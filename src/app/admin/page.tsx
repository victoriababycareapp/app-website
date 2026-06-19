"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
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

/* ── Lullaby Studio (single admin, gated by the `admin:true` claim) ──────────
   Security is enforced by Firestore + Storage rules; this is the front-end. */

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
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

  if (!authReady) return <Centered>Loading…</Centered>;

  if (!user) {
    return (
      <Centered>
        <Card>
          <Moon size={48} />
          <h1 className="mt-4 text-2xl">Lullaby studio</h1>
          <p className="mt-2 text-secondary">Sign in to manage the app’s music.</p>
          <button
            onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            className="mt-6 w-full rounded-full bg-clay px-6 py-3 font-semibold text-cream transition-colors hover:bg-clay-deep"
          >
            Continue with Google
          </button>
        </Card>
      </Centered>
    );
  }

  if (isAdmin === false) {
    return (
      <Centered>
        <Card>
          <h1 className="text-2xl">Not authorized</h1>
          <p className="mt-2 text-secondary">{user.email} isn’t an admin on this studio.</p>
          <button
            onClick={() => signOut(auth)}
            className="mt-6 rounded-full border border-mushroom px-6 py-2.5 font-semibold text-ink hover:bg-plaster"
          >
            Sign out
          </button>
        </Card>
      </Centered>
    );
  }

  return <Studio user={user} />;
}

/* ── Studio shell: sidebar · upload · live-in-app ───────────────────────────*/
function Studio({ user }: { user: User }) {
  const [items, setItems] = useState<Lullaby[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [nowPlaying, setNowPlaying] = useState<Lullaby | null>(null);
  const [view, setView] = useState<"upload" | "lullabies" | "live">("upload");

  useEffect(() => {
    const q = query(collection(db, LULLABIES_COLLECTION), orderBy("order", "asc"));
    return onSnapshot(
      q,
      (snap) =>
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lullaby, "id">) }))),
      (err) => setLoadError(err.message),
    );
  }, []);

  const nextOrder = useMemo(
    () => (items.length ? Math.max(...items.map((i) => i.order ?? 0)) + 1 : 0),
    [items],
  );

  return (
    <div className="min-h-screen bg-wall text-ink">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 p-5">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 flex-col gap-1 md:flex">
          <div className="mb-6 flex items-center gap-2.5 px-2">
            <Moon size={32} />
            <span className="font-serif text-xl font-semibold">Studio</span>
          </div>
          <SideItem active={view === "upload"} icon="upload" onClick={() => setView("upload")}>Upload</SideItem>
          <SideItem active={view === "lullabies"} icon="music" onClick={() => setView("lullabies")}>Lullabies</SideItem>
          <SideItem active={view === "live"} icon="grid" onClick={() => setView("live")}>Live in app</SideItem>
          <button
            onClick={() => signOut(auth)}
            className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-secondary transition-colors hover:bg-plaster"
          >
            <span className="text-lg">↺</span> Sign out
          </button>
          <p className="mt-auto px-2 text-xs text-muted">{user.email}</p>
        </aside>

        {view === "upload" ? (
          <>
            {/* Upload form + the live list alongside */}
            <main className="min-w-0 flex-1">
              <UploadPanel nextOrder={nextOrder} />
              {loadError && (
                <p className="mt-4 rounded-xl border border-amber/40 bg-amber/10 p-3 text-sm text-secondary">
                  Couldn’t load the catalog: {loadError}
                </p>
              )}
            </main>
            <LivePanel variant="aside" items={items} nowPlaying={nowPlaying} setNowPlaying={setNowPlaying} />
          </>
        ) : (
          // "Lullabies" = all songs (incl. hidden); "Live in app" = published only.
          <main className="min-w-0 flex-1">
            <LivePanel
              variant="main"
              title={view === "lullabies" ? "Lullabies" : "Live in the app"}
              items={view === "live" ? items.filter((i) => i.published) : items}
              nowPlaying={nowPlaying}
              setNowPlaying={setNowPlaying}
            />
            {loadError && (
              <p className="mt-4 rounded-xl border border-amber/40 bg-amber/10 p-3 text-sm text-secondary">
                Couldn’t load the catalog: {loadError}
              </p>
            )}
          </main>
        )}
      </div>
    </div>
  );
}

