import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
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
// import { toast } from "@/components/ui/use-toast";

// Project Categories
const PROJECT_CATEGORIES = [
  'Web Development', 
  'Mobile App', 
  'Machine Learning', 
  'Data Science', 
  'Cybersecurity', 
  'Other'
];

// Edit Project Schema
const editProjectSchema = z.object({
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
  ).optional()
});

export function ProjectEditModal({ project, onUpdate } : any) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      category: project.category,
      teamSize: project.teamSize,
      links: project.links || []
    }
  });

  const handleSubmit = async ({data} : any) => {
    try {
      const projectRef = doc(db, 'projects', project.id);
      await updateDoc(projectRef, {
        ...data,
        updatedAt: new Date()
      });

      // Notify parent component about update
      onUpdate({ ...project, ...data });

    //   toast({
    //     title: "Project Updated",
    //     description: "Your project details have been successfully updated.",
    //   });

      setIsOpen(false);
    } catch (error) {
    //   toast({
    //     title: "Error Updating Project",
    //     description: "Something went wrong. Please try again.",
    //     variant: "destructive"
    //   });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
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

            {/* Links Management */}
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
                    <Edit className="h-4 w-4" />
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
                Add Link
              </Button>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Update Project
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}