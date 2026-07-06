// Blog content source — the single place articles live.
//
// Right now there are no articles. Add them to the `posts` array below and
// they appear automatically on /blog, at /blog/<slug>, AND in sitemap.xml —
// nothing else needs editing.
//
// Later, when you pick a real content system (a headless CMS, or Firestore —
// you already have src/lib/firebase.ts), swap the body of getAllPosts() to
// fetch from it and return the same BlogPost shape. Every caller (the blog
// pages and the sitemap) reads through this one function, so they stay in sync.

export type BlogPost = {
  /** URL slug — the article lives at /blog/<slug>. Keep it lowercase-kebab. */
  slug: string;
  title: string;
  /** One-line summary shown on the blog index and used as the meta description. */
  excerpt: string;
  /** ISO date "YYYY-MM-DD" — drives the sitemap <lastmod> and the displayed date. */
  date: string;
  /** Article body as plain text — blank lines separate paragraphs. (Swap to
   *  sanitized Markdown later; see the note in blog/[slug]/page.tsx.) */
  content: string;
};

const posts: BlogPost[] = [
  // Example — copy this shape for a real post, then delete the example:
  // {
  //   slug: "welcome",
  //   title: "Welcome to the Victoria Baby Care blog",
  //   excerpt: "Gentle, practical notes on feeds, sleep and milestones.",
  //   date: "2026-07-06",
  //   content: "Our first article goes here.\n\nA blank line starts a new paragraph.",
  // },
];

/** All published posts, newest first. */
export async function getAllPosts(): Promise<BlogPost[]> {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

/** A single post by slug, or null if it doesn't exist. */
export async function getPost(slug: string): Promise<BlogPost | null> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
