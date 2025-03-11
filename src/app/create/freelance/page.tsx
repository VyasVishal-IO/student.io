// // // 'use client';
// // // import { useState } from 'react';
// // // import { useAuth } from '@/context/AuthContext';
// // // import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// // // import { db } from '@/lib/firebase';
// // // import { FreelanceProject } from '@/types/content';

// // // export default function CreateFreelancePage() {
// // //   const { user } = useAuth();
// // //   const [project, setProject] = useState<Partial<FreelanceProject>>({
// // //     title: '',
// // //     description: '',
// // //     budget: '',
// // //     deadline: new Date(),
// // //     requiredSkills: [],
// // //   });

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (!user?.uid) return;

// // //     try {
// // //       await addDoc(collection(db, 'freelanceProjects'), {
// // //         ...project,
// // //         authorId: user.uid,
// // //         createdAt: serverTimestamp(),
// // //         updatedAt: serverTimestamp(),
// // //       });
// // //     } catch (error) {
// // //       console.error('Error creating project:', error);
// // //     }
// // //   };

// // //   return (
// // //     <div className="max-w-2xl mx-auto p-4">
// // //       <h1 className="text-2xl font-bold mb-4">Create Freelance Project</h1>
// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <input
// // //           type="text"
// // //           value={project.title}
// // //           onChange={(e) => setProject({ ...project, title: e.target.value })}
// // //           placeholder="Project Title"
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <textarea
// // //           value={project.description}
// // //           onChange={(e) => setProject({ ...project, description: e.target.value })}
// // //           className="w-full p-2 border rounded h-32"
// // //           placeholder="Project Description"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           value={project.budget}
// // //           onChange={(e) => setProject({ ...project, budget: e.target.value })}
// // //           placeholder="Budget"
// // //           className="w-full p-2 border rounded"
// // //         />
// // //         <input
// // //           type="date"
// // //           value={project.deadline.toISOString().split('T')[0]}
// // //           onChange={(e) => setProject({ ...project, deadline: new Date(e.target.value) })}
// // //           className="w-full p-2 border rounded"
// // //         />
// // //         <input
// // //           type="text"
// // //           value={project.requiredSkills.join(',')}
// // //           onChange={(e) => setProject({ ...project, requiredSkills: e.target.value.split(',') })}
// // //           placeholder="Required Skills (comma separated)"
// // //           className="w-full p-2 border rounded"
// // //         />
// // //         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
// // //           Post Project
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // }





// // 'use client';

// // import React, { useState } from 'react';
// // import { toast, Toaster } from 'react-hot-toast';
// // import { useForm, Controller } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import * as z from 'zod';
// // import { 
// //   Briefcase, 
// //   DollarSign, 
// //   Calendar, 
// //   Tag, 
// //   FileText, 
// //   Users, 
// //   CheckCircle2 
// // } from 'lucide-react';

// // import { useAuth } from '@/context/AuthContext';
// // import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// // import { db } from '@/lib/firebase';

// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Button } from "@/components/ui/button";
// // import { 
// //   Select, 
// //   SelectContent, 
// //   SelectItem, 
// //   SelectTrigger, 
// //   SelectValue 
// // } from "@/components/ui/select";
// // import { 
// //   Form, 
// //   FormControl, 
// //   FormDescription, 
// //   FormField, 
// //   FormItem, 
// //   FormLabel, 
// //   FormMessage 
// // } from "@/components/ui/form";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Separator } from "@/components/ui/separator";
// // import { Badge } from "@/components/ui/badge";

// // // Project Creation Schema with Zod Validation
// // const projectSchema = z.object({
// //   title: z.string().min(5, "Title must be at least 5 characters"),
// //   description: z.string().min(20, "Description must be at least 20 characters"),
// //   budget: z.string().refine(val => !isNaN(Number(val)), { message: "Budget must be a number" }),
// //   deadline: z.date(),
// //   projectType: z.enum(["web", "mobile", "design", "writing", "other"]),
// //   requiredSkills: z.array(z.string()).min(1, "At least one skill is required"),
// //   complexity: z.enum(["beginner", "intermediate", "advanced"]),
// //   paymentTerms: z.enum(["fixed", "hourly", "milestone"]),
// //   contactEmail: z.string().email("Invalid email address"),
// // });

