import { EventCreator } from '@/components/event-creator'
import { Footer } from '@/components/footer'
import SecretTrigger from '@/components/secret-trigger'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, CheckCircle2, Share2, Users, ArrowRight } from 'lucide-react'

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Whozin',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Any (Web Browser)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
    },
    description: 'The simplest sign-up tool for community events. Create WhatsApp-friendly invite links in 30 seconds.',
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F3] text-slate-900 font-sans">
      
      {/* HEADER */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <SecretTrigger>
          <div className="flex items-center gap-2 cursor-pointer group">
            <Image 
              src="/logo.svg" 
              alt="Whozin Logo" 
              width={32} 
              height={32} 
              className="group-hover:opacity-80 transition-opacity"
            />
            <span className="font-bold text-xl tracking-tight text-slate-900">Whozin</span>
          </div>
        </SecretTrigger>
        
        <Link href="/my-events">
          <Button variant="outline" className="border-slate-300 hover:border-slate-600 hover:bg-slate-50">
            <Calendar className="mr-2 h-4 w-4" />
            My Events
          </Button>
        </Link>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 py-12">
        
        {/* HERO SECTION */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            Instant RSVPs & Headcounts.<br />
            <span className="text-slate-700">No Apps. No Logins.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            The easiest way to organize dinner parties, sports teams, and community events.<br />
            Share a link, get a list.
          </p>
        </div>

        {/* THE TOOL - Clean White Card */}
        <div className="w-full max-w-3xl mx-auto mb-20">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12">
            <EventCreator />
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Create</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Type your event details in plain English.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Share</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Send the link via WhatsApp or Email.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Track</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                See who is coming and settle costs automatically.
              </p>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Why Busy Organizers Love Whozin</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <p className="text-slate-700 mb-4 leading-relaxed">
                "Saved me hours organizing the Sunday 5-a-side. No more chasing people."
              </p>
              <p className="text-sm text-slate-500 font-medium">— David, 34</p>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <p className="text-slate-700 mb-4 leading-relaxed">
                "Perfect for the school committee. The family math feature is a lifesaver."
              </p>
              <p className="text-sm text-slate-500 font-medium">— Sarah, 41</p>
            </div>
          </div>
        </div>

        {/* DISCREET FAQ SECTION */}
        <div className="w-full max-w-2xl mx-auto mb-12 px-6">
          <details className="group">
            <summary className="list-none cursor-pointer text-center">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
                Frequently Asked Questions
                <span className="transition-transform group-open:rotate-180">▼</span>
              </span>
            </summary>
            
            <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <details className="group/item bg-white rounded-lg border border-slate-200 p-4 open:pb-6 cursor-pointer hover:bg-slate-50 transition-colors">
                <summary className="flex items-center justify-between font-semibold text-slate-700 list-none select-none text-sm">
                  Is Whozin really free?
                  <span className="text-slate-400 transition-transform group-open/item:rotate-180">▼</span>
                </summary>
                <p className="text-slate-600 mt-3 text-sm leading-relaxed">
                  Yes! Whozin is 100% free for community events. Perfect for <strong>Sunday Roasts, 5-a-side Football, Pub Quizzes, School Fetes</strong>, as well as <strong>Diwali Parties and Christmas Dinners</strong>. No hidden booking fees.
                </p>
              </details>

              <details className="group/item bg-white rounded-lg border border-slate-200 p-4 open:pb-6 cursor-pointer hover:bg-slate-50 transition-colors">
                <summary className="flex items-center justify-between font-semibold text-slate-700 list-none select-none text-sm">
                  Do guests need an app?
                  <span className="text-slate-400 transition-transform group-open/item:rotate-180">▼</span>
                </summary>
                <p className="text-slate-600 mt-3 text-sm leading-relaxed">
                  No. "Downloading an app" kills participation. Your guests just click the link (optimized for <strong>WhatsApp</strong>), type their name, and click "I'm In". It works on any phone, no login required.
                </p>
              </details>
              
               <details className="group/item bg-white rounded-lg border border-slate-200 p-4 open:pb-6 cursor-pointer hover:bg-slate-50 transition-colors">
                <summary className="flex items-center justify-between font-semibold text-slate-700 list-none select-none text-sm">
                  Can I track payments?
                  <span className="text-slate-400 transition-transform group-open/item:rotate-180">▼</span>
                </summary>
                <p className="text-slate-600 mt-3 text-sm leading-relaxed">
                  Yes. If you're collecting money for a <strong>group gift, sports pitch, or dinner</strong>, simply add your payment details. We calculate the split cost for Adults vs Kids automatically.
                </p>
              </details>
            </div>
          </details>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>

      <div className="relative z-10 border-t border-slate-200 bg-white/50">
        <Footer />
      </div>
    </div>
  )
}
