import type { Timestamp } from "firebase/firestore";

/**
 * Cross-client contract for the Lullabies/Music feature.
 *
 * The admin studio (this website) WRITES documents here; the Flutter app's
 * Music tab READS them in real time (`published == true` only). The Flutter
 * side mirrors this shape — keep them in sync.
 */
export const LULLABIES_COLLECTION = "lullabies";

export type LullabyType = "lullaby" | "noise";

export interface Lullaby {
  id: string;
  title: string;
  artist?: string;
  /** A lullaby song vs white/pink/brown noise. */
  type: LullabyType;
  /** Public download URL of the audio in Cloud Storage. */
  audioUrl: string;
  artworkUrl?: string;
  durationSec?: number;
  /** BCP-47 language tag, or "instrumental". */
  language?: string;
  /** Sort order in the app's player. */
  order: number;
  /** The app shows a track only when this is true. Unpublish = set false. */
  published: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Firestore document shape (the doc id becomes `Lullaby.id`). */
export type LullabyDoc = Omit<Lullaby, "id">;