// // export default function CreateFreelancePage() {
// //   const { user } = useAuth();
// //   const [skills, setSkills] = useState<string[]>([]);
// //   const [currentSkill, setCurrentSkill] = useState('');

// //   const form = useForm<z.infer<typeof projectSchema>>({
// //     resolver: zodResolver(projectSchema),
// //     defaultValues: {
// //       title: "",
// //       description: "",
// //       budget: "",
// //       deadline: new Date(),
// //       projectType: "other",
// //       requiredSkills: [],
// //       complexity: "beginner",
// //       paymentTerms: "fixed",
// //       contactEmail: user?.email || "",
// //     }
// //   });

// //   const addSkill = () => {
// //     if (currentSkill && !skills.includes(currentSkill)) {
// //       const newSkills = [...skills, currentSkill];
// //       setSkills(newSkills);
// //       form.setValue('requiredSkills', newSkills);
// //       setCurrentSkill('');
// //     }
// //   };

// //   const removeSkill = (skillToRemove: string) => {
// //     const newSkills = skills.filter(skill => skill !== skillToRemove);
// //     setSkills(newSkills);
// //     form.setValue('requiredSkills', newSkills);
// //   };

// //   const onSubmit = async (data: z.infer<typeof projectSchema>) => {
// //     if (!user?.uid) {
// //       toast.error('You must be logged in to post a project');
// //       return;
// //     }

// //     try {
// //       await addDoc(collection(db, 'freelanceProjects'), {
// //         ...data,
// //         authorId: user.uid,
// //         createdAt: serverTimestamp(),
// //         updatedAt: serverTimestamp(),
// //       });

// //       toast.success('Project Posted Successfully!');
// //       form.reset();
// //       setSkills([]);
// //     } catch (error) {
// //       console.error('Error creating project:', error);
// //       toast.error('Failed to post project');
// //     }
// //   };

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <Toaster position="top-right" />
// //       <Card className="max-w-3xl mx-auto">
// //         <CardHeader>
// //           <CardTitle className="flex items-center">
// //             <Briefcase className="mr-2" /> Create Freelance Project
// //           </CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <Form {...form}>
// //             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
// //               <div className="grid md:grid-cols-2 gap-4">
// //                 <FormField
// //                   control={form.control}
// //                   name="title"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Project Title</FormLabel>
// //                       <FormControl>
// //                         <div className="flex items-center">
// //                           <Tag className="mr-2 text-muted-foreground" />
// //                           <Input placeholder="Enter project title" {...field} />
// //                         </div>
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />

// //                 <FormField
// //                   control={form.control}
// //                   name="projectType"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Project Type</FormLabel>
// //                       <Select onValueChange={field.onChange} defaultValue={field.value}>
// //                         <FormControl>
// //                           <SelectTrigger>
// //                             <SelectValue placeholder="Select project type" />
// //                           </SelectTrigger>
// //                         </FormControl>
// //                         <SelectContent>
// //                           <SelectItem value="web">Web Development</SelectItem>
// //                           <SelectItem value="mobile">Mobile Development</SelectItem>
// //                           <SelectItem value="design">Design</SelectItem>
// //                           <SelectItem value="writing">Writing</SelectItem>
// //                           <SelectItem value="other">Other</SelectItem>
// //                         </SelectContent>
// //                       </Select>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
// //               </div>

// //               <FormField
// //                 control={form.control}
// //                 name="description"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Project Description</FormLabel>
// //                     <FormControl>
// //                       <div className="flex items-start">
// //                         <FileText className="mr-2 mt-2 text-muted-foreground" />
// //                         <Textarea 
// //                           placeholder="Provide detailed project description" 
// //                           className="min-h-[120px]"
// //                           {...field} 
// //                         />
// //                       </div>
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />

