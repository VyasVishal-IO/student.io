"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/attendance/status-badge"

interface StudentProfile {
  uid: string
  displayName: string
  email: string
  enrollmentNumber?: string
}

interface ManualAttendanceFormProps {
  students: StudentProfile[]
  onSaveAttendance: (data: {
    subject: string
    date: string
    records: Array<{
      enrollmentNumber: string
      studentName: string
      status: string
    }>
  }) => Promise<void>
  isSaving: boolean
}

export function ManualAttendanceForm({ students, onSaveAttendance, isSaving }: ManualAttendanceFormProps) {
  const [subject, setSubject] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [studentAttendance, setStudentAttendance] = useState<Record<string, string>>(
    students.reduce(
      (acc, student) => {
        if (student.enrollmentNumber) {
          acc[student.enrollmentNumber] = "Present"
        }
        return acc
      },
      {} as Record<string, string>,
    ),
  )
  const [searchQuery, setSearchQuery] = useState("")

  const handleStatusChange = (enrollmentNumber: string, status: string) => {
    setStudentAttendance((prev) => ({
      ...prev,
      [enrollmentNumber]: status,
    }))
  }

  const handleSubmit = async () => {
    if (!subject || !date) return

    const records = Object.entries(studentAttendance).map(([enrollmentNumber, status]) => {
      const student = students.find((s) => s.enrollmentNumber === enrollmentNumber)
      return {
        enrollmentNumber,
        studentName: student?.displayName || "Unknown",
        status,
      }
    })

    await onSaveAttendance({
      subject,
      date,
      records,
    })

    // Reset form
    setSubject("")
    setDate(new Date().toISOString().split("T")[0])
  }

  const filteredStudents = students.filter((student) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      student.displayName?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.enrollmentNumber?.toLowerCase().includes(query)
    )
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Attendance Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject name"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Search Students</label>
          <Input
            type="text"
            placeholder="Search by name or enrollment number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enrollment Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Attendance Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) =>
                student.enrollmentNumber ? (
                  <TableRow key={student.uid}>
                    <TableCell>{student.enrollmentNumber}</TableCell>
                    <TableCell>{student.displayName}</TableCell>
                    <TableCell>
                      <Select
                        value={studentAttendance[student.enrollmentNumber] || "Present"}
                        onValueChange={(value) => handleStatusChange(student.enrollmentNumber!, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <StatusBadge status={studentAttendance[student.enrollmentNumber] || "Present"} />
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                          <SelectItem value="Late">Late</SelectItem>
                          <SelectItem value="Excused">Excused</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ) : null,
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isSaving || !subject || !date}>
          {isSaving ? "Saving..." : "Save Attendance"}
        </Button>
      </CardFooter>
    </Card>
  )
}

