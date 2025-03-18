import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusType = "Present" | "Absent" | "Good Standing" | "Warning" | "Critical" | "Unknown" | string

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (status: StatusType) => {
    switch (status.toLowerCase()) {
      case "present":
      case "good standing":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "absent":
      case "critical":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "warning":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Badge variant="outline" className={cn(getStatusColor(status), "font-medium border-0", className)}>
      {status}
    </Badge>
  )
}

