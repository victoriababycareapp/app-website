"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import { auth, db, storage } from "../../lib/firebase";
import {
  LULLABIES_COLLECTION,
  type Lullaby,
  type LullabyType,
} from "../../lib/lullabies";

/* ── Admin lullaby studio (single account, gated by the `admin:true` claim) ──
   Security is enforced by Firestore + Storage rules (only the admin claim can
   write; the app reads published==true). This UI is the convenient front-end. */

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = resolving
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdTokenResult(true);
        setIsAdmin(token.claims.admin === true);
      } else {
        setIsAdmin(null);
      }
      setAuthReady(true);
    });
  }, []);

  if (!authReady) {
    return <Centered>Loading…</Centered>;
  }

  if (!user) {
    return (
      <Centered>
        <div className="w-full max-w-sm rounded-[20px] border border-cardborder bg-cream p-8 text-center">
          <h1 className="text-2xl">Lullaby studio</h1>
          <p className="mt-2 text-secondary">Sign in to manage the app&rsquo;s music.</p>
          <button
            onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            className="mt-6 w-full rounded-full bg-clay px-6 py-3 font-semibold text-cream transition-colors hover:bg-clay-deep"
          >
            Continue with Google
          </button>
        </div>
      </Centered>
    );
  }

  if (isAdmin === false) {
    return (
      <Centered>
        <div className="w-full max-w-sm rounded-[20px] border border-cardborder bg-cream p-8 text-center">
          <h1 className="text-2xl">Not authorized</h1>
          <p className="mt-2 text-secondary">
            {user.email} isn&rsquo;t an admin on this studio.
          </p>
          <button
            onClick={() => signOut(auth)}
            className="mt-6 rounded-full border border-mushroom px-6 py-2.5 font-semibold text-ink hover:bg-plaster"
          >
            Sign out
          </button>
        </div>
      </Centered>
    );
  }

  return <Studio user={user} />;
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-wall px-5">
      {children}
    </div>
  );
}

/* ── The studio ──────────────────────────────────────────────────────────── */
function Studio({ user }: { user: User }) {
  const [items, setItems] = useState<Lullaby[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, LULLABIES_COLLECTION), orderBy("order", "asc"));
    return onSnapshot(
      q,
      (snap) => {
        setItems(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lullaby, "id">) })),
        );
        setLoadError(null);
      },
      (err) => setLoadError(err.message),
    );
  }, []);

  const nextOrder = useMemo(
    () => (items.length ? Math.max(...items.map((i) => i.order ?? 0)) + 1 : 0),
    [items],
  );

  return (
    <div className="min-h-screen bg-wall text-ink">
      <header className="border-b border-cardborder bg-wall/90 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="font-serif text-xl font-semibold">Lullaby studio</h1>
          <div className="flex items-center gap-3 text-sm text-secondary">
            <span>{user.email}</span>
            <button
              onClick={() => signOut(auth)}
              className="rounded-full border border-mushroom px-3 py-1.5 font-semibold text-ink hover:bg-plaster"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-5 py-8">
        <UploadCard nextOrder={nextOrder} />
        {loadError && (
          <p className="rounded-xl border border-amber/40 bg-amber/10 p-3 text-sm text-secondary">
            Couldn&rsquo;t load the catalog: {loadError}. (If this says permission denied,
            the Firestore rules for <code>/lullabies</code> aren&rsquo;t deployed yet.)
          </p>
        )}
        <CatalogList items={items} />
      </main>
    </div>
  );
}

