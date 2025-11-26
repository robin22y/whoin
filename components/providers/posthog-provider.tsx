'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

export function PostHogProvider({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      try {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
          loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') posthog.debug()
          },
          // Privacy Mode - No Cookies
          disable_session_recording: true,
          // Disable cookies for GDPR compliance
          autocapture: false,
          capture_pageview: false,
          capture_pageleave: false,
        })
      } catch (error) {
        // Silently fail in development if PostHog key is invalid
        if (process.env.NODE_ENV === 'development') {
          console.debug('PostHog initialization skipped:', error)
        }
      }
    }
  }, [])

  // Pageview tracking is disabled for privacy mode
  // Uncomment below if you want to enable basic pageview tracking
  // useEffect(() => {
  //   if (pathname && typeof window !== 'undefined' && posthog.__loaded) {
  //     let url = window.origin + pathname
  //     if (searchParams && searchParams.toString()) {
  //       url = url + `?${searchParams.toString()}`
  //     }
  //     posthog.capture('$pageview', {
  //       $current_url: url,
  //     })
  //   }
  // }, [pathname, searchParams])

  return <>{children}</>
}

