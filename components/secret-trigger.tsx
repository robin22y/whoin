"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SecretTrigger({ children }: { children: React.ReactNode }) {
  const [taps, setTaps] = useState(0)
  const router = useRouter()

  // Reset taps if user stops tapping for 1 second
  useEffect(() => {
    const timer = setTimeout(() => setTaps(0), 1000)
    return () => clearTimeout(timer)
  }, [taps])

  const handleTap = () => {
    const newCount = taps + 1
    setTaps(newCount)

    // TRIGGER: 5 Rapid Taps
    if (newCount === 5) {
      const pin = prompt("🍦 Ice Cream Man says: What's the flavor?")
      
      // THE CHECK
      // We don't check the password here. We just pass it to the URL.
      // If it's wrong, the page itself will throw a 404.
      if (pin) {
        router.push(`/icecreamman?key=${pin}`)
      }
      setTaps(0)
    }
  }

  return (
    <div onClick={handleTap} className="cursor-pointer select-none">
      {children}
    </div>
  )
}

