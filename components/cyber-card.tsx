"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface CyberCardProps {
  children: ReactNode
  className?: string
  glowColor?: "cyan" | "pink" | "green" | "orange" | "violet"
  hover?: boolean
  delay?: number
}

const glowStyles = {
  cyan: {
    glow: "glow-cyan",
    border: "bg-[oklch(0.80_0.20_190)]",
    bg: "bg-[oklch(0.80_0.20_190/0.15)]",
  },
  pink: {
    glow: "glow-pink",
    border: "bg-[oklch(0.70_0.25_320)]",
    bg: "bg-[oklch(0.70_0.25_320/0.15)]",
  },
  green: {
    glow: "glow-green",
    border: "bg-[oklch(0.80_0.22_145)]",
    bg: "bg-[oklch(0.80_0.22_145/0.15)]",
  },
  orange: {
    glow: "glow-orange",
    border: "bg-[oklch(0.80_0.20_60)]",
    bg: "bg-[oklch(0.80_0.20_60/0.15)]",
  },
  violet: {
    glow: "glow-violet",
    border: "bg-[oklch(0.70_0.25_290)]",
    bg: "bg-[oklch(0.70_0.25_290/0.15)]",
  },
}

export function CyberCard({ children, className, glowColor = "cyan", hover = true, delay = 0 }: CyberCardProps) {
  const styles = glowStyles[glowColor]

  return (
    <motion.div
      className={cn("glass rounded-xl p-6 relative overflow-hidden", styles.glow, className)}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: delay * 0.1,
      }}
      whileHover={
        hover
          ? {
              scale: 1.02,
              y: -6,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }
          : undefined
      }
    >
      {/* Animated corner accents */}
      <motion.div
        className={cn("absolute top-0 left-0 w-12 h-[2px]", styles.border)}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay * 0.1 + 0.2, duration: 0.3 }}
        style={{ transformOrigin: "left" }}
      />
      <motion.div
        className={cn("absolute top-0 left-0 w-[2px] h-12", styles.border)}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: delay * 0.1 + 0.2, duration: 0.3 }}
        style={{ transformOrigin: "top" }}
      />
      <motion.div
        className={cn("absolute bottom-0 right-0 w-12 h-[2px]", styles.border)}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay * 0.1 + 0.3, duration: 0.3 }}
        style={{ transformOrigin: "right" }}
      />
      <motion.div
        className={cn("absolute bottom-0 right-0 w-[2px] h-12", styles.border)}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: delay * 0.1 + 0.3, duration: 0.3 }}
        style={{ transformOrigin: "bottom" }}
      />

      {/* Subtle inner glow */}
      <div className={cn("absolute inset-0 opacity-30 rounded-xl", styles.bg)} />

      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
