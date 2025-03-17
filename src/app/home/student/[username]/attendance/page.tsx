// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { useAuth } from "@/context/AuthContext"
// import AuthGuard from "@/components/auth/AuthGuard"
// import { db } from "@/lib/firebase"
// import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
// import Link from "next/link"
// import { ArrowLeft, Calendar, BookOpen, AlertTriangle, CheckCircle } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Progress } from "@/components/ui/progress"
// import { Input } from "@/components/ui/input"
// import { toast, Toaster } from "react-hot-toast"

// type AttendanceRecord = {
//   id: string
//   collegeId: string
//   uploadedBy: string
//   uploadedByName: string
//   fileName: string
//   subject: string
//   date: string
//   createdAt: any
//   records: {
//     enrollmentNumber: string
//     studentName: string
//     status: string
//     percentage?: number
//     totalClasses?: number
//     attendedClasses?: number
//   }[]
//   sentToStudents: boolean
// }

// type StudentAttendance = {
//   id: string
//   subject: string
//   date: string
//   status: string
//   teacherName: string
//   createdAt: Date
// }

// type SubjectSummary = {
//   subject: string
//   totalClasses: number
//   attendedClasses: number
//   percentage: number
//   status: string
// }

// export default function StudentAttendancePage() {
//   const { username } = useParams()
//   const { user, profile } = useAuth()
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [attendanceRecords, setAttendanceRecords] = useState<StudentAttendance[]>([])
//   const [subjectSummaries, setSubjectSummaries] = useState<SubjectSummary[]>([])
//   const [selectedSubject, setSelectedSubject] = useState<string>("all")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filteredRecords, setFilteredRecords] = useState<StudentAttendance[]>([])
//   const [dateRange, setDateRange] = useState<string>("all")
//   const [subjects, setSubjects] = useState<string[]>([])
//   const [overallAttendance, setOverallAttendance] = useState({
//     percentage: 0,
//     status: "Unknown",
//     attended: 0,
//     total: 0
//   })

//   useEffect(() => {
//     const fetchAttendanceRecords = async () => {
//       if (!user?.uid || !profile?.enrollmentNumber) {
//         // If no user or no enrollment number, redirect to profile page
//         toast.error("Please update your enrollment number in your profile")
//         return
//       }

//       setLoading(true)
//       try {
//         // Get all attendance records
//         const attendanceQuery = query(
//           collection(db, "attendance"),
//           where("sentToStudents", "==", true)
//         )

//         const attendanceSnapshot = await getDocs(attendanceQuery)
//         const allRecords = attendanceSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         })) as AttendanceRecord[]

//         // Filter records containing this student's enrollment number
//         const studentRecords: StudentAttendance[] = []
//         const subjectsSet = new Set<string>()
//         const subjectAttendance: Record<string, { present: number; total: number }> = {}

//         allRecords.forEach(record => {
//           const studentRecord = record.records.find(
//             r => r.enrollmentNumber === profile.enrollmentNumber
//           )
          
//           if (studentRecord) {
//             subjectsSet.add(record.subject)
            
//             // Add to student's records
//             studentRecords.push({
//               id: record.id,
//               subject: record.subject,
//               date: record.date,
//               status: studentRecord.status,
//               teacherName: record.uploadedByName,
//               createdAt: record.createdAt?.toDate?.() || new Date()
//             })
            
//             // Update subject summary
//             if (!subjectAttendance[record.subject]) {
//               subjectAttendance[record.subject] = { present: 0, total: 0 }
//             }
            
//             subjectAttendance[record.subject].total += 1
//             if (
//               studentRecord.status === "Present" || 
//               studentRecord.status === "Good Standing"
//             ) {
//               subjectAttendance[record.subject].present += 1
//             }
//           }
//         })

//         // Sort records by date (latest first)
//         studentRecords.sort((a, b) => {
//           return new Date(b.date).getTime() - new Date(a.date).getTime()
//         })

//         // Calculate subject-wise summaries
//         const summaries: SubjectSummary[] = []
//         let totalAttended = 0
//         let totalClasses = 0

//         Object.entries(subjectAttendance).forEach(([subject, data]) => {
//           const percentage = data.total > 0 ? (data.present / data.total) * 100 : 0
//           let status = "Unknown"
          