// //               <div className="grid md:grid-cols-3 gap-4">
// //                 <FormField
// //                   control={form.control}
// //                   name="budget"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Budget</FormLabel>
// //                       <FormControl>
// //                         <div className="flex items-center">
// //                           <DollarSign className="mr-2 text-muted-foreground" />
// //                           <Input type="number" placeholder="Project budget" {...field} />
// //                         </div>
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />

// //                 <FormField
// //                   control={form.control}
// //                   name="deadline"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Deadline</FormLabel>
// //                       <FormControl>
// //                         <div className="flex items-center">
// //                           <Calendar className="mr-2 text-muted-foreground" />
// //                           <Input 
// //                             type="date" 
// //                             {...field} 
// //                             value={field.value.toISOString().split('T')[0]} 
// //                             onChange={(e) => field.onChange(new Date(e.target.value))}
// //                           />
// //                         </div>
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />

// //                 <FormField
// //                   control={form.control}
// //                   name="complexity"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Complexity</FormLabel>
// //                       <Select onValueChange={field.onChange} defaultValue={field.value}>
// //                         <FormControl>
// //                           <SelectTrigger>
// //                             <SelectValue placeholder="Project complexity" />
// //                           </SelectTrigger>
// //                         </FormControl>
// //                         <SelectContent>
// //                           <SelectItem value="beginner">Beginner</SelectItem>
// //                           <SelectItem value="intermediate">Intermediate</SelectItem>
// //                           <SelectItem value="advanced">Advanced</SelectItem>
// //                         </SelectContent>
// //                       </Select>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
// //               </div>

// //               <div className="grid md:grid-cols-2 gap-4">
// //                 <FormItem>
// //                   <FormLabel>Required Skills</FormLabel>
// //                   <div className="flex items-center space-x-2">
// //                     <Users className="text-muted-foreground" />
// //                     <Input 
// //                       value={currentSkill}
// //                       onChange={(e) => setCurrentSkill(e.target.value)}
// //                       placeholder="Add skills" 
// //                       onKeyDown={(e) => e.key === 'Enter' && addSkill()}
// //                     />
// //                     <Button type="button" variant="outline" onClick={addSkill}>
// //                       <CheckCircle2 className="mr-2" /> Add
// //                     </Button>
// //                   </div>
// //                   <div className="flex flex-wrap gap-2 mt-2">
// //                     {skills.map((skill) => (
// //                       <Badge 
// //                         key={skill} 
// //                         variant="secondary" 
// //                         className="cursor-pointer" 
// //                         onClick={() => removeSkill(skill)}
// //                       >
// //                         {skill} ✕
// //                       </Badge>
// //                     ))}
// //                   </div>
// //                 </FormItem>

// //                 <FormField
// //                   control={form.control}
// //                   name="contactEmail"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Contact Email</FormLabel>
// //                       <FormControl>
// //                         <Input type="email" placeholder="Your contact email" {...field} />
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
// //               </div>

// //               <Separator />

// //               <Button type="submit" className="w-full">
// //                 Post Project
// //               </Button>
// //             </form>
// //           </Form>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }







// 'use client';

// import React, { useState } from 'react';
// import { toast, Toaster } from 'react-hot-toast';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { 
//   Briefcase, 
//   DollarSign, 
//   Calendar, 
//   Tag, 
//   FileText, 
//   Users, 
//   Plus,
//   X
// } from 'lucide-react';

// import { useAuth } from '@/context/AuthContext';
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";
// import { 
//   Form, 
//   FormControl, 
//   FormField, 
//   FormItem, 
//   FormLabel, 
//   FormMessage 
// } from "@/components/ui/form";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";

// // Project Creation Schema with Zod Validation
// const projectSchema = z.object({
//   title: z.string().min(5, "Title must be at least 5 characters"),
//   description: z.string().min(20, "Description must be at least 20 characters"),
//   budget: z.string().refine(val => !isNaN(Number(val)), { message: "Budget must be a number" }),
//   deadline: z.date(),
//   projectType: z.enum(["web", "mobile", "design", "writing", "other"]),
//   requiredSkills: z.array(z.string()).min(1, "At least one skill is required"),
//   complexity: z.enum(["beginner", "intermediate", "advanced"]),
//   paymentTerms: z.enum(["fixed", "hourly", "milestone"]),
//   contactEmail: z.string().email("Invalid email address"),
// });

