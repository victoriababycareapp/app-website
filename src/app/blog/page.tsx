import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "../../components/LegalShell";
import { getAllPosts } from "../../lib/blog";

export const metadata: Metadata = {
  title: "Blog — Victoria Baby Care",
  description:
    "Gentle, practical notes on feeds, sleep and milestones — from the Victoria Baby Care team.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 3600;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <LegalShell
      title="Blog"
      intro="Gentle, practical notes on feeds, sleep & milestones — from our team to yours."
    >
      {posts.length === 0 ? (
        <p className="text-secondary">
          No articles yet — we&rsquo;re writing our first posts. Check back soon.
        </p>
      ) : (
        <ul className="space-y-8 pl-0" style={{ listStyle: "none" }}>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block no-underline">
                <h2 className="transition-colors group-hover:text-secondary">{post.title}</h2>
                <p className="mt-1 text-sm text-muted">{formatDate(post.date)}</p>
                <p className="mt-2 text-secondary">{post.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </LegalShell>
  );
}
