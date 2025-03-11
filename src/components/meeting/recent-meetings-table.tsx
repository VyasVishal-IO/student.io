// "use client";

// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableHeader, 
//   TableRow 
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Clock, Download, ExternalLink, MoreHorizontal, Play, Users } from "lucide-react";
// import { 
//   DropdownMenu, 
//   DropdownMenuContent, 
//   DropdownMenuItem, 
//   DropdownMenuTrigger 
// } from "@/components/ui/dropdown-menu";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";

// export const RecentMeetingsTable = ({ meetings }) => {
//   const router = useRouter();
  
//   const joinMeeting = (id) => {
//     router.push(`/meeting/${id}`);
//   };
  
//   const copyMeetingLink = (id) => {
//     navigator.clipboard.writeText(`${window.location.origin}/meeting/${id}`);
//     toast.success("Meeting link copied to clipboard");
//   };
  
//   return (
//     <div className="rounded-md border mb-8 overflow-hidden">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Meeting Name</TableHead>
//             <TableHead>Date</TableHead>
//             <TableHead>Duration</TableHead>
//             <TableHead>Participants</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {meetings.map((meeting) => (
//             <TableRow key={meeting.id}>
//               <TableCell className="font-medium">{meeting.title}</TableCell>
//               <TableCell>{meeting.date}</TableCell>
//               <TableCell>{meeting.duration}</TableCell>
//               <TableCell>
//                 <div className="flex items-center gap-1">
//                   <Users className="h-4 w-4 text-gray-500" />
//                   <span>{meeting.participants}</span>
//                 </div>
//               </TableCell>
//               <TableCell className="text-right">
//                 <div className="flex justify-end gap-2">
//                   <Button 
//                     variant="ghost" 
//                     size="sm" 
//                     onClick={() => joinMeeting(meeting.id)}
//                     className="text-blue-600"
//                   >
//                     <Play className="h-4 w-4" />
//                     <span className="sr-only">Join</span>
//                   </Button>
                  
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="sm">
//                         <MoreHorizontal className="h-4 w-4" />
//                         <span className="sr-only">Open menu</span>
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem onClick={() => copyMeetingLink(meeting.id)}>
//                         <ExternalLink className="h-4 w-4 mr-2" />
//                         Copy link
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Download className="h-4 w-4 mr-2" />
//                         Download recording
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Clock className="h-4 w-4 mr-2" />
//                         View details
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };