"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/header"
import { CyberCard } from "@/components/cyber-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Filter, Download, Search, Calendar, Trash2, Edit, Upload, FileUp } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Expense, Category, Project } from "@/lib/store"

interface ExpensesContentProps {
  expenses: Expense[]
  categories: Pick<Category, "category_id" | "category_name">[]
  projects: Pick<Project, "project_id" | "project_name">[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
}

export function ExpensesContent({ expenses, categories, projects }: ExpensesContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { addExpense, deleteExpense } = useStore()

  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [description, setDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedProject, setSelectedProject] = useState("")

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.categories?.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || expense.categories?.category_name === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const category = categories.find((c) => c.category_id === selectedCategory)
      const project = projects.find((p) => p.project_id === selectedProject)

      addExpense({
        amount: Number.parseFloat(amount),
        expense_date: date,
        description: description || null,
        attachment_path: null,
        category_id: selectedCategory || null,
        project_id: selectedProject || null,
        categories: category ? { category_name: category.category_name } : null,
        sub_categories: null,
        projects: project ? { project_name: project.project_name } : null,
      })

      setIsDialogOpen(false)
      setAmount("")
      setDescription("")
      setSelectedCategory("")
      setSelectedProject("")
    } catch (error) {
      console.error("Error adding expense:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (expenseId: string) => {
    deleteExpense(expenseId)
  }

  return (
    <>
      <Header title="Expense Management" subtitle="Track and manage your expenses with precision" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="p-8 space-y-6"
      >
        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-72 bg-muted/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-52 bg-muted/50 border-border/50">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.category_id} value={cat.category_name}>
                    {cat.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="border-border/50 bg-transparent hover:bg-muted/50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </motion.div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="bg-gradient-to-r from-primary to-[oklch(0.70_0.22_200)] hover:opacity-90 glow-cyan">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="glass-strong border-border/50 max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Add New Expense</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddExpense} className="space-y-5 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-muted/50 h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Date</Label>
                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-muted/50 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Description</Label>
                    <Input
                      placeholder="What was this expense for?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-muted/50 h-11"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-muted/50 h-11">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.category_id} value={cat.category_id}>
                              {cat.category_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Project</Label>
                      <Select value={selectedProject} onValueChange={setSelectedProject}>
                        <SelectTrigger className="bg-muted/50 h-11">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((proj) => (
                            <SelectItem key={proj.project_id} value={proj.project_id}>
                              {proj.project_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Enhanced File Upload Zone */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Attachment</Label>
                    <motion.div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                        isDragging
                          ? "border-primary bg-primary/10 scale-[1.02]"
                          : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={() => setIsDragging(false)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <motion.div animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}>
                        <FileUp
                          className={`w-10 h-10 mx-auto transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </motion.div>
                      <p className="text-sm text-muted-foreground mt-3">Drag & drop or click to upload</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">PDF, PNG, JPG up to 10MB</p>
                    </motion.div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-primary to-[oklch(0.70_0.22_200)] hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add Expense"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Expenses Table */}
        <CyberCard hover={false} delay={1}>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Project</TableHead>
                <TableHead className="text-right font-semibold">Amount</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredExpenses.map((expense, index) => (
                  <motion.tr
                    key={expense.expense_id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    transition={{ delay: index * 0.03 }}
                    className="border-border/50 hover:bg-muted/30 group"
                    layout
                  >
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(expense.expense_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{expense.description || "-"}</TableCell>
                    <TableCell>
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[oklch(0.80_0.20_190/0.2)] text-[oklch(0.80_0.20_190)]">
                        {expense.categories?.category_name || "Uncategorized"}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{expense.projects?.project_name || "-"}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-[oklch(0.70_0.25_320)]">
                      ${Number(expense.amount).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(expense.expense_id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredExpenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No expenses found. Add your first expense to get started!</p>
                    </motion.div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CyberCard>
      </motion.div>
    </>
  )
}
