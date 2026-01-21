"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { CyberCard } from "@/components/cyber-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Plus, Calendar, DollarSign, FolderKanban, MoreVertical, Rocket } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Project } from "@/lib/store"

interface ProjectsContentProps {
  projects: Project[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9, rotateX: -15 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

const glowColors = ["cyan", "pink", "green", "orange", "violet"] as const

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addProject } = useStore()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState("")
  const [budget, setBudget] = useState("")

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      addProject({
        project_name: name,
        project_description: description || null,
        project_start_date: startDate,
        project_end_date: endDate || null,
        budget: Number.parseFloat(budget) || 0,
        is_active: true,
      })

      setIsDialogOpen(false)
      setName("")
      setDescription("")
      setBudget("")
      setEndDate("")
    } catch (error) {
      console.error("Error adding project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header title="Projects" subtitle="Manage and track your expense projects" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="p-8">
        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3 text-muted-foreground">
            <motion.div className="p-2 rounded-lg bg-[oklch(0.80_0.22_145/0.2)]" whileHover={{ rotate: 10 }}>
              <FolderKanban className="w-5 h-5 text-[oklch(0.80_0.22_145)]" />
            </motion.div>
            <span className="font-medium">{projects.length} projects</span>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-gradient-to-r from-[oklch(0.80_0.22_145)] to-[oklch(0.70_0.20_160)] hover:opacity-90 glow-green">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="glass-strong border-border/50">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Create New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProject} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Project Name</Label>
                  <Input
                    placeholder="Enter project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-muted/50 h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea
                    placeholder="Describe your project..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-muted/50 min-h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Start Date</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-muted/50 h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">End Date</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-muted/50 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Budget</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="bg-muted/50 h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-[oklch(0.80_0.22_145)] to-[oklch(0.70_0.20_160)] hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Project"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div key={project.project_id} variants={cardVariants} style={{ perspective: 1000 }}>
              <CyberCard glowColor={glowColors[index % glowColors.length]} delay={index}>
                <div className="flex items-start justify-between mb-5">
                  <motion.div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${
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
                    <FolderKanban
                      className={`w-7 h-7 ${
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                <h3 className="text-lg font-bold mb-2">{project.project_name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-5 min-h-[40px]">
                  {project.project_description || "No description provided"}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(project.project_start_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {project.project_end_date &&
                        ` - ${new Date(project.project_end_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="w-4 h-4 text-[oklch(0.80_0.22_145)]" />
                    <span className="font-mono font-bold">${Number(project.budget).toLocaleString()}</span>
                    <span className="text-muted-foreground">budget</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-mono font-medium">$0</span>
                    </div>
                    <div className="relative">
                      <Progress value={0} className="h-2" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        style={{ transformOrigin: "left" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                  <motion.span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      project.is_active
                        ? "bg-[oklch(0.80_0.22_145/0.2)] text-[oklch(0.80_0.22_145)]"
                        : "bg-muted text-muted-foreground"
                    }`}
                    animate={project.is_active ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {project.is_active ? "Active" : "Completed"}
                  </motion.span>
                </div>
              </CyberCard>
            </motion.div>
          ))}

          {projects.length === 0 && (
            <motion.div variants={cardVariants} className="col-span-full text-center py-20">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-6">
                  <Rocket className="w-10 h-10 text-muted-foreground" />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">Create your first project to start tracking expenses</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-[oklch(0.80_0.22_145)] to-[oklch(0.70_0.20_160)]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}
