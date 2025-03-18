import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/attendance/status-badge"

interface SubjectSummary {
  subject: string
  totalClasses: number
  attendedClasses: number
  percentage: number
  status: string
}

interface SubjectSummaryTableProps {
  summaries: SubjectSummary[]
}

export function SubjectSummaryTable({ summaries }: SubjectSummaryTableProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "bg-green-500"
    if (percentage >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
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
          {summaries.map((summary, index) => (
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
                      indicatorClassName={getProgressColor(summary.percentage)}
                    />
                  </div>
                  <span>{summary.percentage}%</span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={summary.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

