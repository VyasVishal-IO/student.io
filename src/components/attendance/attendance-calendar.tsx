"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  subMonths,
  addMonths,
  parseISO,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { StatusBadge } from "@/components/attendance/status-badge"

interface StudentAttendance {
  id: string
  subject: string
  date: string
  status: string
  teacherName: string
  createdAt: Date
}

interface DayAttendance {
  date: string
  records: StudentAttendance[]
  status: "present" | "absent" | "partial" | "none"
  subjects: string[]
}

interface AttendanceCalendarProps {
  calendarData: { [key: string]: DayAttendance }
}

export function AttendanceCalendar({ calendarData }: AttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDayClick = (date: string) => {
    setSelectedDate(date === selectedDate ? null : date)
  }

  const getDayColor = (dayStr: string) => {
    if (!calendarData[dayStr]) return "bg-gray-100"

    switch (calendarData[dayStr].status) {
      case "present":
        return "bg-green-500"
      case "absent":
        return "bg-red-500"
      case "partial":
        return "bg-yellow-500"
      default:
        return "bg-gray-100"
    }
  }

  // Generate calendar days
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = monthStart
    const endDate = monthEnd

    const dateFormat = "MMMM yyyy"
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{format(currentMonth, dateFormat)}</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="grid grid-cols-7 text-center text-xs font-medium bg-gray-50 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
              <div key={i} className="py-2 border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-100">
            {days.map((day, i) => {
              const formattedDate = format(day, "yyyy-MM-dd")
              const isToday = isSameDay(day, new Date())
              const isSelected = selectedDate === formattedDate

              return (
                <div
                  key={i}
                  onClick={() => handleDayClick(formattedDate)}
                  className={`
                    h-12 flex flex-col items-center justify-center relative
                    cursor-pointer hover:bg-gray-50 transition-colors
                    ${isToday ? "font-bold" : ""}
                    ${isSelected ? "ring-2 ring-black z-10" : ""}
                  `}
                >
                  <div className="text-xs mb-1">{format(day, "d")}</div>
                  {calendarData[formattedDate] && (
                    <div
                      className={`w-6 h-6 rounded-sm ${getDayColor(formattedDate)}`}
                      title={`${calendarData[formattedDate]?.subjects.join(", ")}`}
                    ></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Render selected day details
  const renderDayDetails = () => {
    if (!selectedDate || !calendarData[selectedDate])
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 border rounded-lg">
          <Calendar className="w-12 h-12 text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Select a Day</h3>
          <p className="text-gray-600">Click on any day in the calendar to view detailed attendance information</p>
        </div>
      )

    const dayDetails = calendarData[selectedDate]

    return (
      <div className="border rounded-lg overflow-hidden p-4">
        <h3 className="text-lg font-medium mb-2">{format(parseISO(dayDetails.date), "MMMM d, yyyy")}</h3>

        {dayDetails.records.length > 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-3">
              {dayDetails.records.length} class{dayDetails.records.length > 1 ? "es" : ""} on this day
            </p>
            <div className="space-y-3">
              {dayDetails.records.map((record, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <p className="font-medium">{record.subject}</p>
                    <p className="text-sm text-gray-600">Recorded by {record.teacherName}</p>
                  </div>
                  <StatusBadge status={record.status} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600">No attendance records for this day.</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
          <span className="text-sm">Present</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
          <span className="text-sm">Absent</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
          <span className="text-sm">Partially Present</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-100 rounded-sm mr-2"></div>
          <span className="text-sm">No Classes</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>{renderCalendar()}</div>
        <div>{renderDayDetails()}</div>
      </div>
    </div>
  )
}

