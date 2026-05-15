'use server'

/**
 * Server Actions for Progress Tracking
 * Following Next.js 15 best practices
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { auth } from '@/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Update lecture progress
 */
export async function updateLectureProgressAction(
  lectureId: string,
  courseId: string,
  progressPercentage: number
): Promise<ActionResult> {
  const session = await auth()
  
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/progress/lecture/${lectureId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progressPercentage }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update progress' }))
      throw new Error(error.message || 'Failed to update progress')
    }

    const data = await response.json()

    // Revalidate course progress
    revalidatePath(`/courses/${courseId}/learn`)
    revalidatePath('/dashboard/courses')
    revalidateTag(`course-progress-${courseId}`)
    revalidateTag('user-progress')

    return { success: true, data: data.data || data.progress }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update progress',
    }
  }
}

/**
 * Submit quiz answers
 */
export async function submitQuizAction(
  quizId: string,
  courseId: string,
  answers: number[]
): Promise<ActionResult> {
  const session = await auth()
  
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/quizes/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to submit quiz' }))
      throw new Error(error.message || 'Failed to submit quiz')
    }

    const data = await response.json()

    // Revalidate course progress if quiz passed
    if (data.data?.score === 100) {
      revalidatePath(`/courses/${courseId}/learn`)
      revalidatePath('/dashboard/courses')
      revalidateTag(`course-progress-${courseId}`)
    }

    return { success: true, data: data.data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit quiz',
    }
  }
}

