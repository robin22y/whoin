import { EventCreator } from '@/components/event-creator'
import { Footer } from '@/components/footer'
import SecretTrigger from '@/components/secret-trigger'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, Zap, ShieldCheck, ArrowRight, ChevronRight } from 'lucide-react'

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'The Invite Link',
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
    <div className="min-h-screen flex flex-col bg-[#F7F6F3] font-sans selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      
      {/* --- HERO SECTION (Compact for Mobile) --- */}
      <div className="relative bg-[#0F172A] text-white pb-24 sm:pb-32 overflow-hidden rounded-b-[2.5rem] sm:rounded-b-[4rem] shadow-2xl">
        
        {/* Abstract Grid Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(to right, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        {/* Mobile Glow Blob */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>

        {/* HEADER */}
        <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <SecretTrigger>
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#0F172A] font-bold text-xl shadow-lg shadow-white/10 group-hover:scale-110 transition-transform">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">The Invite Link</span>
            </div>
          </SecretTrigger>
          
          <Link href="/my-events">
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-full transition-all px-3 text-sm h-8">
              My Events
            </Button>
          </Link>
        </header>

        {/* HERO CONTENT */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-8 sm:pt-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700/50 text-blue-200 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Free for Community Events
          </div>
          
          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 leading-[1.1]">
            The Only Invite Link <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
              You Need.
            </span>
          </h1>
          
          <p className="text-base sm:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 px-4">
            Instant sign-ups. No apps. <span className="text-white font-medium">No guest logins.</span> <br className="hidden sm:block"/>
            Just share a link and get a list.
          </p>
        </div>
      </div>

      {/* --- MAIN TOOL (Floating Card) --- */}
      <div className="relative z-20 -mt-16 sm:-mt-24 w-full max-w-4xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-200/60 p-1 sm:p-8 backdrop-blur-xl">
          <EventCreator />
        </div>
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        
        {/* --- SWIPEABLE FEATURES (Mobile Carousel) --- */}
        {/* On mobile, this is a flex row with scroll. On desktop, it's a grid. */}
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 mb-24 overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 snap-x snap-mandatory no-scrollbar">
          
          {/* Card 1 */}
          <div className="min-w-[85%] md:min-w-0 snap-center p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-lg">Zero Friction</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Guests sign up in 1 second. No accounts, no "download our app" nonsense.
            </p>
          </div>

          {/* Card 2 */}
          <div className="min-w-[85%] md:min-w-0 snap-center p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-lg">Family Math</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We count adults and kids separately and calculate the total cost split automatically.
            </p>
          </div>

          {/* Card 3 */}
          <div className="min-w-[85%] md:min-w-0 snap-center p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-lg">Private & Safe</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Data is stored securely in the UK/EU and auto-deletes in 30 days.
            </p>
          </div>
        </div>

        {/* --- HOW IT WORKS (Vertical Timeline on Mobile) --- */}
        <div className="w-full max-w-2xl mx-auto mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">How it works</h2>
            <p className="text-slate-500 text-sm sm:text-base">Organizing made simple.</p>
          </div>

          <div className="space-y-0 relative">
            {/* Vertical Line (Mobile Only) */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200 md:hidden"></div>

            {/* Step 1 */}
            <div className="relative flex gap-6 pb-10">
              <div className="w-12 h-12 bg-white rounded-full border-4 border-blue-50 shadow-md flex items-center justify-center relative z-10 shrink-0">
                <span className="text-xl">📝</span>
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-slate-900 text-lg">Create Event</h3>
                <p className="text-slate-500 text-sm mt-1">Type the details in plain English. Add a ticket price if needed.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex gap-6 pb-10">
              <div className="w-12 h-12 bg-white rounded-full border-4 border-purple-50 shadow-md flex items-center justify-center relative z-10 shrink-0">
                <span className="text-xl">🔗</span>
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-slate-900 text-lg">Share Link</h3>
                <p className="text-slate-500 text-sm mt-1">Post the link in your WhatsApp group. No app download required.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex gap-6">
              <div className="w-12 h-12 bg-white rounded-full border-4 border-green-50 shadow-md flex items-center justify-center relative z-10 shrink-0">
                <span className="text-xl">📋</span>
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-slate-900 text-lg">Get List</h3>
                <p className="text-slate-500 text-sm mt-1">Watch the list grow. Track headcount and money instantly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- FAQ (Collapsible) --- */}
        <div className="w-full max-w-xl mx-auto mb-12">
          <details className="group">
            <summary className="list-none cursor-pointer text-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 group-open:text-[#0F172A]">
                Frequently Asked Questions
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
              </span>
            </summary>
            
            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 px-2">
              <div className="p-4 bg-white/50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Is this really free?</h4>
                <p className="text-slate-500 text-sm">Yes. It's a free utility for community events.</p>
              </div>
              <div className="p-4 bg-white/50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Can I track payments?</h4>
                <p className="text-slate-500 text-sm">Yes. Add your bank details or UPI, and we calculate the total cost per family.</p>
              </div>
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