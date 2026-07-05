/**
 * Renders a plain-text legal document (the app's VERBATIM localized text) as
 * styled HTML inside the `.legal` shell:
 *   - "N. ALL-CAPS TITLE" lines  → <h2>
 *   - "- " lines                 → <ul><li>
 *   - everything else            → <p> (internal single line-breaks preserved)
 *
 * The source text is never paraphrased — only structured — so the website stays
 * legally identical to the in-app policy. Paragraphs are separated by blank
 * lines in the source.
 */
export default function LegalText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const s = block.trim();

        // Top-level numbered heading, e.g. "1. WHO WE ARE (DATA CONTROLLER)".
        if (lines.length === 1 && /^\d+\.\s+\S/.test(s) && s === s.toUpperCase()) {
          return <h2 key={i}>{s}</h2>;
        }

        // A block that ends in a run of "- " bullets (optionally with a lead-in
        // sentence) → intro paragraph + real <ul>.
        const firstBullet = lines.findIndex((l) => /^\s*-\s+/.test(l));
        const tailIsBullets =
          firstBullet !== -1 &&
          lines.slice(firstBullet).every((l) => /^\s*-\s+/.test(l) || !l.trim());
        if (tailIsBullets) {
          const intro = lines.slice(0, firstBullet).join("\n").trim();
          const items = lines
            .slice(firstBullet)
            .filter((l) => l.trim())
            .map((l) => l.replace(/^\s*-\s+/, ""));
          return (
            <div key={i}>
              {intro && <p style={{ whiteSpace: "pre-line" }}>{intro}</p>}
              <ul>
                {items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            </div>
          );
        }

        // Ordinary paragraph — keep internal line breaks (addresses, etc.).
        return (
          <p key={i} style={{ whiteSpace: "pre-line" }}>
            {s}
          </p>
        );
      })}
    </>
  );
}
