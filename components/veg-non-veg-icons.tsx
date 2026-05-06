import React from "react"

export const VegIcon = ({ className }: { className?: string }) => (
  <div className={`w-3.5 h-3.5 border border-green-600 dark:border-green-500 flex items-center justify-center bg-transparent shrink-0 ${className}`}>
    <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500" />
  </div>
)

export const NonVegIcon = ({ className }: { className?: string }) => (
  <div className={`w-3.5 h-3.5 border border-red-600 dark:border-red-500 flex items-center justify-center bg-transparent shrink-0 ${className}`}>
    <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500" />
  </div>
)
