/**
 * Functional API Client for LMS
 * Uses functional programming principles instead of OOP
 */

import type {
  RegisterResponse,
  ActivationResponse,
  UserProfileResponse,
  CoursesListResponse,
  CourseResponse,
  CheckoutSessionResponse,
  EnrollmentsListResponse,
  ProgressResponse,
  ReviewResponse,
  ReviewsListResponse,
  CertificateResponse,
  GenericResponse,
  ApiResponse,
} from "./types/api-responses"

import type {
  CourseBase,
  CourseDetail,
  Progress,
  QuizResult,
  PopulatedReview,
  Course,
  Enrollment,
  User,
  Notification,
} from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface RequestOptions extends RequestInit {
  token?: string
}

/**
 * Core request function - handles all HTTP requests
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  }

  // Add authorization header if token is provided
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
    credentials: "include", // Include cookies for refresh token
  }

  const url = `${API_URL}${endpoint}`
  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred",
    }))
    // Log detailed error for debugging
    console.error("API Error Details:", {
      url,
      status: response.status,
      statusText: response.statusText,
      error
    })
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// ============================================================================
// Auth API Functions
// ============================================================================

export async function register(data: {
  name: string
  email: string
  password: string
}): Promise<RegisterResponse> {
  return request("/api/v1/user/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function activateUser(data: {
  email: string
  activationCode: string
}): Promise<ActivationResponse> {
  return request("/api/v1/user/activate-user", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function resendActivation(email: string): Promise<GenericResponse> {
  return request("/api/v1/user/resend-activation", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function forgotPassword(email: string): Promise<GenericResponse> {
  return request("/api/v1/user/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function resetPasswordWithOtp(data: {
  email: string
  otp: string
  newPassword: string
}): Promise<GenericResponse> {
  return request("/api/v1/user/reset-password-otp", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function logout(token: string): Promise<GenericResponse> {
  return request("/api/v1/user/logout", {
    method: "POST",
    token,
  })
}

export async function getProfile(token: string): Promise<UserProfileResponse> {
  return request("/api/v1/user/me", {
    method: "GET",
    token,
  })
}

export async function updateProfile(
  data: { name?: string; email?: string },
  token: string
): Promise<UserProfileResponse> {
  return request("/api/v1/user/update-profile", {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  })
}

export async function updateProfilePicture(
  data: { avatar: string },
  token: string
): Promise<UserProfileResponse> {
  return request("/api/v1/user/update-profile-picture", {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  })
}

export async function resetPassword(
  data: { password: string; newPassword: string },
  token: string
): Promise<GenericResponse> {
  return request("/api/v1/user/reset-password", {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  })
}

// ============================================================================
// Course API Functions
// ============================================================================

export async function getAllCourses(params?: {
  search?: string
  category?: string
  level?: string
  page?: number
  limit?: number
}): Promise<{ courses: CourseBase[]; total: number }> {
  // Build query params only from defined values
  const queryParams = new URLSearchParams()
  if (params) {
    if (params.search) queryParams.append('search', params.search)
    if (params.category) queryParams.append('category', params.category)
    if (params.level) queryParams.append('level', params.level)
    if (params.page) queryParams.append('page', String(params.page))
    if (params.limit) queryParams.append('limit', String(params.limit))
  }
  const queryString = queryParams.toString()
  
  const response = await request<ApiResponse<CourseBase[]>>(
    `/api/v1/courses${queryString ? `?${queryString}` : ""}`
  )
  // Transform to expected format
  return {
    courses: response.data || [],
    total: response.meta?.total || 0,
  }
}

export async function getCourseById(id: string): Promise<{ course: CourseDetail }> {
  const response = await request<ApiResponse<CourseDetail>>(`/api/v1/courses/${id}`)
  // Transform to expected format
  return {
    course: response.data!,
  }
}

export async function getFeaturedCourses(): Promise<CoursesListResponse> {
  const response = await request<{ data: Course[] }>("/api/v1/courses/featured")
  // Transform to expected format
  return {
    success: true,
    courses: response.data || [],
  }
}

export async function getRecommendedCourses(token: string): Promise<CoursesListResponse> {
  const response = await request<{ data: Course[] }>("/api/v1/courses/recommended", {
    token,
  })
  return {
    success: true,
    courses: response.data || [],
  }
}

export async function createCourse(data: Record<string, unknown>, token: string): Promise<CourseResponse> {
  const response = await request<{ data: Course }>("/api/v1/courses/create", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  })
  return {
    success: true,
    course: response.data,
  }
}

export async function updateCourse(
  id: string,
  data: Record<string, unknown>,
  token: string
): Promise<CourseResponse> {
  const response = await request<{ data: Course }>(`/api/v1/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  })
  return {
    success: true,
    course: response.data,
  }
}

export async function deleteCourse(id: string, token: string): Promise<GenericResponse> {
  return request(`/api/v1/courses/${id}`, {
    method: "DELETE",
    token,
  })
}

export async function getCourseAnalytics(
  id: string,
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/courses/analytics/${id}`, {
    token,
  })
}

export async function getCoursesByInstructor(
  instructorId: string,
  token: string
): Promise<CoursesListResponse> {
  const response = await request<{ data: Course[] }>(`/api/v1/courses/instructor/${instructorId}`, {
    token,
  })
  return {
    success: true,
    courses: response.data || [],
  }
}

export async function getStudentsByInstructor(
  instructorId: string,
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/enrollment/students/${instructorId}`, {
    token,
  })
}

export async function getInstructorDashboard(
  instructorId: string,
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/enrollment/instructor-dashboard/${instructorId}`, {
    token,
  })
}

// ============================================================================
// Enrollment API Functions
// ============================================================================

export async function enrollInCourse(
  courseId: string,
  token: string,
  couponCode?: string,
  transactionId?: string
): Promise<CheckoutSessionResponse> {
  const response = await request<{ data: any; message?: string }>(
    "/api/v1/enrollment/submit-payment",
    {
      method: "POST",
      body: JSON.stringify({ courseId, couponCode, transactionId }),
      token,
    }
  )

  return {
    success: true,
    checkoutUrl: null,   // bKash-এ কোনো redirect নেই
    sessionId: response.data?._id || null,
    message: response.message,
  }
}

export async function getMyEnrollments(token: string, userId: string): Promise<EnrollmentsListResponse> {
  const response = await request<{ 
    data: { 
      enrolledCourses: Enrollment[]
      totalCoursesCompleted?: number
      totalRewardPoints?: number
    } 
  }>(`/api/v1/enrollment/enrolled-courses/${userId}`, {
    token,
  })
  return {
    success: true,
    enrollments: response.data?.enrolledCourses || [],
  }
}

export async function checkEnrollment(courseId: string, token: string): Promise<{ isEnrolled: boolean }> {
  const response = await request<{ data: { isEnrolled: boolean } }>(
    `/api/v1/enrollment/check-enrollment/${courseId}`,
    { token }
  )
  return {
    isEnrolled: response.data?.isEnrolled || false,
  }
}

export async function getEnrolledCourseDetails(
  courseId: string,
  token: string
): Promise<CourseResponse> {
  const response = await request<{ data: Course }>(
    `/api/v1/enrollment/enrolled/${courseId}`,
    {
      token,
    }
  )
  return {
    success: true,
    course: response.data,
  }
}

// ============================================================================
// Progress API Functions
// ============================================================================

export async function updateLectureProgress(
  lectureId: string,
  progressPercentage: number,
  token: string
): Promise<ProgressResponse> {
  return request(`/api/v1/progress/lecture/${lectureId}`, {
    method: "POST",
    body: JSON.stringify({ progressPercentage }),
    token,
  })
}

export async function getCourseProgress(
  courseId: string,
  token: string
): Promise<{ progress: Progress }> {
  const response = await request<ApiResponse<Progress>>(`/api/v1/progress/course/${courseId}`, {
    token,
  })
  return {
    progress: response.data!,
  }
}

export async function getUserDashboard(token: string): Promise<ProgressResponse> {
  return request("/api/v1/progress/dashboard", {
    token,
  })
}

// ============================================================================
// Quiz API Functions
// ============================================================================

export async function submitQuiz(
  quizId: string,
  answers: number[],
  token: string
): Promise<ApiResponse<QuizResult>> {
  return request<ApiResponse<QuizResult>>(`/api/v1/quizes/${quizId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
    token,
  })
}

export async function getQuiz(
  quizId: string,
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/quizes/${quizId}`, {
    token,
  })
}

export async function getQuizResults(
  courseId: string,
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/quizes/results/course/${courseId}`, {
    token,
  })
}

// ============================================================================
// Review API Functions
// ============================================================================

export async function createReview(
  data: { courseId: string; rating: number; comment: string },
  token: string
): Promise<ReviewResponse> {
  return request("/api/v1/reviews", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  })
}

export async function getCourseReviews(
  courseId: string, 
  token?: string,
  options?: { cache?: RequestCache }
): Promise<ReviewsListResponse<PopulatedReview>> {
  return request(`/api/v1/reviews/course/${courseId}`, { 
    token,
    ...options 
  })
}

export async function getInstructorReviews(
  instructorId: string,
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/reviews/instructor/${instructorId}`, {
    token,
  })
}

// ============================================================================
// Chapter API Functions
// ============================================================================

export async function getCourseChapters(
  courseId: string,
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/chapters/course/${courseId}`, {
    token,
  })
}

export async function createChapter(
  data: { title: string; course: string; order?: number },
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/chapters`, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  })
}

export async function updateChapter(
  chapterId: string,
  data: { title?: string; order?: number },
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/chapters/${chapterId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  })
}

export async function deleteChapter(
  chapterId: string,
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/chapters/${chapterId}`, {
    method: 'DELETE',
    token,
  })
}

export async function reorderChapters(
  courseId: string,
  order: { chapterId: string; order: number }[],
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/chapters/reorder`, {
    method: 'POST',
    body: JSON.stringify({ courseId, order }),
    token,
  })
}

export async function reorderChapterContent(
  chapterId: string,
  items: { itemId: string; itemType: 'lecture' | 'quiz'; order: number }[],
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/chapters/${chapterId}/reorder-content`, {
    method: 'POST',
    body: JSON.stringify({ items }),
    token,
  })
}

// ============================================================================
// Lecture API Functions
// ============================================================================

export async function createLecture(
  data: {
    title: string
    course: string
    chapter: string
    videoUrl: string
    duration: number
    order?: number
    isPreview?: boolean
    resources?: string
  },
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/lectures`, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  })
}

export async function updateLecture(
  lectureId: string,
  data: {
    title?: string
    videoUrl?: string
    duration?: number
    order?: number
    isPreview?: boolean
    resources?: string
  },
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/lectures/${lectureId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  })
}

export async function deleteLecture(
  lectureId: string,
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/lectures/${lectureId}`, {
    method: 'DELETE',
    token,
  })
}

export async function reorderLectures(
  chapterId: string,
  reorderData: { lectureId: string; newOrder: number }[],
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/lectures/reorder`, {
    method: 'POST',
    body: JSON.stringify({ chapterId, reorderData }),
    token,
  })
}

// ============================================================================
// Quiz API Functions
// ============================================================================

export async function createQuiz(
  data: {
    course: string
    chapter: string
    title: string
    order?: number
    duration?: number
    questions: {
      questionText: string
      options: string[]
      correctAnswer: number
      explanation?: string
    }[]
  },
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/quizes`, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  })
}

export async function updateQuiz(
  quizId: string,
  data: {
    title?: string
    order?: number
    duration?: number
    questions?: {
      questionText: string
      options: string[]
      correctAnswer: number
      explanation?: string
    }[]
  },
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/quizes/${quizId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  })
}

export async function deleteQuiz(
  quizId: string,
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/quizes/${quizId}`, {
    method: 'DELETE',
    token,
  })
}

// ============================================================================
// Certificate API Functions
// ============================================================================

export async function getCertificate(
  enrollmentId: string,
  token: string
): Promise<CertificateResponse> {
  return request(`/api/v1/certificates/${enrollmentId}`, {
    token,
  })
}

export async function downloadCertificate(
  enrollmentId: string,
  token: string
): Promise<Blob> {
  const response = await fetch(
    `${API_URL}/api/v1/certificates/${enrollmentId}/download`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to download certificate")
  }

  return response.blob()
}

// ============================================================================
// Coupon API Functions
// ============================================================================

export async function validateCoupon(
  courseId: string,
  couponCode: string
): Promise<{ success: boolean; coupon: import('./types').Coupon; message?: string }> {
  const response = await request<{ data: import('./types').Coupon; message?: string }>(
    `/api/v1/coupon/validate/${courseId}`,
    {
      method: "POST",
      body: JSON.stringify({ couponCode }),
    }
  )
  return {
    success: true,
    coupon: response.data,
    message: response.message,
  }
}

// ============================================================================
// Notification API Functions
// ============================================================================

/**
 * Get user notifications with filtering
 * @param token - Auth token
 * @param params - Query parameters
 * @returns Promise with notifications array
 */
