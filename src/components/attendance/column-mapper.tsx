"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ColumnMapperProps {
  headers: string[]
  subjectName: string
  setSubjectName: (value: string) => void
  attendanceDate: string
  setAttendanceDate: (value: string) => void
  enrollmentColumn: string
  setEnrollmentColumn: (value: string) => void
  nameColumn: string
  setNameColumn: (value: string) => void
  statusColumn: string
  setStatusColumn: (value: string) => void
  onProcess: () => void
}

export function ColumnMapper({
  headers,
  subjectName,
  setSubjectName,
  attendanceDate,
  setAttendanceDate,
  enrollmentColumn,
  setEnrollmentColumn,
  nameColumn,
  setNameColumn,
  statusColumn,
  setStatusColumn,
  onProcess,
}: ColumnMapperProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="mb-4 text-lg font-medium text-gray-800">Map Attendance Data</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Subject Name</label>
          <Input
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="e.g. Mathematics, Computer Science"
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Attendance Date</label>
          <Input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
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
          <label className="block mb-2 text-sm font-medium text-gray-700">Student Name Column</label>
          <Select value={nameColumn} onValueChange={setNameColumn}>
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
          <label className="block mb-2 text-sm font-medium text-gray-700">Attendance Status Column</label>
          <Select value={statusColumn} onValueChange={setStatusColumn}>
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
        <div className="flex items-end">
          <Button onClick={onProcess} className="w-full">
            Process Attendance Data
          </Button>
        </div>
      </div>
    </div>
  )
}