//           if (percentage >= 75) {
//             status = "Good Standing"
//           } else if (percentage >= 60) {
//             status = "Warning"
//           } else {
//             status = "Critical"
//           }
          
//           summaries.push({
//             subject,
//             totalClasses: data.total,
//             attendedClasses: data.present,
//             percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
//             status
//           })
          
//           totalAttended += data.present
//           totalClasses += data.total
//         })

//         // Calculate overall attendance
//         const overallPercentage = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0
//         let overallStatus = "Unknown"
        
//         if (overallPercentage >= 75) {
//           overallStatus = "Good Standing"
//         } else if (overallPercentage >= 60) {
//           overallStatus = "Warning"
//         } else {
//           overallStatus = "Critical"
//         }

//         setOverallAttendance({
//           percentage: Math.round(overallPercentage * 10) / 10,
//           status: overallStatus,
//           attended: totalAttended,
//           total: totalClasses
//         })

//         // Sort summaries by subject name
//         summaries.sort((a, b) => a.subject.localeCompare(b.subject))

//         setAttendanceRecords(studentRecords)
//         setFilteredRecords(studentRecords)
//         setSubjectSummaries(summaries)
//         setSubjects(Array.from(subjectsSet).sort())
//       } catch (error) {
//         console.error("Error fetching attendance records:", error)
//         toast.error("Failed to load attendance records")
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (user?.uid) {
//       fetchAttendanceRecords()
//     }
//   }, [user?.uid, profile?.enrollmentNumber])

//   useEffect(() => {
//     filterRecords()
//   }, [selectedSubject, searchQuery, dateRange, attendanceRecords])

//   const filterRecords = () => {
//     let filtered = [...attendanceRecords]

//     // Filter by subject
//     if (selectedSubject !== "all") {
//       filtered = filtered.filter(record => record.subject === selectedSubject)
//     }

//     // Filter by search query
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(
//         record =>
//           record.subject.toLowerCase().includes(query) ||
//           record.status.toLowerCase().includes(query) ||
//           record.date.includes(query) ||
//           record.teacherName.toLowerCase().includes(query)
//       )
//     }

//     // Filter by date range
//     const today = new Date()
//     if (dateRange === "thisMonth") {
//       const thisMonth = today.getMonth()
//       const thisYear = today.getFullYear()
//       filtered = filtered.filter(record => {
//         const recordDate = new Date(record.date)
//         return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear
//       })
//     } else if (dateRange === "lastMonth") {
//       const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1
//       const lastMonthYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear()
//       filtered = filtered.filter(record => {
//         const recordDate = new Date(record.date)
//         return recordDate.getMonth() === lastMonth && recordDate.getFullYear() === lastMonthYear
//       })
//     } else if (dateRange === "thisWeek") {
//       // Get first day of the week (Sunday)
//       const firstDay = new Date(today)
//       const day = today.getDay()
//       const diff = today.getDate() - day
//       firstDay.setDate(diff)
//       firstDay.setHours(0, 0, 0, 0)

//       filtered = filtered.filter(record => {
//         const recordDate = new Date(record.date)
//         return recordDate >= firstDay
//       })
//     }

//     setFilteredRecords(filtered)
//   }

//   const getStatusBadgeColor = (status: string) => {
//     if (status === "Present" || status === "Good Standing") {
//       return "bg-green-100 text-green-800"
//     } else if (status === "Absent") {
//       return "bg-red-100 text-red-800"
//     } else if (status === "Warning") {
//       return "bg-yellow-100 text-yellow-800"
//     } else if (status === "Critical") {
//       return "bg-red-100 text-red-800"
//     } else {
//       return "bg-gray-100 text-gray-800"
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center">
//           <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
//           <p className="mt-4 text-lg text-gray-700">Loading attendance records...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <AuthGuard requireAuth={true}>
//       <div className="min-h-screen bg-gray-50">
//         <Toaster position="top-right" />
//         <header className="bg-white shadow">
//           <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
//             <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Attendance</h1>
//                 <p className="mt-1 text-gray-600">View and track your attendance records</p>
//               </div>
//               <div className="flex gap-2">
//                 <Link
//                   href={`/student/${username}`}
//                   className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
//                 >
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back to Dashboard
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
//           <div className="mb-6 space-y-6">
//             {/* Overall Attendance Summary */}
//             <Card className="border-t-4 border-blue-500 shadow-md">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-xl font-bold text-gray-800">Overall Attendance Summary</CardTitle>
//                 <CardDescription>
//                   Enrollment Number: <span className="font-medium">{profile?.enrollmentNumber}</span>
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <div className="text-sm font-medium text-gray-500">Attendance Percentage</div>
//                     <div className="mt-1 text-2xl font-bold">{overallAttendance.percentage}%</div>
//                     <Progress
//                       value={overallAttendance.percentage}
//                       className="h-2 mt-2"
//                       indicatorColor={
//                         overallAttendance.percentage >= 75
//                           ? "bg-green-500"
//                           : overallAttendance.percentage >= 60
//                           ? "bg-yellow-500"
//                           : "bg-red-500"
//                       }
//                     />
//                   </div>
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <div className="text-sm font-medium text-gray-500">Status</div>
//                     <div className="flex items-center mt-1">
//                       <Badge
//                         className={`text-sm px-2 py-1 ${getStatusBadgeColor(overallAttendance.status)}`}
//                       >
//                         {overallAttendance.status}
//                       </Badge>
//                     </div>
//                     <div className="mt-2 text-sm text-gray-500">
//                       {overallAttendance.status === "Good Standing" ? (
//                         <span className="flex items-center text-green-600">
//                           <CheckCircle className="w-4 h-4 mr-1" /> Good attendance record
//                         </span>
//                       ) : overallAttendance.status === "Warning" ? (
//                         <span className="flex items-center text-yellow-600">
//                           <AlertTriangle className="w-4 h-4 mr-1" /> Attendance needs improvement
//                         </span>
//                       ) : overallAttendance.status === "Critical" ? (
//                         <span className="flex items-center text-red-600">
//                           <AlertTriangle className="w-4 h-4 mr-1" /> Critical attendance issues
//                         </span>
//                       ) : (
//                         <span>No status available</span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <div className="text-sm font-medium text-gray-500">Classes Attended</div>
//                     <div className="mt-1 text-2xl font-bold">{overallAttendance.attended}</div>
//                     <div className="mt-2 text-sm text-gray-500">
//                       Out of {overallAttendance.total} total classes
//                     </div>
//                   </div>
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                   <div className="text-sm font-medium text-gray-500">Subject Count</div>
//                     <div className="mt-1 text-2xl font-bold">{subjects.length}</div>
//                     <div className="mt-2 text-sm text-gray-500">
//                       Active subjects with attendance records
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Subject-wise Attendance */}
//             <Card className="shadow-md">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-xl font-bold text-gray-800">Subject-wise Attendance</CardTitle>
//                 <CardDescription>
//                   Detailed attendance breakdown for each subject
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {subjectSummaries.length > 0 ? (
//                     <div className="border rounded-lg overflow-hidden">
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Subject</TableHead>
//                             <TableHead>Classes Attended</TableHead>
//                             <TableHead>Total Classes</TableHead>
//                             <TableHead>Percentage</TableHead>
//                             <TableHead>Status</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {subjectSummaries.map((summary, index) => (
//                             <TableRow key={index}>
//                               <TableCell className="font-medium">{summary.subject}</TableCell>
//                               <TableCell>{summary.attendedClasses}</TableCell>
//                               <TableCell>{summary.totalClasses}</TableCell>
//                               <TableCell>
//                                 <div className="flex items-center gap-2">
//                                   <div className="w-24">
//                                     <Progress
//                                       value={summary.percentage}
//                                       className="h-2"
//                                       indicatorColor={
//                                         summary.percentage >= 75
//                                           ? "bg-green-500"
//                                           : summary.percentage >= 60
//                                           ? "bg-yellow-500"
//                                           : "bg-red-500"
//                                       }
//                                     />
//                                   </div>
//                                   <span>{summary.percentage}%</span>
//                                 </div>
//                               </TableCell>
//                               <TableCell>
//                                 <Badge className={getStatusBadgeColor(summary.status)}>
//                                   {summary.status}
//                                 </Badge>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center p-6 text-center">
//                       <div className="bg-blue-50 p-4 rounded-full mb-4">
//                         <BookOpen className="w-8 h-8 text-blue-500" />
//                       </div>
//                       <h3 className="text-lg font-medium text-gray-800 mb-1">No Subject Data Available</h3>
//                       <p className="text-gray-600 max-w-md">
//                         No attendance records have been uploaded for any subjects yet.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Attendance Records */}
//             <Card className="shadow-md">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-xl font-bold text-gray-800">Attendance Records</CardTitle>
//                 <CardDescription>
//                   Your class attendance records
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {/* Filters */}
//                   <div className="grid gap-4 md:grid-cols-3">
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">
//                         Filter by Subject
//                       </label>
//                       <Select value={selectedSubject} onValueChange={setSelectedSubject}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Subject" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All Subjects</SelectItem>
//                           {subjects.map((subject) => (
//                             <SelectItem key={subject} value={subject}>
//                               {subject}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">
//                         Date Range
//                       </label>
//                       <Select value={dateRange} onValueChange={setDateRange}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Date Range" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All Time</SelectItem>
//                           <SelectItem value="thisWeek">This Week</SelectItem>
//                           <SelectItem value="thisMonth">This Month</SelectItem>
//                           <SelectItem value="lastMonth">Last Month</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <label className="block mb-2 text-sm font-medium text-gray-700">
//                         Search
//                       </label>
//                       <div className="relative">
//                         <Input
//                           type="text"
//                           placeholder="Search records..."
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           className="w-full"
//                         />
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                           />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>

//                   {filteredRecords.length > 0 ? (
//                     <div className="border rounded-lg overflow-hidden">
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Date</TableHead>
//                             <TableHead>Subject</TableHead>
//                             <TableHead>Status</TableHead>
//                             <TableHead>Recorded By</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {filteredRecords.map((record, index) => (
//                             <TableRow key={index}>
//                               <TableCell className="whitespace-nowrap">
//                                 <div className="flex items-center">
//                                   <Calendar className="w-4 h-4 mr-2 text-gray-400" />
//                                   {new Date(record.date).toLocaleDateString()}
//                                 </div>
//                               </TableCell>
//                               <TableCell className="font-medium">{record.subject}</TableCell>
//                               <TableCell>
//                                 <Badge className={getStatusBadgeColor(record.status)}>
//                                   {record.status}
//                                 </Badge>
//                               </TableCell>
//                               <TableCell>{record.teacherName}</TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center p-6 text-center">
//                       <div className="bg-blue-50 p-4 rounded-full mb-4">
//                         <Calendar className="w-8 h-8 text-blue-500" />
//                       </div>
//                       <h3 className="text-lg font-medium text-gray-800 mb-1">No Records Found</h3>
//                       <p className="text-gray-600 max-w-md">
//                         {attendanceRecords.length > 0
//                           ? "No records match your current filter criteria. Try adjusting your filters."
//                           : "No attendance records have been uploaded yet."}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//               <CardFooter className="flex justify-between border-t py-4 bg-gray-50">
//                 <p className="text-sm text-gray-600">
//                   Total records: {filteredRecords.length}
//                 </p>
//                 {attendanceRecords.length > 0 && (
//                   <p className="text-sm text-gray-600">
//                     Displaying {filteredRecords.length} of {attendanceRecords.length} records
//                   </p>
//                 )}
//               </CardFooter>
//             </Card>
//           </div>
//         </main>
//       </div>
//     </AuthGuard>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import AuthGuard from "@/components/auth/AuthGuard"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import Link from "next/link"
import { ArrowLeft, Calendar, BookOpen, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { toast, Toaster } from "react-hot-toast"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay, subMonths, addMonths, parseISO } from "date-fns"

type AttendanceRecord = {
  id: string
  collegeId: string
  uploadedBy: string
  uploadedByName: string
  fileName: string
  subject: string
  date: string
  createdAt: any
  records: {
    enrollmentNumber: string
    studentName: string
    status: string
    percentage?: number
    totalClasses?: number
    attendedClasses?: number
  }[]
  sentToStudents: boolean
}

type StudentAttendance = {
  id: string
  subject: string
  date: string
  status: string
  teacherName: string
  createdAt: Date
}

type SubjectSummary = {
  subject: string
  totalClasses: number
  attendedClasses: number
  percentage: number
  status: string
}

type DayAttendance = {
  date: string
  records: StudentAttendance[]
  status: 'present' | 'absent' | 'partial' | 'none'
  subjects: string[]
}

export default function StudentAttendancePage() {
  const { username } = useParams()
  const { user, profile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [attendanceRecords, setAttendanceRecords] = useState<StudentAttendance[]>([])
  const [subjectSummaries, setSubjectSummaries] = useState<SubjectSummary[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredRecords, setFilteredRecords] = useState<StudentAttendance[]>([])
  const [dateRange, setDateRange] = useState<string>("all")
  const [subjects, setSubjects] = useState<string[]>([])
  const [overallAttendance, setOverallAttendance] = useState({
    percentage: 0,
    status: "Unknown",
    attended: 0,
    total: 0
  })
  
  // Calendar related states
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarData, setCalendarData] = useState<{[key: string]: DayAttendance}>({})
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [dayDetails, setDayDetails] = useState<DayAttendance | null>(null)

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (!user?.uid || !profile?.enrollmentNumber) {
        // If no user or no enrollment number, redirect to profile page
        toast.error("Please update your enrollment number in your profile")
        return
      }

      setLoading(true)
      try {
        // Get all attendance records
        const attendanceQuery = query(
          collection(db, "attendance"),
          where("sentToStudents", "==", true)
        )

        const attendanceSnapshot = await getDocs(attendanceQuery)
        const allRecords = attendanceSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AttendanceRecord[]

        // Filter records containing this student's enrollment number
        const studentRecords: StudentAttendance[] = []
        const subjectsSet = new Set<string>()
        const subjectAttendance: Record<string, { present: number; total: number }> = {}
        const dailyAttendance: {[key: string]: DayAttendance} = {}

        allRecords.forEach(record => {
          const studentRecord = record.records.find(
            r => r.enrollmentNumber === profile.enrollmentNumber
          )
          
          if (studentRecord) {
            subjectsSet.add(record.subject)
            
            // Format the date to be consistent
            const formattedDate = new Date(record.date).toISOString().split('T')[0]
            
            // Add to student's records
            const attendanceRecord = {
              id: record.id,
              subject: record.subject,
              date: formattedDate,
              status: studentRecord.status,
              teacherName: record.uploadedByName,
              createdAt: record.createdAt?.toDate?.() || new Date()
            }
            
            studentRecords.push(attendanceRecord)
            
            // Update daily attendance for calendar view
            if (!dailyAttendance[formattedDate]) {
              dailyAttendance[formattedDate] = {
                date: formattedDate,
                records: [],
                status: 'none',
                subjects: []
              }
            }
            
            dailyAttendance[formattedDate].records.push(attendanceRecord)
            dailyAttendance[formattedDate].subjects.push(record.subject)
            
            // Update the day's status
            if (studentRecord.status === "Present" || studentRecord.status === "Good Standing") {
              if (dailyAttendance[formattedDate].status === 'none' || 
                  dailyAttendance[formattedDate].status === 'present') {
                dailyAttendance[formattedDate].status = 'present'
              } else {
                dailyAttendance[formattedDate].status = 'partial'
              }
            } else if (studentRecord.status === "Absent") {
              if (dailyAttendance[formattedDate].status === 'none' || 
                  dailyAttendance[formattedDate].status === 'absent') {
                dailyAttendance[formattedDate].status = 'absent'
              } else {
                dailyAttendance[formattedDate].status = 'partial'
              }
            }
            
            // Update subject summary
            if (!subjectAttendance[record.subject]) {
              subjectAttendance[record.subject] = { present: 0, total: 0 }
            }
            
            subjectAttendance[record.subject].total += 1
            if (
              studentRecord.status === "Present" || 
              studentRecord.status === "Good Standing"
            ) {
              subjectAttendance[record.subject].present += 1
            }
          }
        })

        // Sort records by date (latest first)
        studentRecords.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })

        // Calculate subject-wise summaries
        const summaries: SubjectSummary[] = []
        let totalAttended = 0
        let totalClasses = 0

        Object.entries(subjectAttendance).forEach(([subject, data]) => {
          const percentage = data.total > 0 ? (data.present / data.total) * 100 : 0
          let status = "Unknown"
          
          if (percentage >= 75) {
            status = "Good Standing"
          } else if (percentage >= 60) {
            status = "Warning"
          } else {
            status = "Critical"
          }
          
          summaries.push({
            subject,
            totalClasses: data.total,
            attendedClasses: data.present,
            percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
            status
          })
          
          totalAttended += data.present
          totalClasses += data.total
        })

        // Calculate overall attendance
        const overallPercentage = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0
        let overallStatus = "Unknown"
        
        if (overallPercentage >= 75) {
          overallStatus = "Good Standing"
        } else if (overallPercentage >= 60) {
          overallStatus = "Warning"
        } else {
          overallStatus = "Critical"
        }

        setOverallAttendance({
          percentage: Math.round(overallPercentage * 10) / 10,
          status: overallStatus,
          attended: totalAttended,
          total: totalClasses
        })

        // Sort summaries by subject name
        summaries.sort((a, b) => a.subject.localeCompare(b.subject))

        setAttendanceRecords(studentRecords)
        setFilteredRecords(studentRecords)
        setSubjectSummaries(summaries)
        setSubjects(Array.from(subjectsSet).sort())
        setCalendarData(dailyAttendance)
      } catch (error) {
        console.error("Error fetching attendance records:", error)
        toast.error("Failed to load attendance records")
      } finally {
        setLoading(false)
      }
    }

    if (user?.uid) {
      fetchAttendanceRecords()
    }
  }, [user?.uid, profile?.enrollmentNumber])

  useEffect(() => {
    filterRecords()
  }, [selectedSubject, searchQuery, dateRange, attendanceRecords])

  useEffect(() => {
    if (selectedDate && calendarData[selectedDate]) {
      setDayDetails(calendarData[selectedDate])
    } else {
      setDayDetails(null)
    }
  }, [selectedDate, calendarData])

  const filterRecords = () => {
    let filtered = [...attendanceRecords]

    // Filter by subject
    if (selectedSubject !== "all") {
      filtered = filtered.filter(record => record.subject === selectedSubject)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        record =>
          record.subject.toLowerCase().includes(query) ||
          record.status.toLowerCase().includes(query) ||
          record.date.includes(query) ||
          record.teacherName.toLowerCase().includes(query)
      )
    }

    // Filter by date range
    const today = new Date()
    if (dateRange === "thisMonth") {
      const thisMonth = today.getMonth()
      const thisYear = today.getFullYear()
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date)
        return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear
      })
    } else if (dateRange === "lastMonth") {
      const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1
      const lastMonthYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear()
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date)
        return recordDate.getMonth() === lastMonth && recordDate.getFullYear() === lastMonthYear
      })
    } else if (dateRange === "thisWeek") {
      // Get first day of the week (Sunday)
      const firstDay = new Date(today)
      const day = today.getDay()
      const diff = today.getDate() - day
      firstDay.setDate(diff)
      firstDay.setHours(0, 0, 0, 0)

      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date)
        return recordDate >= firstDay
      })
    }

    setFilteredRecords(filtered)
  }

  const getStatusBadgeColor = (status: string) => {
    if (status === "Present" || status === "Good Standing") {
      return "bg-green-100 text-green-800"
    } else if (status === "Absent") {
      return "bg-red-100 text-red-800"
    } else if (status === "Warning") {
      return "bg-yellow-100 text-yellow-800"
    } else if (status === "Critical") {
      return "bg-red-100 text-red-800"
    } else {
      return "bg-gray-100 text-gray-800"
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDayClick = (date: string) => {
    setSelectedDate(date)
    
    // Optional: Navigate to attendance details page
    // router.push(`/student/${username}/attendance/${date}`)
  }

  const getDayColor = (dayStr: string) => {
    if (!calendarData[dayStr]) return "bg-gray-100"
    
    switch (calendarData[dayStr].status) {
      case 'present':
        return "bg-green-500"
      case 'absent':
        return "bg-red-500"
      case 'partial':
        return "bg-yellow-500"
      default:
        return "bg-gray-100"
    }
  }

  // Generate calendar days
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = monthStart
    const endDate = monthEnd
    
    const dateFormat = "MMMM yyyy"
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    
    // Generate matrix for calendar view
    const dayMatrix = []
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    
    for (let i = 0; i < 53; i++) {
      dayMatrix.push(Array(7).fill(null))
    }

    // Fill in all dates for the entire year
    days.forEach(day => {
      const week = Math.floor((day.getTime() - new Date(day.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
      const weekday = getDay(day) // 0 for Sunday, 6 for Saturday
      dayMatrix[week][weekday] = day
    })
    
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{format(currentMonth, dateFormat)}</h3>
          <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="grid grid-cols-7 text-center text-xs font-medium bg-gray-50 border-b">
            {weekDays.map((day, i) => (
              <div key={i} className="py-2 border-r last:border-r-0">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-gray-100">
            {days.map((day, i) => {
              const formattedDate = format(day, 'yyyy-MM-dd')
              const isToday = isSameDay(day, new Date())
              const isSelected = selectedDate === formattedDate
              
              return (
                <div
                  key={i}
                  onClick={() => handleDayClick(formattedDate)}
                  className={`
                    h-12 flex flex-col items-center justify-center relative
                    cursor-pointer hover:bg-gray-50 transition-colors
                    ${isToday ? 'font-bold' : ''}
                    ${isSelected ? 'ring-2 ring-blue-500 z-10' : ''}
                  `}
                >
                  <div className="text-xs mb-1">{format(day, 'd')}</div>
                  {calendarData[formattedDate] && (
                    <div 
                      className={`w-6 h-6 rounded-sm ${getDayColor(formattedDate)}`}
                      title={`${calendarData[formattedDate]?.subjects.join(', ')}`}
                    ></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Render selected day details
  const renderDayDetails = () => {
    if (!dayDetails) return null
    
    return (
      <div className="mt-4 border rounded-lg overflow-hidden p-4">
        <h3 className="text-lg font-medium mb-2">
          {format(parseISO(dayDetails.date), 'MMMM d, yyyy')}
        </h3>
        
        {dayDetails.records.length > 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-3">
              {dayDetails.records.length} class{dayDetails.records.length > 1 ? 'es' : ''} on this day
            </p>
            <div className="space-y-3">
              {dayDetails.records.map((record, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <p className="font-medium">{record.subject}</p>
                    <p className="text-sm text-gray-600">Recorded by {record.teacherName}</p>
                  </div>
                  <Badge className={getStatusBadgeColor(record.status)}>
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600">No attendance records for this day.</p>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading attendance records...</p>
        </div>
      </div>
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
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Attendance</h1>
                <p className="mt-1 text-gray-600">View and track your attendance records</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/student/${username}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-6 space-y-6">
            {/* Overall Attendance Summary */}
            <Card className="border-t-4 border-blue-500 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-gray-800">Overall Attendance Summary</CardTitle>
                <CardDescription>
                  Enrollment Number: <span className="font-medium">{profile?.enrollmentNumber}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Attendance Percentage</div>
                    <div className="mt-1 text-2xl font-bold">{overallAttendance.percentage}%</div>
                    <Progress
                      value={overallAttendance.percentage}
                      className="h-2 mt-2"
                      indicatorColor={
                        overallAttendance.percentage >= 75
                          ? "bg-green-500"
                          : overallAttendance.percentage >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Status</div>
                    <div className="flex items-center mt-1">
                      <Badge
                        className={`text-sm px-2 py-1 ${getStatusBadgeColor(overallAttendance.status)}`}
                      >
                        {overallAttendance.status}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {overallAttendance.status === "Good Standing" ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" /> Good attendance record
                        </span>
                      ) : overallAttendance.status === "Warning" ? (
                        <span className="flex items-center text-yellow-600">
                          <AlertTriangle className="w-4 h-4 mr-1" /> Attendance needs improvement
                        </span>
                      ) : overallAttendance.status === "Critical" ? (
                        <span className="flex items-center text-red-600">
                          <AlertTriangle className="w-4 h-4 mr-1" /> Critical attendance issues
                        </span>
                      ) : (
                        <span>No status available</span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Classes Attended</div>
                    <div className="mt-1 text-2xl font-bold">{overallAttendance.attended}</div>
                    <div className="mt-2 text-sm text-gray-500">
                      Out of {overallAttendance.total} total classes
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Subject Count</div>
                    <div className="mt-1 text-2xl font-bold">{subjects.length}</div>
                    <div className="mt-2 text-sm text-gray-500">
                      Active subjects with attendance records
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Calendar View */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-gray-800">Attendance Calendar</CardTitle>
                <CardDescription>
                  Visual representation of your attendance throughout the month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
                      <span className="text-sm">Present</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
                      <span className="text-sm">Absent</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
                      <span className="text-sm">Partially Present</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-100 rounded-sm mr-2"></div>
                      <span className="text-sm">No Classes</span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>{renderCalendar()}</div>
                    <div>
                      {dayDetails ? (
                        renderDayDetails()
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6 border rounded-lg">
                          <Calendar className="w-12 h-12 text-blue-500 mb-4" />
                          <h3 className="text-lg font-medium text-gray-800 mb-2">Select a Day</h3>
                          <p className="text-gray-600">
                            Click on any day in the calendar to view detailed attendance information
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject-wise Attendance */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-gray-800">Subject-wise Attendance</CardTitle>
                <CardDescription>
                  Detailed attendance breakdown for each subject
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectSummaries.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Classes Attended</TableHead>
                            <TableHead>Total Classes</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subjectSummaries.map((summary, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{summary.subject}</TableCell>
                              <TableCell>{summary.attendedClasses}</TableCell>
                              <TableCell>{summary.totalClasses}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-24">
                                    <Progress
                                      value={summary.percentage}
                                      className="h-2"
                                      indicatorColor={
                                        summary.percentage >= 75
                                          ? "bg-green-500"
                                          : summary.percentage >= 60
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }
                                    />
                                  </div>
                                  <span>{summary.percentage}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusBadgeColor(summary.status)}>
                                  {summary.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <div className="bg-blue-50 p-4 rounded-full mb-4">
                        <BookOpen className="w-8 h-8 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No Subject Data Available</h3>
                      <p className="text-gray-600 max-w-md">
                        No attendance records have been uploaded for any subjects yet.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Attendance Records */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-gray-800">Attendance Records</CardTitle>
                <CardDescription>
                  Your class attendance records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Filter by Subject
                      </label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          {subjects.map((subject) => (
                           <SelectItem key={subject} value={subject}>
                           {subject}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div>
                   <label className="block mb-2 text-sm font-medium text-gray-700">
                     Date Range
                   </label>
                   <Select value={dateRange} onValueChange={setDateRange}>
                     <SelectTrigger>
                       <SelectValue placeholder="Select Date Range" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">All Time</SelectItem>
                       <SelectItem value="thisWeek">This Week</SelectItem>
                       <SelectItem value="thisMonth">This Month</SelectItem>
                       <SelectItem value="lastMonth">Last Month</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div>
                   <label className="block mb-2 text-sm font-medium text-gray-700">
Search Records
</label>
<Input
type="text"
placeholder="Search by subject, status, or teacher..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
/>
</div>
</div>
           {/* Attendance Records Table */}
           {filteredRecords.length > 0 ? (
             <div className="border rounded-lg overflow-hidden">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Date</TableHead>
                     <TableHead>Subject</TableHead>
                     <TableHead>Teacher</TableHead>
                     <TableHead>Status</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredRecords.map((record, index) => (
                     <TableRow key={index}>
                       <TableCell>{format(parseISO(record.date), 'MMM d, yyyy')}</TableCell>
                       <TableCell className="font-medium">{record.subject}</TableCell>
                       <TableCell>{record.teacherName}</TableCell>
                       <TableCell>
                         <Badge className={getStatusBadgeColor(record.status)}>
                           {record.status}
                         </Badge>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center p-6 text-center">
               <div className="bg-blue-50 p-4 rounded-full mb-4">
                 <Info className="w-8 h-8 text-blue-500" />
               </div>
               <h3 className="text-lg font-medium text-gray-800 mb-1">No Records Found</h3>
               <p className="text-gray-600 max-w-md">
                 No attendance records match your current filters.
               </p>
             </div>
           )}
         </div>
       </CardContent>
     </Card>
   </div>
 </main>
 </div>
 </AuthGuard>
 );
}