export async function getNotifications(
  token: string,
  params?: {
    page?: number
    limit?: number
    isRead?: boolean
    type?: string
    includeArchived?: boolean
  }
): Promise<{ notifications: Notification[] }> {
  const queryParams = new URLSearchParams()
  
  if (params?.page) queryParams.append("page", String(params.page))
  if (params?.limit) queryParams.append("limit", String(params.limit))
  
  // Backend validation requires STRINGS 'true' or 'false', not booleans
  if (params?.isRead !== undefined) {
    queryParams.append("isRead", params.isRead ? 'true' : 'false')
  }
  
  if (params?.type) queryParams.append("type", params.type)
  
  // Backend validation requires STRINGS 'true' or 'false', not booleans
  if (params?.includeArchived !== undefined) {
    queryParams.append("includeArchived", params.includeArchived ? 'true' : 'false')
  }
  
  const queryString = queryParams.toString()
  const endpoint = `/api/v1/notifications${queryString ? `?${queryString}` : ""}`
  
  const response = await request<{ 
    success: boolean
    data: Notification[]
    meta?: any
    filters?: any
    cached?: boolean
  }>(endpoint, { token })
  
  return { notifications: response.data || [] }
}

/**
 * Get unread notification count
 * @param token - Auth token
 * @returns Promise with unread count
 */
