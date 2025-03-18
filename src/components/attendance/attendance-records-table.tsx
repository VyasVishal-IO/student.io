import { format, parseISO } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/attendance/status-badge"
import { Info } from "lucide-react"

interface StudentAttendance {
  id: string
  subject: string
  date: string
  status: string
  teacherName: string
  createdAt: Date
}

interface AttendanceRecordsTableProps {
  records: StudentAttendance[]
}

export function AttendanceRecordsTable({ records }: AttendanceRecordsTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Info className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-1">No Records Found</h3>
        <p className="text-gray-600 max-w-md">No attendance records match your current filters.</p>
      </div>
    )
  }

  return (
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
          {records.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{format(parseISO(record.date), "MMM d, yyyy")}</TableCell>
              <TableCell className="font-medium">{record.subject}</TableCell>
              <TableCell>{record.teacherName}</TableCell>
              <TableCell>
                <StatusBadge status={record.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

