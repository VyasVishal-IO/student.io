"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, PlusCircle, Clock, MapPin, Trash } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, Timestamp } from "firebase/firestore"
import type { CalendarEvent } from "@/types/college"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, isAfter, isBefore, isToday } from "date-fns"
import toast from "react-hot-toast"

interface CollegeCalendarProps {
  collegeId: string
  canManage: boolean
}

export default function CollegeCalendar({ collegeId, canManage }: CollegeCalendarProps) {
  const { user, profile } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("upcoming")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endDate: "",
    endTime: "",
    allDay: false,
    location: "",
    type: "event" as "exam" | "class" | "event" | "holiday",
  })

  useEffect(() => {
    // Set up real-time listener for events
    const eventsQuery = query(collection(db, "events"), where("collegeId", "==", collegeId))

    const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CalendarEvent[]

      // Sort manually in JavaScript instead of using Firestore orderBy
      eventsData.sort((a, b) => {
        return a.startDate.toMillis() - b.startDate.toMillis()
      })

      setEvents(eventsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [collegeId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !profile) return

    try {
      // Combine date and time for start date
      const startDateTime = formData.allDay
        ? new Date(`${formData.startDate}T00:00:00`)
        : new Date(`${formData.startDate}T${formData.startTime}`)

      // Combine date and time for end date if provided
      let endDateTime = null
      if (formData.endDate) {
        endDateTime = formData.allDay
          ? new Date(`${formData.endDate}T23:59:59`)
          : formData.endTime
            ? new Date(`${formData.endDate}T${formData.endTime}`)
            : new Date(`${formData.endDate}T23:59:59`)
      }

      const eventData = {
        collegeId,
        title: formData.title,
        description: formData.description,
        startDate: Timestamp.fromDate(startDateTime),
        endDate: endDateTime ? Timestamp.fromDate(endDateTime) : null,
        allDay: formData.allDay,
        location: formData.location,
        type: formData.type,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
      }

      await addDoc(collection(db, "events"), eventData)

      // Reset form
      setFormData({
        title: "",
        description: "",
        startDate: format(new Date(), "yyyy-MM-dd"),
        startTime: "09:00",
        endDate: "",
        endTime: "",
        allDay: false,
        location: "",
        type: "event",
      })

      setIsAddDialogOpen(false)
      toast.success("Event added successfully!")
    } catch (error) {
      console.error("Error adding event:", error)
      toast.error("Failed to add event. Please try again.")
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return
    }

    setDeletingId(id)

    try {
      await deleteDoc(doc(db, "events", id))
      toast.success("Event deleted")
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Failed to delete event")
    } finally {
      setDeletingId(null)
    }
  }

  // Filter events based on active tab
  const now = new Date()
  const filteredEvents = events.filter((event) => {
    const eventDate = event.startDate.toDate()

    if (activeTab === "upcoming") {
      return isAfter(eventDate, now) || isToday(eventDate)
    } else if (activeTab === "past") {
      return isBefore(eventDate, now) && !isToday(eventDate)
    }

    return true // 'all' tab
  })

  // Group events by month
  const groupedEvents: Record<string, CalendarEvent[]> = {}

  filteredEvents.forEach((event) => {
    const monthYear = format(event.startDate.toDate(), "MMMM yyyy")

    if (!groupedEvents[monthYear]) {
      groupedEvents[monthYear] = []
    }

    groupedEvents[monthYear].push(event)
  })

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendar</h2>
          <p className="text-gray-600">Upcoming events, classes, and important dates</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "upcoming" | "past" | "all")}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>

          {canManage && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>Create a new event for the college calendar</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleAddEvent}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          name="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          disabled={formData.allDay}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="endDate">End Date (Optional)</Label>
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="endTime">End Time (Optional)</Label>
                        <Input
                          id="endTime"
                          name="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          disabled={formData.allDay}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="type">Event Type</Label>
                      <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="class">Class</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="location">Location (Optional)</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Room 101, Main Building"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Event</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {Object.keys(groupedEvents).length === 0 ? (
        <div className="py-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No events found</h3>
          <p className="mt-1 text-gray-500">
            {activeTab === "upcoming"
              ? "No upcoming events scheduled"
              : activeTab === "past"
                ? "No past events found"
                : "No events have been added to the calendar yet"}
          </p>
          {canManage && (
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Event
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
            <div key={monthYear}>
              <h3 className="mb-4 text-lg font-medium">{monthYear}</h3>
              <div className="space-y-4">
                {monthEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    canDelete={canManage && event.createdBy === user?.uid}
                    isDeleting={deletingId === event.id}
                    onDelete={() => handleDeleteEvent(event.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface EventCardProps {
  event: CalendarEvent
  canDelete: boolean
  isDeleting: boolean
  onDelete: () => void
}

function EventCard({ event, canDelete, isDeleting, onDelete }: EventCardProps) {
  // Determine badge color based on event type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "exam":
        return "bg-red-100 text-red-800 border-red-200"
      case "class":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "holiday":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-purple-100 text-purple-800 border-purple-200"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{event.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline" className={getBadgeVariant(event.type)}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>

              {isToday(event.startDate.toDate()) && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  Today
                </Badge>
              )}
            </div>
          </div>

          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              disabled={isDeleting}
              className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
            >
              {isDeleting ? (
                <span className="w-4 h-4 border-t-2 border-b-2 border-red-500 rounded-full animate-spin"></span>
              ) : (
                <Trash className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {event.description && <p className="mb-4 text-gray-600">{event.description}</p>}

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-2 h-4 w-4" />
            <div>
              <div>
                {format(event.startDate.toDate(), "EEEE, MMMM d, yyyy")}
                {!event.allDay && ` at ${format(event.startDate.toDate(), "h:mm a")}`}
              </div>

              {event.endDate && (
                <div className="mt-1">
                  <span className="text-gray-400">to</span> {format(event.endDate.toDate(), "EEEE, MMMM d, yyyy")}
                  {!event.allDay && ` at ${format(event.endDate.toDate(), "h:mm a")}`}
                </div>
              )}

              {event.allDay && <div className="text-gray-400">All day</div>}
            </div>
          </div>

          {event.location && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

