"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

// Types
export interface User {
  id: string
  email: string
  full_name: string
  role: "admin" | "user"
}

export interface Category {
  category_id: string
  category_name: string
  logo_path: string | null
  sequence: number
  is_active: boolean
  sub_categories: SubCategory[]
}

export interface SubCategory {
  sub_category_id: string
  sub_category_name: string
  sequence: number
}

export interface Project {
  project_id: string
  project_name: string
  project_description: string | null
  project_start_date: string
  project_end_date: string | null
  budget: number
  is_active: boolean
}

export interface Expense {
  expense_id: string
  amount: number
  expense_date: string
  description: string | null
  attachment_path: string | null
  category_id: string | null
  project_id: string | null
  categories: { category_name: string } | null
  sub_categories: { sub_category_name: string } | null
  projects: { project_name: string } | null
}

export interface Income {
  income_id: string
  amount: number
  income_date: string
  description: string | null
}

// Test users
const TEST_USERS: User[] = [
  { id: "1", email: "admin@example.com", full_name: "Admin User", role: "admin" },
  { id: "2", email: "user@example.com", full_name: "Regular User", role: "user" },
]

// Initial mock data
const INITIAL_CATEGORIES: Category[] = [
  {
    category_id: "1",
    category_name: "Food & Dining",
    logo_path: null,
    sequence: 1,
    is_active: true,
    sub_categories: [
      { sub_category_id: "1-1", sub_category_name: "Groceries", sequence: 1 },
      { sub_category_id: "1-2", sub_category_name: "Restaurants", sequence: 2 },
      { sub_category_id: "1-3", sub_category_name: "Coffee Shops", sequence: 3 },
    ],
  },
  {
    category_id: "2",
    category_name: "Transportation",
    logo_path: null,
    sequence: 2,
    is_active: true,
    sub_categories: [
      { sub_category_id: "2-1", sub_category_name: "Gas", sequence: 1 },
      { sub_category_id: "2-2", sub_category_name: "Public Transit", sequence: 2 },
      { sub_category_id: "2-3", sub_category_name: "Ride Share", sequence: 3 },
    ],
  },
  {
    category_id: "3",
    category_name: "Shopping",
    logo_path: null,
    sequence: 3,
    is_active: true,
    sub_categories: [
      { sub_category_id: "3-1", sub_category_name: "Clothing", sequence: 1 },
      { sub_category_id: "3-2", sub_category_name: "Electronics", sequence: 2 },
    ],
  },
  {
    category_id: "4",
    category_name: "Entertainment",
    logo_path: null,
    sequence: 4,
    is_active: true,
    sub_categories: [
      { sub_category_id: "4-1", sub_category_name: "Movies", sequence: 1 },
      { sub_category_id: "4-2", sub_category_name: "Games", sequence: 2 },
      { sub_category_id: "4-3", sub_category_name: "Streaming", sequence: 3 },
    ],
  },
  {
    category_id: "5",
    category_name: "Bills & Utilities",
    logo_path: null,
    sequence: 5,
    is_active: true,
    sub_categories: [
      { sub_category_id: "5-1", sub_category_name: "Electricity", sequence: 1 },
      { sub_category_id: "5-2", sub_category_name: "Internet", sequence: 2 },
      { sub_category_id: "5-3", sub_category_name: "Phone", sequence: 3 },
    ],
  },
  {
    category_id: "6",
    category_name: "Healthcare",
    logo_path: null,
    sequence: 6,
    is_active: true,
    sub_categories: [
      { sub_category_id: "6-1", sub_category_name: "Doctor", sequence: 1 },
      { sub_category_id: "6-2", sub_category_name: "Pharmacy", sequence: 2 },
    ],
  },
]

const INITIAL_PROJECTS: Project[] = [
  {
    project_id: "1",
    project_name: "Home Renovation",
    project_description: "Kitchen and bathroom upgrades",
    project_start_date: "2025-01-01",
    project_end_date: "2025-06-30",
    budget: 15000,
    is_active: true,
  },
  {
    project_id: "2",
    project_name: "Vacation Fund",
    project_description: "Summer trip to Europe",
    project_start_date: "2025-01-01",
    project_end_date: "2025-08-01",
    budget: 5000,
    is_active: true,
  },
  {
    project_id: "3",
    project_name: "Emergency Fund",
    project_description: "Building 6-month emergency savings",
    project_start_date: "2025-01-01",
    project_end_date: null,
    budget: 20000,
    is_active: true,
  },
]

