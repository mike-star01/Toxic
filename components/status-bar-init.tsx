"use client"

import { useEffect } from 'react'
import { StatusBar } from '@capacitor/status-bar'

export default function StatusBarInit() {
  useEffect(() => {
    const initStatusBar = async () => {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        try {
          await StatusBar.setOverlaysWebView({ overlay: false })
        } catch (error) {
          // Plugin might not be available in web browser
          console.log('StatusBar plugin not available')
        }
      }
    }
    initStatusBar()
  }, [])

  return null
}

