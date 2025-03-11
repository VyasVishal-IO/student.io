// File: app/meeting/[meetingId]/page.js
"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Share2, MessageSquare,
  Users, X, CheckCircle, XCircle, Crown, Shield, HandMetal,
  Send, Bell, User, Copy, MoreVertical
} from 'lucide-react';
// Import required UI components
// import { Button, Input, Avatar, Tooltip, Dialog, Popover, ScrollArea } from '@/components/ui';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { Dialog } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { auth, db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  onSnapshot, addDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';

const MeetingPage = () => {
  const router = useRouter();
  const { meetingId } = useParams();
  const [user, setUser] = useState(null);
  const [meetingData, setMeetingData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Media states
  const localVideoRef = useRef(null);
  const screenShareRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const messagesEndRef = useRef(null);

  // UI states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showEndMeetingDialog, setShowEndMeetingDialog] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [layout, setLayout] = useState('grid');

  // Meeting state
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [joinRequests, setJoinRequests] = useState([]);

  // Media controls
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setLayout(window.innerWidth <= 768 ? 'grid' : layout);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Media initialization
  const initializeMedia = useCallback(async (audio = true, video = true) => {
    try {
      const constraints = { audio, video };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (video && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      mediaStreamRef.current = stream;
      return true;
    } catch (error) {
      console.error('Media access error:', error);
      toast.error(`Could not access ${video ? 'camera' : 'microphone'}`);
      return false;
    }
  }, []);

  // WebRTC configuration
  const setupPeerConnection = useCallback((peerId, isInitiator = false) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    peerConnectionsRef.current[peerId] = pc;

    mediaStreamRef.current?.getTracks().forEach(track => 
      pc.addTrack(track, mediaStreamRef.current)
    );

    pc.onicecandidate = e => e.candidate && socketRef.current.emit('ice-candidate', {
      to: peerId,
      candidate: e.candidate
    });

    pc.ontrack = e => {
      const video = document.getElementById(`video-${peerId}`);
      if (video) video.srcObject = e.streams[0];
      setParticipants(prev => prev.map(p => 
        p.id === peerId ? { ...p, hasMedia: true } : p
      ));
    };

    if (isInitiator) {
      pc.createOffer().then(offer => pc.setLocalDescription(offer))
        .then(() => socketRef.current.emit('offer', {
          to: peerId,
          offer: pc.localDescription
        }));
    }

    return pc;
  }, []);

  // Socket initialization
  const socketRef = useRef(null);
  const setupSocket = useCallback((userId, name) => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: { meetingId, userId, name }
    });

    socketRef.current.on('offer', async ({ from, offer }) => {
      const pc = setupPeerConnection(from);
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current.emit('answer', { to: from, answer });
    });

    socketRef.current.on('answer', ({ from, answer }) => {
      const pc = peerConnectionsRef.current[from];
      if (pc) pc.setRemoteDescription(answer);
    });

    socketRef.current.on('ice-candidate', ({ from, candidate }) => {
      const pc = peerConnectionsRef.current[from];
      if (pc) pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socketRef.current.on('participantJoined', ({ userId }) => {
      if (userId !== user?.uid) setupPeerConnection(userId, true);
    });

    socketRef.current.on('participantLeft', ({ userId }) => {
      const pc = peerConnectionsRef.current[userId];
      if (pc) pc.close();
      delete peerConnectionsRef.current[userId];
      setParticipants(prev => prev.filter(p => p.id !== userId));
    });
  }, [setupPeerConnection, user]);

  // Firestore listeners
  const setupFirestoreListeners = useCallback(() => {
    // Participants listener
    const participantsQuery = query(
      collection(db, 'meetings', meetingId, 'participants'),
      where('leftAt', '==', null)
    );
    const participantsUnsub = onSnapshot(participantsQuery, (snapshot) => {
      const participantsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isHost: doc.id === meetingData?.hostId
      }));
      setParticipants(participantsData);
    });

    // Messages listener
    const messagesQuery = query(
      collection(db, 'meetings', meetingId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const messagesUnsub = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });

    return () => {
      participantsUnsub();
      messagesUnsub();
    };
  }, [meetingId, meetingData]);

  // Initial load
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return router.push(`/login?redirect=/meeting/${meetingId}`);
      
      try {
        const meetingSnap = await getDoc(doc(db, 'meetings', meetingId));
        if (!meetingSnap.exists()) throw new Error('Meeting not found');
        
        const meetingData = meetingSnap.data();
        setMeetingData(meetingData);
        setIsHost(user.uid === meetingData.hostId);

        // Check participant status
        const participantSnap = await getDoc(doc(db, 'meetings', meetingId, 'participants', user.uid));
        if (!participantSnap.exists() && meetingData.requireApproval) {
          await requestToJoin(user);
          return toast.success('Join request sent');
        }

        // Initialize media and connections
        await initializeMedia();
        setupSocket(user.uid, user.displayName);
        setupFirestoreListeners();
      } catch (error) {
        toast.error(error.message);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribe();
      socketRef.current?.disconnect();
      Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [meetingId, router, initializeMedia, setupSocket, setupFirestoreListeners]);

  // Chat auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  // Screen sharing
  const handleScreenShare = async () => {
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia();
        screenStreamRef.current = stream;
        
        Object.values(peerConnectionsRef.current).forEach(pc => {
          const [videoSender] = pc.getSenders()
            .filter(s => s.track?.kind === 'video');
          videoSender?.replaceTrack(stream.getVideoTracks()[0]);
        });

        setIsScreenSharing(true);
        stream.getVideoTracks()[0].onended = () => handleScreenShare();
      } catch (error) {
        toast.error('Screen sharing failed');
      }
    }
  };

  // Responsive layout render
  const renderVideos = () => {
    const localParticipant = participants.find(p => p.id === user?.uid);
    const remoteParticipants = participants.filter(p => p.id !== user?.uid);

    return (
      <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded text-sm">
            {localParticipant?.name || 'You'}
            {isHost && <Crown className="inline ml-1 h-4 w-4 text-yellow-400" />}
          </div>
        </div>

        {remoteParticipants.map(participant => (
          <div key={participant.id} className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              id={`video-${participant.id}`}
              autoPlay
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded text-sm">
              {participant.name}
              {participant.isHost && <Crown className="inline ml-1 h-4 w-4 text-yellow-400" />}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Control buttons
  const renderControls = () => (
    <div className="flex items-center justify-center gap-2 p-2 bg-background border-t">
      <Tooltip>
        <div asChild>
          <Button
            size={isMobile ? "icon" : "default"}
            onClick={() => setIsAudioOn(!isAudioOn)}
            variant={isAudioOn ? "default" : "destructive"}
          >
            {isAudioOn ? <Mic /> : <MicOff />}
            {!isMobile && (isAudioOn ? "Mute" : "Unmute")}
          </Button>
        </div>
        <TooltipContent>{isAudioOn ? "Mute" : "Unmute"}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={isMobile ? "icon" : "default"}
            onClick={() => setIsVideoOn(!isVideoOn)}
            variant={isVideoOn ? "default" : "destructive"}
          >
            {isVideoOn ? <Video /> : <VideoOff />}
            {!isMobile && (isVideoOn ? "Stop Video" : "Start Video")}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isVideoOn ? "Stop Video" : "Start Video"}</TooltipContent>
      </Tooltip>

      {!isMobile && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={isMobile ? "icon" : "default"}
              onClick={handleScreenShare}
              variant={isScreenSharing ? "default" : "outline"}
            >
              <Share2 />
              {!isMobile && "Share Screen"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isScreenSharing ? "Stop Sharing" : "Share Screen"}</TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={isMobile ? "icon" : "default"}
            onClick={() => setIsChatOpen(!isChatOpen)}
            variant={isChatOpen ? "default" : "outline"}
          >
            <MessageSquare />
            {!isMobile && "Chat"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle Chat</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={isMobile ? "icon" : "default"}
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
            variant={isParticipantsOpen ? "default" : "outline"}
          >
            <Users />
            {!isMobile && "Participants"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle Participants</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={isMobile ? "icon" : "default"}
            variant="destructive"
            onClick={() => setShowEndMeetingDialog(true)}
          >
            <PhoneOff />
            {!isMobile && (isHost ? "End" : "Leave")}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isHost ? "End Meeting" : "Leave Meeting"}</TooltipContent>
      </Tooltip>
    </div>
  );

  if (isLoading) return <div className="p-4 text-center">Loading meeting...</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 relative">
        {renderVideos()}

        {/* Chat Sidebar */}
        {isChatOpen && (
          <div className={`absolute top-0 ${isMobile ? 'inset-0' : 'right-0 w-96'} bg-background border-l h-full`}>
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Chat</h3>
              <Button variant="ghost" onClick={() => setIsChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-160px)] p-4">
              {messages.map((msg, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{msg.sender.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{msg.sender.name}</span>
                  </div>
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="p-4 border-t">
              <form onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}>
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <Button type="submit">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Participants Sidebar */}
        {isParticipantsOpen && (
          <div className={`absolute top-0 ${isMobile ? 'inset-0' : 'right-0 w-96'} bg-background border-l h-full`}>
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Participants</h3>
              <Button variant="ghost" onClick={() => setIsParticipantsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-60px)] p-4">
              {participants.map(participant => (
                <div key={participant.id} className="flex items-center gap-3 py-2">
                  <Avatar>
                    <AvatarFallback>{participant.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {participant.name}
                      {participant.isHost && <Crown className="h-4 w-4 text-yellow-400" />}
                    </div>
                    {participant.handRaised && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <HandMetal className="h-3 w-3" /> Raised hand
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>

      {renderControls()}

      <Dialog open={showEndMeetingDialog} onOpenChange={setShowEndMeetingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isHost ? "End Meeting?" : "Leave Meeting?"}</DialogTitle>
            <DialogDescription>
              {isHost ? "This will end the meeting for all participants." : "You can rejoin if the meeting is still ongoing."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndMeetingDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (isHost) {
                  await updateDoc(doc(db, 'meetings', meetingId), {
                    endedAt: serverTimestamp()
                  });
                }
                router.push('/');
              }}
            >
              {isHost ? "End Meeting" : "Leave"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingPage;