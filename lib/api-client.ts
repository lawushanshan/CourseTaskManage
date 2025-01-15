import { CourseFormData } from '@/types/course'

class ApiClient {
  async createCourse(data: CourseFormData) {
    console.log('=== API Client ===')
    console.log('Request data:', data)
    
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Failed to create course')
    }

    return response.json()
  }
}

export const apiClient = new ApiClient() 