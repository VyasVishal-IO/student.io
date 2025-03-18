"use client"

import { useState } from "react"
import { X, UserCircle } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import type { UserProfile } from "@/types/college"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import toast from "react-hot-toast"

interface MembersSectionProps {
  students: UserProfile[]
  teachers: UserProfile[]
  collegeId: string
  isAdmin: boolean
}

export default function MembersSection({ students, teachers, collegeId, isAdmin }: MembersSectionProps) {
  const [activeTab, setActiveTab] = useState<"students" | "teachers">("students")
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null)

  const removeMember = async (member: UserProfile) => {
    if (!isAdmin || !collegeId || !member.uid) return

    if (!confirm(`Are you sure you want to remove ${member.displayName} from this college?`)) {
      return
    }

    setRemovingMemberId(member.uid)

    try {
      const collegeRef = doc(db, "colleges", collegeId)
      const collegeDoc = await getDoc(collegeRef)
      const collegeData = collegeDoc.data()

      const arrayField = member.role === "student" ? "students" : "teachers"
      const updatedArray = (collegeData?.[arrayField] || []).filter((id: string) => id !== member.uid)

      await updateDoc(collegeRef, {
        [arrayField]: updatedArray,
      })

      toast.success(`${member.displayName} has been removed from the college`)
    } catch (error) {
      console.error("Error removing member:", error)
      toast.error("Failed to remove member. Please try again.")
    } finally {
      setRemovingMemberId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>College Members</CardTitle>
        <CardDescription>Students and teachers who are part of this college</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value as "students" | "teachers")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
            <TabsTrigger value="teachers">Teachers ({teachers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            {students.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">No students have joined this college yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                  <MemberCard
                    key={student.uid}
                    member={student}
                    isAdmin={isAdmin}
                    isRemoving={removingMemberId === student.uid}
                    onRemove={() => removeMember(student)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="teachers">
            {teachers.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">No teachers have joined this college yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {teachers.map((teacher) => (
                  <MemberCard
                    key={teacher.uid}
                    member={teacher}
                    isAdmin={isAdmin}
                    isRemoving={removingMemberId === teacher.uid}
                    onRemove={() => removeMember(teacher)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface MemberCardProps {
  member: UserProfile
  isAdmin: boolean
  isRemoving: boolean
  onRemove: () => void
}

function MemberCard({ member, isAdmin, isRemoving, onRemove }: MemberCardProps) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={member.displayName} />
            <AvatarFallback>{member.displayName?.substring(0, 2).toUpperCase() || <UserCircle />}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{member.displayName}</h3>
            <p className="text-sm text-gray-600">{member.email}</p>
          </div>
        </div>
        {isAdmin && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            disabled={isRemoving}
            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
          >
            {isRemoving ? (
              <span className="w-4 h-4 border-t-2 border-b-2 border-red-500 rounded-full animate-spin"></span>
            ) : (
              <X className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {member.role === "student" && member.major && (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Major:</span> {member.major}
        </p>
      )}

      {member.role === "teacher" && member.department && (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Department:</span> {member.department}
        </p>
      )}

      <Link
        href={`/profile/${member.username || member.uid}`}
        className="inline-block mt-3 text-xs text-blue-600 hover:underline"
      >
        View Profile
      </Link>
    </div>
  )
}

