"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StatusBadge } from "@/components/attendance/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FileSpreadsheet, Calendar, Info, Check } from "lucide-react"
import { format } from "date-fns"

interface BulkAttendanceProcessorProps {
  headers: string[]
  data: any[]
  fileName: string
  onSaveBulkAttendance: (data: {
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
  }) => Promise<void>
  isSaving: boolean
  uploadLoading: boolean
  progress: number
}

export function BulkAttendanceProcessor({
  headers,
  data,
  fileName,
  onSaveBulkAttendance,
  isSaving,
  uploadLoading,
  progress,
}: BulkAttendanceProcessorProps) {
  const [subject, setSubject] = useState("")
  const [enrollmentColumn, setEnrollmentColumn] = useState("")
  const [nameColumn, setNameColumn] = useState("")
  const [dateColumns, setDateColumns] = useState<{ columnName: string; date: string }[]>([])
  const [activeTab, setActiveTab] = useState<string>("mapping")
  const [processedData, setProcessedData] = useState<any[]>([])
  const [previewDate, setPreviewDate] = useState<string>("")

  const detectDateColumns = () => {
    // Try to detect date columns based on header names
  // Try to detect date columns based on header names
const dateRegex = /^\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}$|^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/;

const possibleDateColumns = headers.filter(
  (header) =>
    dateRegex.test(header) || 
    header.toLowerCase().includes("date") || 
    /\d{2}[-/.]\d{2}[-/.]\d{2,4}/.test(header)
);


    // Format dates for each detected column
    const formattedDateColumns = possibleDateColumns.map((column) => {
      // Try to extract date from column name
      let dateStr = column

      // If column contains a date pattern, use it
      const dateMatch = column.match(/\d{2}[-/.]\d{2}[-/.]\d{2,4}|\d{4}[-/.]\d{2}[-/.]\d{2}/)
      if (dateMatch) {
        dateStr = dateMatch[0]
      }

      // Try to parse the date
      let parsedDate
      try {
        // Try different date formats
        if (dateStr.includes("-")) {
          const parts = dateStr.split("-")
          if (parts[0].length === 4) {
            // YYYY-MM-DD
            parsedDate = new Date(Number.parseInt(parts[0]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[2]))
          } else {
            // DD-MM-YYYY or MM-DD-YYYY
            parsedDate = new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[0]))
          }
        } else if (dateStr.includes("/")) {
          const parts = dateStr.split("/")
          if (parts[0].length === 4) {
            // YYYY/MM/DD
            parsedDate = new Date(Number.parseInt(parts[0]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[2]))
          } else {
            // DD/MM/YYYY or MM/DD/YYYY
            parsedDate = new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[0]))
          }
        } else {
          // Try to parse as ISO date
          parsedDate = new Date(dateStr)
        }

        // If valid date, format it as YYYY-MM-DD
        if (!isNaN(parsedDate.getTime())) {
          return {
            columnName: column,
            date: parsedDate.toISOString().split("T")[0],
          }
        }
      } catch (e) {
        // If parsing fails, use today's date
        const today = new Date()
        return {
          columnName: column,
          date: today.toISOString().split("T")[0],
        }
      }

      // Default to today if parsing fails
      const today = new Date()
      return {
        columnName: column,
        date: today.toISOString().split("T")[0],
      }
    })

    setDateColumns(formattedDateColumns)
    if (formattedDateColumns.length > 0) {
      setPreviewDate(formattedDateColumns[0].columnName)
    }
  }

  const autoDetectColumns = () => {
    // Auto-detect enrollment number column
    const enrollmentPatterns = ["enrollment", "roll", "id", "number", "no."]
    const namePatterns = ["name", "student", "full name"]

    let enrollmentIdx = -1
    let nameIdx = -1

    headers.forEach((header, idx) => {
      const lowerHeader = header.toLowerCase()

      // Check for enrollment patterns
      if (enrollmentIdx === -1 && enrollmentPatterns.some((pattern) => lowerHeader.includes(pattern))) {
        enrollmentIdx = idx
        setEnrollmentColumn(header)
      }

      // Check for name patterns
      if (nameIdx === -1 && namePatterns.some((pattern) => lowerHeader.includes(pattern))) {
        nameIdx = idx
        setNameColumn(header)
      }
    })

    // Try to detect subject from filename
    const filenameParts = fileName.split(".")
    if (filenameParts.length > 1) {
      const nameWithoutExtension = filenameParts.slice(0, -1).join(".")
      // Extract potential subject name
      const subjectMatch = nameWithoutExtension.match(/([A-Za-z]+)/)
      if (subjectMatch && subjectMatch[0].length > 2) {
        setSubject(subjectMatch[0])
      }
    }

    // Detect date columns
    detectDateColumns()
  }

  const processAttendanceData = () => {
    if (!enrollmentColumn || dateColumns.length === 0 || !subject) {
      return
    }

    const enrollmentIdx = headers.indexOf(enrollmentColumn)
    const nameIdx = headers.indexOf(nameColumn)

    if (enrollmentIdx === -1) {
      return
    }

    // Process the data
    const processed = data
      .map((row) => {
        const enrollmentNumber = row[enrollmentIdx]?.toString().trim()
        const studentName = nameIdx !== -1 ? row[nameIdx]?.toString().trim() : "Unknown"

        // Process attendance for each date column
        const dateAttendance: Record<string, string> = {}

        dateColumns.forEach(({ columnName }) => {
          const colIdx = headers.indexOf(columnName)
          if (colIdx !== -1) {
            let status = row[colIdx]?.toString().trim().toLowerCase() || ""

            // Normalize status
            if (status === "p" || status === "present" || status === "1") {
              status = "Present"
            } else if (status === "a" || status === "absent" || status === "0") {
              status = "Absent"
            } else if (status === "l" || status === "late") {
              status = "Late"
            } else if (status === "e" || status === "excused") {
              status = "Excused"
            } else if (status === "") {
              status = "Not Recorded"
            } else {
              status = "Present" // Default to present if unknown status
            }

            dateAttendance[columnName] = status
          }
        })

        return {
          enrollmentNumber,
          studentName,
          dateAttendance,
        }
      })
      .filter((item) => item.enrollmentNumber)

    setProcessedData(processed)
    setActiveTab("preview")
  }

  const handleSaveBulkAttendance = async () => {
    if (!subject || dateColumns.length === 0 || processedData.length === 0) {
      return
    }

    await onSaveBulkAttendance({
      subject,
      dateColumns,
      records: processedData,
    })
  }

  const updateDateForColumn = (columnName: string, date: string) => {
    setDateColumns((prev) => prev.map((col) => (col.columnName === columnName ? { ...col, date } : col)))
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-800"
      case "absent":
        return "bg-red-100 text-red-800"
      case "late":
        return "bg-yellow-100 text-yellow-800"
      case "excused":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (uploadLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Progress value={progress} className="w-full max-w-md mb-4" />
        <p className="text-gray-600">Processing {fileName}...</p>
      </div>
    )
  }

  if (headers.length === 0 || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <FileSpreadsheet className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Attendance Data</h3>
        <p className="text-gray-600 max-w-md mb-4">
          Upload a multi-date attendance sheet to get started. The file should contain columns for enrollment numbers
          and dates.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="mapping">Column Mapping</TabsTrigger>
          <TabsTrigger value="preview" disabled={processedData.length === 0}>
            Preview & Save
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mapping">
          <Card>
            <CardHeader>
              <CardTitle>Map Multi-Date Attendance Data</CardTitle>
              <CardDescription>
                Map columns from your spreadsheet to process attendance for multiple dates at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Subject Name</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Mathematics, Computer Science"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Enrollment Number Column</label>
                  <Select value={enrollmentColumn} onValueChange={setEnrollmentColumn}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((header, index) => (
                        <SelectItem key={index} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Student Name Column (Optional)</label>
                  <Select value={nameColumn} onValueChange={setNameColumn}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {headers.map((header, index) => (
                        <SelectItem key={index} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Button variant="outline" onClick={autoDetectColumns} className="mb-4">
                    Auto-Detect Columns
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Date Columns</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select the columns that contain attendance data for specific dates and set the correct date for each
                  column.
                </p>

                {headers.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Column Name</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Include</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {headers.map((header, index) => {
                          // Skip enrollment and name columns
                          if (header === enrollmentColumn || header === nameColumn) {
                            return null
                          }

                          const dateColumn = dateColumns.find((col) => col.columnName === header)
                          const isDateColumn = !!dateColumn

                          return (
                            <TableRow key={index}>
                              <TableCell>{header}</TableCell>
                              <TableCell>
                                <Input
                                  type="date"
                                  value={dateColumn?.date || ""}
                                  onChange={(e) => updateDateForColumn(header, e.target.value)}
                                  disabled={!isDateColumn}
                                  className="w-full"
                                />
                              </TableCell>
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={isDateColumn}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      // Add to date columns
                                      setDateColumns((prev) => [
                                        ...prev,
                                        {
                                          columnName: header,
                                          date: new Date().toISOString().split("T")[0],
                                        },
                                      ])
                                    } else {
                                      // Remove from date columns
                                      setDateColumns((prev) => prev.filter((col) => col.columnName !== header))
                                    }
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                />
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p>No columns available</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">{dateColumns.length} date columns selected</div>
              <Button
                onClick={processAttendanceData}
                disabled={!enrollmentColumn || dateColumns.length === 0 || !subject}
              >
                Process Attendance Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview Multi-Date Attendance</CardTitle>
              <CardDescription>Review the processed attendance data before saving</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-500">Subject:</span>
                  <p className="font-medium">{subject}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-500">Date Range:</span>
                  <p className="font-medium">
                    {dateColumns.length > 0 ? (
                      <>
                        {format(
                          new Date(
                            dateColumns.reduce((min, col) => (col.date < min ? col.date : min), dateColumns[0].date),
                          ),
                          "MMM d, yyyy",
                        )}
                        {" - "}
                        {format(
                          new Date(
                            dateColumns.reduce((max, col) => (col.date > max ? col.date : max), dateColumns[0].date),
                          ),
                          "MMM d, yyyy",
                        )}
                      </>
                    ) : (
                      "No dates selected"
                    )}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-500">Students:</span>
                  <p className="font-medium">{processedData.length} students</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Preview Date:</span>
                </div>
                <Select value={previewDate} onValueChange={setPreviewDate}>
                  <SelectTrigger className="w-full sm:w-auto">
                    <SelectValue placeholder="Select date to preview" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateColumns.map((col, idx) => (
                      <SelectItem key={idx} value={col.columnName}>
                        {col.columnName} ({col.date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Enrollment Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>
                        {previewDate ? (
                          <>
                            {previewDate} ({dateColumns.find((col) => col.columnName === previewDate)?.date})
                          </>
                        ) : (
                          "Attendance"
                        )}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedData.map((student, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{student.enrollmentNumber}</TableCell>
                        <TableCell>{student.studentName || "Unknown"}</TableCell>
                        <TableCell>
                          {previewDate && (
                            <StatusBadge status={student.dateAttendance[previewDate] || "Not Recorded"} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-gray-500" />
                  Attendance Summary
                </h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {dateColumns.map((col, idx) => {
                    // Calculate stats for this date
                    const present = processedData.filter(
                      (s) => s.dateAttendance[col.columnName]?.toLowerCase() === "present",
                    ).length
                    const absent = processedData.filter(
                      (s) => s.dateAttendance[col.columnName]?.toLowerCase() === "absent",
                    ).length
                    const other = processedData.length - present - absent

                    return (
                      <div key={idx} className="p-3 bg-white rounded-lg border">
                        <div className="text-sm font-medium">{col.columnName}</div>
                        <div className="text-xs text-gray-500">{col.date}</div>
                        <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Present: {present}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span>Absent: {absent}</span>
                          </div>
                          {other > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                              <span>Other: {other}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between">
              <Button variant="outline" onClick={() => setActiveTab("mapping")}>
                Back to Mapping
              </Button>
              <Button onClick={handleSaveBulkAttendance} disabled={isSaving} className="w-full sm:w-auto">
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 mr-2 border-t-2 border-b-2 border-current rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save All Attendance Records
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

