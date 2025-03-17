"use client";

import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/firebase';
import { Avatar } from '@radix-ui/react-avatar';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { CalendarIcon, Search, Video, MessageSquare, Users, Share2, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import JoinedCollegesSection from '@/components/college/JoinedCollegesSection';
import { StudentProfile } from '@/types/user';
import { useAuth } from '@/context/AuthContext';

const Page = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { profile } = useAuth();

   const studentProfile = profile as StudentProfile;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      

    });
    
    return () => unsubscribe();
  }, []);

  







  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 border-b">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Student.io
              </h1>
              <div className="hidden md:flex relative w-64">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-8"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <CalendarIcon className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    {user?.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                    ) : (
                      <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    )}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-24 px-4">
        <Card className="mb-6 border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border">
                  {user?.photoURL ? (
                    <AvatarImage src={user.photoURL} alt={user?.displayName || 'User'} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-lg">
                      {user?.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{user?.displayName || 'User'}</h2>
                  <p className="text-gray-500">{user?.email || ''}</p>
                </div>
              </div>
              
            </div>
          </CardContent>
        </Card>


      </div>
          {/* Joined Colleges Section */}
              <div className="mt-6">
                <JoinedCollegesSection userId={profile?.uid} />
              </div>


      <div className="h-18"></div>
      <Navbar />
    </div>
  );
};

export default Page;