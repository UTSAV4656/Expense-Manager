"use client"

import { motion } from "framer-motion"
import { Bell, Search, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="glass-strong border-b border-border/50 px-4 md:px-8 py-4 md:py-5 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4 md:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-shrink-0 min-w-0"
        >
          <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">{title}</h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs md:text-sm text-muted-foreground mt-1 hidden sm:block"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 md:gap-3"
        >
          {/* Search */}
          <div className="relative group hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search..."
              className="pl-10 w-48 lg:w-72 bg-muted/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Notifications */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" className="relative hover:bg-muted/50">
              <Bell className="w-5 h-5" />
              <motion.span
                className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </Button>
          </motion.div>

          {/* Settings */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" className="hover:bg-muted/50">
              <Settings className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Profile */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" className="rounded-full p-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </header>
  )
}
