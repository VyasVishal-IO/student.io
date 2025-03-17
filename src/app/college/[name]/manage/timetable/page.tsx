// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { useAuth } from "@/context/AuthContext"
// import AuthGuard from "@/components/auth/AuthGuard"
// import { db } from "@/lib/firebase"
// import { collection, doc, getDocs, query, where, addDoc, updateDoc, serverTimestamp } from "firebase/firestore"
// import Link from "next/link"
// import { ArrowLeft, Upload, Send, Download, Clock, Calendar } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Progress } from "@/components/ui/progress"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { toast, Toaster } from "react-hot-toast"
// import * as XLSX from "xlsx"

// type College = {
//   id: string
//   name: string
//   description: string
//   createdBy: string
//   students: string[]
//   teachers: string[]
// }

// type TimetableEntry = {
//   day: string
//   time: string
//   subject: string
//   teacher: string
//   room: string
//   batch?: string
// }

// type Timetable = {
//   id?: string
//   collegeId: string
//   uploadedBy: string
//   uploadedByName: string
//   fileName: string
//   title: string
//   semester: string
//   batch: string
//   createdAt: any
//   entries: TimetableEntry[]
//   published: boolean
// }

// export default function TimetableManagementPage() {
//   const { name } = useParams()
//   const { user, profile } = useAuth()
//   const router = useRouter()
//   const [college, setCollege] = useState<College | null>(null)
//   const [timetables, setTimetables] = useState<Timetable[]>([])
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
//   const [activeTab, setActiveTab] = useState("upload")

//   // Timetable mapping states
//   const [title, setTitle] = useState("")
//   const [semester, setSemester] = useState("")
//   const [batch, setBatch] = useState("")
//   const [dayColumn, setDayColumn] = useState("")
//   const [timeColumn, setTimeColumn] = useState("")
//   const [subjectColumn, setSubjectColumn] = useState("")
//   const [teacherColumn, setTeacherColumn] = useState("")
//   const [roomColumn, setRoomColumn] = useState("")
//   const [mappingComplete, setMappingComplete] = useState(false)
//   const [processedData, setProcessedData] = useState<TimetableEntry[]>([])
//   const [publishing, setPublishing] = useState(false)

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

//         // Fetch timetables
//         await fetchTimetables(collegeWithId.id)
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

//   const fetchTimetables = async (collegeId: string) => {
//     try {
//       const timetableQuery = query(
//         collection(db, "timetables"),
//         where("collegeId", "==", collegeId),
//         where("uploadedBy", "==", user?.uid),
//       )

//       const timetableSnapshot = await getDocs(timetableQuery)
//       const records = timetableSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Timetable[]

//       // Sort by date (newest first)
//       records.sort((a, b) => {
//         return new Date(b.createdAt?.toDate?.() || 0).getTime() - new Date(a.createdAt?.toDate?.() || 0).getTime()
//       })

//       setTimetables(records)
//     } catch (error) {
//       console.error("Error fetching timetables:", error)
//       toast.error("Failed to load timetable records")
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
//             const arrayBuffer = e.target.result as ArrayBuffer
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

//             // Try to extract title from filename
//             const filenameParts = fileName.split(".")
//             if (filenameParts.length > 1) {
//               const nameWithoutExtension = filenameParts.slice(0, -1).join(".")
//               setTitle(nameWithoutExtension)
//             }

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

//     // Try to auto-detect columns
//     autoDetectColumns(extractedHeaders)

//     toast.success(`Loaded ${rows.length} rows from ${fileName}`)
//   }

//   const autoDetectColumns = (headers: string[]) => {
//     // Auto-detect column patterns
//     const dayPatterns = ["day", "weekday"]
//     const timePatterns = ["time", "period", "hour"]
//     const subjectPatterns = ["subject", "course", "class"]
//     const teacherPatterns = ["teacher", "faculty", "professor", "instructor"]
//     const roomPatterns = ["room", "location", "venue", "hall"]

//     let dayIdx = -1
//     let timeIdx = -1
//     let subjectIdx = -1
//     let teacherIdx = -1
//     let roomIdx = -1

//     headers.forEach((header, idx) => {
//       const lowerHeader = header.toLowerCase()

//       // Check for day patterns
//       if (dayIdx === -1 && dayPatterns.some((pattern) => lowerHeader.includes(pattern))) {
//         dayIdx = idx
//       }

//       // Check for time patterns
//       if (timeIdx === -1 && timePatterns.some((pattern) => lowerHeader.includes(pattern))) {
//         timeIdx = idx
//       }

//       // Check for subject patterns
//       if (subjectIdx === -1 && subjectPatterns.some((pattern) => lowerHeader.includes(pattern))) {
//         subjectIdx = idx
//       }

//       // Check for teacher patterns
//       if (teacherIdx === -1 && teacherPatterns.some((pattern) => lowerHeader.includes(pattern))) {
//         teacherIdx = idx
//       }

//       // Check for room patterns
//       if (roomIdx === -1 && roomPatterns.some((pattern) => lowerHeader.includes(pattern))) {
//         roomIdx = idx
//       }
//     })

//     if (dayIdx !== -1) {
//       setDayColumn(headers[dayIdx])
//     }

//     if (timeIdx !== -1) {
//       setTimeColumn(headers[timeIdx])
//     }

