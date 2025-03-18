import { ArrowLeft, School } from "lucide-react"
import Link from "next/link"
import type { College, UserProfile } from "@/types/college"
import type { User } from "firebase/auth"

interface CollegeHeaderProps {
  college: College
  isAdmin: boolean
  isMember: boolean
  isTeacher: boolean
  profile: UserProfile | null
  user: User | null
}

export default function CollegeHeader({ college, isAdmin, isMember, isTeacher, profile, user }: CollegeHeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            {college.logoUrl ? (
              <img
                src={college.logoUrl || "/placeholder.svg"}
                alt={college.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg">
                <School className="w-8 h-8 text-blue-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{college.name}</h1>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2 md:line-clamp-none">{college.description}</p>
              {college.department && (
                <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {college.department}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {(isAdmin || isMember) && (
              <Link
                href={isTeacher ? `/home/teacher/${profile?.username}` : `/home/student/${profile?.username}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            )}

            {(isAdmin || (isTeacher && college?.teachers?.includes(user?.uid || ""))) && (
              <Link
                href={`/college/${encodeURIComponent(college.name)}/manage`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Manage College
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