// export default function CreateFreelancePage() {
//   const { user } = useAuth();
//   const [skills, setSkills] = useState<string[]>([]);
//   const [currentSkill, setCurrentSkill] = useState('');

//   const form = useForm<z.infer<typeof projectSchema>>({
//     resolver: zodResolver(projectSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       budget: "",
//       deadline: new Date(),
//       projectType: "other",
//       requiredSkills: [],
//       complexity: "beginner",
//       paymentTerms: "fixed",
//       contactEmail: user?.email || "",
//     }
//   });

//   const addSkill = () => {
//     if (currentSkill && !skills.includes(currentSkill)) {
//       const newSkills = [...skills, currentSkill];
//       setSkills(newSkills);
//       form.setValue('requiredSkills', newSkills);
//       setCurrentSkill('');
//     }
//   };

//   const removeSkill = (skillToRemove: string) => {
//     const newSkills = skills.filter(skill => skill !== skillToRemove);
//     setSkills(newSkills);
//     form.setValue('requiredSkills', newSkills);
//   };

//   const onSubmit = async (data: z.infer<typeof projectSchema>) => {
//     if (!user?.uid) {
//       toast.error('You must be logged in to post a project');
//       return;
//     }

//     try {
//       await addDoc(collection(db, 'freelanceProjects'), {
//         ...data,
//         authorId: user.uid,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });

//       toast.success('Project Posted Successfully!');
//       form.reset();
//       setSkills([]);
//     } catch (error) {
//       console.error('Error creating project:', error);
//       toast.error('Failed to post project');
//     }
//   };

//   return (
//     <div className="container mx-auto py-12 px-4">
//       <Toaster position="top-right" toastOptions={{ style: { background: '#000', color: '#fff', border: '1px solid #333' } }} />
//       <Card className="max-w-3xl mx-auto bg-white border border-black rounded-none shadow-none">
//         <CardHeader className="border-b border-black">
//           <CardTitle className="text-xl font-normal tracking-tight flex items-center">
//             <Briefcase className="w-5 h-5 mr-2 stroke-1" /> New Project
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <FormField
//                   control={form.control}
//                   name="title"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs uppercase tracking-wide font-medium">Project Title</FormLabel>
//                       <FormControl>
//                         <Input 
//                           placeholder="Enter project title" 
//                           {...field} 
//                           className="rounded-none border-black focus:ring-black focus:border-black" 
//                         />
//                       </FormControl>
//                       <FormMessage className="text-black" />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="projectType"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs uppercase tracking-wide font-medium">Project Type</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger className="rounded-none border-black focus:ring-black">
//                             <SelectValue placeholder="Select project type" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent className="rounded-none border-black">
//                           <SelectItem value="web">Web Development</SelectItem>
//                           <SelectItem value="mobile">Mobile Development</SelectItem>
//                           <SelectItem value="design">Design</SelectItem>
//                           <SelectItem value="writing">Writing</SelectItem>
//                           <SelectItem value="other">Other</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage className="text-black" />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-xs uppercase tracking-wide font-medium">Project Description</FormLabel>
//                     <FormControl>
//                       <Textarea 
//                         placeholder="Provide detailed project description" 
//                         className="min-h-32 rounded-none border-black focus:ring-black focus:border-black"
//                         {...field} 
//                       />
//                     </FormControl>
//                     <FormMessage className="text-black" />
//                   </FormItem>
//                 )}
//               />

