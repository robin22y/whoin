# Whozin - Event Sign-up

Extreme simple sign-up tool for Community Events.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide React icons
- **UI Library:** shadcn/ui
- **Backend:** Supabase (Region: eu-west-2 London for GDPR compliance)
- **Analytics:** PostHog (Privacy Mode - No Cookies)

## Features

1. **Mad Libs Creator:** Organizers type "I am organizing [Event]..." to create events
2. **Viral Guest Memory:** Guest names are remembered via localStorage for future RSVPs
3. **Family Math:** Automatic cost calculation (Adults × Price, kids are free)
4. **No Logins for Guests:** Guests never need to log in. Organizers use magic links
5. **GDPR Compliant:** Strict privacy controls, UK/EU data storage, consent checkboxes

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. **CRITICAL:** Select **Region: London (eu-west-2)** for GDPR compliance
3. Go to SQL Editor and run the schema from `supabase/schema.sql`
4. Copy your project URL and anon key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: PostHog Analytics (Privacy Mode)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Design Rules

- **Mobile First:** All designs are optimized for mobile devices
- **Buttons:** Minimum height 48px for touch-friendly interaction
- **Inputs:** Font size 16px to prevent iOS zoom
- **Aesthetics:** Clean, white, "Notion-like" vibe with Inter font
- **Mad Libs UI:** Inputs styled as underlined text, not boxes

## GDPR & Privacy

- **Consent Required:** Guest form includes mandatory consent checkbox
- **No IP Collection:** IP addresses are not collected
- **UK/EU Storage:** All data stored in London (eu-west-2) region
- **Delete My Data:** Footer includes button to delete all user data
- **Privacy Policy:** Available at `/privacy`

## Project Structure

```
├── app/
│   ├── auth/              # Magic link authentication
│   ├── event/[id]/        # Event pages with RSVP
│   ├── privacy/           # Privacy policy page
│   └── layout.tsx         # Root layout with PostHog
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── event-creator.tsx  # Mad Libs event creator
│   ├── guest-form.tsx     # RSVP form with consent
│   ├── footer.tsx         # Footer with delete functionality
│   └── providers/         # PostHog provider
├── lib/
│   └── supabase/          # Supabase client utilities
├── hooks/
│   └── use-local-storage.ts # localStorage hook with hydration
└── supabase/
    └── schema.sql         # Database schema
```

## Usage

1. **Create an Event:** Visit the homepage and fill out the Mad Libs-style form
2. **Authenticate:** Enter your email to receive a magic link (no password needed)
3. **Share Event:** Share the event URL with guests
4. **RSVP:** Guests can RSVP without logging in, names are remembered for next time
5. **View Stats:** Event page shows anonymized statistics

## License

MIT
