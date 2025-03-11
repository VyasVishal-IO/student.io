'use client';

import { useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function CreatePage() {
  const [section, setSection] = useState("all");
  
  const contentTypes = [
    { name: 'Post', path: '/create/post', section: 'content' },
    { name: 'Project', path: '/create/project', section: 'content' },
    { name: 'Article', path: '/create/article', section: 'content' },
    { name: 'Notes', path: '/create/notes', section: 'content' },
    { name: 'Tweet', path: '/create/tweet', section: 'social' },
    { name: 'Event', path: '/create/event', section: 'student' },
    { name: 'Job Opening', path: '/create/job', section: 'student' },
    { name: 'Freelance Project', path: '/create/freelance', section: 'student' },
  ];

  const filteredContent = section === "all" 
    ? contentTypes 
    : contentTypes.filter(item => item.section === section);

  // Get unique sections for the selector pills
  const sections = ["all", ...new Set(contentTypes.map(item => item.section))];

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-8 py-20">
          <div className="flex flex-col space-y-12">
            <div className="flex flex-col space-y-6">
              <h1 className="text-5xl font-light tracking-tight">Create</h1>
              
              {/* Modern selector pills instead of dropdown */}
              <div className="flex space-x-2">
                {sections.map((sectionName) => (
                  <button
                    key={sectionName}
                    onClick={() => setSection(sectionName)}
                    className={`px-4 py-2 text-sm transition-all ${
                      section === sectionName
                        ? "bg-black text-white"
                        : "bg-white text-black border border-gray-200 hover:border-black"
                    }`}
                  >
                    {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredContent.map((item) => (
                <Link key={item.path} href={item.path} className="group">
                  <div className="p-6 border border-gray-100 hover:border-black transition-all duration-300 h-full flex items-center justify-between group-hover:bg-gray-50">
                    <div className="flex flex-col">
                      <span className="text-xl font-light">{item.name}</span>
                      <span className="text-sm text-gray-400 mt-2 group-hover:text-black transition-colors">
                        {item.section}
                      </span>
                    </div>
                    <div className="h-10 w-10 border border-gray-200 rounded-full flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all">
                      <Plus className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>



      <Navbar />
    </AuthGuard>

  );
}