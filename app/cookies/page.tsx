import { Footer } from '@/components/footer'

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">What are Cookies?</h2>
            <p className="text-muted-foreground">
              Cookies are small text files that are placed on your device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to the site owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Them</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Essential</h3>
                <p className="text-muted-foreground">
                  We use LocalStorage to save your name and "My Events" list on your device for your convenience.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                <p className="text-muted-foreground">
                  We use PostHog in "Privacy Mode" which does NOT set tracking cookies, but may use anonymous local storage signals to count unique visitors.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground">
              You can clear your browser cache to remove these details at any time.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

