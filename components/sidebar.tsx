"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { LayoutDashboard, Receipt, FolderKanban, Tags, BarChart3, LogOut, Zap, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "cyan" },
  { href: "/dashboard/expenses", label: "Expenses", icon: Receipt, color: "pink" },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban, color: "green" },
  { href: "/dashboard/categories", label: "Categories", icon: Tags, color: "orange" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, color: "violet" },
  { href: "/dashboard/users", label: "Users", icon: Users, color: "blue", adminOnly: true },
]

const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
  cyan: {
    bg: "bg-[oklch(0.80_0.20_190/0.2)]",
    text: "text-[oklch(0.80_0.20_190)]",
    glow: "shadow-[0_0_20px_oklch(0.80_0.20_190/0.3)]",
  },
  pink: {
    bg: "bg-[oklch(0.70_0.25_320/0.2)]",
    text: "text-[oklch(0.70_0.25_320)]",
    glow: "shadow-[0_0_20px_oklch(0.70_0.25_320/0.3)]",
  },
  green: {
    bg: "bg-[oklch(0.80_0.22_145/0.2)]",
    text: "text-[oklch(0.80_0.22_145)]",
    glow: "shadow-[0_0_20px_oklch(0.80_0.22_145/0.3)]",
  },
  orange: {
    bg: "bg-[oklch(0.80_0.20_60/0.2)]",
    text: "text-[oklch(0.80_0.20_60)]",
    glow: "shadow-[0_0_20px_oklch(0.80_0.20_60/0.3)]",
  },
  violet: {
    bg: "bg-[oklch(0.70_0.25_290/0.2)]",
    text: "text-[oklch(0.70_0.25_290)]",
    glow: "shadow-[0_0_20px_oklch(0.70_0.25_290/0.3)]",
  },
  blue: {
    bg: "bg-[oklch(0.70_0.25_220/0.2)]",
    text: "text-[oklch(0.70_0.25_220)]",
    glow: "shadow-[0_0_20px_oklch(0.70_0.25_220/0.3)]",
  },
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useStore()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 glass-strong border-r border-border/50 flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-4">
          <motion.div
            className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center glow-cyan relative"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Zap className="w-7 h-7 text-primary" />
            <Sparkles className="w-4 h-4 text-secondary absolute -top-1 -right-1" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gradient-multi">ExpenseX</h1>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems
          .filter((item) => !item.adminOnly || (user && user.role === "admin"))
          .map((item, index) => {
            const isActive = pathname === item.href
            const colors = colorMap[item.color]

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all relative overflow-hidden",
                  isActive
                    ? cn(colors.bg, colors.text, colors.glow)
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
                whileHover={{ x: 6 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full",
                      colors.bg.replace("/0.2]", "]"),
                    )}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  className={cn("p-2 rounded-lg", isActive ? colors.bg : "bg-muted/30")}
                  whileHover={{ rotate: isActive ? 0 : 10 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <motion.div
                    className="ml-auto w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: `oklch(0.80 0.20 ${item.color === "cyan" ? "190" : item.color === "pink" ? "320" : item.color === "green" ? "145" : item.color === "orange" ? "60" : "290"})`,
                    }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border/50">
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <div className="p-2 rounded-lg bg-muted/30">
            <LogOut className="w-5 h-5" />
          </div>
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  )
}