//     if (subjectIdx !== -1) {
//       setSubjectColumn(headers[subjectIdx])
//     }

//     if (teacherIdx !== -1) {
//       setTeacherColumn(headers[teacherIdx])
//     }

//     if (roomIdx !== -1) {
//       setRoomColumn(headers[roomIdx])
//     }

//     // Try to detect semester and batch from filename
//     const filenameParts = fileName.split(".")
//     if (filenameParts.length > 1) {
//       const nameWithoutExtension = filenameParts.slice(0, -1).join(".")

//       // Look for semester pattern (e.g., "Sem 3", "Semester 4")
//       const semesterMatch = nameWithoutExtension.match(/sem(?:ester)?\s*(\d+)/i)
//       if (semesterMatch) {
//         setSemester(semesterMatch[1])
//       }

//       // Look for batch pattern (e.g., "2022-26", "Batch 2023")
//       const batchMatch = nameWithoutExtension.match(/(?:batch\s*)?(\d{4})(?:-\d{2,4})?/i)
//       if (batchMatch) {
//         setBatch(batchMatch[1])
//       }
//     }
//   }

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

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

//   const processTimetableData = () => {
//     if (!dayColumn || !timeColumn || !subjectColumn || !title || !semester || !batch) {
//       toast.error("Please complete all mapping fields before processing")
//       return
//     }

//     const dayIdx = headers.indexOf(dayColumn)
//     const timeIdx = headers.indexOf(timeColumn)
//     const subjectIdx = headers.indexOf(subjectColumn)
//     const teacherIdx = headers.indexOf(teacherColumn)
//     const roomIdx = headers.indexOf(roomColumn)

//     if (dayIdx === -1 || timeIdx === -1 || subjectIdx === -1) {
//       toast.error("Invalid column mapping for required fields")
//       return
//     }

//     // Process the data
//     const processed = data
//       .map((row) => {
//         const day = row[dayIdx]?.toString().trim()
//         const time = row[timeIdx]?.toString().trim()
//         const subject = row[subjectIdx]?.toString().trim()
//         const teacher = teacherIdx !== -1 ? row[teacherIdx]?.toString().trim() : ""
//         const room = roomIdx !== -1 ? row[roomIdx]?.toString().trim() : ""

//         return {
//           day,
//           time,
//           subject,
//           teacher,
//           room,
//           batch,
//         }
//       })
//       .filter((item) => item.day && item.time && item.subject)

//     setProcessedData(processed)
//     setMappingComplete(true)
//     toast.success("Timetable data processed successfully")
//   }

//   const saveTimetable = async () => {
//     if (!college || !processedData.length || !title || !semester || !batch) {
//       toast.error("Missing required data for saving timetable")
//       return
//     }

//     setUploadLoading(true)

//     try {
//       const timetableData: Omit<Timetable, "id"> = {
//         collegeId: college.id,
//         uploadedBy: user?.uid || "",
//         uploadedByName: profile?.displayName || "Unknown",
//         fileName,
//         title,
//         semester,
//         batch,
//         createdAt: serverTimestamp(),
//         entries: processedData,
//         published: false,
//       }

//       // Save to Firestore
//       const docRef = await addDoc(collection(db, "timetables"), timetableData)

//       // Update local state
//       const newTimetable = {
//         id: docRef.id,
//         ...timetableData,
//         createdAt: new Date(),
//       }

//       setTimetables((prev) => [newTimetable, ...prev])

//       toast.success("Timetable saved successfully")
//       setActiveTab("timetables")
//     } catch (error) {
//       console.error("Error saving timetable:", error)
//       toast.error("Failed to save timetable")
//     } finally {
//       setUploadLoading(false)
//     }
//   }

//   const publishTimetable = async (timetableId: string) => {
//     if (!college) return

//     setPublishing(true)

//     try {
//       // Update the timetable as published
//       await updateDoc(doc(db, "timetables", timetableId), {
//         published: true,
//       })

//       // Update local state
//       setTimetables((prev) => prev.map((t) => (t.id === timetableId ? { ...t, published: true } : t)))

//       toast.success("Timetable published successfully")
//     } catch (error) {
//       console.error("Error publishing timetable:", error)
//       toast.error("Failed to publish timetable")
//     } finally {
//       setPublishing(false)
//     }
//   }

//   // Group timetable entries by day for display
//   const groupTimetableByDay = (entries: TimetableEntry[]) => {
//     const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
//     const groupedByDay: Record<string, TimetableEntry[]> = {}

//     // Initialize days
//     days.forEach((day) => {
//       groupedByDay[day] = []
//     })

//     // Group entries by day
//     entries.forEach((entry) => {
//       const day = entry.day
//       if (!groupedByDay[day]) {
//         groupedByDay[day] = []
//       }
//       groupedByDay[day].push(entry)
//     })

//     // Sort entries by time within each day
//     Object.keys(groupedByDay).forEach((day) => {
//       groupedByDay[day].sort((a, b) => {
//         // Convert time to comparable format (assuming format like "9:00 AM")
//         const timeA = a.time
//         const timeB = b.time
//         return timeA.localeCompare(timeB)
//       })
//     })

