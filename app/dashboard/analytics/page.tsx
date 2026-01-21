"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { AnalyticsContent } from "@/components/analytics-content"

export default function AnalyticsPage() {
  const router = useRouter()
  const { user, isLoading, expenses, incomes } = useStore()

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
    <AnalyticsContent
      expenses={expenses.map((e) => ({
        amount: e.amount,
        expense_date: e.expense_date,
        categories: e.categories,
      }))}
      incomes={incomes.map((i) => ({
        amount: i.amount,
        income_date: i.income_date,
      }))}
    />
  )
}
