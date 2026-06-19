import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy — Victoria Baby Care",
  description:
    "How Victoria Baby Care handles your data. No ads, no tracking, no analytics, and we never sell your data. Your baby's information stays yours.",
  alternates: { canonical: "/privacy" },
};

const EMAIL = "support@victoriababycare.com";

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      intro="Victoria Baby Care is built to be quietly trustworthy. This policy explains what we collect, why, and the choices you have."
      updated="June 19, 2026"
    >
      <h2>The short version</h2>
      <ul>
        <li><strong>No ads. No tracking. No analytics.</strong> There are no advertising, tracking, or analytics tools anywhere in the app.</li>
        <li><strong>We never sell or rent your data</strong>, and we never use your or your baby&rsquo;s information to build advertising profiles.</li>
        <li>Your data is used for one thing: to provide the app to you.</li>
        <li>The most sensitive parent-wellbeing entries stay <strong>only on your device</strong> and are never uploaded.</li>
        <li>You can <strong>export</strong> or <strong>permanently delete</strong> your account and data from inside the app at any time.</li>
      </ul>

      <h2>Who this applies to</h2>
      <p>
        This policy covers the Victoria Baby Care mobile app and this website. The app is a tool for a
        parent or caregiver to track their <em>own</em> child&rsquo;s care. You create the account and
        you enter the information; there are no child-facing accounts or child logins.
      </p>

      <h2>Information we collect</h2>
      <p>We only collect what the app needs to work for you:</p>
      <h3>Account &amp; identity</h3>
      <p>
        Your email address and display name, an optional profile photo, your account identifier, and
        preferences (such as language and dark mode). If you sign in with Google or Apple, we receive
        your email and name from them (with Apple, this may be a private-relay email).
      </p>
      <h3>Your baby&rsquo;s profile</h3>
      <p>
        Name, date of birth, gender, optional photo, birth measurements, multiple-birth details
        (twins/triplets), and any notes, allergies or conditions you add.
      </p>
      <h3>Daily-care logs</h3>
      <p>
        The activities you record — feeding, sleep, diapers, growth, bath, tummy time and more — along
        with any notes and which family member logged them.
      </p>
      <h3>Health &amp; milestone records</h3>
      <p>
        Health-related entries you choose to keep, such as temperature, medications, symptoms,
        vaccinations, doctor visits, growth measurements, and milestones (with optional photos).
      </p>
      <h3>Family sharing</h3>
      <p>
        If you share access with a co-parent or caregiver, we store your family group, members and
        their roles. If you invite someone, we store the email address you provide so we can send the
        invitation.
      </p>
      <h3>Notifications</h3>
      <p>
        Your reminder settings and, if you enable notifications, a device push token so we can deliver
        them.
      </p>
      <h3>Subscriptions</h3>
      <p>
        If you subscribe to Victoria Premium, we keep your subscription status (plan, expiry, renewal
        flag). Payment is handled entirely by Apple (or Google Play on Android) — <strong>we never see
        your card details.</strong>
      </p>
      <h3>Photos</h3>
      <p>Any photos you attach to a baby profile, activity or milestone.</p>

      <h2>What we deliberately do NOT collect</h2>
      <ul>
        <li>No advertising identifiers (no IDFA on iOS; the Android advertising-ID permission is removed).</li>
        <li>No analytics, crash-reporting, or attribution SDKs of any kind.</li>
        <li>No advertising networks or ad SDKs.</li>
        <li>No location, microphone, contacts, or calendar access.</li>
        <li>No App Tracking Transparency prompt — because there is nothing to track.</li>
        <li>We do not sell, rent, or share your data for advertising.</li>
      </ul>

      <h2>Parent wellbeing — kept on your device only</h2>
      <p>
        Optional parent-wellbeing features (such as mood check-ins and your personal care contacts) are
        stored <strong>only on your device</strong> and are never uploaded to our servers or any third
        party. Any wellbeing questionnaire answers exist only while the questionnaire is open and are
        discarded when you close it.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To provide the tracking features and show your baby&rsquo;s history and gentle context.</li>
        <li>To sync your data across your devices and with family members you invite.</li>
        <li>To authenticate you and keep your account secure.</li>
        <li>To send reminders and notifications you&rsquo;ve enabled.</li>
        <li>To manage subscriptions and provide support.</li>
        <li>To send essential service emails (for example, a welcome email).</li>
      </ul>

      <h2>Children&rsquo;s privacy</h2>
      <p>
        Victoria Baby Care is intended for adults (parents and caregivers). Information about your child
        is provided and controlled by you, the parent, and is used solely to provide the service to you.
        We never use a child&rsquo;s information for advertising or profiling, and we never sell it. You
        can review, export and delete this information at any time.
      </p>

      <h2>Health information &amp; medical disclaimer</h2>
      <p>
        Victoria Baby Care is a personal record-keeping tool — <strong>it is not a medical device and
        does not provide medical advice, diagnosis, or treatment.</strong> Always rely on your
        pediatrician or a qualified professional for medical decisions. Health entries you record are
        stored as part of your baby&rsquo;s log and are never shared with advertising or analytics tools.
      </p>

      <h2>How your information is shared</h2>
      <p>
        We use a small number of trusted service providers to run the app. We do not share your data
        with anyone else, and never for advertising.
      </p>
      <ul>
        <li><strong>Google Firebase / Google Cloud</strong> — our backend: secure sign-in, database, file storage, push delivery and server functions. (We use Firebase purely as infrastructure; Firebase Analytics is <em>not</em> used.)</li>
        <li><strong>Apple</strong> — Sign in with Apple, and App Store billing for subscriptions.</li>
        <li><strong>Google</strong> — Google Sign-In, Google Play billing (on Android), and Google Fonts for the app&rsquo;s typefaces (a font-file request only — no personal data is sent).</li>
        <li><strong>RevenueCat</strong> — manages subscriptions; it receives purchase/entitlement data linked to your account identifier. No advertising identifier is collected.</li>
        <li><strong>Resend</strong> — delivers service emails. It only ever receives your email address and display name — never any baby data.</li>
      </ul>
      <p>We may also disclose information if required by law, or to protect the rights and safety of our users.</p>

      <h2>Storage &amp; security</h2>
      <p>
        Your cloud data is stored on Google&rsquo;s Firebase platform and protected by authentication
        and security rules, encrypted in transit and at rest. Photos are kept in access-controlled
        cloud storage and referenced by unguessable links. No method of storage is ever 100% secure,
        but we work to protect your information and limit access to it.
      </p>

      <h2>Data retention</h2>
      <p>
        We keep your account and data for as long as your account exists. When you delete your account,
        we remove your data as described below. On-device wellbeing data is automatically trimmed over
        time (for example, the mood log keeps roughly the most recent 90 days). Apple, Google and
        RevenueCat retain billing records under their own policies, and residual copies may persist
        briefly in routine backups before being overwritten.
      </p>

      <h2>Your rights &amp; choices</h2>
      <p>
        You can access, export, correct and delete your data, and manage your permissions and
        subscriptions. See <a href="/privacy-choices">Your Privacy Choices</a> for exactly how to do
        each. Depending on where you live (for example, the EU/UK under GDPR, or California under
        CCPA/CPRA), you may have additional rights, including the right to lodge a complaint with a
        supervisory authority. Because we do not sell or share personal information for advertising,
        there is no such activity to opt out of.
      </p>

      <h2>Deleting your data</h2>
      <p>
        You can permanently delete your account and its data from inside the app (you may be asked to
        sign in again first for security). This removes your profile, your babies and their logs, your
        photos, and your on-device wellbeing data. If you share a family with a co-parent, ownership is
        transferred to them and their data is left intact. Photo deletion is best-effort — in rare cases
        a copy may remain briefly before cleanup. You can also email us to request deletion.
      </p>

      <h2>International transfers</h2>
      <p>
        Our infrastructure is provided by Google Cloud / Firebase and may process and store data in the
        United States and other countries. By using the app, you understand your information may be
        transferred to and processed in countries other than your own, with safeguards consistent with
        applicable law.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We&rsquo;ll revise the &ldquo;Last updated&rdquo;
        date above and, for significant changes, provide a more prominent notice.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions or requests about your privacy? Email{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and a real person will help.
      </p>
    </LegalShell>
  );
}
