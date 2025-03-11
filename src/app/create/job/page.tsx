// 'use client';
// import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { JobOpening } from '@/types/content';

// export default function CreateJobPage() {
//   const { user } = useAuth();
//   const [job, setJob] = useState<Partial<JobOpening>>({
//     title: '',
//     description: '',
//     applyLink: '',
//     jobType: 'full-time',
//     location: '',
//     salaryExpectation: '',
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user?.uid) return;

//     setLoading(true);
//     try {
//       await addDoc(collection(db, 'jobs'), {
//         ...job,
//         authorId: user.uid,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Create Job Listing</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           value={job.title}
//           onChange={(e) => setJob({ ...job, title: e.target.value })}
//           placeholder="Job Title"
//           className="w-full p-2 border rounded"
//           required
//         />
//         <textarea
//           value={job.description}
//           onChange={(e) => setJob({ ...job, description: e.target.value })}
//           className="w-full p-2 border rounded h-32"
//           placeholder="Job Description"
//           required
//         />
//         <input
//           type="text"
//           value={job.applyLink}
//           onChange={(e) => setJob({ ...job, applyLink: e.target.value })}
//           placeholder="Application Link"
//           className="w-full p-2 border rounded"
//         />
//         <select
//           value={job.jobType}
//           onChange={(e) => setJob({ ...job, jobType: e.target.value })}
//           className="w-full p-2 border rounded"
//         >
//           <option value="full-time">Full-time</option>
//           <option value="part-time">Part-time</option>
//           <option value="contract">Contract</option>
//           <option value="internship">Internship</option>
//         </select>
//         <input
//           type="text"
//           value={job.location}
//           onChange={(e) => setJob({ ...job, location: e.target.value })}
//           placeholder="Job Location"
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           value={job.salaryExpectation}
//           onChange={(e) => setJob({ ...job, salaryExpectation: e.target.value })}
//           placeholder="Salary Expectation"
//           className="w-full p-2 border rounded"
//         />
//         <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
//           {loading ? 'Posting...' : 'Post Job'}
//         </button>
//       </form>
//     </div>
//   );
// }







'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Link as LinkIcon, 
  FileText, 
  Clock, 
  Send 
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Zod validation schema
const jobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  applyLink: z.string().url("Please enter a valid URL"),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  location: z.string().min(2, "Location must be at least 2 characters"),
  salaryExpectation: z.string().optional(),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  skills: z.string().optional(),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'executive']),
  workplaceType: z.enum(['on-site', 'remote', 'hybrid']),
});

export default function CreateJobPage() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form and zod
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      description: '',
      applyLink: '',
      jobType: 'full-time',
      location: '',
      salaryExpectation: '',
      companyName: '',
      skills: '',
      experienceLevel: 'entry',
      workplaceType: 'on-site'
    }
  });

  const handleSubmit = async (data: z.infer<typeof jobSchema>) => {
    if (!user?.uid) {
      toast.error('You must be logged in to post a job');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        ...data,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Job posted successfully!');
      form.reset();
    } catch (error) {
      toast.error('Failed to post job. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Create Job Listing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter company name" 
                        { ...field } 
                        icon={<Briefcase className="text-muted-foreground" />
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Software Engineer" 
                        {...field} 
                        icon={<FileText className="text-muted-foreground" />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed job description..." 
                        {...field} 
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Type */}
              <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Full-time
                          </div>
                        </SelectItem>
                        <SelectItem value="part-time">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Part-time
                          </div>
                        </SelectItem>
                        <SelectItem value="contract">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Contract
                          </div>
                        </SelectItem>
                        <SelectItem value="internship">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Internship
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="San Francisco, CA" 
                        {...field} 
                        icon={<MapPin className="text-muted-foreground" />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Workplace Type */}
              <FormField
                control={form.control}
                name="workplaceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workplace Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select workplace type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="on-site">On-site</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Experience Level */}
              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                        <SelectItem value="executive">Executive Level</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Salary Expectation */}
              <FormField
                control={form.control}
                name="salaryExpectation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Expectation</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="$80,000 - $120,000" 
                        {...field} 
                        icon={<DollarSign className="text-muted-foreground" />}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Provide a salary range or expectation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Skills */}
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Skills</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="React, TypeScript, Node.js" 
                        {...field} 
                        icon={<LinkIcon className="text-muted-foreground" />}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of skills
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Application Link */}
              <FormField
                control={form.control}
                name="applyLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Link</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://careers.yourcompany.com/apply" 
                        {...field} 
                        icon={<Send className="text-muted-foreground" />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Job Listing'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}