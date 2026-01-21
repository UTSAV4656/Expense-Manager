"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { CyberCard } from "@/components/cyber-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { FileSpreadsheet, FileText, TrendingUp, TrendingDown, Calendar, Zap } from "lucide-react"

interface AnalyticsContentProps {
  expenses: Array<{
    amount: number
    expense_date: string
    categories: { category_name: string } | null
  }>
  incomes: Array<{
    amount: number
    income_date: string
  }>
}

const monthlyComparison = [
  { month: "Jan", thisYear: 4200, lastYear: 3800 },
  { month: "Feb", thisYear: 3800, lastYear: 4100 },
  { month: "Mar", thisYear: 5100, lastYear: 4500 },
  { month: "Apr", thisYear: 4600, lastYear: 4200 },
  { month: "May", thisYear: 3900, lastYear: 4800 },
  { month: "Jun", thisYear: 4400, lastYear: 4100 },
  { month: "Jul", thisYear: 5200, lastYear: 4900 },
  { month: "Aug", thisYear: 4800, lastYear: 5200 },
  { month: "Sep", thisYear: 4100, lastYear: 4600 },
  { month: "Oct", thisYear: 4700, lastYear: 4300 },
  { month: "Nov", thisYear: 5500, lastYear: 5100 },
  { month: "Dec", thisYear: 6200, lastYear: 5800 },
]

const categoryBreakdown = [
  { category: "Food", amount: 2500, fullMark: 5000 },
  { category: "Transport", amount: 1200, fullMark: 5000 },
  { category: "Shopping", amount: 1800, fullMark: 5000 },
  { category: "Bills", amount: 3200, fullMark: 5000 },
  { category: "Health", amount: 800, fullMark: 5000 },
  { category: "Entertainment", amount: 600, fullMark: 5000 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

export function AnalyticsContent({ expenses, incomes }: AnalyticsContentProps) {
  const [timeRange, setTimeRange] = useState<"month" | "year">("month")

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0)

  return (
    <>
      <Header title="Analytics Center" subtitle="Deep insights into your financial data" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-8 space-y-6">
        {/* Time Range Toggle + Export */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as "month" | "year")}>
            <TabsList className="glass">
              <TabsTrigger value="month" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Calendar className="w-4 h-4 mr-2" />
                Monthly
              </TabsTrigger>
              <TabsTrigger value="year" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Calendar className="w-4 h-4 mr-2" />
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="border-border/50 bg-transparent hover:bg-muted/50">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="border-border/50 bg-transparent hover:bg-muted/50">
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants}>
            <CyberCard glowColor="pink" delay={0}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">Total Expenses</p>
                  <motion.p
                    className="text-3xl font-bold font-mono"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    ${totalExpenses.toLocaleString()}
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 rounded-xl bg-[oklch(0.70_0.25_320/0.2)]"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <TrendingDown className="w-6 h-6 text-[oklch(0.70_0.25_320)]" />
                </motion.div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-sm">
                <TrendingDown className="w-4 h-4 text-[oklch(0.70_0.25_25)]" />
                <span className="text-[oklch(0.70_0.25_25)]">-5.2%</span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </CyberCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <CyberCard glowColor="cyan" delay={1}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">Total Income</p>
                  <motion.p
                    className="text-3xl font-bold font-mono"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    ${totalIncome.toLocaleString()}
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 rounded-xl bg-[oklch(0.80_0.20_190/0.2)]"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <TrendingUp className="w-6 h-6 text-[oklch(0.80_0.20_190)]" />
                </motion.div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-[oklch(0.80_0.22_145)]" />
                <span className="text-[oklch(0.80_0.22_145)]">+12.3%</span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </CyberCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <CyberCard glowColor="green" delay={2}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">Net Savings</p>
                  <motion.p
                    className="text-3xl font-bold font-mono"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    ${(totalIncome - totalExpenses).toLocaleString()}
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 rounded-xl bg-[oklch(0.80_0.22_145/0.2)]"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Zap className="w-6 h-6 text-[oklch(0.80_0.22_145)]" />
                </motion.div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-[oklch(0.80_0.22_145)]" />
                <span className="text-[oklch(0.80_0.22_145)]">+28.1%</span>
                <span className="text-muted-foreground">savings rate</span>
              </div>
            </CyberCard>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <motion.div variants={itemVariants}>
            <CyberCard hover={false} delay={3}>
              <h3 className="text-lg font-bold mb-6">Year-over-Year Comparison</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.04 260)" />
                    <XAxis dataKey="month" stroke="oklch(0.60 0.02 260)" fontSize={12} />
                    <YAxis stroke="oklch(0.60 0.02 260)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.14 0.025 260)",
                        border: "1px solid oklch(0.25 0.04 260)",
                        borderRadius: "12px",
                        boxShadow: "0 8px 32px oklch(0 0 0 / 0.3)",
                      }}
                    />
                    <Bar dataKey="lastYear" fill="oklch(0.70 0.25 290 / 0.5)" name="Last Year" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="thisYear" fill="oklch(0.80 0.20 190)" name="This Year" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CyberCard>
          </motion.div>

          {/* Radar Chart */}
          <motion.div variants={itemVariants}>
            <CyberCard glowColor="violet" hover={false} delay={4}>
              <h3 className="text-lg font-bold mb-6">Category Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={categoryBreakdown}>
                    <PolarGrid stroke="oklch(0.25 0.04 260)" />
                    <PolarAngleAxis dataKey="category" stroke="oklch(0.60 0.02 260)" fontSize={12} />
                    <PolarRadiusAxis stroke="oklch(0.60 0.02 260)" fontSize={10} />
                    <Radar
                      name="Amount"
                      dataKey="amount"
                      stroke="oklch(0.80 0.20 190)"
                      fill="oklch(0.80 0.20 190)"
                      fillOpacity={0.4}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CyberCard>
          </motion.div>
        </div>

        {/* Trend Line */}
        <motion.div variants={itemVariants}>
          <CyberCard hover={false} glowColor="orange" delay={5}>
            <h3 className="text-lg font-bold mb-6">Expense Trend Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.04 260)" />
                  <XAxis dataKey="month" stroke="oklch(0.60 0.02 260)" fontSize={12} />
                  <YAxis stroke="oklch(0.60 0.02 260)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.14 0.025 260)",
                      border: "1px solid oklch(0.25 0.04 260)",
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px oklch(0 0 0 / 0.3)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="thisYear"
                    stroke="oklch(0.80 0.20 190)"
                    strokeWidth={3}
                    dot={{ fill: "oklch(0.80 0.20 190)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8, fill: "oklch(0.80 0.20 190)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lastYear"
                    stroke="oklch(0.70 0.25 320)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CyberCard>
        </motion.div>
      </motion.div>
    </>
  )
}
