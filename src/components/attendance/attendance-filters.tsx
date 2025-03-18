"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AttendanceFiltersProps {
  subjects: string[]
  selectedSubject: string
  setSelectedSubject: (value: string) => void
  dateRange: string
  setDateRange: (value: string) => void
  searchQuery: string
  setSearchQuery: (value: string) => void
}

export function AttendanceFilters({
  subjects,
  selectedSubject,
  setSelectedSubject,
  dateRange,
  setDateRange,
  searchQuery,
  setSearchQuery,
}: AttendanceFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Filter by Subject</label>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Date Range</label>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="lastMonth">Last Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Search Records</label>
        <Input
          type="text"
          placeholder="Search by subject, status, or teacher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  )
}

