import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";

export const metadata: Metadata = {
  title: "Terms & Conditions — Victoria Baby Care",
  description:
    "The terms for using Victoria Baby Care: accounts, subscriptions, your content, the lullaby licence, and important disclaimers.",
  alternates: { canonical: "/terms" },
};

const EMAIL = "support@victoriababycare.com";

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms & Conditions"
      intro="These terms govern your use of the Victoria Baby Care app and this website. By using them, you agree to what's below."
      updated="June 19, 2026"
    >
      <h2>1. Acceptance</h2>
      <p>
        By downloading, accessing or using Victoria Baby Care (the &ldquo;app&rdquo;) or this
        website, you agree to these Terms &amp; Conditions and to our{" "}
        <a href="/privacy">Privacy Policy</a>. If you don&rsquo;t agree, please don&rsquo;t use the app.
      </p>

      <h2>2. Who can use it</h2>
      <p>
        The app is for adults (parents and caregivers) — you must be at least 18, or the age of
        majority where you live. You create the account and you enter your child&rsquo;s information;
        the app is not directed at children and has no child-facing accounts.
      </p>

      <h2>3. The service</h2>
      <p>
        Victoria Baby Care is provided for personal, non-commercial use to help you track your
        baby&rsquo;s activities and play calming sounds. We may add, change or remove features over
        time to improve the app.
      </p>

      <h2>4. Your account</h2>
      <ul>
        <li>You&rsquo;re responsible for keeping your account secure and for activity under it.</li>
        <li>You agree to provide accurate information.</li>
        <li>You must not misuse the service, attempt to break its security, or use it unlawfully.</li>
      </ul>

      <h2>5. Subscriptions &amp; payments</h2>
      <ul>
        <li>The core tracker is free. <strong>Victoria Premium</strong> is an optional paid subscription. There are no ads.</li>
        <li>
          Purchases are processed by <strong>Apple</strong> (App Store) or <strong>Google</strong>
          (Google Play). We never receive or store your payment-card details.
        </li>
        <li>
          Subscriptions <strong>renew automatically</strong> until cancelled. Manage or cancel any
          time in your Apple ID or Google Play account settings — cancelling stops future billing and
          you keep access until the end of the current period.
        </li>
        <li>
          Refunds are handled by Apple or Google under their policies. Prices and plans may change;
          we&rsquo;ll give notice as required, and changes won&rsquo;t affect the period you&rsquo;ve already paid for.
        </li>
      </ul>

      <h2>6. Your content</h2>
      <p>
        The data and photos you add are <strong>yours</strong>. You grant us a limited licence to
        store, process and sync that content solely to operate the app for you and anyone you share a
        family with. You&rsquo;re responsible for the content you add and confirm you have the right to
        add it. You can export or delete your content at any time (see{" "}
        <a href="/privacy-choices">Your Privacy Choices</a>).
      </p>

      <h2>7. Music, lullabies &amp; sleep sounds</h2>
      <p>
        The lullabies are original tracks composed and produced with the assistance of
        artificial-intelligence music tools and curated by Victoria Baby Care. The built-in sleep
        sounds (white, pink and brown noise and similar soundscapes) are generated or licensed for use
        in the app.
      </p>
      <p>
        All of this audio is owned by, or licensed to, Victoria Baby Care. We grant you a personal,
        limited, non-exclusive, non-transferable, revocable licence to stream and play it for your own
        private, non-commercial use within the app, including the in-app offline feature.
      </p>
      <p>
        You may not copy, extract, re-record, redistribute, sell, sub-licence, publicly perform, or use
        the audio commercially, nor use it to train or develop any AI or machine-learning system,
        without our prior written permission.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        The app, its design, content, trademarks, the &ldquo;Luna&rdquo; character and all features —
        including the audio above — are owned by or licensed to Victoria Baby Care and protected by
        copyright and other laws. We reserve all rights not expressly granted to you. You may not
        reverse-engineer, decompile, scrape, or create derivative works from the app except as allowed
        by law.
      </p>

      <h2>9. Medical disclaimer</h2>
      <p>
        Victoria Baby Care helps you track and organise information about your baby&rsquo;s daily
        activities. <strong>It is not a medical device and is not intended to diagnose, treat, cure or
        prevent any disease or health condition.</strong> It is not a substitute for professional
        medical advice. Always seek the advice of your physician or another qualified health provider,
        and never disregard or delay it because of something you tracked in the app. If you think your
        child may have a medical emergency, contact your doctor or emergency services immediately.
      </p>

      <h2>10. Disclaimers &amp; limitation of liability</h2>
      <p>
        The app is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranties of
        any kind to the fullest extent permitted by law. We are not liable for any decisions made based
        on app data, nor for indirect, incidental or consequential damages. Nothing in these terms
        limits liability that cannot be limited under applicable law (such as your statutory consumer
        rights).
      </p>

      <h2>11. Termination</h2>
      <p>
        You can stop using the app and delete your account at any time. We may suspend or end access if
        these terms are seriously or repeatedly breached, or where required by law. Sections that by
        their nature should survive (such as intellectual property, disclaimers and limitation of
        liability) continue to apply after termination.
      </p>

      <h2>12. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. We&rsquo;ll revise the &ldquo;Last updated&rdquo;
        date above and, for significant changes, provide a more prominent notice. Continuing to use the
        app after changes means you accept them.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalShell>
  );
}
