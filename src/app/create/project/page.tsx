"use client"

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "@/components/ui/use-toast";
// import { Toaster } from "@/components/ui/toaster";

import ImageUploader from '@/components/common/ImageUploader';

// Project Creation Schema
const projectSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  category: z.string().min(1, "Please select a category"),
  teamSize: z.number().min(1, "Team size must be at least 1").max(10, "Team size cannot exceed 10"),
  links: z.array(
    z.object({
      title: z.string().min(1, "Link title is required"),
      url: z.string().url("Invalid URL")
    })
  ).optional(),
  imageUrl: z.string().optional()
});

type ProjectFormData = z.infer<typeof projectSchema>;

// Project Categories
const PROJECT_CATEGORIES = [
  'Web Development', 
  'Mobile App', 
  'Machine Learning', 
  'Data Science', 
  'Cybersecurity', 
  'Other'
];

export default function CreateProjectPage() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      teamSize: 1,
      links: [],
    }
  });

  const handleImageUpload = (url: string) => {
    form.setValue('imageUrl', url);
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!user) {
      // toast({
      //   title: "Authentication Required",
      //   description: "Please log in to create a project",
      //   variant: "destructive"
      // });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'projects'), {
        ...data,
        ownerId: user.uid,
        createdBy: user.displayName || user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        currentMembers: [user.uid],
        joinRequests: [],
        joinedStudents: []
      });

      // toast({
      //   title: "Project Created",
      //   description: "Your project has been successfully created!",
      // });

      // Reset form after successful submission
      form.reset();
    } catch (error) {
      // toast({
      //   title: "Error Creating Project",
      //   description: "Something went wrong. Please try again.",
      //   variant: "destructive"
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Image Uploader */}
              <ImageUploader onUpload={handleImageUpload} />
              
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your project" 
                        {...field} 
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROJECT_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Team Size Field */}
              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter team size" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Links Section */}
              <div>
                <FormLabel>Project Links</FormLabel>
                {form.watch('links')?.map((_, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <FormField
                      control={form.control}
                      name={`links.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Link Title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`links.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon"
                      onClick={() => {
                        const currentLinks = form.getValues('links') || [];
                        form.setValue('links', currentLinks.filter((_, i) => i !== index));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    const currentLinks = form.getValues('links') || [];
                    form.setValue('links', [...currentLinks, { title: '', url: '' }]);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Link
                </Button>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* <Toaster /> */}
    </div>
  );
}