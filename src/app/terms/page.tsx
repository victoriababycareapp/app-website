import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";
import LegalText from "../../components/LegalText";
import { TERMS_BODY } from "./content";

export const metadata: Metadata = {
  title: "Terms of Service — Victoria Baby Care",
  description:
    "The terms for using Victoria Baby Care: accounts, subscriptions, the marketplace, the lullaby licence, disclaimers and your rights.",
  alternates: { canonical: "/terms" },
};

// The body is the app's in-app Terms of Service, VERBATIM (src/app/terms/content.ts,
// generated from the Flutter l10n) so the website and the app say exactly the same.
export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="4 July 2026">
      <LegalText text={TERMS_BODY} />
    </LegalShell>
  );
}