export async function getUnreadNotificationCount(token: string): Promise<{ data: number }> {
  const response = await request<{ success: boolean; data: number }>(
    "/api/v1/notifications/unread/count",
    { token }
  )
  return { data: response.data }
}

/**
 * Mark notifications as read
 * @param token - Auth token
 * @param notificationIds - Array of notification IDs (optional)
 * @param markAll - Mark all notifications as read (optional)
 * @returns Promise with success response
 */
export async function markNotificationsAsRead(
  token: string,
  notificationIds?: string[],
  markAll?: boolean
): Promise<GenericResponse> {
  // Backend validation: at least one field must be provided
  if (!markAll && (!notificationIds || notificationIds.length === 0)) {
    throw new Error("Either markAll must be true or notificationIds must be provided")
  }
  
  // Build body according to backend validation schema
  const body: { notificationIds?: string[]; markAll?: boolean } = {}
  
  if (markAll) {
    body.markAll = true
  } else if (notificationIds && notificationIds.length > 0) {
    body.notificationIds = notificationIds
  }
  
  return request<GenericResponse>("/api/v1/notifications/read", {
    method: "PATCH",
    body: JSON.stringify(body),
    token,
  })
}

/**
 * Archive notifications
 * @param token - Auth token
 * @param notificationIds - Array of notification IDs (required, min 1)
 * @returns Promise with success response
 */
