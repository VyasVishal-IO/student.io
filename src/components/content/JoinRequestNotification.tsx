import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { 
  doc, 
  updateDoc, 
  deleteDoc, 
  collection,
  query, 
  where, 
  getDocs, 
  arrayUnion,
  Timestamp,
  onSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

// UI Components
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { 
  Check, 
  X, 
  UserPlus, 
  AlertCircle,
  Clock,
  Calendar,
  MessageSquare
} from "lucide-react";

import { JoinRequest } from "@/types/content";

interface JoinRequestNotificationProps {
  projectId: string;
  joinRequests?: JoinRequest[];
  className?: string;
  maxHeight?: string;
}

export function JoinRequestNotification({ 
  projectId, 
  joinRequests = [],
  className = "",
  maxHeight = "h-64"
}: JoinRequestNotificationProps) {
  
  const { user } = useAuth();
  const [requests, setRequests] = useState<JoinRequest[]>(joinRequests);
  const [isLoading, setIsLoading] = useState(joinRequests.length === 0);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  // Live updates using onSnapshot
  useEffect(() => {
    if (!projectId) return;
    
    setIsLoading(true);
    
    const requestsQuery = query(
      collection(db, "joinRequests"),
      where("projectId", "==", projectId),
      where("status", "==", "pending")
    );
    
    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const requestsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as JoinRequest));
      
      setRequests(requestsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching join requests:", error);
      toast.error("Failed to load join requests");
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [projectId]);

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: Timestamp) => {
    if (!timestamp) return "Unknown time";
    
    const now = new Date();
    const requestDate = timestamp.toDate();
    const diffInMs = now.getTime() - requestDate.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) {
      return `${diffInMins} ${diffInMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  // Handle accept join request with optimistic UI updates
  const handleAcceptRequest = async (request: JoinRequest) => {
    try {
      // Update join request status
      await updateDoc(doc(db, "joinRequests", request.id), {
        status: "accepted"
      });
  
      // Add user to project members
      await updateDoc(doc(db, "projects", projectId), {
        currentMembers: arrayUnion(request.userId)
      });
  
      toast.success("Request accepted successfully!");
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request");
    }
  }

  // Handle reject join request
  const handleRejectRequest = async (request: JoinRequest) => {
    try {
      setProcessingIds(prev => [...prev, request.id]);
      
      // Optimistic UI update
      setRequests(prev => prev.filter(r => r.id !== request.id));

      // Update the join request instead of deleting it
      await updateDoc(doc(db, "joinRequests", request.id), {
        status: "rejected",
        respondedAt: Timestamp.now(),
        respondedBy: user?.uid
      });

      // Create notification for the requesting user
      const notificationRef = collection(db, "notifications");
      await addDoc(notificationRef, {
        userId: request.userId,
        type: "request_rejected",
        projectId: projectId,
        message: `Your request to join the project was not approved at this time`,
        createdAt: Timestamp.now(),
        isRead: false
      });

      toast.success(`Request from ${request.userName} was declined`, {
        icon: '❌',
        duration: 4000
      });
    } catch (error) {
      console.error("Error rejecting join request:", error);
      
      // Revert optimistic update
      if (joinRequests.find(r => r.id === request.id)) {
        setRequests(joinRequests);
      }
      
      toast.error("Failed to reject join request");
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== request.id));
      setSelectedRequest(null);
    }
  };

  // Confirm rejection with alert dialog
  const confirmRejectRequest = (request: JoinRequest) => {
    setSelectedRequest(request);
    setIsAlertOpen(true);
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-6 w-6 text-blue-500" />
            Join Requests
            <Skeleton className="ml-2 w-8 h-6 rounded-full" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className={`${maxHeight} w-full rounded-md border p-4`}>
            {[1, 2, 3].map((item) => (
              <div key={item} className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
                <Separator className="my-4" />
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // Render no requests message
  if (requests.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-6 w-6 text-blue-500" />
            Join Requests
          </CardTitle>
          <CardDescription>
            Manage team member requests here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mb-4 text-gray-400" />
            <p className="text-center font-medium">No pending join requests</p>
            <p className="text-center text-sm mt-2">
              When someone requests to join your project, they'll appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Toaster position="top-right" />
      
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-6 w-6 text-blue-500" />
            Join Requests
            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
              {requests.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Review and manage people who want to join your project
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className={`${maxHeight} w-full rounded-md`}>
            {requests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-blue-100">
                      <AvatarImage src={request.userAvatar || `/user-avatars/${request.userId}.jpg`} />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {request.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{request.userName}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatRelativeTime(request.createdAt)}</span>
                      </div>
                      {request.message && (
                        <div className="mt-2 text-xs p-2 bg-slate-50 rounded-md border border-slate-100 max-w-xs">
                          <div className="flex">
                            <MessageSquare className="h-3 w-3 mr-1 mt-0.5 text-slate-400" />
                            <p className="text-slate-600">{request.message}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-full h-8 px-3 border-green-200 bg-green-50 hover:bg-green-100 text-green-700"
                          onClick={() => handleAcceptRequest(request)}
                          disabled={processingIds.includes(request.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          <span>Accept</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Accept Request</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-full h-8 px-3 border-red-200 bg-red-50 hover:bg-red-100 text-red-700"
                          onClick={() => confirmRejectRequest(request)}
                          disabled={processingIds.includes(request.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          <span>Decline</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Decline Request</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <Separator className="my-4" />
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        {requests.length > 0 && (
          <CardFooter className="flex justify-between pt-4 pb-4 px-6 bg-slate-50 text-xs text-slate-500">
            <div className="flex items-center">
              <UserPlus className="h-3 w-3 mr-1 text-blue-500" />
              <span>{requests.length} pending {requests.length === 1 ? 'request' : 'requests'}</span>
            </div>
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-xs"
              onClick={() => {
                // Handle viewing all requests history
              }}
            >
              View History
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Join Request?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decline the request from <span className="font-medium">{selectedRequest?.userName}</span>?
              You can leave a message explaining why if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-3">
            <textarea 
              className="w-full rounded-md border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional: Add a message for the user (will not be sent)"
              rows={3}
            />
          </div>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (selectedRequest) {
                  handleRejectRequest(selectedRequest);
                  setIsAlertOpen(false);
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Decline Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}