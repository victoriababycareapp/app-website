import Image from "next/image";
import Link from "next/link";

/** Shared chrome for the Support / Privacy / Privacy-choices pages — matches the
 *  homepage's Warm Cocoon look (sticky header, cream cards, footer links). */
export default function LegalShell({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-wall text-ink">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-cardborder/70 bg-wall/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/luna-256.png" alt="Victoria Baby Care" width={34} height={34} />
            <span className="font-serif text-lg font-semibold">Victoria Baby Care</span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-mushroom px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-plaster"
          >
            Back to home
          </Link>
        </div>
      </header>

      {/* Title */}
      <section className="mx-auto max-w-3xl px-5 pt-14 pb-2">
        <h1 className="text-4xl">{title}</h1>
        {intro && <p className="mt-4 text-lg leading-relaxed text-secondary">{intro}</p>}
        {updated && <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>}
      </section>

      {/* Body */}
      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="legal">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cardborder py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted md:flex-row">
          <span className="font-serif text-base text-secondary">Victoria Baby Care</span>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/" className="transition-colors hover:text-secondary">Home</Link>
            <Link href="/support" className="transition-colors hover:text-secondary">Support</Link>
            <Link href="/privacy" className="transition-colors hover:text-secondary">Privacy</Link>
            <Link href="/privacy-choices" className="transition-colors hover:text-secondary">Privacy choices</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
