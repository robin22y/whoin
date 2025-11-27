import { createClient } from '@/lib/supabase/server'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ExportButton } from '@/components/export-button'
import { ShareCard } from '@/components/share-card'
import { LogoutButton } from '@/components/logout-button'
import { EditEventForm } from '@/components/edit-event-form'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, PoundSterling, Calendar, MapPin, ChevronLeft, ShieldAlert, ArrowLeft } from 'lucide-react'

export default async function ManageEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ key?: string }>
}) {
  const { id } = await params
  const { key } = await searchParams
  const supabase = await createClient()

  if (!key) redirect(`/e/${id}`)

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('management_key', key)
    .single()

  if (eventError || !event) redirect(`/e/${id}`)

  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: true })

  const totalHeadcount = guests?.reduce((sum, guest) => sum + guest.adult_count + guest.kid_count, 0) || 0
  const totalAdults = guests?.reduce((sum, guest) => sum + guest.adult_count, 0) || 0
  const totalKids = guests?.reduce((sum, guest) => sum + guest.kid_count, 0) || 0
  const totalExpectedRevenue = totalAdults * (event.price_per_adult || 0) + totalKids * (event.price_per_child || 0)
  
  const eventDate = new Date(event.date)
  const deletionDate = new Date(eventDate)
  deletionDate.setDate(deletionDate.getDate() + 30)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F3] font-sans">
      
      {/* --- NAVY HEADER BACKGROUND --- */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-[#0F172A] -z-0">
         <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(to right, #94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* GLOBAL NAV (Dark Mode Text for Contrast on Navy) */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#0F172A] font-bold text-xl shadow-lg">
              {/* Link Icon SVG */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">The Invite Link</span>
        </Link>
        
        <div className="flex items-center gap-2">
           <Link href="/my-events" className="hidden sm:block">
             <Button variant="ghost" size="sm" className="text-blue-100 hover:text-white hover:bg-white/10">My Events</Button>
           </Link>
           <div className="[&>button]:text-blue-100 [&>button]:hover:text-white [&>button]:hover:bg-white/10">
             <LogoutButton />
           </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* EVENT TITLE CARD */}
        <div className="mb-10">
          <Link href="/my-events" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors text-sm font-medium group">
             <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Events
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-white">
            <div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-blue-100 font-medium text-lg">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Calendar className="w-5 h-5 text-blue-300" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  <MapPin className="w-5 h-5 text-red-300" />
                  {event.location}
                </div>
              </div>
            </div>
            
            {/* EDIT BUTTON (Now Visible) */}
            <div className="w-full md:w-auto">
               {/* We pass className to force the button to look good on dark bg */}
               <div className="[&>button]:bg-white [&>button]:text-[#0F172A] [&>button]:hover:bg-blue-50 [&>button]:border-0 [&>button]:shadow-lg">
                 <EditEventForm event={event} />
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Dashboard */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* STATS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between h-32">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <Users className="w-4 h-4" /> Headcount
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">{totalHeadcount}</span>
                  <span className="text-sm text-slate-500 font-medium">confirmed</span>
                </div>
                <div className="text-xs text-slate-400">
                  {totalAdults} Adults • {totalKids} Kids
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between h-32">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <PoundSterling className="w-4 h-4" /> Revenue
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">£{totalExpectedRevenue.toFixed(2)}</span>
                  <span className="text-sm text-slate-500 font-medium">total</span>
                </div>
                <div className="text-xs text-slate-400">
                  Potential based on sign-ups
                </div>
              </div>
            </div>

            {/* GUEST LIST */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800">Guest List</h3>
                {guests && guests.length > 0 && (
                   <ExportButton eventTitle={event.title} guests={guests} />
                )}
              </div>
              
              <div className="p-0">
                {guests && guests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="pl-6 h-10 text-xs font-bold text-slate-400 uppercase">Name</TableHead>
                        <TableHead className="h-10 text-xs font-bold text-slate-400 uppercase text-center">Party</TableHead>
                        <TableHead className="pr-6 h-10 text-xs font-bold text-slate-400 uppercase text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guests.map((guest) => (
                        <TableRow key={guest.id} className="hover:bg-slate-50 border-slate-100">
                          <TableCell className="pl-6 font-medium text-slate-900">{guest.name}</TableCell>
                          <TableCell className="text-center text-slate-600">
                            {guest.adult_count + guest.kid_count} 
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              guest.is_paid 
                                ? 'bg-green-50 text-green-700 border-green-100' 
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                              {guest.is_paid ? 'PAID' : 'PENDING'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No guests yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="space-y-6">
            
            <ShareCard 
                eventId={event.id}
                shortCode={event.short_code}
                eventTitle={event.title}
                eventDate={event.date}
                eventLocation={event.location}
            />

            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-amber-600">
                <ShieldAlert className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Data Expiry</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                To protect privacy, this event and all guest data will be permanently deleted on:
              </p>
              <div className="bg-amber-50 text-amber-900 px-4 py-3 rounded-xl text-sm font-bold text-center border border-amber-100">
                {formatDate(deletionDate.toISOString())}
              </div>
            </div>

          </div>

        </div>
      </main>
      
      <div className="mt-12 border-t border-slate-200 bg-white">
        <Footer />
      </div>
    </div>
  )
}
