"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import AuthGuard from "@/components/auth/AuthGuard"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, Toaster } from "react-hot-toast"
import { EnrollmentNumberForm } from "@/components/profile/EnrollmentNumberForm"

type TimetableEntry = {
  day: string
  time: string
  subject: string
  teacher: string
  room: string
  batch?: string
}

type Timetable = {
  id: string
  collegeId: string
  uploadedBy: string
  uploadedByName: string
  fileName: string
  title: string
  semester: string
  batch: string
  createdAt: any
  entries: TimetableEntry[]
  published: boolean
}

export default function StudentTimetablePage() {
  const { username } = useParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const [selectedTimetable, setSelectedTimetable] = useState<string>("")
  const [activeTab, setActiveTab] = useState("weekly")
  const [selectedDay, setSelectedDay] = useState<string>("Monday")

  // Check if enrollment number is set
  const hasEnrollmentNumber = !!profile?.enrollmentNumber

  useEffect(() => {
    const fetchTimetables = async () => {
      if (!user?.uid || !profile?.enrollmentNumber) {
        setLoading(false)
        return
      }

      try {
        // Get colleges the student is part of
        const collegesQuery = query(collection(db, "colleges"), where("students", "array-contains", user.uid))

        const collegesSnapshot = await getDocs(collegesQuery)
        const collegeIds = collegesSnapshot.docs.map((doc) => doc.id)

        if (collegeIds.length === 0) {
          setLoading(false)
          return
        }

        // Fetch timetables for these colleges
        const batch = profile.batch || profile.graduationYear

        let timetableQuery
        if (batch) {
          timetableQuery = query(
            collection(db, "timetables"),
            where("collegeId", "in", collegeIds),
            where("published", "==", true),
            where("batch", "==", batch),
          )
        } else {
          timetableQuery = query(
            collection(db, "timetables"),
            where("collegeId", "in", collegeIds),
            where("published", "==", true),
          )
        }

        const timetableSnapshot = await getDocs(timetableQuery)
        const timetableData = timetableSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Timetable[]

        // Sort by date (newest first)
        timetableData.sort((a, b) => {
          return new Date(b.createdAt?.toDate?.() || 0).getTime() - new Date(a.createdAt?.toDate?.() || 0).getTime()
        })

        setTimetables(timetableData)

        // Set the first timetable as selected by default
        if (timetableData.length > 0) {
          setSelectedTimetable(timetableData[0].id)
        }
      } catch (error) {
        console.error("Error fetching timetables:", error)
        toast.error("Failed to load timetable data")
      } finally {
        setLoading(false)
      }
    }

    fetchTimetables()
  }, [user?.uid, profile?.enrollmentNumber, profile?.batch, profile?.graduationYear])

  // Get the currently selected timetable
  const currentTimetable = timetables.find((t) => t.id === selectedTimetable)

  // Group timetable entries by day
  const groupedByDay = () => {
    if (!currentTimetable) return {}

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const grouped: Record<string, TimetableEntry[]> = {}

    // Initialize days
    days.forEach((day) => {
      grouped[day] = []
    })

    // Group entries by day
    currentTimetable.entries.forEach((entry) => {
      const day = entry.day
      if (!grouped[day]) {
        grouped[day] = []
      }
      grouped[day].push(entry)
    })

    // Sort entries by time within each day
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => {
        // Convert time to comparable format (assuming format like "9:00 AM")
        const timeA = a.time
        const timeB = b.time
        return timeA.localeCompare(timeB)
      })
    })

    return grouped
  }

  // Get entries for the selected day
  const entriesForSelectedDay = () => {
    const grouped = groupedByDay()
    return grouped[selectedDay] || []
  }

  // Get all days that have entries
  const daysWithEntries = () => {
    const grouped = groupedByDay()
    return Object.keys(grouped).filter((day) => grouped[day].length > 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading timetable...</p>
        </div>
      </div>
    )
  }

  // If no enrollment number, show form to add it
  if (!hasEnrollmentNumber) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-md mx-auto pt-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold mb-2">Set Your Enrollment Number</h1>
              <p className="text-gray-600">You need to set your enrollment number to view your timetable</p>
            </div>

            <EnrollmentNumberForm
              redirectToAttendance={false}
              username={username as string}
              onComplete={() => {
                toast.success("Enrollment number saved! Refreshing page...")
                setTimeout(() => {
                  router.refresh()
                }, 1500)
              }}
            />

            <div className="mt-6 text-center">
              <Link
                href={`/home/student/${username}`}
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <header className="bg-white shadow">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Timetable</h1>
                <p className="mt-2 text-gray-600">
                  {profile?.enrollmentNumber ? `Enrollment: ${profile.enrollmentNumber}` : "No enrollment number"}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/home/student/${username}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {timetables.length > 0 ? (
            <div className="space-y-6">
              {/* Timetable selector */}
              <Card className="shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-800">Class Schedule</CardTitle>
                      <CardDescription className="text-gray-600">View your weekly class timetable</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={selectedTimetable} onValueChange={setSelectedTimetable}>
                        <SelectTrigger className="w-[220px]">
                          <SelectValue placeholder="Select timetable" />
                        </SelectTrigger>
                        <SelectContent>
                          {timetables.map((timetable) => (
                            <SelectItem key={timetable.id} value={timetable.id}>
                              {timetable.title} (Sem {timetable.semester})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  {currentTimetable ? (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="weekly">Weekly View</TabsTrigger>
                        <TabsTrigger value="daily">Daily View</TabsTrigger>
                      </TabsList>

                      <TabsContent value="weekly" className="w-full">
                        <div className="space-y-6">
                          {daysWithEntries().map((day) => (
                            <div key={day} className="space-y-2">
                              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                                {day}
                              </h3>
                              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {groupedByDay()[day].map((entry, index) => (
                                  <Card key={index} className="overflow-hidden border-l-4 border-l-purple-400">
                                    <CardHeader className="p-3 pb-2">
                                      <div className="flex justify-between items-start">
                                        <CardTitle className="text-base">{entry.subject}</CardTitle>
                                        <Badge variant="outline" className="bg-purple-50">
                                          {entry.time}
                                        </Badge>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-0">
                                      <div className="space-y-1 text-sm">
                                        {entry.teacher && (
                                          <div className="flex items-center text-gray-600">
                                            <User className="w-3.5 h-3.5 mr-1.5" />
                                            {entry.teacher}
                                          </div>
                                        )}
                                        {entry.room && (
                                          <div className="flex items-center text-gray-600">
                                            <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                            {entry.room}
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="daily" className="w-full">
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {daysWithEntries().map((day) => (
                              <Badge
                                key={day}
                                variant={selectedDay === day ? "default" : "outline"}
                                className={`cursor-pointer ${selectedDay === day ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : "hover:bg-gray-100"}`}
                                onClick={() => setSelectedDay(day)}
                              >
                                {day}
                              </Badge>
                            ))}
                          </div>

                          <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                            {selectedDay}
                          </h3>

                          {entriesForSelectedDay().length > 0 ? (
                            <div className="space-y-3">
                              {entriesForSelectedDay().map((entry, index) => (
                                <Card key={index} className="overflow-hidden">
                                  <div className="flex flex-col sm:flex-row">
                                    <div className="bg-purple-100 p-4 flex items-center justify-center sm:w-32">
                                      <div className="text-center">
                                        <Clock className="w-5 h-5 mx-auto text-purple-700" />
                                        <div className="mt-1 font-medium text-purple-800">{entry.time}</div>
                                      </div>
                                    </div>
                                    <div className="p-4 flex-1">
                                      <h4 className="text-lg font-medium">{entry.subject}</h4>
                                      <div className="mt-2 space-y-1 text-sm">
                                        {entry.teacher && (
                                          <div className="flex items-center text-gray-600">
                                            <User className="w-4 h-4 mr-2" />
                                            {entry.teacher}
                                          </div>
                                        )}
                                        {entry.room && (
                                          <div className="flex items-center text-gray-600">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {entry.room}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <div className="bg-purple-50 p-4 rounded-full mb-3">
                                <Calendar className="w-8 h-8 text-purple-400" />
                              </div>
                              <p className="text-gray-600">No classes scheduled for {selectedDay}</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="bg-purple-50 p-6 rounded-lg mb-4">
                        <Calendar className="w-10 h-10 text-purple-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No timetable selected</h3>
                      <p className="text-gray-600 max-w-md">
                        Please select a timetable from the dropdown above to view your class schedule
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex justify-between border-t py-3 px-6 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    {currentTimetable
                      ? `${currentTimetable.title} • Semester ${currentTimetable.semester}`
                      : "No timetable selected"}
                  </p>
                  <p className="text-sm text-gray-600">{currentTimetable ? `Batch: ${currentTimetable.batch}` : ""}</p>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardTitle className="text-2xl font-bold text-gray-800">My Timetable</CardTitle>
                <CardDescription className="text-gray-600">View your class schedule</CardDescription>
              </CardHeader>

              <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-purple-50 p-6 rounded-lg mb-4 w-16 h-16 flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Timetable Available</h3>
                <p className="text-gray-600 max-w-md">
                  Your institution hasn't published a timetable for your batch yet. Check back later or contact your
                  department.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}

