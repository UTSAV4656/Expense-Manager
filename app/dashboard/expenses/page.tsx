"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { ExpensesContent } from "@/components/expenses-content"

export default function ExpensesPage() {
  const router = useRouter()
  const { user, isLoading, expenses, categories, projects } = useStore()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <ExpensesContent
      expenses={expenses}
      categories={categories.map((c) => ({
        category_id: c.category_id,
        category_name: c.category_name,
      }))}
      projects={projects.map((p) => ({
        project_id: p.project_id,
        project_name: p.project_name,
      }))}
    />
  )
}
