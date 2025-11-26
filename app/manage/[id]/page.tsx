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
import Link from 'next/link' // <--- NEW IMPORT
import { Button } from '@/components/ui/button' // <--- NEW IMPORT
import { Users, PoundSterling, Calendar, MapPin, ChevronLeft } from 'lucide-react'

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
    <div className="min-h-screen flex flex-col bg-[#F7F6F3] text-slate-900 font-sans">
      
      {/* Background Pattern */}
      <div className="fixed inset-0 h-full w-full pointer-events-none z-0 opacity-[0.4]" 
           style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* NEW GLOBAL HEADER */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-slate-200/60 bg-white/40 backdrop-blur-md sticky top-0">
        <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
           <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">
              W
            </div>
            <span className="font-bold text-xl tracking-tight">WhoIn.uk</span>
        </Link>
        
        <div className="flex items-center gap-2">
           <Link href="/my-events" className="hidden sm:block">
             <Button variant="ghost" size="sm">My Events</Button>
           </Link>
           <div className="w-px h-4 bg-slate-300 mx-1 hidden sm:block"></div>
           <LogoutButton />
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Page Title Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
             <Link href="/my-events" className="text-slate-400 hover:text-black transition-colors">
                <div className="flex items-center text-sm font-medium">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </div>
             </Link>
             <span className="px-3 py-1 rounded-full bg-black/5 border border-black/10 text-slate-600 text-xs font-bold uppercase tracking-wider">
                Admin Dashboard
             </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-slate-500 font-medium text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              {event.location}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Stats & Share */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2 text-slate-500">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm uppercase tracking-wide">Headcount</span>
                </div>
                <p className="text-5xl font-bold text-slate-900">{totalHeadcount}</p>
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  {totalAdults} Adults • {totalKids} Kids
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2 text-slate-500">
                  <div className="p-2 bg-green-50 text-green-600 rounded-full">
                    <PoundSterling className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm uppercase tracking-wide">Revenue</span>
                </div>
                <p className="text-5xl font-bold text-slate-900">£{totalExpectedRevenue.toFixed(2)}</p>
                <p className="text-sm text-slate-500 mt-2 font-medium">
                   Potential Total
                </p>
              </div>
            </div>

            {/* EDIT FORM */}
            <EditEventForm event={event} />

            {/* SHARE CARD */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="bg-slate-50/50 border-b border-slate-100 p-6">
                <h3 className="font-bold text-lg">Invite Guests</h3>
                <p className="text-slate-500 text-sm">Share this link on WhatsApp to get RSVPs.</p>
              </div>
              <div className="p-6">
                <ShareCard 
                  eventId={event.id}
                  shortCode={event.short_code}
                  eventTitle={event.title}
                  eventDate={event.date}
                  eventLocation={event.location}
                />
              </div>
            </div>

            {/* GUEST LIST */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="bg-slate-50/50 border-b border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg">Guest List ({guests?.length || 0})</h3>
                </div>
                {guests && guests.length > 0 && (
                   <div className="w-full sm:w-auto">
                     <ExportButton eventTitle={event.title} guests={guests} />
                   </div>
                )}
              </div>
              
              <div className="p-0">
                {guests && guests.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="pl-6 font-bold text-slate-900">Name</TableHead>
                        <TableHead className="text-center font-bold text-slate-900">Party Size</TableHead>
                        <TableHead className="text-right pr-6 font-bold text-slate-900">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guests.map((guest) => (
                        <TableRow key={guest.id} className="hover:bg-slate-50/80 border-slate-100">
                          <TableCell className="pl-6 font-medium text-lg">{guest.name}</TableCell>
                          <TableCell className="text-center text-slate-500">
                            {guest.adult_count + guest.kid_count} 
                            <span className="text-xs ml-1 text-slate-400">
                              ({guest.adult_count}A / {guest.kid_count}K)
                            </span>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              guest.is_paid 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {guest.is_paid ? 'PAID' : 'PENDING'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    No guests have signed up yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Meta & Privacy */}
          <div className="space-y-6">
            <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-100 p-6 rounded-3xl">
              <h3 className="font-bold text-amber-900 mb-2">Data Privacy</h3>
              <p className="text-sm text-amber-800/80 leading-relaxed">
                This event data will self-destruct on <strong>{formatDate(deletionDate.toISOString())}</strong> (30 days after event).
                <br/><br/>
                Please ensure you have exported your list or settled payments before then.
              </p>
            </div>
          </div>

        </div>
      </main>
      
      <div className="relative z-10 border-t border-slate-200/60 bg-white/40 backdrop-blur-md">
        <Footer />
      </div>
    </div>
  )
}