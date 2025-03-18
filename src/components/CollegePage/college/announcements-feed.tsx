"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Megaphone, PlusCircle, Clock, AlertCircle, Trash } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, Timestamp } from "firebase/firestore"
import type { Announcement } from "@/types/college"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface AnnouncementsFeedProps {
  collegeId: string
  canPost: boolean
}

export default function AnnouncementsFeed({ collegeId, canPost }: AnnouncementsFeedProps) {
  const { user, profile } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    important: false,
  })

  useEffect(() => {
    // Set up real-time listener for announcements
    const announcementsQuery = query(collection(db, "announcements"), where("collegeId", "==", collegeId))

    const unsubscribe = onSnapshot(announcementsQuery, (snapshot) => {
      const announcementsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Announcement[]

      // Sort manually in JavaScript instead of using Firestore orderBy
      announcementsData.sort((a, b) => {
        return b.createdAt.toMillis() - a.createdAt.toMillis()
      })

      setAnnouncements(announcementsData)
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      important: checked,
    }))
  }

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("You must be logged in to post an announcement")
      return
    }

    if (!profile) {
      toast.error("Your profile information is not available")
      return
    }

    try {
      const announcementData = {
        collegeId,
        title: formData.title,
        content: formData.content,
        important: formData.important,
        authorId: user.uid,
        authorName: profile.displayName || "Anonymous", // Add fallback
        authorRole: profile.role || "member",
        createdAt: Timestamp.now(),
      }

      await addDoc(collection(db, "announcements"), announcementData)

      // Reset form
      setFormData({
        title: "",
        content: "",
        important: false,
      })

      setIsAddDialogOpen(false)
      toast.success("Announcement posted successfully!")
    } catch (error) {
      console.error("Error posting announcement:", error)
      toast.error("Failed to post announcement. Please try again.")
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return
    }

    setDeletingId(id)

    try {
      await deleteDoc(doc(db, "announcements", id))
      toast.success("Announcement deleted")
    } catch (error) {
      console.error("Error deleting announcement:", error)
      toast.error("Failed to delete announcement")
    } finally {
      setDeletingId(null)
    }
  }

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
          <h2 className="text-2xl font-bold">Announcements</h2>
          <p className="text-gray-600">Important updates and information</p>
        </div>

        {canPost && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Post Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Post New Announcement</DialogTitle>
                <DialogDescription>Create a new announcement for all college members</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddAnnouncement}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      className="min-h-[150px]"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="important" checked={formData.important} onCheckedChange={handleSwitchChange} />
                    <Label htmlFor="important">Mark as important</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Post Announcement</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {announcements.length === 0 ? (
        <div className="py-12 text-center">
          <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No announcements yet</h3>
          <p className="mt-1 text-gray-500">
            {canPost
              ? "Post an announcement to keep everyone informed"
              : "Check back later for updates and announcements"}
          </p>
          {canPost && (
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Post Your First Announcement
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              canDelete={canPost && announcement.authorId === user?.uid}
              isDeleting={deletingId === announcement.id}
              onDelete={() => handleDeleteAnnouncement(announcement.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface AnnouncementCardProps {
  announcement: Announcement
  canDelete: boolean
  isDeleting: boolean
  onDelete: () => void
}

function AnnouncementCard({ announcement, canDelete, isDeleting, onDelete }: AnnouncementCardProps) {
  return (
    <Card className={announcement.important ? "border-red-200 bg-red-50" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {announcement.important && <AlertCircle className="h-5 w-5 text-red-500" />}
              {announcement.title}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <span>By {announcement.authorName || "Anonymous"}</span>
              <span className="mx-2">•</span>
              <Clock className="h-3 w-3 mr-1" />
              <span>{announcement.createdAt.toDate().toLocaleString()}</span>
            </CardDescription>
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

        {announcement.important && (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 w-fit">
            Important
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{announcement.content}</p>
      </CardContent>
    </Card>
  )
}

