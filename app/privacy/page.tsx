import { Footer } from '@/components/footer'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full max-w-4xl mx-auto px-6 py-6">
        <Link href="/" className="flex items-center gap-2 w-fit opacity-80 hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 bg-[#0F172A] rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            </svg>
          </div>
          <span className="font-bold text-lg text-[#0F172A] tracking-tight">The Invite Link</span>
        </Link>
      </header>
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Data Collection and Usage</h2>
            <p className="text-muted-foreground">
              The Invite Link (Simple Sign-up Tool) collects minimal data necessary to facilitate event RSVPs:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Event information (title, date, location) provided by organizers</li>
              <li>Guest names and RSVP details (adult/kid counts) provided with explicit consent</li>
              <li>Payment status (if applicable)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We do NOT collect IP addresses, cookies for tracking, or any personal data beyond what you explicitly provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Data Storage Location</h2>
            <p className="text-muted-foreground">
              All data is stored in the United Kingdom (London, eu-west-2 region) in compliance with GDPR regulations. 
              Your data never leaves the UK/EU.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Your Rights</h2>
            <p className="text-muted-foreground mb-2">Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Access:</strong> Request a copy of all data we hold about you</li>
              <li><strong>Rectification:</strong> Correct any inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data (use the "Delete My Data" button)</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Consent</h2>
            <p className="text-muted-foreground">
              By submitting an RSVP, you explicitly consent to sharing your name and RSVP details with the event organizer. 
              This consent can be withdrawn at any time by deleting your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
            <p className="text-muted-foreground">
              Event data is retained until the event organizer deletes it or you request deletion. 
              You can delete your data at any time using the "Delete My Data" button in the footer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Analytics</h2>
            <p className="text-muted-foreground">
              We use PostHog in Privacy Mode (no cookies) for basic analytics. 
              No personal data is collected through analytics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
            <p className="text-muted-foreground">
              For privacy-related inquiries or to exercise your rights, please contact us through the app or use the "Delete My Data" functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. The latest version will always be available on this page.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

