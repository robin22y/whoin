'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        // Try to parse as JSON, but if it fails, use the raw string value
        try {
          setStoredValue(JSON.parse(item))
        } catch {
          // If parsing fails, it might be a plain string value
          // For string types, use the raw value; otherwise use initialValue
          if (typeof initialValue === 'string') {
            setStoredValue(item as T)
          } else {
            // If it's not a string type, clear the invalid value
            window.localStorage.removeItem(key)
            setStoredValue(initialValue)
          }
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (mounted) {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [mounted ? storedValue : initialValue, setValue]
}

