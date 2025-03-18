"use client"

import { useState, useEffect } from "react"
import { UserPlus, CheckCircle } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"

interface JoinRequestSectionProps {
  collegeId: string
  userId: string | undefined
  userName: string | undefined
  userEmail: string | undefined
  role: "student" | "teacher"
}

export default function JoinRequestSection({ collegeId, userId, userName, userEmail, role }: JoinRequestSectionProps) {
  const [hasRequested, setHasRequested] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if user already has a pending request
    const checkExistingRequest = async () => {
      if (!userId || !collegeId) return

      const q = query(
        collection(db, "requests"),
        where("collegeId", "==", collegeId),
        where(role === "student" ? "studentId" : "teacherId", "==", userId),
        where("status", "==", "pending"),
      )

      const snapshot = await getDocs(q)
      setHasRequested(!snapshot.empty)
    }

    checkExistingRequest()
  }, [collegeId, userId, role])

  const handleJoin = async () => {
    if (!userId || !collegeId || !userName || !userEmail) return

    setIsSubmitting(true)

    try {
      const requestData = {
        collegeId,
        [role === "student" ? "studentId" : "teacherId"]: userId,
        name: userName || "Anonymous",
        email: userEmail || "no-email",
        status: "pending",
        createdAt: new Date(),
        role: role,
      }

      await addDoc(collection(db, "requests"), requestData)
      setHasRequested(true)
      toast.success("Join request sent successfully!")
    } catch (error) {
      console.error("Error sending request:", error)
      toast.error("Failed to send request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <CardTitle>Join This College</CardTitle>
        </div>
        <CardDescription>
          Join as a {role === "student" ? "Student" : "Teacher"} to access courses, resources, and more
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasRequested ? (
          <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-md">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Join request sent!</p>
              <p className="text-sm text-green-600">
                Your request is pending approval. You'll be notified when it's processed.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-gray-600">
              Join this college to access courses, resources, and connect with{" "}
              {role === "student" ? "teachers" : "students"}.
            </p>
            <Button
              onClick={handleJoin}
              className="w-full sm:w-auto"
              disabled={isSubmitting || !userName || !userEmail}
            >
              {isSubmitting ? "Submitting..." : "Request to Join"}
            </Button>
            {(!userName || !userEmail) && (
              <p className="mt-2 text-sm text-red-500">Please complete your profile information before joining.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