export async function archiveNotifications(
  token: string,
  notificationIds: string[]
): Promise<GenericResponse> {
  // Backend validation: at least one notification ID required
  if (!notificationIds || notificationIds.length === 0) {
    throw new Error("At least one notification ID is required")
  }
  
  return request<GenericResponse>("/api/v1/notifications/archive", {
    method: "PATCH",
    body: JSON.stringify({ notificationIds }),
    token,
  })
}

/**
 * Delete a notification
 * @param token - Auth token
 * @param notificationId - Notification ID
 * @returns Promise with success response
 */
export async function deleteNotification(
  token: string,
  notificationId: string
): Promise<GenericResponse> {
  return request<GenericResponse>(`/api/v1/notifications/${notificationId}`, {
    method: "DELETE",
    token,
  })
}

// ============================================================================
// Discussion API Functions
// ============================================================================

export async function getLectureDiscussions(
  lectureId: string,
  token: string
): Promise<ApiResponse<any[]>> {
  return request(`/api/v1/discussions/lecture/${lectureId}`, {
    token,
  })
}

export async function getCourseDiscussions(
  courseId: string,
  token: string
): Promise<ApiResponse<any[]>> {
  return request(`/api/v1/discussions/course/${courseId}`, {
    token,
  })
}

export async function createDiscussion(
  data: { lecture: string; question: string },
  token: string
): Promise<ApiResponse<any>> {
  return request("/api/v1/discussions", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  })
}

