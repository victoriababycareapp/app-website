import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";

export const metadata: Metadata = {
  title: "Support — Victoria Baby Care",
  description:
    "Help and contact for Victoria Baby Care: getting started, sign-in, subscriptions, family sharing, languages, and managing your data.",
  alternates: { canonical: "/support" },
};

const EMAIL = "support@victoriababycare.com";

export default function SupportPage() {
  return (
    <LegalShell
      title="Support"
      intro="We're here to help. Most questions are answered below — and a real person reads every email."
    >
      <h2>Contact us</h2>
      <p>
        Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we&rsquo;ll get back to you,
        usually within 2 business days. Please include your device (iPhone model and iOS
        version) and a short description so we can help quickly.
      </p>

      <h2>Getting started</h2>
      <p>
        Tap the <strong>+</strong> button to log a moment — feeds, diapers, sleep, growth,
        temperature, medications and milestones. You can rearrange the activity cards
        (long-press and drag) so your most-used ones sit right under your thumb. Everything
        you log is kept for you and shown against your baby&rsquo;s own gentle rhythm.
      </p>

      <h2>Account &amp; sign-in</h2>
      <ul>
        <li>You can sign in with email &amp; password, Google, or Apple.</li>
        <li>
          Forgot your password? On the sign-in screen choose <strong>Reset password</strong> and
          follow the email link.
        </li>
        <li>
          Your data is tied to your account and syncs securely, so signing in on a new device
          brings everything with you.
        </li>
      </ul>

      <h2>Family &amp; multiple babies</h2>
      <p>
        Both parents and caregivers can share one synced family view, so everyone stays on the
        same page. You can track twins, triplets or quadruplets together, each with their own
        profile and timeline.
      </p>

      <h2>Subscriptions (Victoria Premium)</h2>
      <ul>
        <li>The core tracker is free. Victoria Premium unlocks extras — there are no ads, ever.</li>
        <li>
          Subscriptions are billed through your Apple ID. To manage or cancel, open
          iPhone <strong>Settings → [your name] → Subscriptions</strong>.
        </li>
        <li>
          Switched phones or reinstalled? In the app, use <strong>Restore purchases</strong> to
          bring your subscription back.
        </li>
      </ul>

      <h2>Lullabies &amp; sounds</h2>
      <p>
        The lullaby player keeps playing through the silent switch and at the lock screen, so it
        works for 3am feeds. If you don&rsquo;t hear anything, check your phone&rsquo;s volume and
        that it isn&rsquo;t routed to another Bluetooth device.
      </p>

      <h2>Languages</h2>
      <p>
        Victoria Baby Care speaks 20 languages and follows your phone&rsquo;s language
        automatically. You can also set it manually in the app&rsquo;s settings.
      </p>

      <h2>Your data &amp; privacy</h2>
      <p>
        You own your data. You can export or permanently delete your account and all of its data
        from inside the app at any time. See our{" "}
        <a href="/privacy">Privacy Policy</a> and{" "}
        <a href="/privacy-choices">Privacy choices</a> for details, or email us and we&rsquo;ll
        help.
      </p>
    </LegalShell>
  );
}
