// // src/components/profile/EditTeacherProfile.tsx
// 'use client';

// import { useState, FormEvent } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { TeacherProfile } from '@/types/user';

// interface EditTeacherProfileProps {
//   onCancel: () => void;
//   onComplete: () => void;
// }

// export default function EditTeacherProfile({ onCancel, onComplete }: EditTeacherProfileProps) {
//   const { profile, updateUserProfile } = useAuth();
//   const teacherProfile = profile as TeacherProfile;
  
//   const [formData, setFormData] = useState({
//     department: teacherProfile?.department || '',
//     subjects: teacherProfile?.subjects?.join(', ') || '',
//     bio: teacherProfile?.bio || '',
//     experience: teacherProfile?.experience?.toString() || '',
//   });
  
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };
  
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     try {
//       // Convert comma-separated strings to arrays and experience to number
//       const updatedProfile = {
//         department: formData.department,
//         subjects: formData.subjects ? formData.subjects.split(',').map(subject => subject.trim()) : [],
//         bio: formData.bio,
//         experience: formData.experience ? parseInt(formData.experience) : undefined,
//       };
      
//       await updateUserProfile(updatedProfile);
//       onComplete();
//     } catch (error) {
//       console.error('Error updating profile:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   return (
//     <div className="overflow-hidden bg-white shadow sm:rounded-lg">
//       <div className="px-4 py-5 sm:px-6">
//         <h3 className="text-lg font-medium leading-6 text-gray-900">
//           Edit Teacher Profile
//         </h3>
//         <p className="max-w-2xl mt-1 text-sm text-gray-500">
//           Update your professional details and teaching information.
//         </p>
//       </div>
      
//       <form onSubmit={handleSubmit} className="px-4 py-5 space-y-6 border-t border-gray-200 sm:px-6">
//         <div>
//           <label htmlFor="department" className="block text-sm font-medium text-gray-700">
//             Department
//           </label>
//           <input
//             type="text"
//             name="department"
//             id="department"
//             value={formData.department}
//             onChange={handleChange}
//             className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="e.g., Computer Science Department"
//           />
//         </div>
        
//         <div>
//           <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">
//             Subjects (comma-separated)
//           </label>
//           <input
//             type="text"
//             name="subjects"
//             id="subjects"
//             value={formData.subjects}
//             onChange={handleChange}
//             className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="e.g., Algorithms, Database Management, Web Development"
//           />
//         </div>
        
//         <div>
//           <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
//             Biography
//           </label>
//           <textarea
//             name="bio"
//             id="bio"
//             rows={3}
//             value={formData.bio}
//             onChange={handleChange}
//             className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="Tell us about your teaching experience and interests"
//           />
//         </div>
        
//         <div>
//           <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
//             Experience (years)
//           </label>
//           <input
//             type="number"
//             name="experience"
//             id="experience"
//             min="0"
//             value={formData.experience}
//             onChange={handleChange}
//             className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="e.g., 5"
//           />
//         </div>
        
//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

'use client';

import { useState, FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { Save, X, BookOpen, Building, Clock, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { TeacherProfile } from '@/types/user';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";

interface EditTeacherProfileProps {
  onCancel: () => void;
  onComplete: () => void;
}

export default function EditTeacherProfile({ onCancel, onComplete }: EditTeacherProfileProps) {
  const { profile, updateUserProfile } = useAuth();
  const teacherProfile = profile as TeacherProfile;
  
  const [formData, setFormData] = useState({
    department: teacherProfile?.department || '',
    subjects: teacherProfile?.subjects?.join(', ') || '',
    bio: teacherProfile?.bio || '',
    experience: teacherProfile?.experience?.toString() || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate inputs
      if (formData.experience && isNaN(Number(formData.experience))) {
        toast.error("Experience must be a number");
        setIsSubmitting(false);
        return;
      }
      
      // Convert comma-separated strings to arrays and experience to number
      const updatedProfile = {
        department: formData.department.trim(),
        subjects: formData.subjects ? formData.subjects.split(',').map(subject => subject.trim()) : [],
        bio: formData.bio.trim(),
        experience: formData.experience ? parseInt(formData.experience) : undefined,
      };
      
      await updateUserProfile(updatedProfile);
      toast.success("Profile updated successfully");
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Edit Profile</CardTitle>
        </div>
        <CardDescription>
          Update your professional details and teaching information
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building size={18} />
              <h3 className="text-lg font-medium">Department Information</h3>
            </div>
            <Separator />
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="e.g., Computer Science Department"
                  value={formData.department}
                  onChange={handleChange}
                />
                <p className="text-sm text-gray-500">Your academic department or faculty</p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  placeholder="e.g., 5"
                  value={formData.experience}
                  onChange={handleChange}
                />
                <p className="text-sm text-gray-500">Years of teaching experience</p>
              </div>
            </div>
          </div>
          
          {/* Teaching Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              <h3 className="text-lg font-medium">Teaching Details</h3>
            </div>
            <Separator />
            
            <div className="grid gap-2">
              <Label htmlFor="subjects">Subjects (comma-separated)</Label>
              <Input
                id="subjects"
                name="subjects"
                placeholder="e.g., Algorithms, Database Management, Web Development"
                value={formData.subjects}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500">List the subjects you teach or specialize in</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell students about your teaching philosophy, experience, and interests"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="resize-none"
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X size={16} className="mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></span>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}