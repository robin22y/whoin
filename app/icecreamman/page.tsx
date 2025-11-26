import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function IceCreamManPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>
}) {
  const params = await searchParams

  // Security: Hardcoded password check
  if (params.key !== 'Rncdm 2025') {
    return notFound()
  }

  const supabase = await createClient()

  // Fetch Total Events Created
  const { count: totalEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })

  // Fetch Total Guests (All time)
  const { count: totalGuests } = await supabase
    .from('guests')
    .select('*', { count: 'exact', head: true })

  // Fetch Events Created Today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  const { count: eventsToday } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayISO)

  return (
    <div>
      <h1>Super Secret Stats</h1>
      <ul>
        <li>Total Events Created: {totalEvents || 0}</li>
        <li>Total Guests (All time): {totalGuests || 0}</li>
        <li>Events Created Today: {eventsToday || 0}</li>
      </ul>
    </div>
  )
}

