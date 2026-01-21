"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { DashboardContent } from "@/components/dashboard-content"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, expenses, incomes, projects } = useStore()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
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

  return (
    <DashboardContent
      user={user}
      profile={{ full_name: user.full_name, is_admin: user.role === "admin" }}
      expenses={expenses.map((e) => ({
        amount: e.amount,
        expense_date: e.expense_date,
        categories: e.categories,
      }))}
      incomes={incomes.map((i) => ({
        amount: i.amount,
        income_date: i.income_date,
      }))}
      projects={projects.map((p) => ({
        project_id: p.project_id,
        project_name: p.project_name,
        budget: p.budget,
      }))}
    />
  )
}
