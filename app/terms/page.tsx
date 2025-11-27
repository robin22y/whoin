import { Footer } from '@/components/footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              The Invite Link is a free utility tool provided "as is".
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. No Payment Handling</h2>
            <p className="text-muted-foreground">
              We do NOT process payments. We only display the text provided by the organizer. 
              We are not responsible for typos, incorrect bank details, or failed transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibility</h2>
            <p className="text-muted-foreground">
              Organizers are solely responsible for the events they create. 
              Guests are responsible for verifying event details before attending or sending money.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Accuracy</h2>
            <p className="text-muted-foreground">
              You agree to provide accurate information (Name, Counts).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, The Invite Link is not liable for any direct, indirect, or consequential loss arising from the use of this tool.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to delete any event or user data that violates these terms or appears fraudulent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Jurisdiction</h2>
            <p className="text-muted-foreground">
              These terms are governed by the laws of England and Wales.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

