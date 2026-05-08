"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface PerformanceContextType {
  isLowEnd: boolean
  isReducedMotion: boolean
}

const PerformanceContext = createContext<PerformanceContextType>({
  isLowEnd: false,
  isReducedMotion: false,
})

export const usePerformance = () => useContext(PerformanceContext)

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [performance, setPerformance] = useState<PerformanceContextType>({
    isLowEnd: false,
    isReducedMotion: false,
  })

  useEffect(() => {
    const checkPerformance = () => {
      // 1. Check for reduced motion preference
      const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      const isReducedMotion = reducedMotionQuery.matches

      // 2. Detect low-end hardware
      // navigator.deviceMemory gives RAM in GB (not supported in all browsers)
      const ram = (navigator as any).deviceMemory || 8
      // navigator.hardwareConcurrency gives logical CPU cores
      const cores = navigator.hardwareConcurrency || 8
      
      // 3. Check connection (Data Saver mode)
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      const isSaveData = connection?.saveData

      // Consider it low-end if RAM < 4GB or cores < 4 or Save Data is on
      const isLowEnd = ram < 4 || cores < 4 || isSaveData || isReducedMotion

      setPerformance({
        isLowEnd,
        isReducedMotion,
      })

      if (isLowEnd) {
        console.log("Low-end device detected. Optimizing performance...")
        document.documentElement.classList.add("low-perf")
      }
    }

    checkPerformance()
  }, [])

  return (
    <PerformanceContext.Provider value={performance}>
      {children}
    </PerformanceContext.Provider>
  )
}
