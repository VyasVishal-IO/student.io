// // "use client"

// // import type React from "react"

// // import { useState, useEffect } from "react"
// // import { useParams, useRouter } from "next/navigation"
// // import { useAuth } from "@/context/AuthContext"
// // import AuthGuard from "@/components/auth/AuthGuard"
// // import { db } from "@/lib/firebase"
// // import { collection, doc, getDocs, query, where, addDoc, updateDoc, serverTimestamp, arrayUnion } from "firebase/firestore"
// // import Link from "next/link"
// // import { ArrowLeft, Upload, FileSpreadsheet, Send, Download, Clock } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // import { Progress } from "@/components/ui/progress"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // import { Input } from "@/components/ui/input"
// // import { Badge } from "@/components/ui/badge"
// // import { toast, Toaster } from "react-hot-toast"
// // import * as XLSX from "xlsx"

// // type College = {
// //   id: string
// //   name: string
// //   description: string
// //   createdBy: string
// //   students: string[]
// //   teachers: string[]
// // }

// // type UserProfile = {
// //   uid: string
// //   displayName: string
// //   email: string
// //   role: string
// //   username?: string
// //   enrollmentNumber?: string
// // }

// // type AttendanceRecord = {
// //   id?: string
// //   collegeId: string
// //   uploadedBy: string
// //   uploadedByName: string
// //   fileName: string
// //   subject: string
// //   date: string
// //   createdAt: any
// //   records: {
// //     enrollmentNumber: string
// //     studentName: string
// //     status: string
// //     percentage?: number
// //     totalClasses?: number
// //     attendedClasses?: number
// //   }[]
// //   sentToStudents: boolean
// // }

// // export default function AttendanceManagementPage() {
// //   const { name } = useParams()
// //   const { user, profile } = useAuth()
// //   const router = useRouter()
// //   const [college, setCollege] = useState<College | null>(null)
// //   const [students, setStudents] = useState<UserProfile[]>([])
// //   const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [uploadLoading, setUploadLoading] = useState(false)
// //   const [progress, setProgress] = useState(0)

// //   // File upload states
// //   const [data, setData] = useState<any[]>([])
// //   const [headers, setHeaders] = useState<string[]>([])
// //   const [fileName, setFileName] = useState("")
// //   const [selectedSheet, setSelectedSheet] = useState("")
// //   const [availableSheets, setAvailableSheets] = useState<string[]>([])
// //   const [workbook, setWorkbook] = useState<any>(null)
// //   const [currentPage, setCurrentPage] = useState(1)
// //   const [rowsPerPage, setRowsPerPage] = useState(50)
// //   const [totalRows, setTotalRows] = useState(0)
// //   const [searchQuery, setSearchQuery] = useState("")
// //   const [filteredData, setFilteredData] = useState<any[]>([])
// //   const [activeTab, setActiveTab] = useState("upload")

// //   // Attendance mapping states
// //   const [subjectName, setSubjectName] = useState("")
// //   const [attendanceDate, setAttendanceDate] = useState("")
// //   const [enrollmentColumn, setEnrollmentColumn] = useState("")
// //   const [nameColumn, setNameColumn] = useState("")
// //   const [statusColumn, setStatusColumn] = useState("")
// //   const [mappingComplete, setMappingComplete] = useState(false)
// //   const [processedData, setProcessedData] = useState<any[]>([])
// //   const [sendingToStudents, setSendingToStudents] = useState(false)

// //   const decodedName = decodeURIComponent(name as string)

// //   useEffect(() => {
// //     const fetchCollege = async () => {
// //       try {
// //         // Find the college by name
// //         const collegeQuery = query(collection(db, "colleges"), where("name", "==", decodedName))
// //         const collegeSnapshot = await getDocs(collegeQuery)

// //         if (collegeSnapshot.empty) {
// //           router.push("/colleges")
// //           return
// //         }

// //         const collegeDoc = collegeSnapshot.docs[0]
// //         const collegeData = collegeDoc.data() as Omit<College, "id">
// //         const collegeWithId = { id: collegeDoc.id, ...collegeData } as College
// //         setCollege(collegeWithId)

// //         // Fetch students
// //         await fetchStudents(collegeWithId.id, collegeWithId.students)

