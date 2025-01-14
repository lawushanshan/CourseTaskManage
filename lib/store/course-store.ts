import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CourseState {
  currentCourse: Course | null
  tasks: Task[]
  progress: number
  setCurrentCourse: (course: Course) => void
  updateProgress: (progress: number) => void
  completeTask: (taskId: string) => void
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      currentCourse: null,
      tasks: [],
      progress: 0,
      setCurrentCourse: (course) => set({ currentCourse: course }),
      updateProgress: (progress) => set({ progress }),
      completeTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: true } : task
          ),
        })),
    }),
    {
      name: 'course-storage',
    }
  )
) 