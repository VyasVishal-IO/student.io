import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/attendance/status-badge"
import { AlertTriangle, CheckCircle } from "lucide-react"

interface AttendanceStatsProps {
  percentage: number
  status: string
  attended: number
  total: number
  subjects?: number
}

export function AttendanceStats({ percentage, status, attended, total, subjects }: AttendanceStatsProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "bg-green-500"
    if (percentage >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "good standing":
        return <CheckCircle className="w-4 h-4 mr-1" />
      case "warning":
      case "critical":
        return <AlertTriangle className="w-4 h-4 mr-1" />
      default:
        return null
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case "good standing":
        return "Good attendance record"
      case "warning":
        return "Attendance needs improvement"
      case "critical":
        return "Critical attendance issues"
      default:
        return "No status available"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "good standing":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-500">Attendance Percentage</div>
        <div className="mt-1 text-2xl font-bold">{percentage.toFixed(1)}%</div>
        <Progress value={percentage} className="h-2 mt-2" indicatorClassName={getProgressColor(percentage)} />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-500">Status</div>
        <div className="flex items-center mt-1">
          <StatusBadge status={status} />
        </div>
        <div className="mt-2 text-sm flex items-center" className={getStatusColor(status)}>
          {getStatusIcon(status)}
          {getStatusMessage(status)}
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-500">Classes Attended</div>
        <div className="mt-1 text-2xl font-bold">{attended}</div>
        <div className="mt-2 text-sm text-gray-500">Out of {total} total classes</div>
      </div>

      {subjects !== undefined && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-500">Subject Count</div>
          <div className="mt-1 text-2xl font-bold">{subjects}</div>
          <div className="mt-2 text-sm text-gray-500">Active subjects with attendance records</div>
        </div>
      )}
    </div>
  )
}

