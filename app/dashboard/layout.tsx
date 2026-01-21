import type React from "react"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid-pattern">
      <Sidebar />
      <main className="ml-0 md:ml-72 min-h-screen transition-all duration-300">{children}</main>
    </div>
  )
}