//     return groupedByDay
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center">
//           <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
//           <p className="mt-4 text-lg text-gray-700">Loading timetable management...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <AuthGuard requireAuth={true}>
//       <div className="min-h-screen bg-gray-50">
//         <Toaster position="top-right" />
//         <header className="bg-white shadow">
//           <div className="px-4 py-4 sm:py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
//             <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Timetable Management</h1>
//                 <p className="mt-1 text-sm sm:text-base text-gray-600">{college?.name}</p>
//               </div>

//               <div className="flex gap-2">
//                 <Link
//                   href={`/college/${encodeURIComponent(decodedName)}/manage`}
//                   className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
//                 >
//                   <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
//                   <span className="hidden sm:inline">Back to Management</span>
//                   <span className="sm:hidden">Back</span>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="px-4 py-4 sm:py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
//           <Card className="shadow-lg">
//             <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 sm:p-6">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                 <div>
//                   <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">Timetable Manager</CardTitle>
//                   <CardDescription className="text-gray-600">Upload, manage, and share class schedules</CardDescription>
//                 </div>
//                 <div className="flex gap-2">
//                   <input
//                     type="file"
//                     accept=".xlsx, .xls, .xlsb, .xlsm, .csv"
//                     onChange={handleFileUpload}
//                     className="hidden"
//                     id="timetable-upload"
//                   />
//                   <Button
//                     onClick={() => document.getElementById("timetable-upload")?.click()}
//                     variant="default"
//                     className="w-full sm:w-auto"
//                   >
//                     <Upload className="w-4 h-4 mr-2" />
//                     <span className="hidden sm:inline">Upload Timetable</span>
//                     <span className="sm:hidden">Upload</span>
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>

//             <CardContent className="p-4">
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-2 mb-4">
//                   <TabsTrigger value="upload">Upload & Process</TabsTrigger>
//                   <TabsTrigger value="timetables">Saved Timetables</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="upload" className="w-full">
//                   {uploadLoading ? (
//                     <div className="flex flex-col items-center justify-center p-8">
//                       <Progress value={progress} className="w-full max-w-md mb-4" />
//                       <p className="text-gray-600">Processing {fileName}...</p>
//                     </div>
//                   ) : (
//                     <>
//                       {data && data.length > 0 ? (
//                         <div className="space-y-6">
//                           {!mappingComplete ? (
//                             <div className="p-4 bg-purple-50 rounded-lg">
//                               <h3 className="mb-4 text-lg font-medium text-purple-800">Map Timetable Data</h3>
//                               <div className="grid gap-4 md:grid-cols-2">
//                                 <div>
//                                   <label className="block mb-2 text-sm font-medium text-gray-700">
//                                     Timetable Title
//                                   </label>
//                                   <Input
//                                     value={title}
//                                     onChange={(e) => setTitle(e.target.value)}
//                                     placeholder="e.g. CSE Department Timetable"
//                                     className="w-full"
//                                   />
//                                 </div>
//                                 <div>
//                                   <label className="block mb-2 text-sm font-medium text-gray-700">Semester</label>
//                                   <Input
//                                     value={semester}
//                                     onChange={(e) => setSemester(e.target.value)}
//                                     placeholder="e.g. 3"
//                                     className="w-full"
//                                   />
//                                 </div>
//                                 <div>
//                                   <label className="block mb-2 text-sm font-medium text-gray-700">Batch</label>
//                                   <Input
//                                     value={batch}
//                                     onChange={(e) => setBatch(e.target.value)}
//                                     placeholder="e.g. 2022"
//                                     className="w-full"
//                                   />
//                                 </div>
//                                 <div>
//                                   <label className="block mb-2 text-sm font-medium text-gray-700">Day Column</label>
//                                   <Select value={dayColumn} onValueChange={setDayColumn}>
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Select column" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       {headers.map((header, index) => (
//                                         <SelectItem key={index} value={header || `column-${index}`}>
//                                           {header}
//                                         </SelectItem>
//                                       ))}
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                                 <div>
//                                   <label className="block mb-2 text-sm font-medium text-gray-700">Time Column</label>
//                                   <Select value={timeColumn} onValueChange={setTimeColumn}>
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Select column" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       {headers.map((header, index) => (
//                                         <SelectItem key={index} value={header || `column-${index}`}>
//                                           {header}
//                                         </SelectItem>
//                                       ))}
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                                 <div>
//                                   <label className="block mb-2 text-sm font-medium text-gray-700">Subject Column</label>
//                                   <Select value={subjectColumn} onValueChange={setSubjectColumn}>
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Select column" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       {headers.map((header, index) => (
//                                         <SelectItem key={index} value={header || `column-${index}`}>
//                                           {header}
//                                         </SelectItem>
//                                       ))}
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                                 <div>
//                                   <label className="block mb-2 text-sm font-medium text-gray-700">Teacher Column</label>
//                                   <Select value={teacherColumn} onValueChange={setTeacherColumn}>
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Select column" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectItem value="">Not Available</SelectItem>
//                                       {headers.map((header, index) => (
//                                         <SelectItem key={index} value={header || `column-${index}`}>
//                                           {header}
//                                         </SelectItem>
//                                       ))}
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                                 <div>
//                                   <label className="block mb-2 text-sm font-medium text-gray-700">Room Column</label>
//                                   <Select value={roomColumn} onValueChange={setRoomColumn}>
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Select column" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectItem value="">Not Available</SelectItem>
//                                       {headers.map((header, index) => (
//                                         <SelectItem key={index} value={header || `column-${index}`}>
//                                           {header}
//                                         </SelectItem>
//                                       ))}
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                                 <div className="md:col-span-2">
//                                   <Button onClick={processTimetableData} className="w-full sm:w-auto">
//                                     Process Timetable Data
//                                   </Button>
//                                 </div>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="space-y-4">
//                               <div className="p-4 bg-green-50 rounded-lg">
//                                 <div className="flex items-center justify-between">
//                                   <h3 className="text-lg font-medium text-green-800">Timetable Data Ready</h3>
//                                   <Button onClick={() => setMappingComplete(false)} variant="outline" size="sm">
//                                     Edit Mapping
//                                   </Button>
//                                 </div>
//                                 <div className="grid gap-2 mt-3 md:grid-cols-3">
//                                   <div className="p-2 bg-white rounded-md">
//                                     <span className="text-sm font-medium text-gray-500">Title:</span>
//                                     <p className="font-medium">{title}</p>
//                                   </div>
//                                   <div className="p-2 bg-white rounded-md">
//                                     <span className="text-sm font-medium text-gray-500">Semester:</span>
//                                     <p className="font-medium">{semester}</p>
//                                   </div>
//                                   <div className="p-2 bg-white rounded-md">
//                                     <span className="text-sm font-medium text-gray-500">Batch:</span>
//                                     <p className="font-medium">{batch}</p>
//                                   </div>
//                                 </div>
//                                 <Button
//                                   onClick={saveTimetable}
//                                   className="mt-4 w-full sm:w-auto"
//                                   disabled={uploadLoading}
//                                 >
//                                   {uploadLoading ? "Saving..." : "Save Timetable"}
//                                 </Button>
//                               </div>

