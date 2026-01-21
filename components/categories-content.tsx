"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { CyberCard } from "@/components/cyber-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Plus,
  Tags,
  ChevronRight,
  Utensils,
  Car,
  ShoppingBag,
  Tv,
  Receipt,
  Heart,
  Plane,
  GraduationCap,
  Coins,
  Layers,
} from "lucide-react"
import { useStore } from "@/lib/store"
import type { Category } from "@/lib/store"

interface CategoriesContentProps {
  categories: Category[]
}



const categoryIcons: Record<string, React.ElementType> = {
  "Food & Dining": Utensils,
  Transportation: Car,
  Shopping: ShoppingBag,
  Entertainment: Tv,
  "Bills & Utilities": Receipt,
  Healthcare: Heart,
  Travel: Plane,
  Education: GraduationCap,
  Income: Coins,
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

const glowColors = ["cyan", "pink", "green", "orange", "violet"] as const

export function CategoriesContent({ categories }: CategoriesContentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categoryName, setCategoryName] = useState("")
  const { addCategory } = useStore()

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      addCategory(categoryName)
      setIsDialogOpen(false)
      setCategoryName("")
    } catch (error) {
      console.error("Error adding category:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header title="Categories" subtitle="Organize your expenses with custom categories" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3 text-muted-foreground">
            <motion.div className="p-2 rounded-lg bg-[oklch(0.80_0.20_60/0.2)]" whileHover={{ rotate: 10 }}>
              <Tags className="w-5 h-5 text-[oklch(0.80_0.20_60)]" />
            </motion.div>
            <span className="font-medium">{categories.length} categories</span>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-gradient-to-r from-[oklch(0.80_0.20_60)] to-[oklch(0.75_0.20_40)] hover:opacity-90 glow-orange text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="glass-strong border-border/50">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add New Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category Name</Label>
                  <Input
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="bg-muted/50 h-11"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-[oklch(0.80_0.20_60)] to-[oklch(0.75_0.20_40)] hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add Category"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Categories List */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
          <Accordion type="multiple" className="space-y-4">
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[category.category_name] || Tags
              const glowColor = glowColors[index % glowColors.length]

              return (
                <motion.div key={category.category_id} variants={itemVariants}>
                  <AccordionItem value={category.category_id} className="border-0">
                    <CyberCard className="p-0 overflow-hidden" glowColor={glowColor} hover={false} delay={index}>
                      <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              index % 5 === 0
                                ? "bg-[oklch(0.80_0.20_190/0.2)]"
                                : index % 5 === 1
                                  ? "bg-[oklch(0.70_0.25_320/0.2)]"
                                  : index % 5 === 2
                                    ? "bg-[oklch(0.80_0.22_145/0.2)]"
                                    : index % 5 === 3
                                      ? "bg-[oklch(0.80_0.20_60/0.2)]"
                                      : "bg-[oklch(0.70_0.25_290/0.2)]"
                            }`}
                            whileHover={{ rotate: 10, scale: 1.1 }}
                          >
                            <IconComponent
                              className={`w-6 h-6 ${
                                index % 5 === 0
                                  ? "text-[oklch(0.80_0.20_190)]"
                                  : index % 5 === 1
                                    ? "text-[oklch(0.70_0.25_320)]"
                                    : index % 5 === 2
                                      ? "text-[oklch(0.80_0.22_145)]"
                                      : index % 5 === 3
                                        ? "text-[oklch(0.80_0.20_60)]"
                                        : "text-[oklch(0.70_0.25_290)]"
                              }`}
                            />
                          </motion.div>
                          <div className="text-left">
                            <p className="font-bold text-base">{category.category_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {category.sub_categories.length} subcategories
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-5">
                        <div className="pl-16 space-y-2">
                          {category.sub_categories.map((sub, subIndex) => (
                            <motion.div
                              key={sub.sub_category_id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: subIndex * 0.05 }}
                              whileHover={{ x: 8 }}
                              className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-muted/30 transition-all cursor-pointer"
                            >
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{sub.sub_category_name}</span>
                            </motion.div>
                          ))}
                          {category.sub_categories.length === 0 && (
                            <p className="text-sm text-muted-foreground py-3 px-4">No subcategories yet</p>
                          )}
                          <motion.div whileHover={{ scale: 1.02 }} className="pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Subcategory
                            </Button>
                          </motion.div>
                        </div>
                      </AccordionContent>
                    </CyberCard>
                  </AccordionItem>
                </motion.div>
              )
            })}
          </Accordion>

          {categories.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-20">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-6">
                  <Layers className="w-10 h-10 text-muted-foreground" />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold mb-2">No categories yet</h3>
              <p className="text-muted-foreground mb-6">Add your first category to organize expenses</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}
