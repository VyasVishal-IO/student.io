"use client"

import { useState, useEffect } from "react"
import { Clock, X, Check, Bell } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, doc, getDoc, query, where, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"
import type { Request } from "@/types/college"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import toast from "react-hot-toast"

interface PendingRequestsSectionProps {
  collegeId: string
}

export default function PendingRequestsSection({ collegeId }: PendingRequestsSectionProps) {
  const [requests, setRequests] = useState<Request[]>([])
  const [processingIds, setProcessingIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up real-time listener for requests
    const requestsQuery = query(
      collection(db, "requests"),
      where("collegeId", "==", collegeId),
      where("status", "==", "pending"),
    )

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const requestsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Request[]

      setRequests(requestsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [collegeId])

  // Filter requests based on role
  const studentRequests = requests.filter((r) => r.role === "student")
  const teacherRequests = requests.filter((r) => r.role === "teacher")

  const handleRequest = async (requestId: string, action: "accept" | "reject") => {
    setProcessingIds((prev) => [...prev, requestId])

    try {
      const requestRef = doc(db, "requests", requestId)
      const collegeRef = doc(db, "colleges", collegeId)

      // Update request status
      await updateDoc(requestRef, { status: action })

      if (action === "accept") {
        // Get request data to identify user ID
        const requestDoc = await getDoc(requestRef)
        const requestData = requestDoc.data()
        const memberId = requestData?.role === "student" ? requestData?.studentId : requestData?.teacherId

        if (memberId) {
          // Add user to appropriate array in college document
          const arrayField = requestData?.role === "student" ? "students" : "teachers"
          await updateDoc(collegeRef, {
            [arrayField]: arrayUnion(memberId),
          })

          toast.success(`${requestData?.name} has been accepted as a ${requestData?.role}`)
        }
      } else {
        toast.success("Request rejected")
      }
    } catch (error) {
      console.error("Error handling request:", error)
      toast.error("Failed to process request. Please try again.")
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== requestId))
    }
  }

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Pending Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (requests.length === 0) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Pending Requests ({requests.length})
          </CardTitle>
          <Link href="/notifications" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View All Notifications
          </Link>
        </div>
        <CardDescription>Review and manage join requests for your college</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="students">Students ({studentRequests.length})</TabsTrigger>
            <TabsTrigger value="teachers">Teachers ({teacherRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <RequestsList requests={studentRequests} handleRequest={handleRequest} processingIds={processingIds} />
          </TabsContent>

          <TabsContent value="teachers">
            <RequestsList requests={teacherRequests} handleRequest={handleRequest} processingIds={processingIds} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface RequestsListProps {
  requests: Request[]
  handleRequest: (requestId: string, action: "accept" | "reject") => Promise<void>
  processingIds: string[]
}

function RequestsList({ requests, handleRequest, processingIds }: RequestsListProps) {
  if (requests.length === 0) {
    return <p className="text-center py-4 text-gray-500">No pending requests</p>
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => {
        const isProcessing = processingIds.includes(request.id)

        return (
          <div key={request.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium">{request.name}</h3>
                <p className="text-sm text-gray-600">{request.email}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {request.createdAt?.toDate?.().toLocaleString() || "Unknown date"}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRequest(request.id, "reject")}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="w-3 h-3 mr-1 border-t-2 border-b-2 border-current rounded-full animate-spin"></span>
                  ) : (
                    <X className="w-3 h-3 mr-1" />
                  )}
                  Reject
                </Button>
                <Button size="sm" onClick={() => handleRequest(request.id, "accept")} disabled={isProcessing}>
                  {isProcessing ? (
                    <span className="w-3 h-3 mr-1 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                  ) : (
                    <Check className="w-3 h-3 mr-1" />
                  )}
                  Accept
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

