# Lullaby studio — backend activation (manual, gated by George)

The admin studio code is built and compiles, but it can't write/read until two
**one-off backend steps** are done. These are intentionally NOT automated (they
touch the live `vbc-cross-platform` project + custom claims).

## 1. Add the security rules and deploy them (TARGETED)

These rules are NOT in the canonical `firestore.rules` yet (that file lives in
`crossed-platform/victoria-baby-care-flutter/firestore.rules` and is the single
source of truth — see the `firestore-rules` memory). **Diff deployed-vs-repo
first**, then add:

**Firestore** — add inside `service cloud.firestore { match /databases/{db}/documents { … } }`:

```
match /lullabies/{id} {
  // The app reads only published tracks; the admin can read everything.
  allow read: if resource.data.published == true || request.auth.token.admin == true;
  allow write: if request.auth.token.admin == true;
}
```

**Storage** — there is no canonical `storage.rules` yet; create one:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Lullaby audio is public (free); only the admin can upload/change it.
    match /lullabies/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
    // (Keep any existing rules for other paths, e.g. baby photos.)
  }
}
```

Deploy **targeted** (never untargeted — deployed functions have no repo source):

```
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## 2. Grant yourself the `admin:true` custom claim (one-off, server-side)

Auth (who you are) ≠ authorization (allowed to write). The studio gate + the
rules both require the custom claim `admin:true` on your account. Set it once
with the Admin SDK, signed in as a project owner:

```js
// set-admin.mjs — run once: `node set-admin.mjs you@gmail.com`
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
initializeApp({ credential: applicationDefault() });
const email = process.argv[2];
const user = await getAuth().getUserByEmail(email);
await getAuth().setCustomUserClaims(user.uid, { admin: true });
console.log("admin:true set for", email);
```

(Run with `GOOGLE_APPLICATION_CREDENTIALS` pointing at a service-account key, or
`gcloud auth application-default login` as an owner.) Sign out/in in the studio
afterwards so the new claim is in the ID token.

## How it works once activated
- Studio uploads the audio file → Cloud Storage `lullabies/audio/{id}/…`
- Writes the catalog doc → Firestore `/lullabies/{id}` (see `src/lib/lullabies.ts`)
- The Flutter app's Music tab listens to `/lullabies` where `published == true`
  in real time — **new tracks appear with no app update.**

## Deferred (Phase-3, not needed for MVP)
- `onObjectFinalized` Cloud Function for FFmpeg transcode + `-16 LUFS` loudness
  normalization (the studio currently writes the doc directly after upload).
- Session-cookie + middleware hardening (`next-firebase-auth-edge`). Today the
  gate is the claim check + the rules (which are the real enforcement).
