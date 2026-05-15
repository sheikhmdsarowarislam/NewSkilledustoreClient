"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { ArrowLeft, Save, Trash2, BookOpen } from "lucide-react"
import Link from "next/link"
import { updateCourseAction, deleteCourseAction } from "@/app/actions/course-actions"
import { convertToBase64, validateImageFile } from "@/lib/utils"
import type { Course } from "@/lib/types"
import { LoadingCard } from "@/components/ui"
import { CourseFormFields } from "@/components/instructor/CourseFormFields"

interface EditCoursePageProps {
  params: Promise<{ id: string }>
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [courseId, setCourseId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState<string>("")
  const [course, setCourse] = useState<Course | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "programming",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    price: "",
    discount: "",
    thumbnail: "",
    stacks: [""],
    requirements: [""],
    whatYouWillLearn: [""],
    status: "draft" as "draft" | "published" | "archived",
  })


  // Unwrap params and fetch course
  useEffect(() => {
    const initPage = async () => {
      const resolvedParams = await params
      setCourseId(resolvedParams.id)
      
      // TODO: Fetch course data - this should ideally be a server component
      // For now, keeping client-side fetch but should migrate to server component
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${resolvedParams.id}`)
        if (!response.ok) throw new Error('Failed to fetch course')
        
        const data = await response.json()
        const courseData = data.data || data.course
        setCourse(courseData as Course)
        
        // Populate form with existing data
        setFormData({
          title: courseData.title || "",
          description: courseData.description || "",
          category: courseData.category || "programming",
          level: (courseData.level || "beginner") as "beginner" | "intermediate" | "advanced",
          price: courseData.price?.toString() || "",
          discount: courseData.discount?.toString() || "",
          thumbnail: courseData.thumbnail?.url || "",
          stacks: courseData.stacks && courseData.stacks.length > 0 ? courseData.stacks : [""],
          requirements: courseData.requirements && courseData.requirements.length > 0 ? courseData.requirements : [""],
          whatYouWillLearn: courseData.whatYouWillLearn && courseData.whatYouWillLearn.length > 0 ? courseData.whatYouWillLearn : [""],
          status: courseData.status || "draft",
        })
        
        // Set image preview
        if (courseData.thumbnail?.url) {
          setImagePreview(courseData.thumbnail.url)
        }
      } catch (err) {
        console.error("Failed to fetch course:", err)
        setError("Failed to load course details")
      } finally {
        setIsLoading(false)
      }
    }

    initPage()
  }, [params])


  // Image upload handler - Convert to base64
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate image file using utility function
    const validation = validateImageFile(file, 5)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setIsUploading(true)
    setError("")

    try {
      // Convert image to base64 using utility function
      const base64String = await convertToBase64(file)
      setImagePreview(base64String)
      // Store base64 string in form data - backend will handle upload
      setFormData({ ...formData, thumbnail: base64String })
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to process image')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    setFormData({ ...formData, thumbnail: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseId) return

    setError("")

    // Create FormData for server action
    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('category', formData.category)
    data.append('level', formData.level)
    data.append('price', formData.price)
    data.append('discount', formData.discount || '0')
    data.append('status', formData.status)
    data.append('stacks', JSON.stringify(formData.stacks.filter(s => s.trim() !== "")))
    data.append('requirements', JSON.stringify(formData.requirements.filter(r => r.trim() !== "")))
    data.append('whatYouWillLearn', JSON.stringify(formData.whatYouWillLearn.filter(w => w.trim() !== "")))
    
    // Add thumbnail if changed
    if (formData.thumbnail !== course?.thumbnail?.url) {
      data.append('thumbnail', formData.thumbnail)
    }

    startTransition(async () => {
      try {
        const result = await updateCourseAction(courseId, data)
        
        if (!result.success) {
          setError(result.error || "Failed to update course")
        }
        // On success, updateCourseAction will revalidate and redirect
        router.push(`/instructor/courses`)
      } catch (err) {
        const error = err as Error
        setError(error.message || "Failed to update course")
      }
    })
  }

  const handleDelete = async () => {
    if (!courseId) return
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return

    startTransition(async () => {
      try {
        const result = await deleteCourseAction(courseId)
        
        if (!result.success) {
          setError(result.error || "Failed to delete course")
        } else {
          // On success, redirect to courses list
          router.push("/instructor/courses")
        }
      } catch (err) {
        const error = err as Error
        setError(error.message || "Failed to delete course")
      }
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mt-8">
        <LoadingCard message="Loading course..." />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-6xl mt-8">
        <Card className="relative overflow-hidden border-red-500/20 bg-gradient-to-br from-gray-900/90 via-red-900/20 to-gray-900/90 backdrop-blur-sm">
          <CardContent className="relative z-10 text-center py-12">
            <p className="text-red-400 text-lg">Course not found</p>
            <Link href="/instructor/courses">
              <Button className="mt-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/30 border-0">
                Back to Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mt-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/instructor/courses">
            <Button variant="ghost" className="mb-4 border-violet-500/30 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 hover:border-violet-400/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Edit Course
          </h1>
          <p className="text-gray-400 mt-2">Update your course details and content</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/instructor/courses/${courseId}/content`}>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 border-0">
              <BookOpen className="h-4 w-4 mr-2" />
              Manage Content
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-400/50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Course
          </Button>
        </div>
      </div>

      <Card className="relative overflow-hidden border-violet-500/20 bg-gradient-to-br from-gray-900/90 via-indigo-900/50 to-gray-900/90 backdrop-blur-sm shadow-xl shadow-violet-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-purple-600/5 opacity-50"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-violet-300">Course Information</CardTitle>
          <CardDescription className="text-gray-400">
            Update comprehensive details including pricing, technologies, requirements, and learning outcomes
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert variant="error" className="bg-red-500/10 border-red-500/30 text-red-300">{error}</Alert>}

            <CourseFormFields
              formData={formData}
              onChange={(updates) => setFormData({ ...formData, ...updates as Partial<typeof formData> })}
              imagePreview={imagePreview}
              isUploading={isUploading}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
              showStatus={true}
            />

            <div className="flex justify-between items-center pt-4">
              <div className="flex space-x-4">
                <Button type="submit" isLoading={isPending} disabled={isPending} className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/30 border-0">
                  <Save className="h-4 w-4 mr-2" />
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href="/instructor/courses">
                  <Button type="button" variant="outline" disabled={isPending} className="border-violet-500/30 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 hover:border-violet-400/50">
                    Cancel
                  </Button>
                </Link>
              </div>
              
              <div className="text-xs text-gray-500">
                <p>Last updated: {course ? new Date(course.updatedAt).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