//               <div className="grid md:grid-cols-3 gap-6">
//                 <FormField
//                   control={form.control}
//                   name="budget"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs uppercase tracking-wide font-medium">Budget</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//                           <Input 
//                             type="number" 
//                             placeholder="Project budget" 
//                             {...field} 
//                             className="pl-10 rounded-none border-black focus:ring-black focus:border-black" 
//                           />
//                         </div>
//                       </FormControl>
//                       <FormMessage className="text-black" />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="deadline"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs uppercase tracking-wide font-medium">Deadline</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//                           <Input 
//                             type="date" 
//                             {...field} 
//                             value={field.value.toISOString().split('T')[0]} 
//                             onChange={(e) => field.onChange(new Date(e.target.value))}
//                             className="pl-10 rounded-none border-black focus:ring-black focus:border-black"
//                           />
//                         </div>
//                       </FormControl>
//                       <FormMessage className="text-black" />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="complexity"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs uppercase tracking-wide font-medium">Complexity</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger className="rounded-none border-black focus:ring-black">
//                             <SelectValue placeholder="Project complexity" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent className="rounded-none border-black">
//                           <SelectItem value="beginner">Beginner</SelectItem>
//                           <SelectItem value="intermediate">Intermediate</SelectItem>
//                           <SelectItem value="advanced">Advanced</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage className="text-black" />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <FormItem>
//                   <FormLabel className="text-xs uppercase tracking-wide font-medium">Required Skills</FormLabel>
//                   <div className="flex items-center space-x-2">
//                     <Input 
//                       value={currentSkill}
//                       onChange={(e) => setCurrentSkill(e.target.value)}
//                       placeholder="Add skills" 
//                       onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
//                       className="rounded-none border-black focus:ring-black focus:border-black"
//                     />
//                     <Button 
//                       type="button" 
//                       onClick={addSkill}
//                       className="rounded-none bg-black text-white hover:bg-gray-800"
//                     >
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <div className="flex flex-wrap gap-2 mt-3">
//                     {skills.map((skill) => (
//                       <div 
//                         key={skill} 
//                         className="inline-flex items-center bg-gray-100 px-3 py-1 text-sm border border-black"
//                       >
//                         {skill}
//                         <button 
//                           type="button" 
//                           onClick={() => removeSkill(skill)}
//                           className="ml-2"
//                         >
//                           <X className="h-3 w-3" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                   {form.formState.errors.requiredSkills && (
//                     <p className="text-sm text-black mt-1">
//                       {form.formState.errors.requiredSkills.message}
//                     </p>
//                   )}
//                 </FormItem>

//                 <FormField
//                   control={form.control}
//                   name="contactEmail"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs uppercase tracking-wide font-medium">Contact Email</FormLabel>
//                       <FormControl>
//                         <Input 
//                           type="email" 
//                           placeholder="Your contact email" 
//                           {...field}
//                           className="rounded-none border-black focus:ring-black focus:border-black" 
//                         />
//                       </FormControl>
//                       <FormMessage className="text-black" />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <Separator className="bg-black" />

//               <Button 
//                 type="submit" 
//                 className="w-full rounded-none bg-black text-white hover:bg-gray-800 font-normal tracking-wide"
//               >
//                 Submit Project
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }









'use client';

import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Tag, 
  FileText, 
  Users, 
  Plus,
  X
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Project Creation Schema with Zod Validation
const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  budget: z.string().refine(val => !isNaN(Number(val)), { message: "Budget must be a number" }),
  deadline: z.date(),
  projectType: z.enum(["web", "mobile", "design", "writing", "other"]),
  requiredSkills: z.array(z.string()).min(1, "At least one skill is required"),
  complexity: z.enum(["beginner", "intermediate", "advanced"]),
  paymentTerms: z.enum(["fixed", "hourly", "milestone"]),
  contactEmail: z.string().email("Invalid email address"),
});

