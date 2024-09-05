import {   useCallback, useEffect, useState } from "react"
import { api } from "../lib/axios"
import { createContext } from "use-context-selector"

interface SubCategory {
  id: string,
  name: string,
}

interface Category {
  id: string,
  name: string,
  subCategories: SubCategory[],
}

interface CategoriesContextType {
  categories: Category[],
  fetchCategories: () => Promise<void>,
}

interface CategoriesProviderProps {
  children: React.ReactNode
}

export const CategoriesContext = createContext({} as CategoriesContextType)

export function CategoriesProvider({ children }: CategoriesProviderProps) {
  const [categories, setCategories] = useState<Category[]>([])

  const fetchCategories = useCallback(async () => {
    const response = await api.get<Category[]>('categories')
    setCategories(response.data)
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <CategoriesContext.Provider value={{ categories, fetchCategories }}>
      {children}
    </CategoriesContext.Provider>
  )
}