"use client"

import { useEffect, useRef, useState } from 'react'
import styles from './animated-rose.module.css'

interface AnimatedRoseProps {
  isVisible?: boolean
}

export default function AnimatedRose({ isVisible = true }: AnimatedRoseProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInViewport, setIsInViewport] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setIsInViewport(false)
      return
    }

    if (!containerRef.current) {
      setIsInViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInViewport(entry.isIntersecting)
        })
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [isVisible])

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.rose}>
        <div className={styles.flower}>
          <div 
            className={styles.petalBase}
            style={{ animation: isInViewport ? undefined : 'none' }}
          ></div>
          <div 
            className={styles.petalSide}
            style={{ animation: isInViewport ? undefined : 'none' }}
          ></div>
          <div 
            className={styles.petalInnerRight}
            style={{ animation: isInViewport ? undefined : 'none' }}
          ></div>
          <div 
            className={styles.petalInnerTop}
            style={{ animation: isInViewport ? undefined : 'none' }}
          ></div>
          <div className={styles.bud}></div>
        </div>
        <div className={styles.leaf}>
          <div 
            className={styles.stem}
            style={{ animation: isInViewport ? undefined : 'none' }}
          ></div>
          <div 
            className={styles.leafs}
            style={{ animation: isInViewport ? undefined : 'none' }}
          ></div>
          <div 
            className={styles.leafs}
            style={{ animation: isInViewport ? undefined : 'none' }}
          ></div>
        </div>
      </div>
    </div>
  )
}