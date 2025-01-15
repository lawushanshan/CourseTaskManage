import { create } from 'zustand'

interface CourseStore {
  lastAction: 'create' | 'edit' | null
  setLastAction: (action: 'create' | 'edit' | null) => void
}

export const useCourseStore = create<CourseStore>((set) => ({
  lastAction: null,
  setLastAction: (action) => set({ lastAction: action }),
})) 