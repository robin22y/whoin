import { EventCreator } from '@/components/event-creator'
import { Footer } from '@/components/footer'
import SecretTrigger from '@/components/secret-trigger'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, CheckCircle2, Zap, ShieldCheck } from 'lucide-react'

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
    <div className="min-h-screen flex flex-col bg-[#F7F6F3] text-slate-900 font-sans selection:bg-black selection:text-white">
      
      {/* Dot Background Pattern */}
      <div className="fixed inset-0 h-full w-full pointer-events-none z-0 opacity-[0.4]" 
           style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* HEADER */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <SecretTrigger>
          <div className="flex items-center gap-2 cursor-pointer group">
            <Image 
              src="/logo.svg" 
              alt="Whozin Logo" 
              width={32} 
              height={32} 
              className="group-hover:scale-110 transition-transform"
            />
            <span className="font-bold text-xl tracking-tight">Whozin</span>
          </div>
        </SecretTrigger>
        
        <Link href="/my-events">
          <Button variant="outline" className="rounded-full border-slate-200 hover:border-black hover:bg-transparent transition-all">
            <Calendar className="mr-2 h-4 w-4" />
            My Events
          </Button>
        </Link>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 flex flex-col items-center pt-12 sm:pt-20 pb-20">
        
        {/* HERO TEXT */}
        <div className="text-center mb-12 space-y-4 max-w-2xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-700">
            The easiest way to get <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              people together.
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
            No logins. No app downloads. Just a simple link for your group chat.
            <br/>Handles the headcount and the math for you.
          </p>
        </div>

        {/* THE TOOL (Glassmorphism Update) */}
        <div className="relative w-full max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-backwards">
            {/* Glow Blob (Subtler) */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-[2.5rem] blur-2xl opacity-10"></div>
            
            {/* THE GLASS CARD */}
            <div className="relative w-full bg-white/40 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-white/60 p-4 sm:p-10 transition-all hover:bg-white/50 hover:shadow-2xl hover:shadow-slate-200/60">
              <EventCreator />
            </div>
        </div>

        {/* SOCIAL PROOF */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-backwards">
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-white/30 border border-white/50 backdrop-blur-sm">
            <div className="w-12 h-12 bg-blue-50/80 rounded-full flex items-center justify-center text-blue-600 mb-2">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg">Zero Friction</h3>
            <p className="text-slate-500 text-sm">Guests RSVP in 1 second. No passwords, no accounts, no "download our app" nonsense.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-white/30 border border-white/50 backdrop-blur-sm">
            <div className="w-12 h-12 bg-green-50/80 rounded-full flex items-center justify-center text-green-600 mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg">Family Math</h3>
            <p className="text-slate-500 text-sm">We automatically count adults and kids separately and calculate the total cost for you.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-white/30 border border-white/50 backdrop-blur-sm">
            <div className="w-12 h-12 bg-purple-50/80 rounded-full flex items-center justify-center text-purple-600 mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg">Private & Safe</h3>
            <p className="text-slate-500 text-sm">Your guest list isn't public. Data is stored in the UK/EU and auto-deletes in 30 days.</p>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>

      {/* DISCREET FAQ SECTION */}
      <div className="w-full max-w-2xl mt-32 mb-8 px-6">
        <details className="group">
          <summary className="list-none cursor-pointer text-center">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
              Frequently Asked Questions
              <span className="transition-transform group-open:rotate-180">▼</span>
            </span>
          </summary>
          
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <details className="group/item bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200/60 p-4 open:pb-6 cursor-pointer hover:bg-white/60 transition-colors">
              <summary className="flex items-center justify-between font-semibold text-slate-700 list-none select-none text-sm">
                Is Whozin really free?
                <span className="text-slate-400 transition-transform group-open/item:rotate-180">▼</span>
              </summary>
              <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                Yes! Whozin is 100% free for community events. Perfect for <strong>Sunday Roasts, 5-a-side Football, Pub Quizzes, School Fetes</strong>, as well as <strong>Diwali Parties and Christmas Dinners</strong>. No hidden booking fees.
              </p>
            </details>

            <details className="group/item bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200/60 p-4 open:pb-6 cursor-pointer hover:bg-white/60 transition-colors">
              <summary className="flex items-center justify-between font-semibold text-slate-700 list-none select-none text-sm">
                Do guests need an app?
                <span className="text-slate-400 transition-transform group-open/item:rotate-180">▼</span>
              </summary>
              <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                No. "Downloading an app" kills participation. Your guests just click the link (optimized for <strong>WhatsApp</strong>), type their name, and click "I'm In". It works on any phone, no login required.
              </p>
            </details>
            
             <details className="group/item bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200/60 p-4 open:pb-6 cursor-pointer hover:bg-white/60 transition-colors">
              <summary className="flex items-center justify-between font-semibold text-slate-700 list-none select-none text-sm">
                Can I track payments?
                <span className="text-slate-400 transition-transform group-open/item:rotate-180">▼</span>
              </summary>
              <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                Yes. If you're collecting money for a <strong>group gift, sports pitch, or dinner</strong>, simply add your payment details. We calculate the split cost for Adults vs Kids automatically.
              </p>
            </details>
          </div>
        </details>
      </div>

      <div className="relative z-10 border-t border-slate-100 bg-white/50">
        <Footer />
      </div>
    </div>
  )
}