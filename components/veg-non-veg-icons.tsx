import React from "react"

export const VegIcon = ({ className }: { className?: string }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <div className="absolute inset-0 bg-green-500/10 blur-sm rounded-sm" />
    <div className="w-3.5 h-3.5 border border-green-600 dark:border-green-500 flex items-center justify-center bg-white/50 dark:bg-transparent rounded-sm relative z-10">
      <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500 shadow-[0_0_8px_rgba(22,163,74,0.5)] animate-pulse" />
    </div>
  </div>
)

export const NonVegIcon = ({ className }: { className?: string }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <div className="absolute inset-0 bg-red-500/10 blur-sm rounded-sm" />
    <div className="w-3.5 h-3.5 border border-red-600 dark:border-red-500 flex items-center justify-center bg-white/50 dark:bg-transparent rounded-sm relative z-10">
      <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.5)] animate-pulse" />
    </div>
  </div>
)
