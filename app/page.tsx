import { EventCreator } from '@/components/event-creator'
import { Footer } from '@/components/footer'
import SecretTrigger from '@/components/secret-trigger'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, CheckCircle2, Zap, ShieldCheck, ArrowRight } from 'lucide-react'

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
    <div className="min-h-screen flex flex-col bg-[#F7F6F3] font-sans selection:bg-blue-200 selection:text-blue-900">
      
      {/* --- HERO SECTION (Dark Navy) --- */}
      <div className="relative bg-[#0F172A] text-white pb-32 overflow-hidden">
        
        {/* Abstract Grid Pattern Background */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(to right, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        {/* Gradient Blob for Vibe */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* HEADER */}
        <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <SecretTrigger>
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#0F172A] font-bold text-xl shadow-lg shadow-white/10 group-hover:scale-110 transition-transform">
                W
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Whozin</span>
            </div>
          </SecretTrigger>
          
          <Link href="/my-events">
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-full transition-all">
              My Events <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </header>

        {/* HERO CONTENT */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-16 sm:pt-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700/50 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Free for everyone
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Instant Sign-ups. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
              No Apps. No Logins.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            The easiest way to organize dinner parties, sports teams, and community events. 
            Just share a link and get a list.
          </p>
        </div>
      </div>

      {/* --- MAIN TOOL (Floating Card) --- */}
      <div className="relative z-20 -mt-24 w-full max-w-4xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/20 border border-slate-200/60 p-2 sm:p-8 backdrop-blur-xl">
          <EventCreator />
        </div>
      </div>

      {/* --- SOCIAL PROOF & FEATURES --- */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-24">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Zero Friction</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Guests RSVP in 1 second. No accounts, no "download our app" nonsense. Higher response rates guaranteed.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Family Math</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Organizing a roast or wedding? We count adults and kids separately and calculate the total cost split automatically.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Private & Safe</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your guest list isn't public. Data is stored securely in the UK/EU and auto-deletes in 30 days.
            </p>
          </div>
        </div>

        {/* HOW IT WORKS (Simple Steps) */}
        <div className="text-center mb-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">How it works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-20 right-20 h-0.5 bg-slate-200 -z-10"></div>
            
            <div className="bg-[#F7F6F3] p-4 z-10">
              <span className="block text-4xl font-black text-slate-200 mb-2">1</span>
              <p className="font-semibold text-slate-700">Create Event</p>
            </div>
            <div className="bg-[#F7F6F3] p-4 z-10">
              <span className="block text-4xl font-black text-slate-200 mb-2">2</span>
              <p className="font-semibold text-slate-700">Share Link</p>
            </div>
            <div className="bg-[#F7F6F3] p-4 z-10">
              <span className="block text-4xl font-black text-slate-200 mb-2">3</span>
              <p className="font-semibold text-slate-700">Get List</p>
            </div>
          </div>
        </div>

        {/* DISCREET FAQ SECTION */}
        <div className="w-full max-w-2xl mx-auto mb-12">
          <details className="group">
            <summary className="list-none cursor-pointer text-center">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
                Frequently Asked Questions
                <span className="transition-transform group-open:rotate-180">▼</span>
              </span>
            </summary>
            
            <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* FAQ Item 1 */}
              <details className="group/item bg-white rounded-lg border border-slate-200 p-4 open:pb-6 cursor-pointer hover:border-slate-300 transition-colors">
                <summary className="flex items-center justify-between font-semibold text-slate-700 list-none select-none text-sm">
                  Is Whozin really free?
                  <span className="text-slate-400 transition-transform group-open/item:rotate-180">▼</span>
                </summary>
                <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                  Yes! Whozin is 100% free for community events. Perfect for Sunday Roasts, 5-a-side Football, Pub Quizzes, and School Fetes.
                </p>
              </details>
              {/* FAQ Item 2 */}
              <details className="group/item bg-white rounded-lg border border-slate-200 p-4 open:pb-6 cursor-pointer hover:border-slate-300 transition-colors">
                <summary className="flex items-center justify-between font-semibold text-slate-700 list-none select-none text-sm">
                  Do guests need an app?
                  <span className="text-slate-400 transition-transform group-open/item:rotate-180">▼</span>
                </summary>
                <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                  No. Guests just click the link, type their name, and click "I'm In". Works on any phone.
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

      <div className="border-t border-slate-200 bg-white">
        <Footer />
      </div>
    </div>
  )
}
