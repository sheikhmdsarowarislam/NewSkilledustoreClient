import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getStudentsByInstructorServer } from "@/lib/server-api"
import { InstructorStudentsClient } from "@/components/instructor/instructor-students-client"

export const dynamic = "force-dynamic"

export default async function InstructorStudentsPage() {
  const session = await auth()
  
  if (!session?.user || !session?.accessToken) {
    redirect("/signin")
  }

  let studentsData
  try {
    studentsData = await getStudentsByInstructorServer(session.user.id)
  } catch (error) {
    console.error("Failed to fetch students:", error)
    studentsData = {
      students: [],
      totalStudents: 0,
      totalEnrollments: 0,
      courseMap: {}
    }
  }

  return <InstructorStudentsClient studentsData={studentsData} />
}