/* ── Upload panel ───────────────────────────────────────────────────────────*/
function UploadPanel({ nextOrder }: { nextOrder: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [durationSec, setDurationSec] = useState<number | undefined>();
  const [artwork, setArtwork] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [tags, setTags] = useState("");
  const [type, setType] = useState<LullabyType>("lullaby");
  const [language, setLanguage] = useState("instrumental");
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const artInput = useRef<HTMLInputElement>(null);

  const pickFile = useCallback(
    (f: File | null) => {
      setError(null);
      if (!f) return;
      if (!f.type.startsWith("audio/")) return setError("Please choose an audio file (MP3 / M4A).");
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
      if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
      const probe = new Audio(url);
      probe.addEventListener("loadedmetadata", () => setDurationSec(Math.round(probe.duration)));
    },
    [title],
  );

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  function reset() {
    setFile(null); setPreviewUrl(null); setDurationSec(undefined); setArtwork(null);
    setTitle(""); setArtist(""); setTags(""); setType("lullaby");
    setLanguage("instrumental"); setProgress(null);
  }

  async function uploadTo(path: string, f: File): Promise<string> {
    const task = uploadBytesResumable(storageRef(storage, path), f, { contentType: f.type });
    await new Promise<void>((res, rej) =>
      task.on("state_changed",
        (s) => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
        rej, () => res()),
    );
    return getDownloadURL(task.snapshot.ref);
  }

  async function publish() {
    if (!file || !title.trim()) return setError("A file and a title are required.");
    setError(null); setProgress(0);
    try {
      const id = crypto.randomUUID();
      const audioUrl = await uploadTo(`lullabies/audio/${id}/${file.name}`, file);
      let artworkUrl: string | null = null;
      if (artwork) artworkUrl = await uploadTo(`lullabies/artwork/${id}/${artwork.name}`, artwork);
      await setDoc(doc(db, LULLABIES_COLLECTION, id), {
        title: title.trim(),
        artist: artist.trim() || "Victoria Baby Care",
        type,
        audioUrl,
        artworkUrl,
        durationSec: durationSec ?? null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        language: language || null,
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
    <section
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files?.[0] ?? null); }}
      className={`rounded-[24px] border-2 border-dashed p-6 transition-colors ${
        dragOver ? "border-clay bg-clay/5" : "border-mushroom bg-cream/60"
      }`}
    >
      <div onClick={() => fileInput.current?.click()} className="cursor-pointer pb-4 pt-6 text-center">
        <input ref={fileInput} type="file" accept="audio/*" className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
        <h2 className="text-2xl">{file ? file.name : "Drop a lullaby here"}</h2>
        <p className="mt-1 text-sm font-semibold text-secondary">MP3 / M4A · drag &amp; drop</p>
      </div>

      <div className="space-y-3">
        <FieldRow>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls}
            placeholder="Title — “Moonlight Lullaby”" />
        </FieldRow>
        <FieldRow>
          <button onClick={() => artInput.current?.click()} className="w-full text-left text-ink/80">
            {artwork ? `Artwork — ${artwork.name} ✓` : "Artwork — add cover (optional)"}
          </button>
          <input ref={artInput} type="file" accept="image/*" className="hidden"
            onChange={(e) => setArtwork(e.target.files?.[0] ?? null)} />
        </FieldRow>
        <FieldRow>
          <div className="flex w-full items-center gap-3">
            <input value={tags} onChange={(e) => setTags(e.target.value)}
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-mushroom"
              placeholder="Tags — sleep, calm" />
            <span className="text-mushroom">·</span>
            <select value={type} onChange={(e) => setType(e.target.value as LullabyType)}
              className="bg-transparent text-ink outline-none">
              <option value="lullaby">Type — Lullaby</option>
              <option value="noise">Type — Noise</option>
            </select>
          </div>
        </FieldRow>
        <FieldRow>
          {/* The app shows vocal songs to users in this language; "instrumental"
              is shown to everyone. Codes match the app's 20 languages. */}
          <div className="flex w-full items-center gap-3">
            <span className="text-mushroom">Language —</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-ink outline-none">
              <option value="instrumental">Instrumental (all languages)</option>
              <option value="en">English (en)</option>
              <option value="es">Spanish (es)</option>
              <option value="fr">French (fr)</option>
              <option value="de">German (de)</option>
              <option value="it">Italian (it)</option>
              <option value="pt">Portuguese (pt)</option>
              <option value="nl">Dutch (nl)</option>
              <option value="pl">Polish (pl)</option>
              <option value="ru">Russian (ru)</option>
              <option value="uk">Ukrainian (uk)</option>
              <option value="cs">Czech (cs)</option>
              <option value="da">Danish (da)</option>
              <option value="no">Norwegian (no)</option>
              <option value="sv">Swedish (sv)</option>
              <option value="fi">Finnish (fi)</option>
              <option value="hu">Hungarian (hu)</option>
              <option value="ro">Romanian (ro)</option>
              <option value="el">Greek (el)</option>
              <option value="sl">Slovenian (sl)</option>
              <option value="tr">Turkish (tr)</option>
            </select>
          </div>
        </FieldRow>
        <FieldRow>
          <span className="text-ink/80">
            Duration — {durationSec ? fmt(durationSec) : "—"} (auto) · Order — {nextOrder}
          </span>
        </FieldRow>
      </div>

      {previewUrl && (
        <audio controls src={previewUrl} className="mt-4 w-full">
          <track kind="captions" />
        </audio>
      )}
      {error && <p className="mt-3 text-sm text-clay-deep">{error}</p>}

      {progress !== null && (
        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-mushroom/30">
            <div className="h-full rounded-full bg-sage transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm text-secondary">Uploading… {progress}% · preview before publish</p>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <button onClick={publish} disabled={progress !== null || !file}
          className="rounded-full bg-clay px-6 py-3 font-semibold text-cream transition-colors hover:bg-clay-deep disabled:opacity-50">
          Publish to the app
        </button>
        {file && progress === null && (
          <button onClick={reset} className="text-sm font-semibold text-secondary hover:text-ink">Clear</button>
        )}
      </div>
    </section>
  );
}

/* ── Live-in-app panel + mini player ────────────────────────────────────────*/
function LivePanel({
  items, nowPlaying, setNowPlaying, variant = "aside", title = "Live in the app",
}: {
  items: Lullaby[];
  nowPlaying: Lullaby | null;
  setNowPlaying: (l: Lullaby | null) => void;
  variant?: "aside" | "main";
  title?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);

  function playTrack(l: Lullaby) {
    setNowPlaying(l);
    setTimeout(() => { audioRef.current?.play(); }, 0);
  }
  function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play(); else a.pause();
  }
  async function togglePublished(l: Lullaby) {
    await updateDoc(doc(db, LULLABIES_COLLECTION, l.id), { published: !l.published, updatedAt: serverTimestamp() });
  }
  async function remove(l: Lullaby) {
    if (nowPlaying?.id === l.id) setNowPlaying(null);
    await deleteDoc(doc(db, LULLABIES_COLLECTION, l.id));
  }

  return (
    <aside className={variant === "main"
        ? "flex min-w-0 flex-1 flex-col"
        : "hidden w-80 shrink-0 flex-col lg:flex"}>
      <h2 className="mb-4 text-xl">{title}</h2>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {items.length === 0 && (
          <p className="rounded-2xl border border-cardborder bg-cream p-4 text-sm text-secondary">
            No tracks yet. Upload one — it appears in the app instantly.
          </p>
        )}
        {items.map((l) => (
          <div key={l.id} className="rounded-2xl border border-cardborder bg-cream p-3">
            <div className="flex items-center gap-3">
              <Thumb url={l.artworkUrl} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{l.title}</p>
                <p className="truncate text-xs text-muted">
                  {l.durationSec ? fmt(l.durationSec) : "—"} · {l.published ? "published" : "hidden"}
                </p>
              </div>
              <button onClick={() => playTrack(l)} aria-label={`Play ${l.title}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  l.published ? "bg-clay text-cream hover:bg-clay-deep" : "bg-mushroom/40 text-secondary"
                }`}>▶</button>
            </div>
            <div className="mt-2 flex gap-3 pl-14 text-xs">
              <button onClick={() => togglePublished(l)} className="font-semibold text-secondary hover:text-ink">
                {l.published ? "Hide" : "Publish"}
              </button>
              <button onClick={() => remove(l)} className="font-semibold text-clay-deep hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Dark mini-player */}
      {nowPlaying && (
        <div className="mt-4 rounded-2xl bg-night p-3 text-cream">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-amber text-night">
              {playing ? "❚❚" : "▶"}
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{nowPlaying.title}</p>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-cream/20">
                <div className="h-full rounded-full bg-amber"
                  style={{ width: nowPlaying.durationSec ? `${(pos / nowPlaying.durationSec) * 100}%` : "0%" }} />
              </div>
            </div>
            <span className="text-xs tabular-nums text-cream/70">{fmt(Math.floor(pos))}</span>
          </div>
          <audio
            ref={audioRef}
            src={nowPlaying.audioUrl}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setPos(e.currentTarget.currentTime)}
            onEnded={() => setPlaying(false)}
          >
            <track kind="captions" />
          </audio>
        </div>
      )}
    </aside>
  );
}

/* ── small bits ─────────────────────────────────────────────────────────────*/
const inputCls = "w-full bg-transparent text-ink outline-none placeholder:text-mushroom";

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-cardborder bg-cream px-4 py-3 text-sm">{children}</div>;
}

function SideItem({
  children, active, icon, onClick,
}: { children: React.ReactNode; active?: boolean; icon: "upload" | "music" | "grid"; onClick?: () => void }) {
  const glyph = icon === "upload" ? "＋" : icon === "music" ? "♪" : "▦";
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
        active ? "bg-clay font-semibold text-cream" : "text-secondary hover:bg-plaster"
      }`}>
      <span className="text-lg">{glyph}</span> {children}
    </button>
  );
}

function Thumb({ url }: { url?: string }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className="h-11 w-11 rounded-lg object-cover" />;
  }
  return <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-mushroom/30 text-clay">♪</div>;
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-wall px-5">{children}</div>;
}
function Card({ children }: { children: React.ReactNode }) {
  return <div className="w-full max-w-sm rounded-[20px] border border-cardborder bg-cream p-8 text-center">{children}</div>;
}
function Moon({ size }: { size: number }) {
  return <Image src="/luna-256.png" alt="Victoria Baby Care" width={size} height={size} className="rounded-full" />;
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
