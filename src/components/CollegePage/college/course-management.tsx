"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PlusCircle, BookOpen, Search, FileText, User, Clock } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore"
import type { Course } from "@/types/college"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface CourseManagementProps {
  collegeId: string
  canManage: boolean
  isStudent: boolean
}

export default function CourseManagement({ collegeId, canManage, isStudent }: CourseManagementProps) {
  const { user, profile } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    credits: 3,
    syllabus: "",
  })

  useEffect(() => {
    // Set up real-time listener for courses
    const coursesQuery = query(collection(db, "courses"), where("collegeId", "==", collegeId))

    const unsubscribe = onSnapshot(coursesQuery, (snapshot) => {
      const coursesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[]

      // Sort manually in JavaScript instead of using Firestore orderBy
      coursesData.sort((a, b) => {
        return b.createdAt.toMillis() - a.createdAt.toMillis()
      })

      setCourses(coursesData)
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

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("You must be logged in to add a course")
      return
    }

    if (!profile) {
      toast.error("Your profile information is not available")
      return
    }

    try {
      const courseData = {
        collegeId,
        title: formData.title,
        description: formData.description,
        department: formData.department || "General",
        credits: Number(formData.credits),
        syllabus: formData.syllabus || "",
        teacherId: user.uid,
        teacherName: profile.displayName || "Unknown Teacher", // Add fallback
        enrolledStudents: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      await addDoc(collection(db, "courses"), courseData)

      // Reset form
      setFormData({
        title: "",
        description: "",
        department: "",
        credits: 3,
        syllabus: "",
      })

      setIsAddDialogOpen(false)
      toast.success("Course added successfully!")
    } catch (error) {
      console.error("Error adding course:", error)
      toast.error("Failed to add course. Please try again.")
    }
  }

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.department?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
  )

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
          <h2 className="text-2xl font-bold">Courses</h2>
          <p className="text-gray-600">Browse and manage courses for this college</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {canManage && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                  <DialogDescription>Create a new course for students to enroll in</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleAddCourse}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          placeholder="e.g. Computer Science"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="credits">Credits</Label>
                        <Input
                          id="credits"
                          name="credits"
                          type="number"
                          min="1"
                          max="10"
                          value={formData.credits}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="syllabus">Syllabus (Optional)</Label>
                      <Textarea
                        id="syllabus"
                        name="syllabus"
                        value={formData.syllabus}
                        onChange={handleInputChange}
                        placeholder="Enter course syllabus or outline"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Course</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="py-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No courses found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery
              ? "No courses match your search criteria"
              : canManage
                ? "Start by adding a new course"
                : "No courses have been added to this college yet"}
          </p>
          {canManage && searchQuery === "" && (
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Course
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              canManage={canManage}
              isStudent={isStudent}
              userId={user?.uid || ""}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CourseCardProps {
  course: Course
  canManage: boolean
  isStudent: boolean
  userId: string
}

function CourseCard({ course, canManage, isStudent, userId }: CourseCardProps) {
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Check if student is enrolled
    if (isStudent && course.enrolledStudents) {
      setIsEnrolled(course.enrolledStudents.includes(userId))
    }
  }, [course.enrolledStudents, isStudent, userId])

  const handleEnroll = async () => {
    if (!isStudent || !userId) return

    setIsEnrolling(true)

    try {
      const courseRef = doc(db, "courses", course.id)

      await updateDoc(courseRef, {
        enrolledStudents: isEnrolled
          ? course.enrolledStudents?.filter((id) => id !== userId) // Unenroll
          : [...(course.enrolledStudents || []), userId], // Enroll
      })

      toast.success(isEnrolled ? "Unenrolled from course" : "Enrolled in course successfully!")
      setIsEnrolled(!isEnrolled)
    } catch (error) {
      console.error("Error enrolling in course:", error)
      toast.error("Failed to update enrollment. Please try again.")
    } finally {
      setIsEnrolling(false)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle>{course.title}</CardTitle>
        {course.department && (
          <Badge variant="outline" className="w-fit">
            {course.department}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <User className="mr-1 h-4 w-4" />
          <span>{course.teacherName || "Unknown Teacher"}</span>
        </div>

        {course.credits && (
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <FileText className="mr-1 h-4 w-4" />
            <span>{course.credits} Credits</span>
          </div>
        )}

        <div className="mt-1 flex items-center text-sm text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          <span>{course.createdAt.toDate().toLocaleDateString()}</span>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Syllabus</h4>
            <p className="text-sm text-gray-600 whitespace-pre-line">{course.syllabus || "No syllabus available"}</p>

            {course.enrolledStudents && (
              <div className="mt-4">
                <h4 className="font-medium mb-1">Enrolled Students</h4>
                <p className="text-sm text-gray-600">{course.enrolledStudents.length} students enrolled</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Show Less" : "Show More"}
        </Button>

        {isStudent && (
          <Button variant={isEnrolled ? "outline" : "default"} size="sm" onClick={handleEnroll} disabled={isEnrolling}>
            {isEnrolling ? (
              <>
                <span className="w-4 h-4 mr-2 border-t-2 border-b-2 border-current rounded-full animate-spin"></span>
                {isEnrolled ? "Unenrolling..." : "Enrolling..."}
              </>
            ) : isEnrolled ? (
              "Unenroll"
            ) : (
              "Enroll"
            )}
          </Button>
        )}

        {canManage && course.teacherId === userId && (
          <Button variant="outline" size="sm">
            Manage
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