/* ── Upload + metadata ───────────────────────────────────────────────────── */
function UploadCard({ nextOrder }: { nextOrder: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [durationSec, setDurationSec] = useState<number | undefined>();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [type, setType] = useState<LullabyType>("lullaby");
  const [language, setLanguage] = useState("instrumental");
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = useCallback((f: File | null) => {
    setError(null);
    if (!f) return;
    if (!f.type.startsWith("audio/")) {
      setError("Please choose an audio file.");
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
    const probe = new Audio(url);
    probe.addEventListener("loadedmetadata", () =>
      setDurationSec(Math.round(probe.duration)),
    );
  }, [title]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function reset() {
    setFile(null);
    setPreviewUrl(null);
    setDurationSec(undefined);
    setTitle("");
    setArtist("");
    setType("lullaby");
    setLanguage("instrumental");
    setProgress(null);
  }

  async function publish() {
    if (!file || !title.trim()) {
      setError("A file and a title are required.");
      return;
    }
    setError(null);
    setProgress(0);
    try {
      const id = crypto.randomUUID();
      const path = `lullabies/audio/${id}/${file.name}`;
      const task = uploadBytesResumable(storageRef(storage, path), file, {
        contentType: file.type,
      });
      await new Promise<void>((resolve, reject) => {
        task.on(
          "state_changed",
          (s) => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
          reject,
          () => resolve(),
        );
      });
      const audioUrl = await getDownloadURL(task.snapshot.ref);
      await setDoc(doc(db, LULLABIES_COLLECTION, id), {
        title: title.trim(),
        artist: artist.trim() || null,
        type,
        audioUrl,
        durationSec: durationSec ?? null,
        language: language.trim() || null,
        order: nextOrder,
        published: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setProgress(null);
    }
  }

  return (
    <section className="rounded-[20px] border border-cardborder bg-cream p-6">
      <h2 className="text-xl">Add a track</h2>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          pickFile(e.dataTransfer.files?.[0] ?? null);
        }}
        onClick={() => inputRef.current?.click()}
        className={`mt-4 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? "border-clay bg-clay/5" : "border-mushroom bg-wall"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <p className="font-semibold text-ink">
            {file.name}
            {durationSec ? ` · ${formatDur(durationSec)}` : ""}
          </p>
        ) : (
          <p className="text-secondary">Drop an audio file here, or click to choose.</p>
        )}
      </div>

      {previewUrl && (
        <audio controls src={previewUrl} className="mt-4 w-full">
          <track kind="captions" />
        </audio>
      )}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
            placeholder="Moonlight"
          />
        </Field>
        <Field label="Artist (optional)">
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className={inputCls}
            placeholder="Victoria Baby Care"
          />
        </Field>
        <Field label="Type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LullabyType)}
            className={inputCls}
          >
            <option value="lullaby">Lullaby</option>
            <option value="noise">Noise (white/pink/brown)</option>
          </select>
        </Field>
        <Field label="Language">
          <input
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={inputCls}
            placeholder="instrumental, en, fr…"
          />
        </Field>
      </div>

      {error && <p className="mt-4 text-sm text-clay-deep">{error}</p>}

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={publish}
          disabled={progress !== null || !file}
          className="rounded-full bg-clay px-6 py-3 font-semibold text-cream transition-colors hover:bg-clay-deep disabled:opacity-50"
        >
          {progress !== null ? `Uploading… ${progress}%` : "Publish to the app"}
        </button>
        {file && progress === null && (
          <button onClick={reset} className="text-sm font-semibold text-secondary hover:text-ink">
            Clear
          </button>
        )}
      </div>
    </section>
  );
}

/* ── Live catalog ────────────────────────────────────────────────────────── */
function CatalogList({ items }: { items: Lullaby[] }) {
  async function togglePublished(l: Lullaby) {
    await updateDoc(doc(db, LULLABIES_COLLECTION, l.id), {
      published: !l.published,
      updatedAt: serverTimestamp(),
    });
  }
  async function remove(l: Lullaby) {
    await deleteDoc(doc(db, LULLABIES_COLLECTION, l.id));
  }

  if (!items.length) {
    return (
      <section className="rounded-[20px] border border-cardborder bg-cream p-6 text-center text-secondary">
        No tracks yet. Add your first lullaby above — it appears in the app instantly.
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xl">Live in the app</h2>
      {items.map((l) => (
        <div
          key={l.id}
          className="flex items-center justify-between gap-4 rounded-2xl border border-cardborder bg-cream p-4"
        >
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">
              {l.title}{" "}
              <span className="text-xs font-normal text-muted">
                · {l.type}
                {l.durationSec ? ` · ${formatDur(l.durationSec)}` : ""}
              </span>
            </p>
            {l.artist && <p className="truncate text-sm text-secondary">{l.artist}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => togglePublished(l)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                l.published
                  ? "bg-sage/20 text-sage"
                  : "border border-mushroom text-secondary"
              }`}
            >
              {l.published ? "Published" : "Hidden"}
            </button>
            <button
              onClick={() => remove(l)}
              className="rounded-full border border-mushroom px-3 py-1.5 text-xs font-semibold text-clay-deep hover:bg-plaster"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ── small helpers ───────────────────────────────────────────────────────── */
const inputCls =
  "w-full rounded-xl border border-mushroom bg-wall px-3 py-2.5 text-ink outline-none focus:border-clay";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-secondary">{label}</span>
      {children}
    </label>
  );
}

function formatDur(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