//                               {/* Preview timetable */}
//                               <div className="border rounded-lg overflow-hidden">
//                                 <div className="p-4 bg-gray-50 border-b">
//                                   <h3 className="font-medium">Timetable Preview</h3>
//                                 </div>
//                                 <div className="overflow-x-auto">
//                                   <Table>
//                                     <TableHeader>
//                                       <TableRow>
//                                         <TableHead>Day</TableHead>
//                                         <TableHead>Time</TableHead>
//                                         <TableHead>Subject</TableHead>
//                                         {teacherColumn && <TableHead>Teacher</TableHead>}
//                                         {roomColumn && <TableHead>Room</TableHead>}
//                                       </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                       {processedData.map((entry, index) => (
//                                         <TableRow key={index}>
//                                           <TableCell>{entry.day}</TableCell>
//                                           <TableCell>{entry.time}</TableCell>
//                                           <TableCell>{entry.subject}</TableCell>
//                                           {teacherColumn && <TableCell>{entry.teacher}</TableCell>}
//                                           {roomColumn && <TableCell>{entry.room}</TableCell>}
//                                         </TableRow>
//                                       ))}
//                                     </TableBody>
//                                   </Table>
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
//                           <div className="bg-purple-50 p-6 rounded-lg mb-4 w-16 h-16 flex items-center justify-center">
//                             <Calendar className="w-10 h-10 text-purple-500" />
//                           </div>
//                           <h3 className="text-xl font-semibold text-gray-800 mb-2">No Timetable Data</h3>
//                           <p className="text-gray-600 max-w-md">
//                             Upload an Excel file containing timetable information to get started. The system supports
//                             .xlsx, .xls, and .csv files.
//                           </p>
//                           <Button
//                             onClick={() => document.getElementById("timetable-upload")?.click()}
//                             variant="default"
//                             className="mt-4"
//                           >
//                             <Upload className="w-4 h-4 mr-2" />
//                             Upload Timetable
//                           </Button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </TabsContent>

