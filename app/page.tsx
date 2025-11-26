import { EventCreator } from '@/components/event-creator'
import { Footer } from '@/components/footer'
import SecretTrigger from '@/components/secret-trigger'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'WhoIn.uk',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Any (Web Browser)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
    },
    description: 'The simplest RSVP tool for UK community events. Create WhatsApp-friendly invite links in 30 seconds.',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <SecretTrigger>
                <h1 className="text-4xl font-bold mb-4">WhoIn.uk</h1>
              </SecretTrigger>
              <p className="text-lg text-muted-foreground">
                Extreme simple RSVP tool for UK Community Events
              </p>
            </div>
            <Link href="/my-events">
              <Button variant="outline" className="min-h-[48px]">
                <Calendar className="mr-2 h-4 w-4" />
                My Events
              </Button>
            </Link>
          </div>
        </div>
        <EventCreator />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>
      <Footer />
    </div>
  )
}