export async function answerDiscussion(
  discussionId: string,
  data: { text: string },
  token: string
): Promise<ApiResponse<any>> {
  return request(`/api/v1/discussions/${discussionId}/answer`, {
    method: "POST",
    token,
    body: JSON.stringify(data),
  })
}

export async function updateDiscussion(
  discussionId: string,
  data: { question: string },
  token: string
): Promise<ApiResponse<any>> {
  return request(`/api/v1/discussions/${discussionId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  })
}

export async function deleteDiscussion(
  discussionId: string,
  token: string
): Promise<ApiResponse<any>> {
  return request(`/api/v1/discussions/${discussionId}`, {
    method: "DELETE",
    token,
  })
}

export async function getUserDiscussions(
  token: string
): Promise<ApiResponse<any[]>> {
  return request("/api/v1/discussions/user/me", {
    token,
  })
}

export async function getEnrolledCoursesDiscussions(
  token: string
): Promise<ApiResponse<any[]>> {
  return request("/api/v1/discussions/enrolled", {
    token,
  })
}

// ============================================================================
// Certificate API Functions - Extended
// ============================================================================

export async function getUserCertificates(
  token: string
): Promise<ApiResponse<any[]>> {
  return request("/api/v1/certificates", {
    token,
  })
}

// ============================================================================
// Admin API Functions
// ============================================================================

export async function getAllUsers(
  token: string,
  params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
  }
): Promise<{
  users: User[]
  total: number
  page: number
  pages: number
}> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append("page", String(params.page))
  if (params?.limit) queryParams.append("limit", String(params.limit))
  if (params?.search) queryParams.append("search", params.search)
  if (params?.role) queryParams.append("role", params.role)

  const queryString = queryParams.toString()
  const response = await request<ApiResponse<{
    users: User[]
    total: number
    page: number
    pages: number
  }>>(`/api/v1/user/all${queryString ? `?${queryString}` : ""}`, {
    token,
  })

  return response.data!
}

export async function getUserStats(token: string): Promise<{
  totalUsers: number
  totalStudents: number
  totalInstructors: number
  totalAdmins: number
  verifiedUsers: number
  unverifiedUsers: number
}> {
  const response = await request<ApiResponse<{
    totalUsers: number
    totalStudents: number
    totalInstructors: number
    totalAdmins: number
    verifiedUsers: number
    unverifiedUsers: number
  }>>("/api/v1/user/stats", {
    token,
  })

  return response.data!
}

export async function updateUserRole(
  userId: string,
  role: string,
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/user/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
    token,
  })
}

export async function deleteUser(
  userId: string,
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/user/${userId}`, {
    method: "DELETE",
    token,
  })
}

