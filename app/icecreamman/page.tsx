import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Lock, Trash2, ExternalLink, ShieldAlert, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default async function IceCreamManPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>
}) {
  const params = await searchParams

  // 1. Security Check
  if (params.key !== 'Rncdm 2025') {
    return notFound()
  }

  const supabase = await createClient()

  // 2. Fetch High Level Stats
  const { count: totalEvents } = await supabase.from('events').select('*', { count: 'exact', head: true })
  const { count: totalGuests } = await supabase.from('guests').select('*', { count: 'exact', head: true })
  
  // 3. Fetch Recent Events for Investigation
  const { data: recentEvents } = await supabase
    .from('events')
    .select('*, guests(count)')
    .order('created_at', { ascending: false })
    .limit(50)

  // 4. Calculate Month-wise Data for Graphs
  const eventsByMonth = (recentEvents || []).reduce((acc: any, event: any) => {
    const month = new Date(event.created_at).toLocaleString('default', { month: 'short' })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  // Calculate max for graph scaling
  const maxEvents = Math.max(...Object.values(eventsByMonth).map((v: any) => v), 1)

  // --- SERVER ACTIONS ---
  async function toggleSuspension(formData: FormData) {
    'use server'
    const eventId = formData.get('eventId') as string
    const currentStatus = formData.get('currentStatus') === 'true'
    const supabase = await createClient()
    
    await supabase.from('events').update({ is_suspended: !currentStatus }).eq('id', eventId)
    revalidatePath('/icecreamman')
  }

  async function deleteEventAdmin(formData: FormData) {
    'use server'
    const eventId = formData.get('eventId') as string
    const supabase = await createClient()
    
    await supabase.from('events').delete().eq('id', eventId)
    revalidatePath('/icecreamman')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Header */}
      <div className="bg-[#0F172A] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4 opacity-50">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-bold tracking-widest uppercase">Admin Dashboard</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-2">The Ice Cream Van 🍦</h1>
          <p className="text-slate-400">Monitoring platform activity and enforcement.</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 -mt-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white shadow-lg border-0 ring-1 ring-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-slate-900">{totalEvents}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0 ring-1 ring-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-slate-900">{totalGuests}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 ring-1 ring-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Activity Graph</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-12">
                {Object.entries(eventsByMonth).map(([month, count]: any) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1 group">
                    <div 
                      className="w-full bg-blue-600 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all"
                      style={{ height: `${(count / maxEvents) * 100}%` }}
                    ></div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investigation Table */}
        <Card className="bg-white shadow-sm border border-slate-200 overflow-hidden mb-12">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-400" /> 
                Recent Events Investigation
              </CardTitle>
              <span className="text-xs font-medium px-2 py-1 bg-slate-200 rounded text-slate-600">
                Last 50 Entries
              </span>
            </div>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-[300px]">Event Title / ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Enforcement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents?.map((event) => (
                <TableRow key={event.id} className={event.is_suspended ? 'bg-red-50 hover:bg-red-50' : ''}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-bold truncate max-w-[200px]" title={event.title}>{event.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{event.id}</span>
                      {event.user_id && <span className="text-[10px] text-blue-400">User: {event.user_id.slice(0, 8)}...</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                        <span className="font-semibold text-slate-700">{new Date(event.date).toLocaleDateString()}</span>
                        <span className="text-slate-400">Created: {new Date(event.created_at).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                       {event.guests[0]?.count || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    {event.is_suspended ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                            <Lock className="w-3 h-3" /> Suspended
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                            Active
                        </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        {/* VIEW LINK */}
                        <Link href={`/e/${event.short_code || event.id}`} target="_blank">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </Link>

                        {/* SUSPEND BUTTON */}
                        <form action={toggleSuspension}>
                            <input type="hidden" name="eventId" value={event.id} />
                            <input type="hidden" name="currentStatus" value={String(event.is_suspended || false)} />
                            <Button size="icon" variant="ghost" className={`h-8 w-8 ${event.is_suspended ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:text-amber-600'}`} title="Suspend/Unsuspend">
                                <Lock className="w-4 h-4" />
                            </Button>
                        </form>

                        {/* DELETE BUTTON */}
                        <form action={deleteEventAdmin}>
                            <input type="hidden" name="eventId" value={event.id} />
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50" title="Delete Permanently">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  )
}