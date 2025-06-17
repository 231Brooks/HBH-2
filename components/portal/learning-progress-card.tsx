'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AcademicCapIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface CourseProgress {
  id: string
  title: string
  progress: number
  totalModules: number
  completedModules: number
}

export function LearningProgressCard() {
  const [courses, setCourses] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - will be replaced with actual API call
    setTimeout(() => {
      setCourses([
        {
          id: '1',
          title: 'Real Estate Fundamentals',
          progress: 75,
          totalModules: 8,
          completedModules: 6,
        },
        {
          id: '2',
          title: 'Advanced Bidding Strategies',
          progress: 30,
          totalModules: 10,
          completedModules: 3,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AcademicCapIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Learning Progress
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {courses.length} Active Courses
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3">
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{course.title}</p>
                <div className="mt-1 flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    {course.completedModules}/{course.totalModules}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link
            href="/portal/learning"
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all courses
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