//                 <TabsContent value="timetables" className="w-full">
//                   {timetables.length > 0 ? (
//                     <div className="space-y-4">
//                       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                         {timetables.map((timetable) => (
//                           <Card key={timetable.id} className="overflow-hidden">
//                             <CardHeader className="p-4 bg-gray-50">
//                               <div className="flex justify-between items-start">
//                                 <div>
//                                   <CardTitle className="text-lg">{timetable.title}</CardTitle>
//                                   <CardDescription>
//                                     Semester {timetable.semester}, Batch {timetable.batch}
//                                   </CardDescription>
//                                 </div>
//                                 <Badge variant={timetable.published ? "outline" : "default"}>
//                                   {timetable.published ? "Published" : "Draft"}
//                                 </Badge>
//                               </div>
//                             </CardHeader>
//                             <CardContent className="p-4">
//                               <div className="space-y-2">
//                                 <div className="flex items-center justify-between text-sm">
//                                   <span className="text-gray-500">File:</span>
//                                   <span className="font-medium truncate max-w-[180px]">{timetable.fileName}</span>
//                                 </div>
//                                 <div className="flex items-center justify-between text-sm">
//                                   <span className="text-gray-500">Entries:</span>
//                                   <span className="font-medium">{timetable.entries.length} classes</span>
//                                 </div>
//                                 <div className="flex items-center justify-between text-sm">
//                                   <span className="text-gray-500">Created:</span>
//                                   <span className="font-medium flex items-center">
//                                     <Clock className="w-3 h-3 mr-1" />
//                                     {timetable.createdAt?.toDate?.().toLocaleString() || "Unknown"}
//                                   </span>
//                                 </div>
//                               </div>
//                             </CardContent>
//                             <CardFooter className="p-4 bg-gray-50 flex justify-between">
//                               <Button variant="outline" size="sm">
//                                 <Download className="w-4 h-4 mr-1" />
//                                 Export
//                               </Button>
//                               <Button
//                                 variant={timetable.published ? "outline" : "default"}
//                                 size="sm"
//                                 disabled={timetable.published || publishing}
//                                 onClick={() => publishTimetable(timetable.id || "")}
//                               >
//                                 {publishing ? (
//                                   <>
//                                     <span className="w-4 h-4 mr-1 border-t-2 border-b-2 border-current rounded-full animate-spin"></span>
//                                     Publishing...
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Send className="w-4 h-4 mr-1" />
//                                     {timetable.published ? "Published" : "Publish"}
//                                   </>
//                                 )}
//                               </Button>
//                             </CardFooter>
//                           </Card>
//                         ))}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
//                       <div className="bg-purple-50 p-6 rounded-lg mb-4 w-16 h-16 flex items-center justify-center">
//                         <Calendar className="w-10 h-10 text-purple-500" />
//                       </div>
//                       <h3 className="text-xl font-semibold text-gray-800 mb-2">No Timetables</h3>
//                       <p className="text-gray-600 max-w-md">
//                         You haven't uploaded any timetables yet. Upload a timetable to get started.
//                       </p>
//                       <Button
//                         onClick={() => {
//                           setActiveTab("upload")
//                           document.getElementById("timetable-upload")?.click()
//                         }}
//                         variant="default"
//                         className="mt-4"
//                       >
//                         <Upload className="w-4 h-4 mr-2" />
//                         Upload Timetable
//                       </Button>
//                     </div>
//                   )}
//                 </TabsContent>
//               </Tabs>
//             </CardContent>

