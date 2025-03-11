'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StudentProfile } from '@/types/user';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Linkedin, Github, Globe, X, GraduationCap, Book, Calendar, Briefcase, Code } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ImageUploader from '@/components/common/ImageUploader';
import toast from 'react-hot-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditStudentProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function EditStudentProfile({ isOpen, onClose, onSave }: EditStudentProfileProps) {
  const { profile, updateUserProfile } = useAuth();
  const studentProfile = profile as StudentProfile;
  
  // Initialize state with profile data
  const [formData, setFormData] = useState({
    profileImg: '',
    bio: '',
    education: '',
    major: '',
    graduationYear: '',
    skills: '',
    projects: '',
    linkedin: '',
    github: '',
    website: '',
    experience: ''
  });

  // Load profile data when component mounts or profile changes
  useEffect(() => {
    if (studentProfile) {
      setFormData({
        profileImg: studentProfile.profileImg || '',
        bio: studentProfile.bio || '',
        education: studentProfile.education || '',
        major: studentProfile.major || '',
        graduationYear: studentProfile.graduationYear || '',
        skills: studentProfile.skills?.join(', ') || '',
        projects: studentProfile.projects?.map(p => `${p.title}::${p.description}::${p.link}`).join('\n') || '',
        linkedin: studentProfile.linkedin || '',
        github: studentProfile.github || '',
        website: studentProfile.website || '',
        experience: studentProfile.experience || ''
      });
    }
  }, [studentProfile]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInputValue, setSkillInputValue] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([]);

  // Load skills into array for better UI
  useEffect(() => {
    if (formData.skills) {
      setSkillsList(formData.skills.split(',').map(s => s.trim()).filter(Boolean));
    }
  }, [formData.skills]);

  const handleAddSkill = () => {
    if (skillInputValue.trim()) {
      const newSkills = [...skillsList, skillInputValue.trim()];
      setSkillsList(newSkills);
      setFormData({ ...formData, skills: newSkills.join(', ') });
      setSkillInputValue('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skillsList.filter(skill => skill !== skillToRemove);
    setSkillsList(updatedSkills);
    setFormData({ ...formData, skills: updatedSkills.join(', ') });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const saveToast = toast.loading('Saving your profile...');

    try {
      const projects = formData.projects
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [title, description, link] = line.split('::');
          return { title: title || '', description: description || '', link: link || '' };
        });

      const updatedProfile = {
        ...studentProfile,
        profileImg: formData.profileImg,
        bio: formData.bio,
        education: formData.education,
        major: formData.major,
        graduationYear: formData.graduationYear,
        skills: skillsList,
        projects,
        linkedin: formData.linkedin,
        github: formData.github,
        website: formData.website,
        experience: formData.experience
      };

      await updateUserProfile(updatedProfile);
      toast.success('Profile updated successfully!', { id: saveToast });
      onSave();
      onClose();
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', { id: saveToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-3xl p-0 h-[90vh] md:h-auto">
        <DialogHeader className="p-4 md:p-6 border-b sticky top-0 bg-white z-10">
          <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute right-4 top-4"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <ScrollArea className="p-4 md:p-6 h-[calc(90vh-60px)] md:h-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Profile Image and Basic Info */}
              <div className="md:col-span-1 space-y-6">
                <div className="space-y-2">
                  <Label className="text-base flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Profile Image
                  </Label>
                  <ImageUploader
                    currentImage={formData.profileImg}
                    onUpload={(url) => setFormData({ ...formData, profileImg: url })}
                    onRemove={() => setFormData({ ...formData, profileImg: '' })}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Book className="h-4 w-4" />
                    Education
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="education">University</Label>
                    <Input
                      id="education"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="University name"
                      className="transition-all focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <Input
                      id="major"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      placeholder="Field of study"
                      className="transition-all focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graduationYear" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Graduation Year
                    </Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      placeholder="Expected year"
                      className="transition-all focus-visible:ring-blue-500"
                      min="2000"
                      max="2100"
                    />
                  </div>
                </div>
              </div>

              {/* Middle Column - Bio and Skills */}
              <div className="md:col-span-1 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500">About You</h3>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="min-h-[100px] resize-y transition-all focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Skills
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="skills"
                        value={skillInputValue}
                        onChange={(e) => setSkillInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add a skill..."
                        className="flex-1 transition-all focus-visible:ring-blue-500"
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddSkill}
                        size="sm"
                        variant="secondary"
                      >
                        Add
                      </Button>
                    </div>
                    
                    {/* Skills badges */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skillsList.map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          {skill}
                          <X 
                            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Experience
                    </Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="Professional experience summary"
                      className="transition-all focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Projects and Social Links */}
              <div className="md:col-span-1 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500">Projects</h3>
                  <div className="space-y-2">
                    <Label htmlFor="projects">Your Work</Label>
                    <Textarea
                      id="projects"
                      value={formData.projects}
                      onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                      rows={6}
                      placeholder={`Project Title::Description::Link\nAnother Project::Details::URL`}
                      className="min-h-[150px] font-mono text-sm resize-y transition-all focus-visible:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">
                      Format: Title::Description::Link (one per line)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500">Social Links</h3>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      LinkedIn
                    </Label>
                    <Input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="transition-all focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                      <Github className="h-4 w-4" />
                      GitHub
                    </Label>
                    <Input
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      placeholder="https://github.com/username"
                      className="transition-all focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                      <Globe className="h-4 w-4 text-green-600" />
                      Website
                    </Label>
                    <Input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourportfolio.com"
                      className="transition-all focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 sticky bottom-0 bg-white">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
                className="transition-all"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 transition-all"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}