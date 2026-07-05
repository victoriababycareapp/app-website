import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";
import LegalText from "../../components/LegalText";
import { PRIVACY_BODY } from "./content";

export const metadata: Metadata = {
  title: "Privacy Policy — Victoria Baby Care",
  description:
    "How Victoria Baby Care collects, uses, shares and protects your personal data under the GDPR. No ads, no tracking — the app's full privacy policy.",
  alternates: { canonical: "/privacy" },
};

// The body is the app's in-app Privacy Policy, VERBATIM (src/app/privacy/content.ts,
// generated from the Flutter l10n) so the website and the app say exactly the same.
export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="4 July 2026">
      <LegalText text={PRIVACY_BODY} />
    </LegalShell>
  );
}
