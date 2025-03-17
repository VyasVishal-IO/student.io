"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { ClipboardCheck } from "lucide-react"
import { useRouter } from "next/navigation"

interface EnrollmentNumberFormProps {
  onComplete?: () => void
  redirectToAttendance?: boolean
  username?: string
}

export function EnrollmentNumberForm({
  onComplete,
  redirectToAttendance = false,
  username,
}: EnrollmentNumberFormProps) {
  const { user, profile, refreshUserProfile } = useAuth()
  const [enrollmentNumber, setEnrollmentNumber] = useState(profile?.enrollmentNumber || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.uid) {
      toast.error("You must be logged in to update your enrollment number")
      return
    }

    if (!enrollmentNumber.trim()) {
      toast.error("Please enter a valid enrollment number")
      return
    }

    setIsSubmitting(true)

    try {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        enrollmentNumber: enrollmentNumber.trim(),
      })

      // Refresh the user profile to get the updated enrollment number
      if (refreshUserProfile) {
        await refreshUserProfile()
      }

      toast.success("Enrollment number updated successfully")

      if (onComplete) {
        onComplete()
      }

      // Redirect to attendance page if requested
      if (redirectToAttendance && username) {
        setTimeout(() => {
          router.push(`/home/student/${username}/attendance`)
        }, 1000)
      }
    } catch (error) {
      console.error("Error updating enrollment number:", error)
      toast.error("Failed to update enrollment number")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-blue-600" />
          Enrollment Number
        </CardTitle>
        <CardDescription>
          Enter your enrollment number to access attendance records and other academic information
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
              <Input
                id="enrollmentNumber"
                value={enrollmentNumber}
                onChange={(e) => setEnrollmentNumber(e.target.value)}
                placeholder="e.g. 2023CS1234"
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500">This is the unique identifier assigned by your institution</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isSubmitting ? "Saving..." : "Save Enrollment Number"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

