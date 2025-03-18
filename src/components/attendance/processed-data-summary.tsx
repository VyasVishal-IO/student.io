"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/attendance/status-badge"

interface ProcessedRecord {
  enrollmentNumber: string
  studentName: string
  status: string
}

interface ProcessedDataSummaryProps {
  subjectName: string
  attendanceDate: string
  processedData: ProcessedRecord[]
  onEditMapping: () => void
  onSave: () => void
  isSaving: boolean
}

export function ProcessedDataSummary({
  subjectName,
  attendanceDate,
  processedData,
  onEditMapping,
  onSave,
  isSaving,
}: ProcessedDataSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">Attendance Data Ready</h3>
          <Button onClick={onEditMapping} variant="outline" size="sm">
            Edit Mapping
          </Button>
        </div>
        <div className="grid gap-2 mt-3 md:grid-cols-3">
          <div className="p-2 bg-white rounded-md">
            <span className="text-sm font-medium text-gray-500">Subject:</span>
            <p className="font-medium">{subjectName}</p>
          </div>
          <div className="p-2 bg-white rounded-md">
            <span className="text-sm font-medium text-gray-500">Date:</span>
            <p className="font-medium">{attendanceDate}</p>
          </div>
          <div className="p-2 bg-white rounded-md">
            <span className="text-sm font-medium text-gray-500">Records:</span>
            <p className="font-medium">{processedData.length} students</p>
          </div>
        </div>
        <Button onClick={onSave} className="mt-4" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Attendance Record"}
        </Button>
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
            {processedData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.enrollmentNumber}</TableCell>
                <TableCell>{row.studentName}</TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

