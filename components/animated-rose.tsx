"use client"

import styles from './animated-rose.module.css'

export default function AnimatedRose() {
  return (
    <div className={styles.container}>
      <div className={styles.rose}>
        <div className={styles.flower}>
          <div className={styles.petalBase}></div>
          <div className={styles.petalSide}></div>
          <div className={styles.petalInnerRight}></div>
          <div className={styles.petalInnerTop}></div>
          <div className={styles.bud}></div>
        </div>
        <div className={styles.leaf}>
          <div className={styles.stem}></div>
          <div className={styles.leafs}></div>
          <div className={styles.leafs}></div>
        </div>
      </div>
    </div>
  )
}