const INITIAL_EXPENSES: Expense[] = [
  {
    expense_id: "1",
    amount: 125.5,
    expense_date: "2025-01-14",
    description: "Weekly groceries",
    attachment_path: null,
    category_id: "1",
    project_id: null,
    categories: { category_name: "Food & Dining" },
    sub_categories: { sub_category_name: "Groceries" },
    projects: null,
  },
  {
    expense_id: "2",
    amount: 45.0,
    expense_date: "2025-01-13",
    description: "Gas fill-up",
    attachment_path: null,
    category_id: "2",
    project_id: null,
    categories: { category_name: "Transportation" },
    sub_categories: { sub_category_name: "Gas" },
    projects: null,
  },
  {
    expense_id: "3",
    amount: 89.99,
    expense_date: "2025-01-12",
    description: "Netflix + Spotify subscriptions",
    attachment_path: null,
    category_id: "4",
    project_id: null,
    categories: { category_name: "Entertainment" },
    sub_categories: { sub_category_name: "Streaming" },
    projects: null,
  },
  {
    expense_id: "4",
    amount: 2500.0,
    expense_date: "2025-01-10",
    description: "Kitchen countertops",
    attachment_path: null,
    category_id: "3",
    project_id: "1",
    categories: { category_name: "Shopping" },
    sub_categories: null,
    projects: { project_name: "Home Renovation" },
  },
  {
    expense_id: "5",
    amount: 150.0,
    expense_date: "2025-01-08",
    description: "Electric bill",
    attachment_path: null,
    category_id: "5",
    project_id: null,
    categories: { category_name: "Bills & Utilities" },
    sub_categories: { sub_category_name: "Electricity" },
    projects: null,
  },
]

const INITIAL_INCOMES: Income[] = [
  { income_id: "1", amount: 5500, income_date: "2025-01-01", description: "Monthly Salary" },
  { income_id: "2", amount: 500, income_date: "2025-01-05", description: "Freelance project" },
  { income_id: "3", amount: 5500, income_date: "2024-12-01", description: "Monthly Salary" },
  { income_id: "4", amount: 5500, income_date: "2024-11-01", description: "Monthly Salary" },
  { income_id: "5", amount: 800, income_date: "2024-11-15", description: "Bonus" },
]

// Context
interface StoreContextType {
  // Auth
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void

  // Data
  categories: Category[]
  projects: Project[]
  expenses: Expense[]
  incomes: Income[]

  // Actions
  addExpense: (expense: Omit<Expense, "expense_id">) => void
  deleteExpense: (id: string) => void
  addProject: (project: Omit<Project, "project_id">) => void
  addCategory: (name: string) => void
  addIncome: (income: Omit<Income, "income_id">) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES)
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES)
  const [incomes, setIncomes] = useState<Income[]>(INITIAL_INCOMES)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("expensex_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check test users (password is Test@1234 for both)
    const foundUser = TEST_USERS.find((u) => u.email === email)
    if (foundUser && password === "Test@1234") {
      setUser(foundUser)
      localStorage.setItem("expensex_user", JSON.stringify(foundUser))
      return { success: true }
    }

    // Check localStorage for registered users
    const registeredUsers = JSON.parse(localStorage.getItem("expensex_registered_users") || "[]")
    const registeredUser = registeredUsers.find(
      (u: { email: string; password: string }) => u.email === email && u.password === password,
    )
    if (registeredUser) {
      const userObj: User = {
        id: registeredUser.id,
        email: registeredUser.email,
        full_name: registeredUser.full_name,
        role: "user",
      }
      setUser(userObj)
      localStorage.setItem("expensex_user", JSON.stringify(userObj))
      return { success: true }
    }

    return { success: false, error: "Invalid email or password" }
  }, [])

  const signup = useCallback(async (email: string, password: string, fullName: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if email already exists
    if (TEST_USERS.some((u) => u.email === email)) {
      return { success: false, error: "Email already registered" }
    }

    const registeredUsers = JSON.parse(localStorage.getItem("expensex_registered_users") || "[]")
    if (registeredUsers.some((u: { email: string }) => u.email === email)) {
      return { success: false, error: "Email already registered" }
    }

    // Register new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      full_name: fullName,
    }
    registeredUsers.push(newUser)
    localStorage.setItem("expensex_registered_users", JSON.stringify(registeredUsers))

    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("expensex_user")
  }, [])

  const addExpense = useCallback((expense: Omit<Expense, "expense_id">) => {
    const newExpense: Expense = {
      ...expense,
      expense_id: Date.now().toString(),
    }
    setExpenses((prev) => [newExpense, ...prev])
  }, [])

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.expense_id !== id))
  }, [])

  const addProject = useCallback((project: Omit<Project, "project_id">) => {
    const newProject: Project = {
      ...project,
      project_id: Date.now().toString(),
    }
    setProjects((prev) => [newProject, ...prev])
  }, [])

  const addCategory = useCallback(
    (name: string) => {
      const newCategory: Category = {
        category_id: Date.now().toString(),
        category_name: name,
        logo_path: null,
        sequence: categories.length + 1,
        is_active: true,
        sub_categories: [],
      }
      setCategories((prev) => [...prev, newCategory])
    },
    [categories.length],
  )

  const addIncome = useCallback((income: Omit<Income, "income_id">) => {
    const newIncome: Income = {
      ...income,
      income_id: Date.now().toString(),
    }
    setIncomes((prev) => [newIncome, ...prev])
  }, [])

  return (
    <StoreContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        categories,
        projects,
        expenses,
        incomes,
        addExpense,
        deleteExpense,
        addProject,
        addCategory,
        addIncome,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
