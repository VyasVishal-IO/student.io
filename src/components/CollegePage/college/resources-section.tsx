"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FileText, PlusCircle, Clock, Download, Trash, Image, File, Search, Grid3X3, List } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, Timestamp } from "firebase/firestore"
import type { Resource } from "@/types/college"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import ImageUploader from "@/components/common/ImageUploader"
import toast from "react-hot-toast"

interface ResourcesSectionProps {
  collegeId: string
  canManage: boolean
}

export default function ResourcesSection({ collegeId, canManage }: ResourcesSectionProps) {
  const { user, profile } = useAuth()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    fileType: "document",
    category: "general",
  })

  useEffect(() => {
    // Set up real-time listener for resources
    const resourcesQuery = query(collection(db, "resources"), where("collegeId", "==", collegeId))

    const unsubscribe = onSnapshot(resourcesQuery, (snapshot) => {
      const resourcesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Resource[]

      setResources(resourcesData)
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

  const handleFileUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      fileUrl: url,
    }))
  }

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("You must be logged in to add a resource")
      return
    }

    if (!profile) {
      toast.error("Your profile information is not available")
      return
    }

    if (!formData.fileUrl) {
      toast.error("Please upload a file")
      return
    }

    try {
      const resourceData = {
        collegeId,
        title: formData.title,
        description: formData.description || "",
        fileUrl: formData.fileUrl,
        fileType: formData.fileType,
        category: formData.category,
        uploadedBy: user.uid,
        uploadedByName: profile.displayName || "Anonymous", // Add fallback
        createdAt: Timestamp.now(),
      }

      await addDoc(collection(db, "resources"), resourceData)

      // Reset form
      setFormData({
        title: "",
        description: "",
        fileUrl: "",
        fileType: "document",
        category: "general",
      })

      setIsAddDialogOpen(false)
      toast.success("Resource added successfully!")
    } catch (error) {
      console.error("Error adding resource:", error)
      toast.error("Failed to add resource. Please try again.")
    }
  }

  const handleDeleteResource = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) {
      return
    }

    setDeletingId(id)

    try {
      await deleteDoc(doc(db, "resources", id))
      toast.success("Resource deleted")
    } catch (error) {
      console.error("Error deleting resource:", error)
      toast.error("Failed to delete resource")
    } finally {
      setDeletingId(null)
    }
  }

  // Get unique categories
  const categories = ["all", ...new Set(resources.map((r) => r.category || "general"))]

  // Filter resources based on active category and search query
  const filteredResources = resources.filter((resource) => {
    const matchesCategory = activeCategory === "all" || resource.category === activeCategory
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Sort resources
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortBy === "newest") {
      return b.createdAt.toMillis() - a.createdAt.toMillis()
    } else if (sortBy === "oldest") {
      return a.createdAt.toMillis() - b.createdAt.toMillis()
    } else {
      // Sort by name
      return a.title.localeCompare(b.title)
    }
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
          <h2 className="text-2xl font-bold">Resources</h2>
          <p className="text-gray-600">Documents, images, and other resources</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full sm:w-auto"
              />
            </div>
          </div>

          {canManage && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add New Resource</DialogTitle>
                  <DialogDescription>Upload a document, image, or other resource</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleAddResource}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
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
                        <Label htmlFor="fileType">File Type</Label>
                        <Select
                          value={formData.fileType}
                          onValueChange={(value) => handleSelectChange("fileType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select file type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="document">Document</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="lecture">Lecture</SelectItem>
                            <SelectItem value="assignment">Assignment</SelectItem>
                            <SelectItem value="exam">Exam</SelectItem>
                            <SelectItem value="reference">Reference</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Upload File</Label>
                      <ImageUploader
                        onUpload={handleFileUpload}
                        currentImage={formData.fileUrl}
                        onRemove={() => setFormData((prev) => ({ ...prev, fileUrl: "" }))}
                      />
                      {!formData.fileUrl && (
                        <p className="text-xs text-gray-500 mt-1">
                          Upload an image, document, or other file using the uploader above
                        </p>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!formData.fileUrl}>
                      Add Resource
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category tabs */}
        <div className="overflow-x-auto pb-2">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground w-auto min-w-full sm:min-w-0">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow whitespace-nowrap"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as "newest" | "oldest" | "name")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value as "grid" | "list")}
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid3X3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {sortedResources.length === 0 ? (
        <div className="py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No resources found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery
              ? "No resources match your search criteria"
              : activeCategory !== "all"
                ? `No resources in the ${activeCategory} category`
                : canManage
                  ? "Start by adding a new resource"
                  : "No resources have been added yet"}
          </p>
          {canManage && searchQuery === "" && activeCategory === "all" && (
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Resource
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              canDelete={canManage && resource.uploadedBy === user?.uid}
              isDeleting={deletingId === resource.id}
              onDelete={() => handleDeleteResource(resource.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedResources.map((resource) => (
            <ResourceListItem
              key={resource.id}
              resource={resource}
              canDelete={canManage && resource.uploadedBy === user?.uid}
              isDeleting={deletingId === resource.id}
              onDelete={() => handleDeleteResource(resource.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ResourceCardProps {
  resource: Resource
  canDelete: boolean
  isDeleting: boolean
  onDelete: () => void
}

function ResourceCard({ resource, canDelete, isDeleting, onDelete }: ResourceCardProps) {
  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return <Image className="h-5 w-5" />
      case "document":
        return <FileText className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2 text-base">
            {getFileIcon(resource.fileType)}
            <span className="line-clamp-1">{resource.title}</span>
          </CardTitle>

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

        {resource.category && (
          <Badge variant="outline" className="w-fit">
            {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        {resource.fileType === "image" && (
          <div className="mb-3 aspect-video overflow-hidden rounded-md bg-gray-100">
            <img
              src={resource.fileUrl || "/placeholder.svg"}
              alt={resource.title}
              className="h-full w-full object-cover transition-all hover:scale-105"
            />
          </div>
        )}

        {resource.description && <p className="text-sm text-gray-600 line-clamp-2 mb-2">{resource.description}</p>}

        <div className="flex items-center text-xs text-gray-500">
          <Clock className="mr-1 h-3 w-3" />
          <span>{resource.createdAt.toDate().toLocaleDateString()}</span>
          <span className="mx-1">•</span>
          <span>By {resource.uploadedByName || "Anonymous"}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button variant="outline" size="sm" className="w-full gap-1">
            <Download className="h-3 w-3" />
            {resource.fileType === "image" ? "View Full Size" : "Download"}
          </Button>
        </a>
      </CardFooter>
    </Card>
  )
}

interface ResourceListItemProps {
  resource: Resource
  canDelete: boolean
  isDeleting: boolean
  onDelete: () => void
}

function ResourceListItem({ resource, canDelete, isDeleting, onDelete }: ResourceListItemProps) {
  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return <Image className="h-5 w-5" />
      case "document":
        return <FileText className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 flex-grow overflow-hidden">
        <div className="flex-shrink-0">
          {resource.fileType === "image" ? (
            <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
              <img
                src={resource.fileUrl || "/placeholder.svg"}
                alt={resource.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded">
              {getFileIcon(resource.fileType)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-grow">
          <h4 className="font-medium text-sm truncate">{resource.title}</h4>
          {resource.description && <p className="text-xs text-gray-600 line-clamp-1">{resource.description}</p>}
          <div className="flex items-center mt-1">
            {resource.category && (
              <Badge variant="outline" className="mr-2 text-xs py-0 h-5">
                {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
              </Badge>
            )}
            <span className="text-xs text-gray-500">{resource.createdAt.toDate().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-2">
        <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-1 h-8">
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </a>

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
    </div>
  )
}

