import { Suspense } from 'react'
import { CourseCatalog } from '@/components/portal/learning/course-catalog'
import { LearningDashboard } from '@/components/portal/learning/learning-dashboard'
import { CreateCourseButton } from '@/components/portal/learning/create-course-button'

export default function LearningCenterPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Center</h1>
          <p className="mt-1 text-sm text-gray-600">
            Expand your knowledge and unlock new features
          </p>
        </div>
        <CreateCourseButton />
      </div>

      {/* Learning Dashboard */}
      <Suspense fallback={<div className="animate-pulse h-48 bg-gray-200 rounded-lg"></div>}>
        <LearningDashboard />
      </Suspense>

      {/* Course Catalog */}
      <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>}>
        <CourseCatalog />
      </Suspense>
    </div>
  )
}