export default function CreateFreelancePage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
      deadline: new Date(),
      projectType: "other",
      requiredSkills: [],
      complexity: "beginner",
      paymentTerms: "fixed",
      contactEmail: user?.email || "",
    }
  });

  const addSkill = () => {
    if (currentSkill && !skills.includes(currentSkill)) {
      const newSkills = [...skills, currentSkill];
      setSkills(newSkills);
      form.setValue('requiredSkills', newSkills);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    form.setValue('requiredSkills', newSkills);
  };

  const onSubmit = async (data: z.infer<typeof projectSchema>) => {
    if (!user?.uid) {
      toast.error('You must be logged in to post a project');
      return;
    }

    try {
      await addDoc(collection(db, 'freelanceProjects'), {
        ...data,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Project Posted Successfully!');
      form.reset();
      setSkills([]);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to post project');
    }
  };

  return (
    <div className="px-4 py-6 sm:py-12 w-full">
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          style: { 
            background: '#000', 
            color: '#fff', 
            border: '1px solid #333',
            borderRadius: '0', 
            padding: '16px', 
            maxWidth: '90vw',
            width: '100%',
            textAlign: 'center'
          } 
        }} 
      />
      
      <Card className="w-full mx-auto bg-white border border-black rounded-none shadow-none sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <CardHeader className="border-b border-black px-4 py-4 sm:px-6 sm:py-5">
          <CardTitle className="text-xl font-normal tracking-wide flex items-center justify-center sm:justify-start">
            <Briefcase className="w-5 h-5 mr-2 stroke-1" /> 
            <span className="uppercase tracking-widest text-sm sm:text-base">New Project</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title and Project Type - Stack on mobile, side by side on tablet+ */}
              <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider font-medium text-gray-900">Project Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter project title" 
                          {...field} 
                          className="rounded-none border-black focus:ring-0 focus:border-2 focus:border-black mt-1" 
                        />
                      </FormControl>
                      <FormMessage className="text-black" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider font-medium text-gray-900">Project Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-none border-black focus:ring-0 focus:border-2 focus:border-black mt-1">
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none border-black">
                          <SelectItem value="web">Web Development</SelectItem>
                          <SelectItem value="mobile">Mobile Development</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="writing">Writing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-black" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider font-medium text-gray-900">Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide detailed project description" 
                        className="min-h-32 rounded-none border-black focus:ring-0 focus:border-2 focus:border-black mt-1"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-black" />
                  </FormItem>
                )}
              />

              {/* Budget, Deadline, Complexity - Stack on mobile, side by side on tablet+ */}
              <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider font-medium text-gray-900">Budget</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            type="number" 
                            placeholder="Project budget" 
                            {...field} 
                            className="pl-10 rounded-none border-black focus:ring-0 focus:border-2 focus:border-black mt-1" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-black" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider font-medium text-gray-900">Deadline</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            type="date" 
                            {...field} 
                            value={field.value.toISOString().split('T')[0]} 
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                            className="pl-10 rounded-none border-black focus:ring-0 focus:border-2 focus:border-black mt-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-black" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="complexity"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2 md:col-span-1">
                      <FormLabel className="text-xs uppercase tracking-wider font-medium text-gray-900">Complexity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-none border-black focus:ring-0 focus:border-2 focus:border-black mt-1">
                            <SelectValue placeholder="Project complexity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none border-black">
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-black" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Skills and Email - Stack on mobile, side by side on tablet+ */}
              <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-medium text-gray-900">Required Skills</FormLabel>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-grow">
                      <Input 
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        placeholder="Add skills" 
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="rounded-none border-black focus:ring-0 focus:border-2 focus:border-black w-full"
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={addSkill}
                      className="rounded-none bg-black text-white hover:bg-gray-800 aspect-square p-2 h-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill) => (
                      <div 
                        key={skill} 
                        className="inline-flex items-center bg-gray-100 px-3 py-1 text-sm border border-black"
                      >
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => removeSkill(skill)}
                          className="ml-2"
                          aria-label={`Remove ${skill}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {skills.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No skills added yet</p>
                    )}
                  </div>
                  {form.formState.errors.requiredSkills && (
                    <p className="text-sm text-black mt-1">
                      {form.formState.errors.requiredSkills.message}
                    </p>
                  )}
                </FormItem>

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider font-medium text-gray-900">Contact Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Your contact email" 
                          {...field}
                          className="rounded-none border-black focus:ring-0 focus:border-2 focus:border-black mt-1" 
                        />
                      </FormControl>
                      <FormMessage className="text-black" />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-black my-8" />

              <Button 
                type="submit" 
                className="w-full rounded-none bg-black text-white hover:bg-gray-800 font-normal tracking-wide py-6 text-sm"
              >
                SUBMIT PROJECT
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}