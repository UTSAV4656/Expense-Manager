"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { CyberCard } from "@/components/cyber-card"
import { FloatingOrbs } from "@/components/particles"
import { TrendingUp, TrendingDown, Wallet, FolderKanban, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { User } from "@/lib/store"

interface DashboardContentProps {
  user: User
  profile: {
    full_name: string
    is_admin: boolean
  } | null
  expenses: Array<{
    amount: number
    expense_date: string
    categories: { category_name: string } | null
  }>
  incomes: Array<{
    amount: number
    income_date: string
  }>
  projects: Array<{
    project_id: string
    project_name: string
    budget: number
  }>
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

const monthlyData = [
  { name: "Jan", expenses: 4200, income: 6500 },
  { name: "Feb", expenses: 3800, income: 5900 },
  { name: "Mar", expenses: 5100, income: 7200 },
  { name: "Apr", expenses: 4600, income: 6800 },
  { name: "May", expenses: 3900, income: 7100 },
  { name: "Jun", expenses: 4400, income: 6600 },
]

const categoryData = [
  { name: "Food", value: 35, color: "oklch(0.80 0.20 190)" },
  { name: "Transport", value: 20, color: "oklch(0.70 0.25 320)" },
  { name: "Shopping", value: 25, color: "oklch(0.80 0.22 145)" },
  { name: "Bills", value: 15, color: "oklch(0.80 0.20 60)" },
  { name: "Other", value: 5, color: "oklch(0.70 0.25 290)" },
]

export function DashboardContent({ user, profile, expenses, incomes, projects }: DashboardContentProps) {
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0)
  const balance = totalIncome - totalExpenses

  const stats = [
    {
      title: "Total Balance",
      value: `$${balance.toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: Wallet,
      glow: "cyan" as const,
    },
    {
      title: "Total Income",
      value: `$${totalIncome.toLocaleString()}`,
      change: "+8.2%",
      trend: "up",
      icon: TrendingUp,
      glow: "green" as const,
    },
    {
      title: "Total Expenses",
      value: `$${totalExpenses.toLocaleString()}`,
      change: "-3.1%",
      trend: "down",
      icon: TrendingDown,
      glow: "pink" as const,
    },
    {
      title: "Active Projects",
      value: projects.length.toString(),
      change: "+2",
      trend: "up",
      icon: FolderKanban,
      glow: "violet" as const,
    },
  ]

  return (
    <>
      <FloatingOrbs />
      <Header
        title={`Welcome back, ${profile?.full_name || user.email?.split("@")[0]}`}
        subtitle="Here's your financial command center"
      />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-8 space-y-8 relative">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <CyberCard glowColor={stat.glow} delay={index}>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <motion.p
                      className="text-3xl font-bold font-mono tracking-tight"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                    >
                      {stat.value}
                    </motion.p>
                    <div className="flex items-center gap-1.5">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-[oklch(0.80_0.22_145)]" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-[oklch(0.70_0.25_25)]" />
                      )}
                      <span
                        className={stat.trend === "up" ? "text-[oklch(0.80_0.22_145)]" : "text-[oklch(0.70_0.25_25)]"}
                      >
                        {stat.change}
                      </span>
                      <span className="text-muted-foreground text-xs">vs last month</span>
                    </div>
                  </div>
                  <motion.div
                    className={`p-3 rounded-xl ${
                      stat.glow === "cyan"
                        ? "bg-[oklch(0.80_0.20_190/0.2)]"
                        : stat.glow === "green"
                          ? "bg-[oklch(0.80_0.22_145/0.2)]"
                          : stat.glow === "pink"
                            ? "bg-[oklch(0.70_0.25_320/0.2)]"
                            : "bg-[oklch(0.70_0.25_290/0.2)]"
                    }`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <stat.icon
                      className={`w-6 h-6 ${
                        stat.glow === "cyan"
                          ? "text-[oklch(0.80_0.20_190)]"
                          : stat.glow === "green"
                            ? "text-[oklch(0.80_0.22_145)]"
                            : stat.glow === "pink"
                              ? "text-[oklch(0.70_0.25_320)]"
                              : "text-[oklch(0.70_0.25_290)]"
                      }`}
                    />
                  </motion.div>
                </div>
              </CyberCard>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Area Chart */}
          <motion.div variants={itemVariants} className="xl:col-span-2">
            <CyberCard hover={false} delay={4}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Income vs Expenses</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[oklch(0.80_0.20_190)]" />
                    <span className="text-muted-foreground">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[oklch(0.70_0.25_320)]" />
                    <span className="text-muted-foreground">Expenses</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.80 0.20 190)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="oklch(0.80 0.20 190)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.70 0.25 320)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="oklch(0.70 0.25 320)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.04 260)" />
                    <XAxis dataKey="name" stroke="oklch(0.60 0.02 260)" fontSize={12} />
                    <YAxis stroke="oklch(0.60 0.02 260)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.14 0.025 260)",
                        border: "1px solid oklch(0.25 0.04 260)",
                        borderRadius: "12px",
                        boxShadow: "0 8px 32px oklch(0 0 0 / 0.3)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="oklch(0.80 0.20 190)"
                      fill="url(#incomeGradient)"
                      strokeWidth={3}
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="oklch(0.70 0.25 320)"
                      fill="url(#expenseGradient)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CyberCard>
          </motion.div>

          {/* Pie Chart */}
          <motion.div variants={itemVariants}>
            <CyberCard glowColor="pink" hover={false} delay={5}>
              <h3 className="text-lg font-semibold mb-6">Expense Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.14 0.025 260)",
                        border: "1px solid oklch(0.25 0.04 260)",
                        borderRadius: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((cat) => (
                  <motion.div key={cat.name} className="flex items-center gap-2" whileHover={{ x: 4 }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs text-muted-foreground">{cat.name}</span>
                    <span className="text-xs font-mono ml-auto">{cat.value}%</span>
                  </motion.div>
                ))}
              </div>
            </CyberCard>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <CyberCard hover={false} glowColor="green" delay={6}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 300 }}
                  whileHover={{ x: 8, backgroundColor: "oklch(0.20 0.02 260 / 0.5)" }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-11 h-11 rounded-xl bg-[oklch(0.70_0.25_320/0.2)] flex items-center justify-center"
                      whileHover={{ rotate: -10 }}
                    >
                      <TrendingDown className="w-5 h-5 text-[oklch(0.70_0.25_320)]" />
                    </motion.div>
                    <div>
                      <p className="font-medium">{expense.categories?.category_name || "Uncategorized"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(expense.expense_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="font-mono font-bold text-[oklch(0.70_0.25_320)]">
                    -${Number(expense.amount).toLocaleString()}
                  </p>
                </motion.div>
              ))}
              {expenses.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-12"
                >
                  No transactions yet. Start by adding an expense!
                </motion.p>
              )}
            </div>
          </CyberCard>
        </motion.div>
      </motion.div>
    </>
  )
}
