"use client"

import { useState } from "react"
import { Clock, Download, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface AttendanceRecordProps {
  id: string
  subject: string
  date: string
  fileName: string
  recordCount: number
  createdAt: Date | string
  sentToStudents: boolean
  onSendToStudents: (id: string) => Promise<void>
  isSending: boolean
}

export function RecordCard({
  id,
  subject,
  date,
  fileName,
  recordCount,
  createdAt,
  sentToStudents,
  onSendToStudents,
  isSending,
}: AttendanceRecordProps) {
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    setSending(true)
    await onSendToStudents(id)
    setSending(false)
  }

  const formattedDate = typeof createdAt === "string" ? createdAt : createdAt?.toLocaleString?.() || "Unknown"

  return (
    <Card className="h-full">
      <CardHeader className="p-4 bg-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{subject}</CardTitle>
            <CardDescription>{date}</CardDescription>
          </div>
          <Badge variant={sentToStudents ? "outline" : "default"}>
            {sentToStudents ? "Sent to Students" : "Not Sent"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">File:</span>
            <span className="font-medium truncate max-w-[180px]">{fileName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Records:</span>
            <span className="font-medium">{recordCount} students</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Uploaded:</span>
            <span className="font-medium flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formattedDate}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 flex justify-between">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
        <Button
          variant={sentToStudents ? "outline" : "default"}
          size="sm"
          disabled={sentToStudents || isSending || sending}
          onClick={handleSend}
        >
          {sending || isSending ? (
            <>
              <span className="w-4 h-4 mr-1 border-t-2 border-b-2 border-current rounded-full animate-spin"></span>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-1" />
              {sentToStudents ? "Sent" : "Send"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

