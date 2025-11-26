import { Button } from '@/components/ui/button'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-md mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
        <p className="text-muted-foreground mb-6">
          There was a problem verifying your magic link. This could happen if:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
          <li>The link has expired (magic links expire after a short time)</li>
          <li>The link has already been used</li>
          <li>The link was invalid or corrupted</li>
        </ul>
        <div className="space-y-4">
          <Link href="/auth">
            <Button className="w-full min-h-[48px]">
              Try Again
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full min-h-[48px]">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

