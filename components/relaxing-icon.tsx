import React from "react"
import { LucideIcon } from "lucide-react"

interface RelaxingIconProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>
  className?: string
  containerClassName?: string
  glowColor?: string
}

export const RelaxingIcon = ({ 
  icon: Icon, 
  className = "w-5 h-5", 
  containerClassName = "",
  glowColor = "from-amber-400 to-amber-600"
}: RelaxingIconProps) => {
  return (
    <div className={`relative group/icon shrink-0 ${containerClassName}`}>
      {/* Soft Glow Background */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${glowColor} opacity-20 blur-lg group-hover/icon:opacity-40 transition-opacity duration-500`} />
      
      {/* Main Container */}
      <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${glowColor} shadow-lg shadow-amber-500/10 group-hover/icon:shadow-amber-500/30 group-hover/icon:-translate-y-1 transition-all duration-500 ring-4 ring-white/50 dark:ring-white/5 translate-z-50`}>
        <Icon className={`${className} text-white animate-float-slow`} />
      </div>
    </div>
  )
}
