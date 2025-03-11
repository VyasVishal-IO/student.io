// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Clock, Users, Video } from "lucide-react";
// import { useRouter } from "next/navigation";

// export const MeetingCard = ({ meeting }) => {
//   const router = useRouter();
  
//   const joinMeeting = () => {
//     router.push(`/meeting/${meeting.id}`);
//   };
  
//   return (
//     <Card className="hover:shadow-md transition-shadow">
//       <CardContent className="p-4">
//         <div className="flex items-center justify-between mb-4">
//           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//             <Video className="h-5 w-5 text-primary" />
//           </div>
//           <span className="text-sm font-medium text-gray-500">{meeting.time}</span>
//         </div>
        
//         <h3 className="font-medium text-lg mb-2">{meeting.title}</h3>
        
//         <div className="flex items-center gap-2 mb-4">
//           <Clock className="h-4 w-4 text-gray-500" />
//           <span className="text-sm text-gray-500">Today</span>
//           <span className="mx-1 text-gray-300">•</span>
//           <Users className="h-4 w-4 text-gray-500" />
//           <span className="text-sm text-gray-500">{meeting.participants} participants</span>
//         </div>
        
//         <div className="flex items-center gap-2 mb-4">
//           <div className="flex -space-x-2">
//             {[...Array(Math.min(3, meeting.participants))].map((_, i) => (
//               <Avatar key={i} className="h-6 w-6 border-2 border-white">
//                 <AvatarFallback className="text-xs bg-gray-200">
//                   {String.fromCharCode(65 + i)}
//                 </AvatarFallback>
//               </Avatar>
//             ))}
//           </div>
//           {meeting.participants > 3 && (
//             <span className="text-xs text-gray-500">+{meeting.participants - 3} more</span>
//           )}
//         </div>
        
//         <Button onClick={joinMeeting} className="w-full">Join Meeting</Button>
//       </CardContent>
//     </Card>
//   );
// };