// Get admin dashboard stats (courses, enrollments, etc.)
export async function getAdminDashboardStats(token: string): Promise<{
  users: {
    totalUsers: number
    totalStudents: number
    totalInstructors: number
    totalAdmins: number
    verifiedUsers: number
    unverifiedUsers: number
  }
  courses: {
    total: number
    published: number
    draft: number
  }
  enrollments: {
    total: number
    active: number
    completed: number
  }
  revenue: {
    total: number
    monthly: number
    yearly: number
  }
}> {
  const [userStats, coursesResponse] = await Promise.all([
    getUserStats(token),
    request<ApiResponse<Course[]>>("/api/v1/courses?limit=1000", { token }),
  ])

  // Calculate course statistics
  const courses = coursesResponse.data || []
  const totalCourses = courses.length
  const publishedCourses = courses.filter((c: any) => c.status === 'published').length
  const draftCourses = totalCourses - publishedCourses

  return {
    users: userStats,
    courses: {
      total: totalCourses,
      published: publishedCourses,
      draft: draftCourses,
    },
    enrollments: {
      total: 0, // This would come from enrollment API
      active: 0,
      completed: 0,
    },
    revenue: {
      total: 0, // This would come from payment/revenue API
      monthly: 0,
      yearly: 0,
    },
  }
}

// ============================================================================
// Coupon API Functions
// ============================================================================

export async function getAllCoupons(token: string): Promise<any[]> {
  const response = await request<ApiResponse<any[]>>("/api/v1/coupon", {
    token,
  })
  return response.data || []
}

export async function createCoupon(
  data: {
    code: string
    discountValue: number
    appliesTo?: string
    expiresAt?: string
    isActive?: boolean
    usageLimit?: number
  },
  token: string
): Promise<GenericResponse> {
  return request("/api/v1/coupon", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  })
}

export async function updateCoupon(
  couponId: string,
  data: {
    code?: string
    discountValue?: number
    appliesTo?: string
    expiresAt?: string
    isActive?: boolean
    usageLimit?: number
  },
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/coupon/${couponId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  })
}

export async function deleteCoupon(
  couponId: string,
  token: string
): Promise<GenericResponse> {
  return request(`/api/v1/coupon/${couponId}`, {
    method: "DELETE",
    token,
  })
}

// Legacy export for backwards compatibility during migration
// TODO: Remove this after all components are updated
export const apiClient = {
  register,
  activateUser,
  resendActivation,
  forgotPassword,
  resetPasswordWithOtp,
  logout,
  getProfile,
  updateProfile,
  updateProfilePicture,
  resetPassword,
  getAllCourses,
  getCourseById,
  getFeaturedCourses,
  getRecommendedCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseAnalytics,
  getCoursesByInstructor,
  getStudentsByInstructor,
  getInstructorDashboard,
  enrollInCourse,
  getMyEnrollments,
  getEnrolledCourseDetails,
  updateLectureProgress,
  getCourseProgress,
  getUserDashboard,
  submitQuiz,
  getQuiz,
  getQuizResults,
  createReview,
  getCourseReviews,
  getInstructorReviews,
  // Chapters
  getCourseChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  reorderChapters,
  reorderChapterContent,
  // Lectures
  createLecture,
  updateLecture,
  deleteLecture,
  reorderLectures,
  // Quizes
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getCertificate,
  downloadCertificate,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationsAsRead,
  archiveNotifications,
  deleteNotification,
  getLectureDiscussions,
  getCourseDiscussions,
  createDiscussion,
  answerDiscussion,
  updateDiscussion,
  deleteDiscussion,
}