//             <CardFooter className="flex justify-between border-t py-3 px-6 bg-gray-50">
//               <p className="text-sm text-gray-600">Timetable Management • {college?.name}</p>
//               <p className="text-sm text-gray-600">{fileName && `Current file: ${fileName}`}</p>
//             </CardFooter>
//           </Card>
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
import { collection, doc, getDocs, query, where, addDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import Link from "next/link"
import { ArrowLeft, Upload, Send, Download, Clock, Calendar, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast, Toaster } from "react-hot-toast"
import * as XLSX from "xlsx"
import { Skeleton } from "@/components/ui/skeleton"

// Type definitions
type College = {
  id: string
  name: string
  description: string
  createdBy: string
  students: string[]
  teachers: string[]
}

type TimetableEntry = {
  day: string
  time: string
  subject: string
  teacher: string
  room: string
  batch?: string
}

type Timetable = {
  id?: string
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

export default function TimetableManagementPage() {
  const { name } = useParams()
  const { user, profile } = useAuth()
  const router = useRouter()
  const [college, setCollege] = useState<College | null>(null)
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [publishingId, setPublishingId] = useState<string | null>(null)

  // File upload states
  const [data, setData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [fileName, setFileName] = useState("")
  const [selectedSheet, setSelectedSheet] = useState("")
  const [availableSheets, setAvailableSheets] = useState<string[]>([])
  const [workbook, setWorkbook] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("timetables")

  // Timetable mapping states
  const [title, setTitle] = useState("")
  const [semester, setSemester] = useState("")
  const [batch, setBatch] = useState("")
  const [dayColumn, setDayColumn] = useState("")
  const [timeColumn, setTimeColumn] = useState("")
  const [subjectColumn, setSubjectColumn] = useState("")
  const [teacherColumn, setTeacherColumn] = useState("")
  const [roomColumn, setRoomColumn] = useState("")
  const [mappingComplete, setMappingComplete] = useState(false)
  const [processedData, setProcessedData] = useState<TimetableEntry[]>([])

  const decodedName = decodeURIComponent(name as string)

  // Fetch college data and timetables
  useEffect(() => {
    const fetchCollege = async () => {
      try {
        if (!decodedName || !user?.uid) return
        
        // Find the college by name
        const collegeQuery = query(collection(db, "colleges"), where("name", "==", decodedName))
        const collegeSnapshot = await getDocs(collegeQuery)

        if (collegeSnapshot.empty) {
          toast.error("College not found")
          router.push("/colleges")
          return
        }

        const collegeDoc = collegeSnapshot.docs[0]
        const collegeData = collegeDoc.data() as Omit<College, "id">
        const collegeWithId = { id: collegeDoc.id, ...collegeData } as College
        setCollege(collegeWithId)

        // Fetch timetables
        await fetchTimetables(collegeWithId.id)
      } catch (error) {
        console.error("Error fetching college:", error)
        toast.error("Failed to load college data")
      } finally {
        setLoading(false)
      }
    }

    fetchCollege()
  }, [decodedName, user?.uid, router])

  // Fetch timetables from Firestore
  const fetchTimetables = async (collegeId: string) => {
    try {
      const timetableQuery = query(
        collection(db, "timetables"),
        where("collegeId", "==", collegeId),
        where("uploadedBy", "==", user?.uid),
      )

      const timetableSnapshot = await getDocs(timetableQuery)
      const records = timetableSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Timetable[]

      // Sort by date (newest first)
      records.sort((a, b) => {
        return new Date(b.createdAt?.toDate?.() || 0).getTime() - new Date(a.createdAt?.toDate?.() || 0).getTime()
      })

      setTimetables(records)
    } catch (error) {
      console.error("Error fetching timetables:", error)
      toast.error("Failed to load timetable records")
    }
  }

  // Process Excel file
  const processFileInChunks = async (file: File) => {
    setUploadLoading(true)
    setProgress(0)

    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = async (e) => {
          try {
            setProgress(30)
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

            // Try to extract title from filename
            const filenameParts = file.name.split(".")
            if (filenameParts.length > 1) {
              const nameWithoutExtension = filenameParts.slice(0, -1).join(".")
              setTitle(nameWithoutExtension)
            }

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

  // Process sheet data
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
    for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
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

    // Try to auto-detect columns
    autoDetectColumns(extractedHeaders)

    toast.success(`Loaded ${rows.length} rows from ${fileName}`)
  }

  // Auto-detect columns in the Excel file
  const autoDetectColumns = (headers: string[]) => {
    // Auto-detect column patterns
    const dayPatterns = ["day", "weekday"]
    const timePatterns = ["time", "period", "hour"]
    const subjectPatterns = ["subject", "course", "class"]
    const teacherPatterns = ["teacher", "faculty", "professor", "instructor"]
    const roomPatterns = ["room", "location", "venue", "hall"]

    let dayIdx = -1
    let timeIdx = -1
    let subjectIdx = -1
    let teacherIdx = -1
    let roomIdx = -1

    headers.forEach((header, idx) => {
      const lowerHeader = header.toLowerCase()

      // Check for day patterns
      if (dayIdx === -1 && dayPatterns.some((pattern) => lowerHeader.includes(pattern))) {
        dayIdx = idx
      }

      // Check for time patterns
      if (timeIdx === -1 && timePatterns.some((pattern) => lowerHeader.includes(pattern))) {
        timeIdx = idx
      }

      // Check for subject patterns
      if (subjectIdx === -1 && subjectPatterns.some((pattern) => lowerHeader.includes(pattern))) {
        subjectIdx = idx
      }

      // Check for teacher patterns
      if (teacherIdx === -1 && teacherPatterns.some((pattern) => lowerHeader.includes(pattern))) {
        teacherIdx = idx
      }

      // Check for room patterns
      if (roomIdx === -1 && roomPatterns.some((pattern) => lowerHeader.includes(pattern))) {
        roomIdx = idx
      }
    })

    if (dayIdx !== -1) {
      setDayColumn(headers[dayIdx])
    }

    if (timeIdx !== -1) {
      setTimeColumn(headers[timeIdx])
    }

    if (subjectIdx !== -1) {
      setSubjectColumn(headers[subjectIdx])
    }

    if (teacherIdx !== -1) {
      setTeacherColumn(headers[teacherIdx])
    }

    if (roomIdx !== -1) {
      setRoomColumn(headers[roomIdx])
    }

    // Try to detect semester and batch from filename
    const filenameParts = fileName.split(".")
    if (filenameParts.length > 1) {
      const nameWithoutExtension = filenameParts.slice(0, -1).join(".")

      // Look for semester pattern (e.g., "Sem 3", "Semester 4")
      const semesterMatch = nameWithoutExtension.match(/sem(?:ester)?\s*(\d+)/i)
      if (semesterMatch) {
        setSemester(semesterMatch[1])
      }

      // Look for batch pattern (e.g., "2022-26", "Batch 2023")
      const batchMatch = nameWithoutExtension.match(/(?:batch\s*)?(\d{4})(?:-\d{2,4})?/i)
      if (batchMatch) {
        setBatch(batchMatch[1])
      }
    }
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setActiveTab("upload")
    setMappingComplete(false)
    setProcessedData([])

    try {
      await processFileInChunks(file)
    } catch (error: any) {
      toast.error("Failed to process file: " + error.message)
    }
  }

  // Handle sheet change
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

  // Process timetable data
  const processTimetableData = () => {
    if (!dayColumn || !timeColumn || !subjectColumn || !title || !semester || !batch) {
      toast.error("Please complete all required mapping fields before processing")
      return
    }

    const dayIdx = headers.indexOf(dayColumn)
    const timeIdx = headers.indexOf(timeColumn)
    const subjectIdx = headers.indexOf(subjectColumn)
    const teacherIdx = headers.indexOf(teacherColumn)
    const roomIdx = headers.indexOf(roomColumn)

    if (dayIdx === -1 || timeIdx === -1 || subjectIdx === -1) {
      toast.error("Invalid column mapping for required fields")
      return
    }

    // Process the data
    const processed = data
      .map((row) => {
        const day = row[dayIdx]?.toString().trim()
        const time = row[timeIdx]?.toString().trim()
        const subject = row[subjectIdx]?.toString().trim()
        const teacher = teacherIdx !== -1 ? row[teacherIdx]?.toString().trim() : ""
        const room = roomIdx !== -1 ? row[roomIdx]?.toString().trim() : ""

        // Skip rows with empty essential data
        if (!day || !time || !subject) return null

        return {
          day,
          time,
          subject,
          teacher,
          room,
          batch,
        }
      })
      .filter(Boolean) as TimetableEntry[]

    if (processed.length === 0) {
      toast.error("No valid timetable entries found after processing")
      return
    }

    setProcessedData(processed)
    setMappingComplete(true)
    toast.success("Timetable data processed successfully")
  }

  // Save timetable
  // Save timetable
  const saveTimetable = async () => {
    if (!college || !processedData.length || !title || !semester || !batch) {
      toast.error("Missing required data for saving timetable")
      return
    }

    setUploadLoading(true)

    try {
      const timetableData: Omit<Timetable, "id"> = {
        collegeId: college.id,
        uploadedBy: user?.uid || "",
        uploadedByName: profile?.displayName || "Unknown",
        fileName,
        title,
        semester,
        batch,
        createdAt: serverTimestamp(),
        entries: processedData,
        published: false,
      }

      // Save to Firestore
      const docRef = await addDoc(collection(db, "timetables"), timetableData)

      // Update local state
      const newTimetable = {
        id: docRef.id,
        ...timetableData,
        createdAt: new Date(),
      }

      setTimetables((prev) => [newTimetable, ...prev])

      toast.success("Timetable saved successfully")
      setActiveTab("timetables")
      resetUploadState()
    } catch (error) {
      console.error("Error saving timetable:", error)
      toast.error("Failed to save timetable")
    } finally {
      setUploadLoading(false)
    }
  }

  // Reset upload state
  const resetUploadState = () => {
    setData([])
    setHeaders([])
    setFileName("")
    setSelectedSheet("")
    setAvailableSheets([])
    setWorkbook(null)
    setTitle("")
    setSemester("")
    setBatch("")
    setDayColumn("")
    setTimeColumn("")
    setSubjectColumn("")
    setTeacherColumn("")
    setRoomColumn("")
    setMappingComplete(false)
    setProcessedData([])
  }

  // Publish timetable
  const publishTimetable = async (timetableId: string) => {
    if (!college || !timetableId) return

    setPublishingId(timetableId)

    try {
      // Update the timetable as published
      await updateDoc(doc(db, "timetables", timetableId), {
        published: true,
      })

      // Update local state
      setTimetables((prev) => prev.map((t) => (t.id === timetableId ? { ...t, published: true } : t)))

      toast.success("Timetable published successfully")
    } catch (error) {
      console.error("Error publishing timetable:", error)
      toast.error("Failed to publish timetable")
    } finally {
      setPublishingId(null)
    }
  }

  // Export timetable as Excel
  const exportTimetable = (timetable: Timetable) => {
    try {
      // Convert timetable entries to worksheet data
      const headers = ["Day", "Time", "Subject", "Teacher", "Room"]
      const data = timetable.entries.map(entry => [
        entry.day,
        entry.time,
        entry.subject,
        entry.teacher,
        entry.room
      ])

      // Create workbook and worksheet
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Timetable")

      // Generate filename
      const exportFileName = `${timetable.title}_Sem${timetable.semester}_${timetable.batch}.xlsx`

      // Export to file
      XLSX.writeFile(workbook, exportFileName)
      toast.success("Timetable exported successfully")
    } catch (error) {
      console.error("Error exporting timetable:", error)
      toast.error("Failed to export timetable")
    }
  }

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown"
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date)
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-3"></div>
          <p className="text-lg text-gray-700">Loading timetable management...</p>
        </div>
      </div>
    )
  }

  // Empty state component
  const EmptyState = ({ 
    icon: Icon, 
    title, 
    description, 
    action 
  }: { 
    icon: React.ElementType,
    title: string, 
    description: string, 
    action: React.ReactNode 
  }) => (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center">
      <div className="bg-purple-50 p-5 rounded-full mb-4">
        <Icon className="w-8 h-8 text-purple-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mb-4">{description}</p>
      {action}
    </div>
  )

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 sm:py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Timetable Management</h1>
                <p className="text-sm text-gray-600">{college?.name}</p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/college/${encodeURIComponent(decodedName)}/manage`}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Back to Management</span>
                  <span className="sm:hidden">Back</span>
                </Link>
                <input
                  type="file"
                  accept=".xlsx, .xls, .xlsb, .xlsm, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="timetable-upload"
                />
                <Button
                  onClick={() => document.getElementById("timetable-upload")?.click()}
                  variant="default"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <Upload className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Upload Timetable</span>
                  <span className="sm:hidden">Upload</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-4 sm:py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Card className="shadow-sm">
            <CardHeader className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardTitle className="text-lg sm:text-xl text-gray-800">Timetable Manager</CardTitle>
              <CardDescription className="text-gray-600">
                Upload, manage, and share class schedules
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
                  <TabsTrigger value="timetables" className="rounded-none">Saved Timetables</TabsTrigger>
                  <TabsTrigger value="upload" className="rounded-none">Upload & Process</TabsTrigger>
                </TabsList>

                <div className="p-4">
                  <TabsContent value="upload" className="mt-0">
                    {uploadLoading ? (
                      <div className="flex flex-col items-center justify-center p-6">
                        <Progress value={progress} className="w-full max-w-md mb-4" />
                        <p className="text-gray-600">Processing {fileName}...</p>
                      </div>
                    ) : (
                      <>
                        {data.length > 0 ? (
                          <div className="space-y-5">
                            {!mappingComplete ? (
                              <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-base font-medium text-purple-800">Map Timetable Data</h3>
                                  {availableSheets.length > 1 && (
                                    <div className="flex items-center">
                                      <label className="text-sm font-medium text-gray-700 mr-2">Sheet:</label>
                                      <Select value={selectedSheet} onValueChange={handleSheetChange}>
                                        <SelectTrigger className="w-40 h-8 text-sm">
                                          <SelectValue placeholder="Select sheet" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {availableSheets.map((sheet) => (
                                            <SelectItem key={sheet} value={sheet}>
                                              {sheet}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                      Timetable Title <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                      value={title}
                                      onChange={(e) => setTitle(e.target.value)}
                                      placeholder="e.g. CSE Department Timetable"
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                      Semester <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                      value={semester}
                                      onChange={(e) => setSemester(e.target.value)}
                                      placeholder="e.g. 3"
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                      Batch <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                      value={batch}
                                      onChange={(e) => setBatch(e.target.value)}
                                      placeholder="e.g. 2022"
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                      Day Column <span className="text-red-500">*</span>
                                    </label>
                                    <Select value={dayColumn} onValueChange={setDayColumn}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select column" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {headers.map((header, index) => (
                                          <SelectItem key={index} value={header || `column-${index}`}>
                                            {header || `Column ${index + 1}`}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                      Time Column <span className="text-red-500">*</span>
                                    </label>
                                    <Select value={timeColumn} onValueChange={setTimeColumn}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select column" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {headers.map((header, index) => (
                                          <SelectItem key={index} value={header || `column-${index}`}>
                                            {header || `Column ${index + 1}`}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                      Subject Column <span className="text-red-500">*</span>
                                    </label>
                                    <Select value={subjectColumn} onValueChange={setSubjectColumn}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select column" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {headers.map((header, index) => (
                                          <SelectItem key={index} value={header || `column-${index}`}>
                                            {header || `Column ${index + 1}`}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                      Teacher Column
                                    </label>
                                    <Select value={teacherColumn} onValueChange={setTeacherColumn}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select column (optional)" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="">Not Available</SelectItem>
                                        {headers.map((header, index) => (
                                          <SelectItem key={index} value={header || `column-${index}`}>
                                            {header || `Column ${index + 1}`}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                  <label className="block mb-1 text-sm font-medium text-gray-700">
                                      Room Column
                                    </label>
                                    <Select value={roomColumn} onValueChange={setRoomColumn}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select column (optional)" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="">Not Available</SelectItem>
                                        {headers.map((header, index) => (
                                          <SelectItem key={index} value={header || `column-${index}`}>
                                            {header || `Column ${index + 1}`}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                  <Button
                                    onClick={processTimetableData}
                                    disabled={
                                      !dayColumn || !timeColumn || !subjectColumn || !title || !semester || !batch
                                    }
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                    Process Timetable
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-green-50 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-base font-medium text-green-800">Processed Timetable Data</h3>
                                  <Button
                                    onClick={saveTimetable}
                                    disabled={!mappingComplete || uploadLoading}
                                  >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Save Timetable
                                  </Button>
                                </div>
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Day</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead>Room</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {processedData.map((entry, index) => (
                                        <TableRow key={index}>
                                          <TableCell>{entry.day}</TableCell>
                                          <TableCell>{entry.time}</TableCell>
                                          <TableCell>{entry.subject}</TableCell>
                                          <TableCell>{entry.teacher}</TableCell>
                                          <TableCell>{entry.room}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <EmptyState
                            icon={FileSpreadsheet}
                            title="Upload a Timetable"
                            description="Upload an Excel file to start managing your timetable."
                            action={
                              <Button
                                onClick={() => document.getElementById("timetable-upload")?.click()}
                                variant="default"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload File
                              </Button>
                            }
                          />
                        )}
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="timetables" className="mt-0">
                    {timetables.length > 0 ? (
                      <div className="space-y-4">
                        {timetables.map((timetable) => (
                          <Card key={timetable.id} className="shadow-sm">
                            <CardHeader className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg font-semibold text-gray-800">
                                    {timetable.title}
                                  </CardTitle>
                                  <CardDescription className="text-gray-600">
                                    {timetable.semester} • Batch {timetable.batch}
                                  </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => exportTimetable(timetable)}
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                  </Button>
                                  {!timetable.published && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => publishTimetable(timetable.id!)}
                                      disabled={publishingId === timetable.id}
                                    >
                                      {publishingId === timetable.id ? (
                                        <>
                                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                                          Publishing...
                                        </>
                                      ) : (
                                        <>
                                          <Send className="w-4 h-4 mr-2" />
                                          Publish
                                        </>
                                      )}
                                    </Button>
                                  )}
                                  {timetable.published && (
                                    <Badge variant="success" className="px-3 py-1">
                                      Published
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="text-sm text-gray-600">
                                <p>Uploaded by: {timetable.uploadedByName}</p>
                                <p>Uploaded on: {formatDate(timetable.createdAt)}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Calendar}
                        title="No Timetables Found"
                        description="You haven't uploaded any timetables yet. Start by uploading one."
                        action={
                          <Button
                            onClick={() => document.getElementById("timetable-upload")?.click()}
                            variant="default"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Timetable
                          </Button>
                        }
                      />
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}