// //         // Fetch attendance records
// //         await fetchAttendanceRecords(collegeWithId.id)
// //       } catch (error) {
// //         console.error("Error fetching college:", error)
// //         toast.error("Failed to load college data")
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     if (decodedName && user?.uid) {
// //       fetchCollege()
// //     }
// //   }, [decodedName, user?.uid, router])

// //   const fetchStudents = async (collegeId: string, studentIds: string[]) => {
// //     try {
// //       if (studentIds.length === 0) {
// //         setStudents([])
// //         return
// //       }

// //       // Fetch students details
// //       const studentsQuery = query(
// //         collection(db, "users"),
// //         where("uid", "in", studentIds),
// //         where("role", "==", "student"),
// //       )

// //       const studentsSnapshot = await getDocs(studentsQuery)
// //       setStudents(studentsSnapshot.docs.map((doc) => doc.data() as UserProfile))
// //     } catch (error) {
// //       console.error("Error fetching students:", error)
// //       toast.error("Failed to load student data")
// //     }
// //   }

// //   const fetchAttendanceRecords = async (collegeId: string) => {
// //     try {
// //       const attendanceQuery = query(
// //         collection(db, "attendance"),
// //         where("collegeId", "==", collegeId),
// //         where("uploadedBy", "==", user?.uid),
// //       )

// //       const attendanceSnapshot = await getDocs(attendanceQuery)
// //       const records = attendanceSnapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       })) as AttendanceRecord[]

// //       // Sort by date (newest first)
// //       records.sort((a, b) => {
// //         return new Date(b.createdAt?.toDate?.() || 0).getTime() - new Date(a.createdAt?.toDate?.() || 0).getTime()
// //       })

// //       setAttendanceRecords(records)
// //     } catch (error) {
// //       console.error("Error fetching attendance records:", error)
// //       toast.error("Failed to load attendance records")
// //     }
// //   }

// //   const processFileInChunks = async (file: File) => {
// //     setUploadLoading(true)
// //     setProgress(0)

// //     try {
// //       return new Promise((resolve, reject) => {
// //         const reader = new FileReader()

// //         reader.onload = async (e) => {
// //           try {
// //             setProgress(40)
// //             const arrayBuffer = e.target.result as ArrayBuffer
// //             const wb = XLSX.read(arrayBuffer, { type: "array", cellDates: true })
// //             setWorkbook(wb)
// //             setProgress(60)

// //             // Get all sheet names
// //             const sheetNames = wb.SheetNames
// //             setAvailableSheets(sheetNames)

// //             // Use first sheet as default
// //             const sheetName = sheetNames[0]
// //             setSelectedSheet(sheetName)

// //             setProgress(80)

// //             // Process selected sheet
// //             await processSheet(wb, sheetName)
// //             setProgress(100)

// //             // Set today's date as default
// //             const today = new Date()
// //             const formattedDate = today.toISOString().split("T")[0]
// //             setAttendanceDate(formattedDate)

// //             resolve(null)
// //           } catch (error) {
// //             console.error("Error processing Excel file:", error)
// //             reject(error)
// //           }
// //         }

// //         reader.onerror = () => {
// //           reject(new Error("Failed to read file"))
// //         }

// //         reader.readAsArrayBuffer(file)
// //       })
// //     } catch (error: any) {
// //       toast.error("Failed to process file: " + error.message)
// //     } finally {
// //       setUploadLoading(false)
// //     }
// //   }

// //   const processSheet = async (wb: any, sheetName: string) => {
// //     // Get the worksheet
// //     const worksheet = wb.Sheets[sheetName]

// //     // Convert to JSON with headers
// //     const jsonData = XLSX.utils.sheet_to_json(worksheet, {
// //       header: 1,
// //       defval: "", // Set default value for empty cells
// //       raw: false, // Convert all data to strings
// //       dateNF: "yyyy-mm-dd", // Format for dates
// //     }) as any[]

// //     if (jsonData.length === 0) {
// //       toast.error("The selected sheet appears to be empty.")
// //       return
// //     }

// //     // Find the real header row (skip empty rows at the top)
// //     let headerRowIndex = 0
// //     for (let i = 0; i < jsonData.length; i++) {
// //       // Check if row has meaningful content and isn't just empty cells
// //       if (jsonData[i].some((cell: any) => cell !== "")) {
// //         const nonEmptyCells = jsonData[i].filter((cell: any) => cell !== "").length
// //         // If the row has multiple non-empty cells, consider it as a potential header row
// //         if (nonEmptyCells > 2) {
// //           headerRowIndex = i
// //           break
// //         }
// //       }
// //     }

// //     // Extract headers
// //     const extractedHeaders = jsonData[headerRowIndex].map((header: any, idx: number) =>
// //       header !== "" ? header : `Column ${idx + 1}`,
// //     )

// //     setHeaders(extractedHeaders)

// //     // Extract data (rows after header)
// //     const rows = jsonData.slice(headerRowIndex + 1).filter((row: any) => row.some((cell: any) => cell !== ""))

// //     setData(rows)
// //     setFilteredData(rows)
// //     setTotalRows(rows.length)

// //     // Try to auto-detect columns
// //     autoDetectColumns(extractedHeaders)

// //     toast.success(`Loaded ${rows.length} rows from ${fileName}`)
// //   }

// //   const autoDetectColumns = (headers: string[]) => {
// //     // Auto-detect enrollment number column
// //     const enrollmentPatterns = ["enrollment", "roll", "id", "number", "no."]
// //     const namePatterns = ["name", "student", "full name"]
// //     const statusPatterns = ["status", "attendance", "present", "absent", "attend", "%", "percentage"]

// //     let enrollmentIdx = -1
// //     let nameIdx = -1
// //     let statusIdx = -1

// //     headers.forEach((header, idx) => {
// //       const lowerHeader = header.toLowerCase()

// //       // Check for enrollment patterns
// //       if (enrollmentIdx === -1 && enrollmentPatterns.some((pattern) => lowerHeader.includes(pattern))) {
// //         enrollmentIdx = idx
// //       }

// //       // Check for name patterns
// //       if (nameIdx === -1 && namePatterns.some((pattern) => lowerHeader.includes(pattern))) {
// //         nameIdx = idx
// //       }

// //       // Check for status patterns
// //       if (statusIdx === -1 && statusPatterns.some((pattern) => lowerHeader.includes(pattern))) {
// //         statusIdx = idx
// //       }
// //     })

// //     if (enrollmentIdx !== -1) {
// //       setEnrollmentColumn(headers[enrollmentIdx])
// //     }

// //     if (nameIdx !== -1) {
// //       setNameColumn(headers[nameIdx])
// //     }

// //     if (statusIdx !== -1) {
// //       setStatusColumn(headers[statusIdx])
// //     }

// //     // Try to detect subject from filename
// //     const filenameParts = fileName.split(".")
// //     if (filenameParts.length > 1) {
// //       const nameWithoutExtension = filenameParts.slice(0, -1).join(".")
// //       // Extract potential subject name
// //       const subjectMatch = nameWithoutExtension.match(/([A-Za-z]+)/)
// //       if (subjectMatch && subjectMatch[0].length > 2) {
// //         setSubjectName(subjectMatch[0])
// //       }
// //     }
// //   }

// //   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0]
// //     if (!file) return

// //     setFileName(file.name)
// //     setActiveTab("upload")
// //     setMappingComplete(false)

// //     try {
// //       await processFileInChunks(file)
// //     } catch (error: any) {
// //       toast.error("Failed to process file: " + error.message)
// //     }
// //   }

// //   const handleSheetChange = async (value: string) => {
// //     setSelectedSheet(value)
// //     setUploadLoading(true)

// //     try {
// //       if (workbook) {
// //         await processSheet(workbook, value)
// //       } else {
// //         toast.error("Workbook not available. Please reload the file.")
// //       }
// //     } catch (error: any) {
// //       toast.error("Failed to change sheet: " + error.message)
// //     } finally {
// //       setUploadLoading(false)
// //     }
// //   }

// //   const handleSearch = (query: string) => {
// //     setSearchQuery(query)

// //     if (!query.trim()) {
// //       setFilteredData(data)
// //       setTotalRows(data.length)
// //       return
// //     }

// //     // Filter data based on search query
// //     const filtered = data.filter((row: any[]) =>
// //       row.some((cell: any) => cell?.toString().toLowerCase().includes(query.toLowerCase())),
// //     )

// //     setFilteredData(filtered)
// //     setTotalRows(filtered.length)
// //     setCurrentPage(1)
// //   }

// //   const processAttendanceData = () => {
// //     if (!enrollmentColumn || !nameColumn || !statusColumn || !subjectName || !attendanceDate) {
// //       toast.error("Please complete all mapping fields before processing")
// //       return
// //     }

// //     const enrollmentIdx = headers.indexOf(enrollmentColumn)
// //     const nameIdx = headers.indexOf(nameColumn)
// //     const statusIdx = headers.indexOf(statusColumn)

// //     if (enrollmentIdx === -1 || nameIdx === -1 || statusIdx === -1) {
// //       toast.error("Invalid column mapping")
// //       return
// //     }

// //     // Process the data
// //     const processed = data
// //       .map((row) => {
// //         const enrollmentNumber = row[enrollmentIdx]?.toString().trim()
// //         const studentName = row[nameIdx]?.toString().trim()
// //         let status = row[statusIdx]?.toString().trim()

// //         // Normalize status
// //         if (status.toLowerCase().includes("present") || status === "1" || status === "P" || status === "p") {
// //           status = "Present"
// //         } else if (status.toLowerCase().includes("absent") || status === "0" || status === "A" || status === "a") {
// //           status = "Absent"
// //         } else if (status.includes("%")) {
// //           // It's a percentage, extract the number
// //           const percentage = Number.parseFloat(status.replace("%", ""))
// //           if (percentage >= 75) {
// //             status = "Good Standing"
// //           } else if (percentage >= 50) {
// //             status = "Warning"
// //           } else {
// //             status = "Critical"
// //           }
// //         }

// //         return {
// //           enrollmentNumber,
// //           studentName,
// //           status,
// //         }
// //       })
// //       .filter((item) => item.enrollmentNumber && item.studentName)

// //     setProcessedData(processed)
// //     setMappingComplete(true)
// //     toast.success("Attendance data processed successfully")
// //   }

// //   const saveAttendanceRecord = async () => {
// //     if (!college || !processedData.length || !subjectName || !attendanceDate) {
// //       toast.error("Missing required data for saving attendance")
// //       return
// //     }

// //     setUploadLoading(true)

// //     try {
// //       const attendanceData: Omit<AttendanceRecord, "id"> = {
// //         collegeId: college.id,
// //         uploadedBy: user?.uid || "",
// //         uploadedByName: profile?.displayName || "Unknown",
// //         fileName,
// //         subject: subjectName,
// //         date: attendanceDate,
// //         createdAt: serverTimestamp(),
// //         records: processedData,
// //         sentToStudents: false,
// //       }

// //       // Save to Firestore
// //       const docRef = await addDoc(collection(db, "attendance"), attendanceData)

// //       // Update local state
// //       const newRecord = {
// //         id: docRef.id,
// //         ...attendanceData,
// //         createdAt: new Date(),
// //       }

// //       setAttendanceRecords((prev) => [newRecord, ...prev])

// //       toast.success("Attendance record saved successfully")
// //       setActiveTab("records")
// //     } catch (error) {
// //       console.error("Error saving attendance record:", error)
// //       toast.error("Failed to save attendance record")
// //     } finally {
// //       setUploadLoading(false)
// //     }
// //   }

// //   const sendToStudents = async (recordId: string) => {
// //     if (!college) return

// //     setSendingToStudents(true)

// //     try {
// //       // Find the record
// //       const record = attendanceRecords.find((r) => r.id === recordId)
// //       if (!record) {
// //         toast.error("Attendance record not found")
// //         return
// //       }

// //       // Get all students with enrollment numbers
// //       const enrollmentMap = new Map()
// //       students.forEach((student) => {
// //         if (student.enrollmentNumber) {
// //           enrollmentMap.set(student.enrollmentNumber, student.uid)
// //         }
// //       })

// //       // Create notifications for each student
// //       const matchedStudents = record.records.filter((r) => enrollmentMap.has(r.enrollmentNumber))

// //       if (matchedStudents.length === 0) {
// //         toast.error("No matching students found with the enrollment numbers in this record")
// //         return
// //       }

// //       // Create notifications in batch
// //       const notificationPromises = matchedStudents.map(async (studentRecord) => {
// //         const studentId = enrollmentMap.get(studentRecord.enrollmentNumber)

// //         if (!studentId) return null

// //         // Create notification
// //         return addDoc(collection(db, "notifications"), {
// //           userId: studentId,
// //           collegeId: college.id,
// //           type: "attendance",
// //           title: `Attendance Update: ${record.subject}`,
// //           message: `Your attendance for ${record.subject} on ${record.date} has been recorded as: ${studentRecord.status}`,
// //           data: {
// //             recordId: record.id,
// //             subject: record.subject,
// //             date: record.date,
// //             status: studentRecord.status,
// //           },
// //           read: false,
// //           createdAt: serverTimestamp(),
// //         })
// //       })

// //       await Promise.all(notificationPromises)

// //       // Update the record as sent
// //       await updateDoc(doc(db, "attendance", recordId), {
// //         sentToStudents: true,
// //       })

// //       // Update local state
// //       setAttendanceRecords((prev) => prev.map((r) => (r.id === recordId ? { ...r, sentToStudents: true } : r)))

// //       toast.success(`Attendance notifications sent to ${matchedStudents.length} students`)
// //     } catch (error) {
// //       console.error("Error sending notifications:", error)
// //       toast.error("Failed to send notifications to students")
// //     } finally {
// //       setSendingToStudents(false)
// //     }
// //   }

// //   // Calculate pagination



// //   const totalPages = Math.ceil(totalRows / rowsPerPage)
// //   const startIndex = (currentPage - 1) * rowsPerPage
// //   const endIndex = Math.min(startIndex + rowsPerPage, totalRows)
// //   const currentData = filteredData?.slice(startIndex, endIndex) || []

// //   // Generate pagination buttons
// //   const paginationButtons = () => {
// //     const buttons = []
// //     const maxButtons = 5

// //     let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
// //     const endPage = Math.min(totalPages, startPage + maxButtons - 1)

// //     if (endPage - startPage + 1 < maxButtons) {
// //       startPage = Math.max(1, endPage - maxButtons + 1)
// //     }

// //     // First page
// //     buttons.push(
// //       <Button key="first" variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
// //         First
// //       </Button>,
// //     )

// //     // Previous page
// //     buttons.push(
// //       <Button
// //         key="prev"
// //         variant="outline"
// //         size="sm"
// //         onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
// //         disabled={currentPage === 1}
// //       >
// //         &lt;
// //       </Button>,
// //     )

// //     // Page numbers
// //     for (let i = startPage; i <= endPage; i++) {
// //       buttons.push(
// //         <Button key={i} variant={currentPage === i ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(i)}>
// //           {i}
// //         </Button>,
// //       )
// //     }

// //     // Next page
// //     buttons.push(
// //       <Button
// //         key="next"
// //         variant="outline"
// //         size="sm"
// //         onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
// //         disabled={currentPage === totalPages}
// //       >
// //         &gt;
// //       </Button>,
// //     )

// //     // Last page
// //     buttons.push(
// //       <Button
// //         key="last"
// //         variant="outline"
// //         size="sm"
// //         onClick={() => setCurrentPage(totalPages)}
// //         disabled={currentPage === totalPages}
// //       >
// //         Last
// //       </Button>,
// //     )

// //     return buttons
// //   }

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen">
// //         <div className="flex flex-col items-center">
// //           <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
// //           <p className="mt-4 text-lg text-gray-700">Loading attendance management...</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <AuthGuard requireAuth={true}>
// //       <div className="min-h-screen bg-gray-50">
// //         <Toaster position="top-right" />
// //         <header className="bg-white shadow">
// //           <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
// //             <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
// //               <div>
// //                 <h1 className="text-3xl font-bold tracking-tight text-gray-900">Attendance Management</h1>
// //                 <p className="mt-2 text-gray-600">{college?.name}</p>
// //               </div>

// //               <div className="flex gap-2">
// //                 <Link
// //                   href={`/college/${encodeURIComponent(decodedName)}/manage`}
// //                   className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
// //                 >
// //                   <ArrowLeft className="w-4 h-4 mr-2" />
// //                   Back to Management
// //                 </Link>
// //               </div>
// //             </div>
// //           </div>
// //         </header>

// //         <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
// //           <Card className="shadow-lg">
// //             <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
// //               <div className="flex items-center justify-between">
// //                 <div>
// //                   <CardTitle className="text-2xl font-bold text-gray-800">Attendance Tracker</CardTitle>
// //                   <CardDescription className="text-gray-600">
// //                     Upload, manage, and share attendance records
// //                   </CardDescription>
// //                 </div>
// //                 <div className="flex gap-2">
// //                   <input
// //                     type="file"
// //                     accept=".xlsx, .xls, .xlsb, .xlsm, .csv"
// //                     onChange={handleFileUpload}
// //                     className="hidden"
// //                     id="attendance-upload"
// //                   />
// //                   <Button onClick={() => document.getElementById("attendance-upload")?.click()} variant="default">
// //                     <Upload className="w-4 h-4 mr-2" />
// //                     Upload Attendance Sheet
// //                   </Button>
// //                 </div>
// //               </div>
// //             </CardHeader>

// //             <CardContent className="p-4">
// //               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
// //                 <TabsList className="grid w-full grid-cols-2 mb-4">
// //                   <TabsTrigger value="upload">Upload & Process</TabsTrigger>
// //                   <TabsTrigger value="records">Attendance Records</TabsTrigger>
// //                 </TabsList>

// //                 <TabsContent value="upload" className="w-full">
// //                   {uploadLoading ? (
// //                     <div className="flex flex-col items-center justify-center p-8">
// //                       <Progress value={progress} className="w-full max-w-md mb-4" />
// //                       <p className="text-gray-600">Processing {fileName}...</p>
// //                     </div>
// //                   ) : (
// //                     <>
// //                       {data && data.length > 0 ? (
// //                         <div className="space-y-6">
// //                           {!mappingComplete ? (
// //                             <div className="p-4 bg-blue-50 rounded-lg">
// //                               <h3 className="mb-4 text-lg font-medium text-blue-800">Map Attendance Data</h3>
// //                               <div className="grid gap-4 md:grid-cols-2">
// //                                 <div>
// //                                   <label className="block mb-2 text-sm font-medium text-gray-700">Subject Name</label>
// //                                   <Input
// //                                     value={subjectName}
// //                                     onChange={(e) => setSubjectName(e.target.value)}
// //                                     placeholder="e.g. Mathematics, Computer Science"
// //                                     className="w-full"
// //                                   />
// //                                 </div>
// //                                 <div>
// //                                   <label className="block mb-2 text-sm font-medium text-gray-700">
// //                                     Attendance Date
// //                                   </label>
// //                                   <Input
// //                                     type="date"
// //                                     value={attendanceDate}
// //                                     onChange={(e) => setAttendanceDate(e.target.value)}
// //                                     className="w-full"
// //                                   />
// //                                 </div>
// //                                 <div>
// //                                   <label className="block mb-2 text-sm font-medium text-gray-700">
// //                                     Enrollment Number Column
// //                                   </label>
// //                                   <Select value={enrollmentColumn} onValueChange={setEnrollmentColumn}>
// //                                     <SelectTrigger>
// //                                       <SelectValue placeholder="Select column" />
// //                                     </SelectTrigger>
// //                                     <SelectContent>
// //                                       {headers.map((header, index) => (
// //                                         <SelectItem key={index} value={header}>
// //                                           {header}
// //                                         </SelectItem>
// //                                       ))}
// //                                     </SelectContent>
// //                                   </Select>
// //                                 </div>
// //                                 <div>
// //                                   <label className="block mb-2 text-sm font-medium text-gray-700">
// //                                     Student Name Column
// //                                   </label>
// //                                   <Select value={nameColumn} onValueChange={setNameColumn}>
// //                                     <SelectTrigger>
// //                                       <SelectValue placeholder="Select column" />
// //                                     </SelectTrigger>
// //                                     <SelectContent>
// //                                       {headers.map((header, index) => (
// //                                         <SelectItem key={index} value={header}>
// //                                           {header}
// //                                         </SelectItem>
// //                                       ))}
// //                                     </SelectContent>
// //                                   </Select>
// //                                 </div>
// //                                 <div>
// //                                   <label className="block mb-2 text-sm font-medium text-gray-700">
// //                                     Attendance Status Column
// //                                   </label>
// //                                   <Select value={statusColumn} onValueChange={setStatusColumn}>
// //                                     <SelectTrigger>
// //                                       <SelectValue placeholder="Select column" />
// //                                     </SelectTrigger>
// //                                     <SelectContent>
// //                                       {headers.map((header, index) => (
// //                                         <SelectItem key={index} value={header}>
// //                                           {header}
// //                                         </SelectItem>
// //                                       ))}
// //                                     </SelectContent>
// //                                   </Select>
// //                                 </div>
// //                                 <div className="flex items-end">
// //                                   <Button onClick={processAttendanceData} className="w-full">
// //                                     Process Attendance Data
// //                                   </Button>
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           ) : (
// //                             <div className="space-y-4">
// //                               <div className="p-4 bg-green-50 rounded-lg">
// //                                 <div className="flex items-center justify-between">
// //                                   <h3 className="text-lg font-medium text-green-800">Attendance Data Ready</h3>
// //                                   <Button onClick={() => setMappingComplete(false)} variant="outline" size="sm">
// //                                     Edit Mapping
// //                                   </Button>
// //                                 </div>
// //                                 <div className="grid gap-2 mt-3 md:grid-cols-3">
// //                                   <div className="p-2 bg-white rounded-md">
// //                                     <span className="text-sm font-medium text-gray-500">Subject:</span>
// //                                     <p className="font-medium">{subjectName}</p>
// //                                   </div>
// //                                   <div className="p-2 bg-white rounded-md">
// //                                     <span className="text-sm font-medium text-gray-500">Date:</span>
// //                                     <p className="font-medium">{attendanceDate}</p>
// //                                   </div>
// //                                   <div className="p-2 bg-white rounded-md">
// //                                     <span className="text-sm font-medium text-gray-500">Records:</span>
// //                                     <p className="font-medium">{processedData.length} students</p>
// //                                   </div>
// //                                 </div>
// //                                 <Button onClick={saveAttendanceRecord} className="mt-4" disabled={uploadLoading}>
// //                                   {uploadLoading ? "Saving..." : "Save Attendance Record"}
// //                                 </Button>
// //                               </div>

// //                               <div className="border rounded-lg overflow-hidden">
// //                                 <Table>
// //                                   <TableHeader>
// //                                     <TableRow>
// //                                       <TableHead>Enrollment Number</TableHead>
// //                                       <TableHead>Student Name</TableHead>
// //                                       <TableHead>Attendance Status</TableHead>
// //                                     </TableRow>
// //                                   </TableHeader>
// //                                   <TableBody>
// //                                     {processedData.map((row, index) => (
// //                                       <TableRow key={index}>
// //                                         <TableCell>{row.enrollmentNumber}</TableCell>
// //                                         <TableCell>{row.studentName}</TableCell>
// //                                         <TableCell>
// //                                           <Badge
// //                                             className={
// //                                               row.status === "Present"
// //                                                 ? "bg-green-100 text-green-800"
// //                                                 : row.status === "Absent"
// //                                                   ? "bg-red-100 text-red-800"
// //                                                   : row.status === "Good Standing"
// //                                                     ? "bg-blue-100 text-blue-800"
// //                                                     : row.status === "Warning"
// //                                                       ? "bg-yellow-100 text-yellow-800"
// //                                                       : row.status === "Critical"
// //                                                         ? "bg-red-100 text-red-800"
// //                                                         : "bg-gray-100 text-gray-800"
// //                                             }
// //                                           >
// //                                             {row.status}
// //                                           </Badge>
// //                                         </TableCell>
// //                                       </TableRow>
// //                                     ))}
// //                                   </TableBody>
// //                                 </Table>
// //                               </div>
// //                             </div>
// //                           )}

// //                           {!mappingComplete && (
// //                             <div className="space-y-4">
// //                               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //                                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
// //                                   {availableSheets.length > 0 && (
// //                                     <Select value={selectedSheet} onValueChange={handleSheetChange}>
// //                                       <SelectTrigger className="w-48">
// //                                         <SelectValue placeholder="Select Sheet" />
// //                                       </SelectTrigger>
// //                                       <SelectContent>
// //                                         {availableSheets.map((sheet) => (
// //                                           <SelectItem key={sheet} value={sheet}>
// //                                             {sheet}
// //                                           </SelectItem>
// //                                         ))}
// //                                       </SelectContent>
// //                                     </Select>
// //                                   )}

// //                                   <div className="relative">
// //                                     <input
// //                                       type="text"
// //                                       placeholder="Search..."
// //                                       className="pl-10 py-2 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
// //                                       value={searchQuery}
// //                                       onChange={(e) => handleSearch(e.target.value)}
// //                                     />
// //                                     <svg
// //                                       xmlns="http://www.w3.org/2000/svg"
// //                                       className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
// //                                       fill="none"
// //                                       viewBox="0 0 24 24"
// //                                       stroke="currentColor"
// //                                     >
// //                                       <path
// //                                         strokeLinecap="round"
// //                                         strokeLinejoin="round"
// //                                         strokeWidth={2}
// //                                         d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
// //                                       />
// //                                     </svg>
// //                                   </div>
// //                                 </div>

// //                                 <Select
// //                                   value={rowsPerPage.toString()}
// //                                   onValueChange={(value) => setRowsPerPage(Number(value))}
// //                                 >
// //                                   <SelectTrigger className="w-32">
// //                                     <SelectValue placeholder="Rows per page" />
// //                                   </SelectTrigger>
// //                                   <SelectContent>
// //                                     <SelectItem value="25">25 rows</SelectItem>
// //                                     <SelectItem value="50">50 rows</SelectItem>
// //                                     <SelectItem value="100">100 rows</SelectItem>
// //                                   </SelectContent>
// //                                 </Select>
// //                               </div>

// //                               <div className="border rounded-lg overflow-hidden">
// //                                 <div className="overflow-x-auto">
// //                                   <Table>
// //                                     <TableHeader>
// //                                       <TableRow>
// //                                         {headers.map((header, index) => (
// //                                           <TableHead key={index} className="bg-gray-50 font-semibold whitespace-nowrap">
// //                                             {header}
// //                                           </TableHead>
// //                                         ))}
// //                                       </TableRow>
// //                                     </TableHeader>
// //                                     <TableBody>
// //                                       {currentData.map((row, rowIndex) => (
// //                                         <TableRow key={rowIndex}>
// //                                           {row.map((cell: any, cellIndex: number) => (
// //                                             <TableCell key={cellIndex} className="whitespace-nowrap">
// //                                               {cell !== null ? String(cell) : ""}
// //                                             </TableCell>
// //                                           ))}
// //                                         </TableRow>
// //                                       ))}
// //                                     </TableBody>
// //                                   </Table>
// //                                 </div>
// //                               </div>

// //                               <div className="flex justify-between items-center mt-4">
// //                                 <div className="text-sm text-gray-600">
// //                                   Showing {startIndex + 1} - {endIndex} of {totalRows} rows
// //                                 </div>
// //                                 <div className="flex space-x-1">{paginationButtons()}</div>
// //                               </div>
// //                             </div>
// //                           )}
// //                         </div>
// //                       ) : (
// //                         <div className="flex flex-col items-center justify-center p-12 text-center">
// //                           <div className="bg-blue-50 p-6 rounded-lg mb-4 w-16 h-16 flex items-center justify-center">
// //                             <FileSpreadsheet className="w-10 h-10 text-blue-500" />
// //                           </div>
// //                           <h3 className="text-xl font-semibold text-gray-800 mb-2">No Attendance Data</h3>
// //                           <p className="text-gray-600 max-w-md">
// //                             Upload an Excel file containing attendance records to get started. The system supports
// //                             .xlsx, .xls, and .csv files.
// //                           </p>
// //                           <Button
// //                             onClick={() => document.getElementById("attendance-upload")?.click()}
// //                             variant="default"
// //                             className="mt-4"
// //                           >
// //                             <Upload className="w-4 h-4 mr-2" />
// //                             Upload Attendance Sheet
// //                           </Button>
// //                         </div>
// //                       )}
// //                     </>
// //                   )}
// //                 </TabsContent>

// //                 <TabsContent value="records" className="w-full">
// //                   {attendanceRecords.length > 0 ? (
// //                     <div className="space-y-4">
// //                       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
// //                         {attendanceRecords.map((record) => (
// //                           <Card key={record.id} className="overflow-hidden">
// //                             <CardHeader className="p-4 bg-gray-50">
// //                               <div className="flex justify-between items-start">
// //                                 <div>
// //                                   <CardTitle className="text-lg">{record.subject}</CardTitle>
// //                                   <CardDescription>{record.date}</CardDescription>
// //                                 </div>
// //                                 <Badge variant={record.sentToStudents ? "outline" : "default"}>
// //                                   {record.sentToStudents ? "Sent to Students" : "Not Sent"}
// //                                 </Badge>
// //                               </div>
// //                             </CardHeader>
// //                             <CardContent className="p-4">
// //                               <div className="space-y-2">
// //                                 <div className="flex items-center justify-between text-sm">
// //                                   <span className="text-gray-500">File:</span>
// //                                   <span className="font-medium truncate max-w-[180px]">{record.fileName}</span>
// //                                 </div>
// //                                 <div className="flex items-center justify-between text-sm">
// //                                   <span className="text-gray-500">Records:</span>
// //                                   <span className="font-medium">{record.records.length} students</span>
// //                                 </div>
// //                                 <div className="flex items-center justify-between text-sm">
// //                                   <span className="text-gray-500">Uploaded:</span>
// //                                   <span className="font-medium flex items-center">
// //                                     <Clock className="w-3 h-3 mr-1" />
// //                                     {record.createdAt?.toDate?.().toLocaleString() || "Unknown"}
// //                                   </span>
// //                                 </div>
// //                               </div>
// //                             </CardContent>
// //                             <CardFooter className="p-4 bg-gray-50 flex justify-between">
// //                               <Button variant="outline" size="sm">
// //                                 <Download className="w-4 h-4 mr-1" />
// //                                 Export
// //                               </Button>
// //                               <Button
// //                                 variant={record.sentToStudents ? "outline" : "default"}
// //                                 size="sm"
// //                                 disabled={record.sentToStudents || sendingToStudents}
// //                                 onClick={() => sendToStudents(record.id || "")}
// //                               >
// //                                 {sendingToStudents ? (
// //                                   <>
// //                                     <span className="w-4 h-4 mr-1 border-t-2 border-b-2 border-current rounded-full animate-spin"></span>
// //                                     Sending...
// //                                   </>
// //                                 ) : (
// //                                   <>
// //                                     <Send className="w-4 h-4 mr-1" />
// //                                     {record.sentToStudents ? "Sent to Students" : "Send to Students"}
// //                                   </>
// //                                 )}
// //                               </Button>
// //                             </CardFooter>
// //                           </Card>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <div className="flex flex-col items-center justify-center p-12 text-center">
// //                       <div className="bg-blue-50 p-6 rounded-lg mb-4 w-16 h-16 flex items-center justify-center">
// //                         <FileSpreadsheet className="w-10 h-10 text-blue-500" />
// //                       </div>
// //                       <h3 className="text-xl font-semibold text-gray-800 mb-2">No Attendance Records</h3>
// //                       <p className="text-gray-600 max-w-md">
// //                         You haven't uploaded any attendance records yet. Upload an attendance sheet to get started.
// //                       </p>
// //                       <Button
// //                         onClick={() => {
// //                           setActiveTab("upload")
// //                           document.getElementById("attendance-upload")?.click()
// //                         }}
// //                         variant="default"
// //                         className="mt-4"
// //                       >
// //                         <Upload className="w-4 h-4 mr-2" />
// //                         Upload Attendance Sheet
// //                       </Button>
// //                     </div>
// //                   )}
// //                 </TabsContent>
// //               </Tabs>
// //             </CardContent>

// //             <CardFooter className="flex justify-between border-t py-3 px-6 bg-gray-50">
// //               <p className="text-sm text-gray-600">Attendance Management • {college?.name}</p>
// //               <p className="text-sm text-gray-600">{fileName && `Current file: ${fileName}`}</p>
// //             </CardFooter>
// //           </Card>
// //         </main>
// //       </div>
// //     </AuthGuard>
// //   )
// // }




// "use client"

// import { Button } from "@/components/ui/button"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { useAuth } from "@/context/AuthContext"
// import AuthGuard from "@/components/auth/AuthGuard"
// import { db } from "@/lib/firebase"
// import { collection, doc, getDocs, query, where, addDoc, updateDoc, serverTimestamp } from "firebase/firestore"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
// import { toast, Toaster } from "react-hot-toast"
// import * as XLSX from "xlsx"

// // Import components
// import { PageHeader } from "@/components/attendance/page-header"
// import { FileUpload } from "@/components/attendance/file-upload"
// import { ColumnMapper } from "@/components/attendance/column-mapper"
// import { ProcessedDataSummary } from "@/components/attendance/processed-data-summary"
// import { DataTable } from "@/components/attendance/data-table"
// import { RecordCard } from "@/components/attendance/record-card"
// import { ManualAttendanceForm } from "@/components/attendance/manual-attendance-form"

// type College = {
//   id: string
//   name: string
//   description: string
//   createdBy: string
//   students: string[]
//   teachers: string[]
// }

// type UserProfile = {
//   uid: string
//   displayName: string
//   email: string
//   role: string
//   username?: string
//   enrollmentNumber?: string
// }

// type AttendanceRecord = {
//   id?: string
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

// export default function TeacherAttendancePage() {
//   const { name } = useParams()
//   const { user, profile } = useAuth()
//   const router = useRouter()
//   const [college, setCollege] = useState<College | null>(null)
//   const [students, setStudents] = useState<UserProfile[]>([])
//   const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
//   const [loading, setLoading] = useState(true)
//   const [uploadLoading, setUploadLoading] = useState(false)
//   const [progress, setProgress] = useState(0)

//   // File upload states
//   const [data, setData] = useState<any[]>([])
//   const [headers, setHeaders] = useState<string[]>([])
//   const [fileName, setFileName] = useState("")
//   const [selectedSheet, setSelectedSheet] = useState("")
//   const [availableSheets, setAvailableSheets] = useState<string[]>([])
//   const [workbook, setWorkbook] = useState<any>(null)
//   const [rowsPerPage, setRowsPerPage] = useState(50)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filteredData, setFilteredData] = useState<any[]>([])
//   const [activeTab, setActiveTab] = useState("upload")

//   // Attendance mapping states
//   const [subjectName, setSubjectName] = useState("")
//   const [attendanceDate, setAttendanceDate] = useState("")
//   const [enrollmentColumn, setEnrollmentColumn] = useState("")
//   const [nameColumn, setNameColumn] = useState("")
//   const [statusColumn, setStatusColumn] = useState("")
//   const [mappingComplete, setMappingComplete] = useState(false)
//   const [processedData, setProcessedData] = useState<any[]>([])
//   const [sendingToStudents, setSendingToStudents] = useState(false)

//   const decodedName = decodeURIComponent(name as string)

//   useEffect(() => {
//     const fetchCollege = async () => {
//       try {
//         // Find the college by name
//         const collegeQuery = query(collection(db, "colleges"), where("name", "==", decodedName))
//         const collegeSnapshot = await getDocs(collegeQuery)

//         if (collegeSnapshot.empty) {
//           router.push("/colleges")
//           return
//         }

//         const collegeDoc = collegeSnapshot.docs[0]
//         const collegeData = collegeDoc.data() as Omit<College, "id">
//         const collegeWithId = { id: collegeDoc.id, ...collegeData } as College
//         setCollege(collegeWithId)

//         // Fetch students
//         await fetchStudents(collegeWithId.id, collegeWithId.students)

//         // Fetch attendance records
//         await fetchAttendanceRecords(collegeWithId.id)
//       } catch (error) {
//         console.error("Error fetching college:", error)
//         toast.error("Failed to load college data")
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (decodedName && user?.uid) {
//       fetchCollege()
//     }
//   }, [decodedName, user?.uid, router])

//   const fetchStudents = async (collegeId: string, studentIds: string[]) => {
//     try {
//       if (studentIds.length === 0) {
//         setStudents([])
//         return
//       }

//       // Fetch students details
//       const studentsQuery = query(
//         collection(db, "users"),
//         where("uid", "in", studentIds),
//         where("role", "==", "student"),
//       )

//       const studentsSnapshot = await getDocs(studentsQuery)
//       setStudents(studentsSnapshot.docs.map((doc) => doc.data() as UserProfile))
//     } catch (error) {
//       console.error("Error fetching students:", error)
//       toast.error("Failed to load student data")
//     }
//   }

//   const fetchAttendanceRecords = async (collegeId: string) => {
//     try {
//       const attendanceQuery = query(
//         collection(db, "attendance"),
//         where("collegeId", "==", collegeId),
//         where("uploadedBy", "==", user?.uid),
//       )

//       const attendanceSnapshot = await getDocs(attendanceQuery)
//       const records = attendanceSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as AttendanceRecord[]

//       // Sort by date (newest first)
//       records.sort((a, b) => {
//         return new Date(b.createdAt?.toDate?.() || 0).getTime() - new Date(a.createdAt?.toDate?.() || 0).getTime()
//       })

//       setAttendanceRecords(records)
//     } catch (error) {
//       console.error("Error fetching attendance records:", error)
//       toast.error("Failed to load attendance records")
//     }
//   }

//   const processFileInChunks = async (file: File) => {
//     setUploadLoading(true)
//     setProgress(0)

//     try {
//       return new Promise((resolve, reject) => {
//         const reader = new FileReader()

//         reader.onload = async (e) => {
//           try {
//             setProgress(40)
//             const arrayBuffer = e.target?.result as ArrayBuffer
//             const wb = XLSX.read(arrayBuffer, { type: "array", cellDates: true })
//             setWorkbook(wb)
//             setProgress(60)

//             // Get all sheet names
//             const sheetNames = wb.SheetNames
//             setAvailableSheets(sheetNames)

//             // Use first sheet as default
//             const sheetName = sheetNames[0]
//             setSelectedSheet(sheetName)

//             setProgress(80)

//             // Process selected sheet
//             await processSheet(wb, sheetName)
//             setProgress(100)

//             // Set today's date as default
//             const today = new Date()
//             const formattedDate = today.toISOString().split("T")[0]
//             setAttendanceDate(formattedDate)

//             resolve(null)
//           } catch (error) {
//             console.error("Error processing Excel file:", error)
//             reject(error)
//           }
//         }

//         reader.onerror = () => {
//           reject(new Error("Failed to read file"))
//         }

//         reader.readAsArrayBuffer(file)
//       })
//     } catch (error: any) {
//       toast.error("Failed to process file: " + error.message)
//     } finally {
//       setUploadLoading(false)
//     }
//   }

//   const processSheet = async (wb: any, sheetName: string) => {
//     // Get the worksheet
//     const worksheet = wb.Sheets[sheetName]

//     // Convert to JSON with headers
//     const jsonData = XLSX.utils.sheet_to_json(worksheet, {
//       header: 1,
//       defval: "", // Set default value for empty cells
//       raw: false, // Convert all data to strings
//       dateNF: "yyyy-mm-dd", // Format for dates
//     }) as any[]

//     if (jsonData.length === 0) {
//       toast.error("The selected sheet appears to be empty.")
//       return
//     }

//     // Find the real header row (skip empty rows at the top)
//     let headerRowIndex = 0
//     for (let i = 0; i < jsonData.length; i++) {
//       // Check if row has meaningful content and isn't just empty cells
//       if (jsonData[i].some((cell: any) => cell !== "")) {
//         const nonEmptyCells = jsonData[i].filter((cell: any) => cell !== "").length
//         // If the row has multiple non-empty cells, consider it as a potential header row
//         if (nonEmptyCells > 2) {
//           headerRowIndex = i
//           break
//         }
//       }
//     }

//     // Extract headers
//     const extractedHeaders = jsonData[headerRowIndex].map((header: any, idx: number) =>
//       header !== "" ? header : `Column ${idx + 1}`,
//     )

//     setHeaders(extractedHeaders)

//     // Extract data (rows after header)
//     const rows = jsonData.slice(headerRowIndex + 1).filter((row: any) => row.some((cell: any) => cell !== ""))

//     setData(rows)
//     setFilteredData(rows)

//     // Try to auto-detect columns
//     autoDetectColumns(extractedHeaders)

//     toast.success(`Loaded ${rows.length} rows from ${fileName}`)
//   }

//   const autoDetectColumns = (headers: string[]) => {
//     // Auto-detect enrollment number column
//     const enrollmentPatterns = ["enrollment", "roll", "id", "number", "no."]
//     const namePatterns = ["name", "student", "full name"]
//     const statusPatterns = ["status", "attendance", "present", "absent", "attend", "%", "percentage"]

//     let enrollmentIdx = -1
//     let nameIdx = -1
//     let statusIdx = -1

//     headers.forEach((header, idx) => {
//       const lowerHeader = header.toLowerCase()

//       // Check for enrollment patterns
//       if (enrollmentIdx === -1 && enrollmentPatterns.some((pattern) => lowerHeader.includes(pattern))) {
//         enrollmentIdx = idx
//       }

//       // Check for name patterns
//       if (nameIdx === -1 && namePatterns.some((pattern) => lowerHeader.includes(pattern))) {
//         nameIdx = idx
//       }

//       // Check for status patterns
//       if (statusIdx === -1 && statusPatterns.some((pattern) => lowerHeader.includes(pattern))) {
//         statusIdx = idx
//       }
//     })

//     if (enrollmentIdx !== -1) {
//       setEnrollmentColumn(headers[enrollmentIdx])
//     }

//     if (nameIdx !== -1) {
//       setNameColumn(headers[nameIdx])
//     }

//     if (statusIdx !== -1) {
//       setStatusColumn(headers[statusIdx])
//     }

//     // Try to detect subject from filename
//     const filenameParts = fileName.split(".")
//     if (filenameParts.length > 1) {
//       const nameWithoutExtension = filenameParts.slice(0, -1).join(".")
//       // Extract potential subject name
//       const subjectMatch = nameWithoutExtension.match(/([A-Za-z]+)/)
//       if (subjectMatch && subjectMatch[0].length > 2) {
//         setSubjectName(subjectMatch[0])
//       }
//     }
//   }

//   const handleFileUpload = async (file: File) => {
//     setFileName(file.name)
//     setActiveTab("upload")
//     setMappingComplete(false)

//     try {
//       await processFileInChunks(file)
//     } catch (error: any) {
//       toast.error("Failed to process file: " + error.message)
//     }
//   }

//   const handleSheetChange = async (value: string) => {
//     setSelectedSheet(value)
//     setUploadLoading(true)

//     try {
//       if (workbook) {
//         await processSheet(workbook, value)
//       } else {
//         toast.error("Workbook not available. Please reload the file.")
//       }
//     } catch (error: any) {
//       toast.error("Failed to change sheet: " + error.message)
//     } finally {
//       setUploadLoading(false)
//     }
//   }

//   const handleSearch = (query: string) => {
//     setSearchQuery(query)

//     if (!query.trim()) {
//       setFilteredData(data)
//       return
//     }

//     // Filter data based on search query
//     const filtered = data.filter((row: any[]) =>
//       row.some((cell: any) => cell?.toString().toLowerCase().includes(query.toLowerCase())),
//     )

//     setFilteredData(filtered)
//   }

//   const processAttendanceData = () => {
//     if (!enrollmentColumn || !nameColumn || !statusColumn || !subjectName || !attendanceDate) {
//       toast.error("Please complete all mapping fields before processing")
//       return
//     }

//     const enrollmentIdx = headers.indexOf(enrollmentColumn)
//     const nameIdx = headers.indexOf(nameColumn)
//     const statusIdx = headers.indexOf(statusColumn)

//     if (enrollmentIdx === -1 || nameIdx === -1 || statusIdx === -1) {
//       toast.error("Invalid column mapping")
//       return
//     }

//     // Process the data
//     const processed = data
//       .map((row) => {
//         const enrollmentNumber = row[enrollmentIdx]?.toString().trim()
//         const studentName = row[nameIdx]?.toString().trim()
//         let status = row[statusIdx]?.toString().trim()

//         // Normalize status
//         if (status.toLowerCase().includes("present") || status === "1" || status === "P" || status === "p") {
//           status = "Present"
//         } else if (status.toLowerCase().includes("absent") || status === "0" || status === "A" || status === "a") {
//           status = "Absent"
//         } else if (status.includes("%")) {
//           // It's a percentage, extract the number
//           const percentage = Number.parseFloat(status.replace("%", ""))
//           if (percentage >= 75) {
//             status = "Good Standing"
//           } else if (percentage >= 50) {
//             status = "Warning"
//           } else {
//             status = "Critical"
//           }
//         }

//         return {
//           enrollmentNumber,
//           studentName,
//           status,
//         }
//       })
//       .filter((item) => item.enrollmentNumber && item.studentName)

//     setProcessedData(processed)
//     setMappingComplete(true)
//     toast.success("Attendance data processed successfully")
//   }

//   const saveAttendanceRecord = async () => {
//     if (!college || !processedData.length || !subjectName || !attendanceDate) {
//       toast.error("Missing required data for saving attendance")
//       return
//     }

//     setUploadLoading(true)

//     try {
//       const attendanceData: Omit<AttendanceRecord, "id"> = {
//         collegeId: college.id,
//         uploadedBy: user?.uid || "",
//         uploadedByName: profile?.displayName || "Unknown",
//         fileName,
//         subject: subjectName,
//         date: attendanceDate,
//         createdAt: serverTimestamp(),
//         records: processedData,
//         sentToStudents: false,
//       }

//       // Save to Firestore
//       const docRef = await addDoc(collection(db, "attendance"), attendanceData)

//       // Update local state
//       const newRecord = {
//         id: docRef.id,
//         ...attendanceData,
//         createdAt: new Date(),
//       }

//       setAttendanceRecords((prev) => [newRecord, ...prev])

//       toast.success("Attendance record saved successfully")
//       setActiveTab("records")
//     } catch (error) {
//       console.error("Error saving attendance record:", error)
//       toast.error("Failed to save attendance record")
//     } finally {
//       setUploadLoading(false)
//     }
//   }

//   const saveManualAttendance = async (data: {
//     subject: string
//     date: string
//     records: Array<{
//       enrollmentNumber: string
//       studentName: string
//       status: string
//     }>
//   }) => {
//     if (!college) {
//       toast.error("College information not available")
//       return
//     }

//     setUploadLoading(true)

//     try {
//       const attendanceData: Omit<AttendanceRecord, "id"> = {
//         collegeId: college.id,
//         uploadedBy: user?.uid || "",
//         uploadedByName: profile?.displayName || "Unknown",
//         fileName: "Manual Entry",
//         subject: data.subject,
//         date: data.date,
//         createdAt: serverTimestamp(),
//         records: data.records,
//         sentToStudents: false,
//       }

//       // Save to Firestore
//       const docRef = await addDoc(collection(db, "attendance"), attendanceData)

//       // Update local state
//       const newRecord = {
//         id: docRef.id,
//         ...attendanceData,
//         createdAt: new Date(),
//       }

//       setAttendanceRecords((prev) => [newRecord, ...prev])

//       toast.success("Manual attendance record saved successfully")
//       setActiveTab("records")
//     } catch (error) {
//       console.error("Error saving manual attendance record:", error)
//       toast.error("Failed to save attendance record")
//     } finally {
//       setUploadLoading(false)
//     }
//   }

//   const sendToStudents = async (recordId: string) => {
//     if (!college) return

//     setSendingToStudents(true)

//     try {
//       // Find the record
//       const record = attendanceRecords.find((r) => r.id === recordId)
//       if (!record) {
//         toast.error("Attendance record not found")
//         return
//       }

//       // Get all students with enrollment numbers
//       const enrollmentMap = new Map()
//       students.forEach((student) => {
//         if (student.enrollmentNumber) {
//           enrollmentMap.set(student.enrollmentNumber, student.uid)
//         }
//       })

//       // Create notifications for each student
//       const matchedStudents = record.records.filter((r) => enrollmentMap.has(r.enrollmentNumber))

//       if (matchedStudents.length === 0) {
//         toast.error("No matching students found with the enrollment numbers in this record")
//         return
//       }

//       // Create notifications in batch
//       const notificationPromises = matchedStudents.map(async (studentRecord) => {
//         const studentId = enrollmentMap.get(studentRecord.enrollmentNumber)

//         if (!studentId) return null

//         // Create notification
//         return addDoc(collection(db, "notifications"), {
//           userId: studentId,
//           collegeId: college.id,
//           type: "attendance",
//           title: `Attendance Update: ${record.subject}`,
//           message: `Your attendance for ${record.subject} on ${record.date} has been recorded as: ${studentRecord.status}`,
//           data: {
//             recordId: record.id,
//             subject: record.subject,
//             date: record.date,
//             status: studentRecord.status,
//           },
//           read: false,
//           createdAt: serverTimestamp(),
//         })
//       })

//       await Promise.all(notificationPromises)

//       // Update the record as sent
//       await updateDoc(doc(db, "attendance", recordId), {
//         sentToStudents: true,
//       })

//       // Update local state
//       setAttendanceRecords((prev) => prev.map((r) => (r.id === recordId ? { ...r, sentToStudents: true } : r)))

//       toast.success(`Attendance notifications sent to ${matchedStudents.length} students`)
//     } catch (error) {
//       console.error("Error sending notifications:", error)
//       toast.error("Failed to send notifications to students")
//     } finally {
//       setSendingToStudents(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center">
//           <div className="w-12 h-12 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
//           <p className="mt-4 text-lg text-gray-700">Loading attendance management...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <AuthGuard requireAuth={true}>
//       <div className="min-h-screen bg-gray-50">
//         <Toaster position="top-right" />

//         <PageHeader
//           title="Attendance Management"
//           subtitle={college?.name}
//           backLink={{
//             href: `/college/${encodeURIComponent(decodedName)}/manage`,
//             label: "Back to Management",
//           }}
//         />

//         <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
//           <Card className="shadow-md">
//             <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800">Attendance Tracker</h2>
//                   <p className="text-sm text-gray-600">Upload, manage, and share attendance records</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <input
//                     type="file"
//                     accept=".xlsx, .xls, .xlsb, .xlsm, .csv"
//                     onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
//                     className="hidden"
//                     id="attendance-upload"
//                   />
//                   <Button onClick={() => document.getElementById("attendance-upload")?.click()}>
//                     Upload Attendance Sheet
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>

//             <CardContent className="p-4">
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-3 mb-4">
//                   <TabsTrigger value="upload">Upload & Process</TabsTrigger>
//                   <TabsTrigger value="manual">Manual Entry</TabsTrigger>
//                   <TabsTrigger value="records">Attendance Records</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="upload" className="w-full">
//                   {uploadLoading ? (
//                     <FileUpload
//                       onFileUpload={handleFileUpload}
//                       uploadLoading={uploadLoading}
//                       progress={progress}
//                       fileName={fileName}
//                     />
//                   ) : (
//                     <>
//                       {data && data.length > 0 ? (
//                         <div className="space-y-6">
//                           {!mappingComplete ? (
//                             <ColumnMapper
//                               headers={headers}
//                               subjectName={subjectName}
//                               setSubjectName={setSubjectName}
//                               attendanceDate={attendanceDate}
//                               setAttendanceDate={setAttendanceDate}
//                               enrollmentColumn={enrollmentColumn}
//                               setEnrollmentColumn={setEnrollmentColumn}
//                               nameColumn={nameColumn}
//                               setNameColumn={setNameColumn}
//                               statusColumn={statusColumn}
//                               setStatusColumn={setStatusColumn}
//                               onProcess={processAttendanceData}
//                             />
//                           ) : (
//                             <ProcessedDataSummary
//                               subjectName={subjectName}
//                               attendanceDate={attendanceDate}
//                               processedData={processedData}
//                               onEditMapping={() => setMappingComplete(false)}
//                               onSave={saveAttendanceRecord}
//                               isSaving={uploadLoading}
//                             />
//                           )}

//                           {!mappingComplete && (
//                             <DataTable
//                               headers={headers}
//                               data={filteredData}
//                               searchQuery={searchQuery}
//                               onSearch={handleSearch}
//                               rowsPerPage={rowsPerPage}
//                               setRowsPerPage={setRowsPerPage}
//                               selectedSheet={selectedSheet}
//                               availableSheets={availableSheets}
//                               onSheetChange={handleSheetChange}
//                             />
//                           )}
//                         </div>
//                       ) : (
//                         <FileUpload
//                           onFileUpload={handleFileUpload}
//                           uploadLoading={uploadLoading}
//                           progress={progress}
//                           fileName={fileName}
//                         />
//                       )}
//                     </>
//                   )}
//                 </TabsContent>

//                 <TabsContent value="manual" className="w-full">
//                   <ManualAttendanceForm
//                     students={students}
//                     onSaveAttendance={saveManualAttendance}
//                     isSaving={uploadLoading}
//                   />
//                 </TabsContent>

//                 <TabsContent value="records" className="w-full">
//                   {attendanceRecords.length > 0 ? (
//                     <div className="space-y-4">
//                       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                         {attendanceRecords.map((record) => (
//                           <RecordCard
//                             key={record.id}
//                             id={record.id || ""}
//                             subject={record.subject}
//                             date={record.date}
//                             fileName={record.fileName}
//                             recordCount={record.records.length}
//                             createdAt={record.createdAt?.toDate?.() || new Date()}
//                             sentToStudents={record.sentToStudents}
//                             onSendToStudents={sendToStudents}
//                             isSending={sendingToStudents}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center p-12 text-center">
//                       <div className="bg-gray-100 p-6 rounded-lg mb-4 w-16 h-16 flex items-center justify-center">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-10 w-10 text-gray-500"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                           />
//                         </svg>
//                       </div>
//                       <h3 className="text-xl font-semibold text-gray-800 mb-2">No Attendance Records</h3>
//                       <p className="text-gray-600 max-w-md">
//                         You haven't uploaded any attendance records yet. Upload an attendance sheet to get started.
//                       </p>
//                       <Button
//                         onClick={() => {
//                           setActiveTab("upload")
//                           document.getElementById("attendance-upload")?.click()
//                         }}
//                         className="mt-4"
//                       >
//                         Upload Attendance Sheet
//                       </Button>
//                     </div>
//                   )}
//                 </TabsContent>
//               </Tabs>
//             </CardContent>

//             <CardFooter className="flex justify-between border-t py-3 px-6 bg-gray-50">
//               <p className="text-sm text-gray-600">Attendance Management • {college?.name}</p>
//               <p className="text-sm text-gray-600">{fileName && `Current file: ${fileName}`}</p>
//             </CardFooter>
//           </Card>
//         </main>
//       </div>
//     </AuthGuard>
//   )
// }












"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import AuthGuard from "@/components/auth/AuthGuard"
import { db } from "@/lib/firebase"
import { collection, doc, getDocs, query, where, addDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { toast, Toaster } from "react-hot-toast"
import * as XLSX from "xlsx"
import { FileSpreadsheet, Upload } from "lucide-react"

// Import components
import { PageHeader } from "@/components/attendance/page-header"
import { FileUpload } from "@/components/attendance/file-upload"
import { ColumnMapper } from "@/components/attendance/column-mapper"
import { ProcessedDataSummary } from "@/components/attendance/processed-data-summary"
import { DataTable } from "@/components/attendance/data-table"
import { RecordCard } from "@/components/attendance/record-card"
import { ManualAttendanceForm } from "@/components/attendance/manual-attendance-form"
import { BulkAttendanceProcessor } from "@/components/attendance/bulk-attendance-processor"

type College = {
  id: string
  name: string
  description: string
  createdBy: string
  students: string[]
  teachers: string[]
}

type UserProfile = {
  uid: string
  displayName: string
  email: string
  role: string
  username?: string
  enrollmentNumber?: string
}

type AttendanceRecord = {
  id?: string
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

export default function TeacherAttendancePage() {
  const { name } = useParams()
  const { user, profile } = useAuth()
  const router = useRouter()
  const [college, setCollege] = useState<College | null>(null)
  const [students, setStudents] = useState<UserProfile[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  // File upload states
  const [data, setData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [fileName, setFileName] = useState("")
  const [selectedSheet, setSelectedSheet] = useState("")
  const [availableSheets, setAvailableSheets] = useState<string[]>([])
  const [workbook, setWorkbook] = useState<any>(null)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("upload")

  // Attendance mapping states
  const [subjectName, setSubjectName] = useState("")
  const [attendanceDate, setAttendanceDate] = useState("")
  const [enrollmentColumn, setEnrollmentColumn] = useState("")
  const [nameColumn, setNameColumn] = useState("")
  const [statusColumn, setStatusColumn] = useState("")
  const [mappingComplete, setMappingComplete] = useState(false)
  const [processedData, setProcessedData] = useState<any[]>([])
  const [sendingToStudents, setSendingToStudents] = useState(false)

  const decodedName = decodeURIComponent(name as string)

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        // Find the college by name
        const collegeQuery = query(collection(db, "colleges"), where("name", "==", decodedName))
        const collegeSnapshot = await getDocs(collegeQuery)

        if (collegeSnapshot.empty) {
          router.push("/colleges")
          return
        }

        const collegeDoc = collegeSnapshot.docs[0]
        const collegeData = collegeDoc.data() as Omit<College, "id">
        const collegeWithId = { id: collegeDoc.id, ...collegeData } as College
        setCollege(collegeWithId)

        // Fetch students
        await fetchStudents(collegeWithId.id, collegeWithId.students)

        // Fetch attendance records
        await fetchAttendanceRecords(collegeWithId.id)
      } catch (error) {
        console.error("Error fetching college:", error)
        toast.error("Failed to load college data")
      } finally {
        setLoading(false)
      }
    }

    if (decodedName && user?.uid) {
      fetchCollege()
    }
  }, [decodedName, user?.uid, router])

  const fetchStudents = async (collegeId: string, studentIds: string[]) => {
    try {
      if (studentIds.length === 0) {
        setStudents([])
        return
      }

      // Fetch students details
      const studentsQuery = query(
        collection(db, "users"),
        where("uid", "in", studentIds),
        where("role", "==", "student"),
      )

      const studentsSnapshot = await getDocs(studentsQuery)
      setStudents(studentsSnapshot.docs.map((doc) => doc.data() as UserProfile))
    } catch (error) {
      console.error("Error fetching students:", error)
      toast.error("Failed to load student data")
    }
  }

  const fetchAttendanceRecords = async (collegeId: string) => {
    try {
      const attendanceQuery = query(
        collection(db, "attendance"),
        where("collegeId", "==", collegeId),
        where("uploadedBy", "==", user?.uid),
      )

      const attendanceSnapshot = await getDocs(attendanceQuery)
      const records = attendanceSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AttendanceRecord[]

      // Sort by date (newest first)
      records.sort((a, b) => {
        return new Date(b.createdAt?.toDate?.() || 0).getTime() - new Date(a.createdAt?.toDate?.() || 0).getTime()
      })

      setAttendanceRecords(records)
    } catch (error) {
      console.error("Error fetching attendance records:", error)
      toast.error("Failed to load attendance records")
    }
  }

  const processFileInChunks = async (file: File) => {
    setUploadLoading(true)
    setProgress(0)

    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = async (e) => {
          try {
            setProgress(40)
            const arrayBuffer = e.target?.result as ArrayBuffer
            const wb = XLSX.read(arrayBuffer, { type: "array", cellDates: true })
            setWorkbook(wb)
            setProgress(60)

            // Get all sheet names
            const sheetNames = wb.SheetNames
            setAvailableSheets(sheetNames)

            // Use first sheet as default
            const sheetName = sheetNames[0]
            setSelectedSheet(sheetName)

            setProgress(80)

            // Process selected sheet
            await processSheet(wb, sheetName)
            setProgress(100)

            // Set today's date as default
            const today = new Date()
            const formattedDate = today.toISOString().split("T")[0]
            setAttendanceDate(formattedDate)

            resolve(null)
          } catch (error) {
            console.error("Error processing Excel file:", error)
            reject(error)
          }
        }

        reader.onerror = () => {
          reject(new Error("Failed to read file"))
        }

        reader.readAsArrayBuffer(file)
      })
    } catch (error: any) {
      toast.error("Failed to process file: " + error.message)
    } finally {
      setUploadLoading(false)
    }
  }

  const processSheet = async (wb: any, sheetName: string) => {
    // Get the worksheet
    const worksheet = wb.Sheets[sheetName]

    // Convert to JSON with headers
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "", // Set default value for empty cells
      raw: false, // Convert all data to strings
      dateNF: "yyyy-mm-dd", // Format for dates
    }) as any[]

    if (jsonData.length === 0) {
      toast.error("The selected sheet appears to be empty.")
      return
    }

    // Find the real header row (skip empty rows at the top)
    let headerRowIndex = 0
    for (let i = 0; i < jsonData.length; i++) {
      // Check if row has meaningful content and isn't just empty cells
      if (jsonData[i].some((cell: any) => cell !== "")) {
        const nonEmptyCells = jsonData[i].filter((cell: any) => cell !== "").length
        // If the row has multiple non-empty cells, consider it as a potential header row
        if (nonEmptyCells > 2) {
          headerRowIndex = i
          break
        }
      }
    }

    // Extract headers
    const extractedHeaders = jsonData[headerRowIndex].map((header: any, idx: number) =>
      header !== "" ? header : `Column ${idx + 1}`,
    )

    setHeaders(extractedHeaders)

    // Extract data (rows after header)
    const rows = jsonData.slice(headerRowIndex + 1).filter((row: any) => row.some((cell: any) => cell !== ""))

    setData(rows)
    setFilteredData(rows)

    // Try to auto-detect columns
    autoDetectColumns(extractedHeaders)

    toast.success(`Loaded ${rows.length} rows from ${fileName}`)
  }

  const autoDetectColumns = (headers: string[]) => {
    // Auto-detect enrollment number column
    const enrollmentPatterns = ["enrollment", "roll", "id", "number", "no."]
    const namePatterns = ["name", "student", "full name"]
    const statusPatterns = ["status", "attendance", "present", "absent", "attend", "%", "percentage"]

    let enrollmentIdx = -1
    let nameIdx = -1
    let statusIdx = -1

    headers.forEach((header, idx) => {
      const lowerHeader = header.toLowerCase()

      // Check for enrollment patterns
      if (enrollmentIdx === -1 && enrollmentPatterns.some((pattern) => lowerHeader.includes(pattern))) {
        enrollmentIdx = idx
      }

      // Check for name patterns
      if (nameIdx === -1 && namePatterns.some((pattern) => lowerHeader.includes(pattern))) {
        nameIdx = idx
      }

      // Check for status patterns
      if (statusIdx === -1 && statusPatterns.some((pattern) => lowerHeader.includes(pattern))) {
        statusIdx = idx
      }
    })

    if (enrollmentIdx !== -1) {
      setEnrollmentColumn(headers[enrollmentIdx])
    }

    if (nameIdx !== -1) {
      setNameColumn(headers[nameIdx])
    }

    if (statusIdx !== -1) {
      setStatusColumn(headers[statusIdx])
    }

    // Try to detect subject from filename
    const filenameParts = fileName.split(".")
    if (filenameParts.length > 1) {
      const nameWithoutExtension = filenameParts.slice(0, -1).join(".")
      // Extract potential subject name
      const subjectMatch = nameWithoutExtension.match(/([A-Za-z]+)/)
      if (subjectMatch && subjectMatch[0].length > 2) {
        setSubjectName(subjectMatch[0])
      }
    }
  }

  const handleFileUpload = async (file: File) => {
    setFileName(file.name)
    setActiveTab("upload")
    setMappingComplete(false)

    try {
      await processFileInChunks(file)
    } catch (error: any) {
      toast.error("Failed to process file: " + error.message)
    }
  }

  const handleSheetChange = async (value: string) => {
    setSelectedSheet(value)
    setUploadLoading(true)

    try {
      if (workbook) {
        await processSheet(workbook, value)
      } else {
        toast.error("Workbook not available. Please reload the file.")
      }
    } catch (error: any) {
      toast.error("Failed to change sheet: " + error.message)
    } finally {
      setUploadLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setFilteredData(data)
      return
    }

    // Filter data based on search query
    const filtered = data.filter((row: any[]) =>
      row.some((cell: any) => cell?.toString().toLowerCase().includes(query.toLowerCase())),
    )

    setFilteredData(filtered)
  }

  const processAttendanceData = () => {
    if (!enrollmentColumn || !nameColumn || !statusColumn || !subjectName || !attendanceDate) {
      toast.error("Please complete all mapping fields before processing")
      return
    }

    const enrollmentIdx = headers.indexOf(enrollmentColumn)
    const nameIdx = headers.indexOf(nameColumn)
    const statusIdx = headers.indexOf(statusColumn)

    if (enrollmentIdx === -1 || nameIdx === -1 || statusIdx === -1) {
      toast.error("Invalid column mapping")
      return
    }

    // Process the data
    const processed = data
      .map((row) => {
        const enrollmentNumber = row[enrollmentIdx]?.toString().trim()
        const studentName = row[nameIdx]?.toString().trim()
        let status = row[statusIdx]?.toString().trim()

        // Normalize status
        if (status.toLowerCase().includes("present") || status === "1" || status === "P" || status === "p") {
          status = "Present"
        } else if (status.toLowerCase().includes("absent") || status === "0" || status === "A" || status === "a") {
          status = "Absent"
        } else if (status.includes("%")) {
          // It's a percentage, extract the number
          const percentage = Number.parseFloat(status.replace("%", ""))
          if (percentage >= 75) {
            status = "Good Standing"
          } else if (percentage >= 50) {
            status = "Warning"
          } else {
            status = "Critical"
          }
        }

        return {
          enrollmentNumber,
          studentName,
          status,
        }
      })
      .filter((item) => item.enrollmentNumber && item.studentName)

    setProcessedData(processed)
    setMappingComplete(true)
    toast.success("Attendance data processed successfully")
  }

  const saveAttendanceRecord = async () => {
    if (!college || !processedData.length || !subjectName || !attendanceDate) {
      toast.error("Missing required data for saving attendance")
      return
    }

    setUploadLoading(true)

    try {
      const attendanceData: Omit<AttendanceRecord, "id"> = {
        collegeId: college.id,
        uploadedBy: user?.uid || "",
        uploadedByName: profile?.displayName || "Unknown",
        fileName,
        subject: subjectName,
        date: attendanceDate,
        createdAt: serverTimestamp(),
        records: processedData,
        sentToStudents: false,
      }

      // Save to Firestore
      const docRef = await addDoc(collection(db, "attendance"), attendanceData)

      // Update local state
      const newRecord = {
        id: docRef.id,
        ...attendanceData,
        createdAt: new Date(),
      }

      setAttendanceRecords((prev) => [newRecord, ...prev])

      toast.success("Attendance record saved successfully")
      setActiveTab("records")
    } catch (error) {
      console.error("Error saving attendance record:", error)
      toast.error("Failed to save attendance record")
    } finally {
      setUploadLoading(false)
    }
  }

  const saveManualAttendance = async (data: {
    subject: string
    date: string
    records: Array<{
      enrollmentNumber: string
      studentName: string
      status: string
    }>
  }) => {
    if (!college) {
      toast.error("College information not available")
      return
    }

    setUploadLoading(true)

    try {
      const attendanceData: Omit<AttendanceRecord, "id"> = {
        collegeId: college.id,
        uploadedBy: user?.uid || "",
        uploadedByName: profile?.displayName || "Unknown",
        fileName: "Manual Entry",
        subject: data.subject,
        date: data.date,
        createdAt: serverTimestamp(),
        records: data.records,
        sentToStudents: false,
      }

      // Save to Firestore
      const docRef = await addDoc(collection(db, "attendance"), attendanceData)

      // Update local state
      const newRecord = {
        id: docRef.id,
        ...attendanceData,
        createdAt: new Date(),
      }

      setAttendanceRecords((prev) => [newRecord, ...prev])

      toast.success("Manual attendance record saved successfully")
      setActiveTab("records")
    } catch (error) {
      console.error("Error saving manual attendance record:", error)
      toast.error("Failed to save attendance record")
    } finally {
      setUploadLoading(false)
    }
  }

  const saveBulkAttendance = async (data: {
    subject: string
    dateColumns: {
      columnName: string
      date: string
    }[]
    records: Array<{
      enrollmentNumber: string
      studentName: string
      dateAttendance: Record<string, string>
    }>
  }) => {
    if (!college) {
      toast.error("College information not available")
      return
    }

    setUploadLoading(true)

    try {
      // Create a separate attendance record for each date
      const savePromises = data.dateColumns.map(async (dateCol) => {
        // Filter records for this date
        const dateRecords = data.records
          .map((student) => ({
            enrollmentNumber: student.enrollmentNumber,
            studentName: student.studentName || "Unknown",
            status: student.dateAttendance[dateCol.columnName] || "Not Recorded",
          }))
          .filter((record) => record.status !== "Not Recorded")

        if (dateRecords.length === 0) return null

        const attendanceData: Omit<AttendanceRecord, "id"> = {
          collegeId: college.id,
          uploadedBy: user?.uid || "",
          uploadedByName: profile?.displayName || "Unknown",
          fileName: `Bulk Upload - ${dateCol.columnName}`,
          subject: data.subject,
          date: dateCol.date,
          createdAt: serverTimestamp(),
          records: dateRecords,
          sentToStudents: false,
        }

        // Save to Firestore
        return addDoc(collection(db, "attendance"), attendanceData)
      })

      const results = await Promise.all(savePromises)
      const validResults = results.filter(Boolean)

      if (validResults.length > 0) {
        // Refresh attendance records
        await fetchAttendanceRecords(college.id)
        toast.success(`Successfully saved attendance for ${validResults.length} dates`)
        setActiveTab("records")
      } else {
        toast.error("No valid attendance records to save")
      }
    } catch (error) {
      console.error("Error saving bulk attendance records:", error)
      toast.error("Failed to save attendance records")
    } finally {
      setUploadLoading(false)
    }
  }

  const sendToStudents = async (recordId: string) => {
    if (!college) return

    setSendingToStudents(true)

    try {
      // Find the record
      const record = attendanceRecords.find((r) => r.id === recordId)
      if (!record) {
        toast.error("Attendance record not found")
        return
      }

      // Get all students with enrollment numbers
      const enrollmentMap = new Map()
      students.forEach((student) => {
        if (student.enrollmentNumber) {
          enrollmentMap.set(student.enrollmentNumber, student.uid)
        }
      })

      // Create notifications for each student
      const matchedStudents = record.records.filter((r) => enrollmentMap.has(r.enrollmentNumber))

      if (matchedStudents.length === 0) {
        toast.error("No matching students found with the enrollment numbers in this record")
        return
      }

      // Create notifications in batch
      const notificationPromises = matchedStudents.map(async (studentRecord) => {
        const studentId = enrollmentMap.get(studentRecord.enrollmentNumber)

        if (!studentId) return null

        // Create notification
        return addDoc(collection(db, "notifications"), {
          userId: studentId,
          collegeId: college.id,
          type: "attendance",
          title: `Attendance Update: ${record.subject}`,
          message: `Your attendance for ${record.subject} on ${record.date} has been recorded as: ${studentRecord.status}`,
          data: {
            recordId: record.id,
            subject: record.subject,
            date: record.date,
            status: studentRecord.status,
          },
          read: false,
          createdAt: serverTimestamp(),
        })
      })

      await Promise.all(notificationPromises)

      // Update the record as sent
      await updateDoc(doc(db, "attendance", recordId), {
        sentToStudents: true,
      })

      // Update local state
      setAttendanceRecords((prev) => prev.map((r) => (r.id === recordId ? { ...r, sentToStudents: true } : r)))

      toast.success(`Attendance notifications sent to ${matchedStudents.length} students`)
    } catch (error) {
      console.error("Error sending notifications:", error)
      toast.error("Failed to send notifications to students")
    } finally {
      setSendingToStudents(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading attendance management...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />

        <PageHeader
          title="Attendance Management"
          subtitle={college?.name}
          backLink={{
            href: `/college/${encodeURIComponent(decodedName)}/manage`,
            label: "Back to Management",
          }}
        />

        <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Attendance Tracker</h2>
                  <p className="text-sm text-gray-600">Upload, manage, and share attendance records</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".xlsx, .xls, .xlsb, .xlsm, .csv"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="attendance-upload"
                  />
                  <Button onClick={() => document.getElementById("attendance-upload")?.click()}>
                    Upload Attendance Sheet
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="upload">Upload & Process</TabsTrigger>
                  <TabsTrigger value="bulk">Multi-Date Upload</TabsTrigger>
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="records">Attendance Records</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="w-full">
                  {uploadLoading ? (
                    <FileUpload
                      onFileUpload={handleFileUpload}
                      uploadLoading={uploadLoading}
                      progress={progress}
                      fileName={fileName}
                    />
                  ) : (
                    <>
                      {data && data.length > 0 ? (
                        <div className="space-y-6">
                          {!mappingComplete ? (
                            <ColumnMapper
                              headers={headers}
                              subjectName={subjectName}
                              setSubjectName={setSubjectName}
                              attendanceDate={attendanceDate}
                              setAttendanceDate={setAttendanceDate}
                              enrollmentColumn={enrollmentColumn}
                              setEnrollmentColumn={setEnrollmentColumn}
                              nameColumn={nameColumn}
                              setNameColumn={setNameColumn}
                              statusColumn={statusColumn}
                              setStatusColumn={setStatusColumn}
                              onProcess={processAttendanceData}
                            />
                          ) : (
                            <ProcessedDataSummary
                              subjectName={subjectName}
                              attendanceDate={attendanceDate}
                              processedData={processedData}
                              onEditMapping={() => setMappingComplete(false)}
                              onSave={saveAttendanceRecord}
                              isSaving={uploadLoading}
                            />
                          )}

                          {!mappingComplete && (
                            <DataTable
                              headers={headers}
                              data={filteredData}
                              searchQuery={searchQuery}
                              onSearch={handleSearch}
                              rowsPerPage={rowsPerPage}
                              setRowsPerPage={setRowsPerPage}
                              selectedSheet={selectedSheet}
                              availableSheets={availableSheets}
                              onSheetChange={handleSheetChange}
                            />
                          )}
                        </div>
                      ) : (
                        <FileUpload
                          onFileUpload={handleFileUpload}
                          uploadLoading={uploadLoading}
                          progress={progress}
                          fileName={fileName}
                        />
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent value="bulk" className="w-full">
                  {data && data.length > 0 ? (
                    <BulkAttendanceProcessor
                      headers={headers}
                      data={data}
                      fileName={fileName}
                      onSaveBulkAttendance={saveBulkAttendance}
                      isSaving={uploadLoading}
                      uploadLoading={uploadLoading}
                      progress={progress}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                      <div className="bg-gray-100 p-6 rounded-lg mb-4 w-16 h-16 flex items-center justify-center">
                        <FileSpreadsheet className="w-10 h-10 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Multi-Date Attendance Upload</h3>
                      <p className="text-gray-600 max-w-md">
                        Upload a spreadsheet with multiple date columns to process attendance for several days at once.
                        Each column should represent a different date with attendance marked as 'p' for present or 'a'
                        for absent.
                      </p>
                      <Button
                        onClick={() => document.getElementById("attendance-upload")?.click()}
                        variant="default"
                        className="mt-4"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Multi-Date Sheet
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="manual" className="w-full">
                  <ManualAttendanceForm
                    students={students}
                    onSaveAttendance={saveManualAttendance}
                    isSaving={uploadLoading}
                  />
                </TabsContent>

                <TabsContent value="records" className="w-full">
                  {attendanceRecords.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {attendanceRecords.map((record) => (
                          <RecordCard
                            key={record.id}
                            id={record.id || ""}
                            subject={record.subject}
                            date={record.date}
                            fileName={record.fileName}
                            recordCount={record.records.length}
                            createdAt={record.createdAt?.toDate?.() || new Date()}
                            sentToStudents={record.sentToStudents}
                            onSendToStudents={sendToStudents}
                            isSending={sendingToStudents}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                      <div className="bg-gray-100 p-6 rounded-lg mb-4 w-16 h-16 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Attendance Records</h3>
                      <p className="text-gray-600 max-w-md">
                        You haven't uploaded any attendance records yet. Upload an attendance sheet to get started.
                      </p>
                      <Button
                        onClick={() => {
                          setActiveTab("upload")
                          document.getElementById("attendance-upload")?.click()
                        }}
                        className="mt-4"
                      >
                        Upload Attendance Sheet
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex justify-between border-t py-3 px-6 bg-gray-50">
              <p className="text-sm text-gray-600">Attendance Management • {college?.name}</p>
              <p className="text-sm text-gray-600">{fileName && `Current file: ${fileName}`}</p>
            </CardFooter>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}

