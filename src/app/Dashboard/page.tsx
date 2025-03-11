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

const Page = () => {
  const [user, setUser] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [recentMeetings, setRecentMeetings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      
      // If user is logged in, fetch their recent meetings
      if (user) {
        // This would be a real API call in production
        fetchRecentMeetings(user.uid);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Mock function to fetch recent meetings - in production this would be a real API call
  const fetchRecentMeetings = (userId) => {
    // Simulate API response
    const mockMeetings = [
      { 
        id: generateMeetingId(), 
        name: 'Team Standup', 
        lastJoined: '2 days ago', 
        duration: '45 minutes',
        isRecurring: true
      },
      { 
        id: generateMeetingId(), 
        name: 'Product Review', 
        lastJoined: 'Yesterday', 
        duration: '1 hour 15 minutes',
        isRecurring: false
      }
    ];
    
    setRecentMeetings(mockMeetings);
  };

  const generateMeetingId = () => {
    return Math.random().toString(36).substring(2, 12);
  };

  const handleCreateMeeting = async () => {
    const meetingId = generateMeetingId();
    
    const meetingData = {
      id: meetingId,
      hostId: user?.uid,
      hostName: user?.displayName || 'Anonymous',
      createdAt: new Date().toISOString(),
      participants: [],
      settings: {
        requireHostApproval: true,
        allowChat: true,
        allowScreenSharing: true,
        muteParticipantsOnEntry: true
      }
    };
    
    try {
      // Simulate API call to create meeting
      console.log('Creating meeting:', meetingData);
      
      // Show success message
      toast.success('Meeting created! You are the host.');
      
      // Navigate to meeting page
      router.push(`/meeting/${meetingId}`);
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting. Please try again.');
    }
  };
  
  const handleJoinMeeting = async (e) => {
    e.preventDefault();
    
    if (!joinCode || joinCode.trim() === '') {
      toast.error('Please enter a valid meeting code');
      return;
    }
    
    try {
      // Simulate API call to verify meeting
      const meetingExists = true; // Replace with actual API call
      
      if (meetingExists) {
        toast.success('Joining meeting...');
        router.push(`/meeting/${joinCode.trim()}`);
      } else {
        toast.error('Meeting not found. Please check the code and try again.');
      }
    } catch (error) {
      console.error('Error joining meeting:', error);
      toast.error('Failed to join meeting. Please try again.');
    }
  };

  const joinRecentMeeting = (meetingId) => {
    toast.success('Joining recent meeting...');
    router.push(`/meeting/${meetingId}`);
  };

  const shareMeetingLink = (meetingId) => {
    const link = `https://student.io/meeting/${meetingId}`;
    navigator.clipboard.writeText(link);
    toast.success('Meeting link copied to clipboard!');
  };

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
              
              <Button 
                onClick={handleCreateMeeting}
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Video className="mr-2 h-5 w-5" />
                Create Meeting
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">New Meeting</h3>
                <p className="text-gray-500 text-sm mb-4">Start an instant meeting with video</p>
                <Button 
                  onClick={handleCreateMeeting}
                  variant="outline" 
                  className="w-full"
                >
                  Start Now
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Join Meeting</h3>
                <p className="text-gray-500 text-sm mb-4">Join using a meeting code</p>
                <form onSubmit={handleJoinMeeting} className="w-full">
                  <div className="flex w-full gap-2">
                    <Input 
                      placeholder="Enter meeting code" 
                      className="flex-1"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                    />
                    <Button type="submit" variant="outline">Join</Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <CalendarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Schedule</h3>
                <p className="text-gray-500 text-sm mb-4">Plan a meeting for later</p>
                <Button variant="outline" className="w-full">
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold mb-4">Recent Meetings</h2>
        <div className="grid grid-cols-1 gap-4">
          {recentMeetings.length > 0 ? (
            recentMeetings.map((meeting, index) => (
              <Card key={meeting.id} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{meeting.name}</h3>
                      <p className="text-sm text-gray-500">Last joined {meeting.lastJoined} • {meeting.duration}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => shareMeetingLink(meeting.id)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => joinRecentMeeting(meeting.id)}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border shadow-sm">
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">No recent meetings. Create a new meeting to get started!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;