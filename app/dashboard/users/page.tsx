"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { UsersContent } from "@/components/users-content"

export default function UsersPage() {
  const router = useRouter()
  const { user, isLoading } = useStore()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    // Check if user is admin
    // Note: Since the database doesn't have a role field, you may need to:
    // 1. Add a role field to the User table in the database
    // 2. Or check admin status by UserID/EmailAddress
    // 3. Or use a separate admin table
    // For now, checking role from localStorage (which comes from store.tsx)
    if (!isLoading && user && user.role !== "admin") {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-pattern">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (user.role !== "admin") {
    return null
  }

  return <UsersContent />
}
