import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";

export const metadata: Metadata = {
  title: "Your Privacy Choices — Victoria Baby Care",
  description:
    "Manage your data in Victoria Baby Care: access, export, correct or delete your account, manage notifications and subscriptions. We never sell your data.",
  alternates: { canonical: "/privacy-choices" },
};

const EMAIL = "support@victoriababycare.com";

export default function PrivacyChoicesPage() {
  return (
    <LegalShell
      title="Your Privacy Choices"
      intro="You're in control of your data. Here's exactly how to access, export, correct or delete it — and how to manage notifications and subscriptions."
      updated="June 19, 2026"
    >
      <h2>We don&rsquo;t sell or share your data</h2>
      <p>
        Victoria Baby Care does <strong>not</strong> sell your personal information and does
        <strong> not</strong> share it for advertising or cross-context behavioral advertising. There
        are no ads, no tracking, and no analytics in the app — so there is nothing here to opt out of.
        The choices below are about accessing, correcting and removing your own data.
      </p>

      <h2>Access &amp; export your data</h2>
      <p>
        You can export your data — your families, babies, activity logs, and on-device wellbeing
        entries — as a file from inside the app (Settings → export), then save or share it via your
        device&rsquo;s share sheet.
      </p>

      <h2>Correct your data</h2>
      <p>
        You can edit your account details, your baby&rsquo;s profile, and any logged entry directly in
        the app at any time.
      </p>

      <h2>Delete your account &amp; data</h2>
      <p>Open the app and go to <strong>Settings → Account → Delete account</strong>. This permanently removes:</p>
      <ul>
        <li>Your profile, preferences and notification settings;</li>
        <li>Your babies and all of their logs (feeds, sleep, diapers, growth, health, milestones);</li>
        <li>Your uploaded photos;</li>
        <li>Your on-device wellbeing data (mood log, care contacts, recent lists);</li>
        <li>Your sign-in account itself.</li>
      </ul>
      <p>
        You may be asked to sign in again first (a security requirement). If you share a family with a
        co-parent, ownership is transferred to them so their data stays intact. Photo deletion is
        best-effort — in rare cases a copy may remain briefly before automatic cleanup. Prefer we do it
        for you? Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>

      <h2>Manage notifications &amp; permissions</h2>
      <ul>
        <li>Turn reminders on or off in the app&rsquo;s settings.</li>
        <li>Change camera, photos and notification permissions any time in your device&rsquo;s Settings.</li>
      </ul>

      <h2>Manage or cancel your subscription</h2>
      <p>
        Subscriptions are billed by Apple. To view, change or cancel, open iPhone{" "}
        <strong>Settings → [your name] → Subscriptions</strong>. (On Android, manage subscriptions in
        the Google Play Store.) Cancelling stops future billing; you keep access until the current
        period ends.
      </p>

      <h2>Make a privacy request</h2>
      <p>
        For any request — access, correction, deletion, or a question about your rights under laws like
        GDPR (EU/UK) or CCPA/CPRA (California) — email{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We&rsquo;ll respond as required by applicable law. See
        our <a href="/privacy">Privacy Policy</a> for the full details.
      </p>
    </LegalShell>
  );
}
