
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import {
  Star,
  Clock,
  Users,
  Globe,
  Award,
  PlayCircle,
  BookOpen,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { getCourseByIdServer, getCourseReviewsServer } from "@/lib/server-api";
import { EnrollmentCard } from "@/components/course/enrollment-card";
import { ChapterAccordion } from "@/components/course/chapter-accordion";
import Image from "next/image";
import type { Review } from "@/lib/types";
import { formatDuration, formatTimeAgo } from "@/lib/utils";
import { EmptyState } from "@/components/ui";
import type { Metadata } from "next";

/**
 * Course Detail Page - Server Component with Static Generation
 * Revalidates every 30 minutes for fresh course data
 */
export const revalidate = 1800; // Revalidate every 30 minutes

// Generate dynamic metadata for course pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const course = await getCourseByIdServer(id);
    
    return {
      title: `${course.title} | SkilleduStore`,
      description: course.description || `Learn ${course.title} with CodeTutor. Expert-led course with hands-on projects and practical skills.`,
      keywords: [
        course.title,
        course.category,
        "coding course",
        "programming tutorial",
        "online learning",
        ...(course.stacks || []),
      ],
      openGraph: {
        title: `${course.title} | SkilleduStore`,
        description: course.description || `Learn ${course.title} with CodeTutor. Expert-led course with hands-on projects.`,
        images: course.thumbnail?.url ? [
          {
            url: course.thumbnail.url,
            width: 1200,
            height: 630,
            alt: course.title,
          },
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${course.title} | SkilleduStore`,
        description: course.description || `Learn ${course.title} with CodeTutor.`,
        images: course.thumbnail?.url ? [course.thumbnail.url] : [],
      },
    };
  } catch {
    return {
      title: "Course | SkilleduStore",
      description: "Learn coding skills with SkilleduStore",
    };
  }
}

interface CourseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;

  // Fetch course data on the server
  let course: any = null;
  let error = null;
  let reviews: Review[] = [];

  try {
    const data = await getCourseByIdServer(id);
    course = data;
  } catch (err) {
    const errorObj = err as Error;
    error = errorObj.message;
    console.error("Failed to fetch course:", err);
  }

  // Fetch reviews for the course
  if (course) {
    try {
      const reviewsData = await getCourseReviewsServer(id);
      reviews = reviewsData as Review[];
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      // Continue with empty reviews array
    }
  }

  // Enrollment check will be done client-side in the EnrollmentCard component
  // This keeps the page static and improves performance

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#03050a]">
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-12">
          <Alert
            variant="error"
            className="bg-red-900/20 border-red-500/50 text-red-400"
          >
            {error || "Course not found"}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03050a]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-[#03050a] to-cyan-900/20 pt-24">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-10 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:border-cyan-500/30 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mr-2">
                    <Star className="h-3.5 w-3.5 fill-cyan-400 text-cyan-400" />
                  </div>
                  <span className="font-semibold mr-1 text-white">
                    {course.averageRating && course.averageRating > 0 ? course.averageRating.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-gray-400">
                    ({course.reviewCount || 0} reviews)
                  </span>
                </div>
                {course.isFeatured && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/50">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                {course.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-6 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">

                <div className="flex items-center bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:border-blue-500/30 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-2">
                    <Users className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <span className="text-gray-300">
                    {course.enrollmentCount || 0} students
                  </span>
                </div>
                <div className="flex items-center bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:border-cyan-500/30 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mr-2">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">
                    {formatDuration(course.totalDuration || 0)}
                  </span>
                </div>
                {course.language && (
                  <div className="flex items-center bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:border-blue-500/30 transition-all">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-2">
                      <Globe className="h-3.5 w-3.5 text-blue-400" />
                    </div>
                    <span className="text-gray-300">{course.language}</span>
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              {course.stacks && course.stacks.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {course.stacks.map((stack: string) => (
                    <Badge
                      key={stack}
                      className="bg-gray-900/50 text-gray-300 border border-gray-700 backdrop-blur-sm hover:border-blue-500/50 transition-colors"
                    >
                      {stack}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Only show instructor if it's an object with details */}
              {typeof course.instructor === "object" &&
                course.instructor?.name && (
                  <div className="flex items-center mt-6">
                    {course.instructor?.avatar?.url ? (
                      <Image
                        src={course.instructor.avatar.url}
                        alt={course.instructor?.name || "Instructor"}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full mr-3 ring-2 ring-gray-700"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-3">
                        <span className="text-white text-lg font-medium">
                          {course.instructor?.name?.charAt(0) || "I"}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Instructor</p>
                      <p className="font-semibold text-white">
                        {course.instructor?.name || "Unknown Instructor"}
                      </p>
                    </div>
                  </div>
                )}
            </div>

            {/* Enrollment Card - Client Component handles auth check dynamically */}
            <div className="md:col-span-1">
              <EnrollmentCard
                courseId={id}
                price={course.price}
                discount={course.discount}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="md:col-span-2 space-y-8">
            {/* Detailed Description */}
            <Card className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    About This Course
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {course.description}
                  </p>
                  {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">What You&apos;ll Learn</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {course.whatYouWillLearn.map((item: string, index: number) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <PlayCircle className="h-5 w-5 text-cyan-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Course Content
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  {course.chapters?.length || 0} chapters • {formatDuration(Math.floor((course.totalDuration || 0)))} total
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ChapterAccordion chapters={course.chapters || []} />
              </CardContent>
            </Card>

            {/* Student Reviews */}
            <Card className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Star className="h-5 w-5 text-cyan-400" />
                      </div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Student Reviews
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-400 mt-1">
                      {course.reviewCount || 0} reviews • {course.averageRating ? course.averageRating.toFixed(1) : '0.0'} average rating
                    </CardDescription>
                  </div>
                  {course.averageRating && course.averageRating > 0 && (
                    <div className="flex items-center gap-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-cyan-500/20 px-4 py-3 rounded-xl shadow-lg">
                      <Star className="h-6 w-6 fill-cyan-400 text-cyan-400" />
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{course.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.length > 0 ? (
                  <>
                    {reviews.map((review) => {
                      const userName = review.userName || 'Anonymous';
                      const userAvatar = review.userAvatar?.url;
                      const initials = userName
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .substring(0, 2);
                      
                      const timeAgo = formatTimeAgo(review.createdAt)

                      return (
                        <div key={review._id} className="p-4 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 hover:border-cyan-500/20 transition-all duration-300">
                          <div className="flex items-start gap-4">
                            {userAvatar ? (
                              <div className="relative h-12 w-12 rounded-full flex-shrink-0 shadow-lg shadow-cyan-500/20 overflow-hidden">
                                <Image
                                  src={userAvatar}
                                  alt={userName}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
                                <span className="text-white text-lg font-medium">{initials}</span>
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-white">{userName}</h4>
                                  <p className="text-sm text-gray-500">{timeAgo}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3.5 w-3.5 ${
                                        star <= review.rating
                                          ? "fill-cyan-400 text-cyan-400"
                                          : "fill-gray-700 text-gray-700"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-300 leading-relaxed text-sm">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <EmptyState
                    icon={Star}
                    title="No Reviews Yet"
                    description="Be the first to review this course!"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Side */}
          <div className="md:col-span-1 space-y-6">
            {/* This course includes */}
            <Card className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  This course includes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-3">
                    <PlayCircle className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">
                    {formatDuration(course.totalDuration || 0)} on-demand video
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mr-3">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">
                    {course.chapters?.length || 0} chapters
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-3">
                    <Globe className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">
                    {course.level || "All levels"}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mr-3">
                    <Award className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">
                    Certificate of completion
                  </span>
                </div>
                
              </CardContent>
            </Card>

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <Card className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {course.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-cyan-400 mr-2 mt-0.5">•</span>
                        <span className="text-sm text-gray-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
