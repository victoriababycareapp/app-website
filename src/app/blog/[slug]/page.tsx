import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalShell from "../../../components/LegalShell";
import { getAllPosts, getPost } from "../../../lib/blog";

export const revalidate = 3600;

// Pre-render every article at build time (empty until you add posts).
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found — Victoria Baby Care" };
  return {
    title: `${post.title} — Victoria Baby Care`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const updated = new Date(post.date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Plain-text body split into paragraphs on blank lines. React escapes the
  // text, so there's no XSS surface. When you want rich formatting, render
  // Markdown through a sanitizing library (e.g. react-markdown + rehype-sanitize)
  // here instead — the data shape in src/lib/blog.ts stays the same.
  const paragraphs = post.content.split(/\n{2,}/).filter((p) => p.trim().length > 0);

  return (
    <LegalShell title={post.title} updated={updated}>
      {paragraphs.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </LegalShell>
  );
}
