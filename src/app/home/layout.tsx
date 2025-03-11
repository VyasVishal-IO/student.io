// "use client";
// import { collection, query, where, onSnapshot, DocumentData } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import { db } from '@/lib/firebase';
// import { useAuth } from '@/context/AuthContext';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { 
//   Tooltip, 
//   TooltipContent, 
//   TooltipProvider, 
//   TooltipTrigger 
// } from "@/components/ui/tooltip";

// import { 
//   FolderPlus, 
//   Layers, 
//   CheckCircle2, 
//   AlertCircle 
// } from "lucide-react";

// import CreatedPost from '@/components/content/CreatedPost';
// import CreatedProject from '@/components/content/CreatedProject';
// import { Post, Project } from '@/types/content';

// // Content Section Component
// type ContentSectionProps<T> = {
//   title: string;
//   items: T[];
//   Component: React.ComponentType<{ [key: string]: any }>;
//   emptyMessage?: string;
// };

// function ContentSection<T>({ 
//   title, 
//   items, 
//   Component, 
//   emptyMessage = "No items created yet." 
// }: ContentSectionProps<T>) {
//   return (
//     <div className="mt-8">
//       <h2 className="text-2xl font-bold mb-4">{title}</h2>
//       {items.length > 0 ? (
//         items.map((item: any) => (
//           <Component 
//             key={item.id} 
//             {...{[title.toLowerCase().slice(0, -1)]: item}} 
//           />
//         ))
//       ) : (
//         <p>{emptyMessage}</p>
//       )}
//     </div>
//   );
// }

// export default function HomeLayout({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [createdContent, setCreatedContent] = useState<{
//     posts: Post[];
//     projects: Project[];
//     tweets: any[];
//     articles: any[];
//     notes: any[];
//     events: any[];
//     job_openings: any[];
//     freelance_projects: any[];
//   }>({
//     posts: [],
//     projects: [],
//     tweets: [],
//     articles: [],
//     notes: [],
//     events: [],
//     job_openings: [],
//     freelance_projects: []
//   });

//   // New state for joined and created projects
//   const [userProjects, setUserProjects] = useState<{
//     createdProjects: Project[];
//     joinedProjects: Project[];
//   }>({
//     createdProjects: [],
//     joinedProjects: []
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [savedItems, setSavedItems] = useState<any[]>([]);

//   // Fetch saved items
//   useEffect(() => {
//     if (!user?.uid) return;
  
//     const savedQuery = query(
//       collection(db, 'saves'),
//       where('userId', '==', user.uid)
//     );
  
//     const unsubscribe = onSnapshot(savedQuery, (snapshot) => {
//       const items = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//         contentRef: doc.data().contentType + '/' + doc.data().contentId
//       }));
//       setSavedItems(items);
//     });
  
//     return () => unsubscribe();
//   }, [user?.uid]);

//   // Fetch projects (created and joined)
//   useEffect(() => {
//     if (!user?.uid) {
//       setLoading(false);
//       return;
//     }

//     const createdProjectsQuery = query(
//       collection(db, 'projects'),
//       where('ownerId', '==', user.uid)
//     );

//     const joinedProjectsQuery = query(
//       collection(db, 'projects'),
//       where('currentMembers', 'array-contains', user.uid)
//     );

//     const createdUnsubscribe = onSnapshot(
//       createdProjectsQuery,
//       (snapshot) => {
//         const projects = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data()
//         })) as Project[];
        
//         setUserProjects(prev => ({
//           ...prev,
//           createdProjects: projects
//         }));
//         setLoading(false);
//       },
//       (error) => {
//         console.error('Error fetching created projects:', error);
//         setError('Failed to load projects');
//         setLoading(false);
//       }
//     );

//     const joinedUnsubscribe = onSnapshot(
//       joinedProjectsQuery,
//       (snapshot) => {
//         const projects = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data()
//         })) as Project[];
        
//         setUserProjects(prev => ({
//           ...prev,
//           joinedProjects: projects
//         }));
//         setLoading(false);
//       },
//       (error) => {
//         console.error('Error fetching joined projects:', error);
//         setError('Failed to load projects');
//         setLoading(false);
//       }
//     );

//     // Cleanup function
//     return () => {
//       createdUnsubscribe();
//       joinedUnsubscribe();
//     };
//   }, [user?.uid]);

//   // Main content fetch (existing logic)
//   useEffect(() => {
//     if (!user?.uid) {
//       console.log('User not available');
//       setLoading(false);
//       return;
//     }

//     const contentTypes = [
//       'posts', 'projects', 'tweets', 'articles', 
//       'notes', 'events', 'job_openings', 'freelance_projects'
//     ];
    
//     const unsubscribers = contentTypes.map(type => {
//       const contentQuery = query(
//         collection(db, type),
//         where('authorId', '==', user.uid)
//       );
      
//       return onSnapshot(
//         contentQuery,
//         (snapshot) => {
//           const items = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
          
//           setCreatedContent(prev => ({
//             ...prev,
//             [type]: items
//           }));
          
//           setLoading(false);
//         },
//         (error) => {
//           console.error(`Error fetching ${type}:`, error);
//           setError(`Failed to load ${type}. Please try again later.`);
//           setLoading(false);
//         }
//       );
//     });
    
//     // Cleanup function to unsubscribe from all listeners
//     return () => unsubscribers.forEach(unsub => unsub());
//   }, [user?.uid]);

//   // Project Card Component
//   const ProjectCard = ({ project, type }: { project: Project, type: 'created' | 'joined' }) => {
//     const handleProjectClick = () => {
//       router.push(`/projects/${project.id}`);
//     };

//     return (
//       <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="flex items-center">
//             {type === 'created' ? <FolderPlus className="mr-2 h-5 w-5 text-blue-500" /> : <Layers className="mr-2 h-5 w-5 text-green-500" />}
//             {project.title}
//           </CardTitle>
//           <Badge variant={type === 'created' ? 'default' : 'secondary'}>
//             {type === 'created' ? 'Owner' : 'Member'}
//           </Badge>
//         </CardHeader>
//         <CardContent>
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-sm text-muted-foreground line-clamp-2">
//                 {project.description}
//               </p>
//               <div className="mt-2 flex items-center space-x-2">
//                 <Badge variant="outline">{project.category}</Badge>
//                 <span className="text-xs text-muted-foreground">
//                   {project.teamSize} Members
//                 </span>
//               </div>
//             </div>
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button 
//                     variant="outline" 
//                     size="sm" 
//                     onClick={handleProjectClick}
//                   >
//                     <CheckCircle2 className="mr-2 h-4 w-4" />
//                     View Details
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>View Project Details</p>
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <main>{children}</main>

//       {/* Projects Section */}
//       <Tabs defaultValue="created" className="mt-8">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="created">
//             <FolderPlus className="mr-2 h-4 w-4" /> Created Projects
//           </TabsTrigger>
//           <TabsTrigger value="joined">
//             <Layers className="mr-2 h-4 w-4" /> Joined Projects
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent value="created">
//           <ScrollArea className="h-[400px] w-full rounded-md border p-4">
//             {userProjects.createdProjects.length > 0 ? (
//               userProjects.createdProjects.map(project => (
//                 <ProjectCard 
//                   key={project.id} 
//                   project={project} 
//                   type="created" 
//                 />
//               ))
//             ) : (
//               <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
//                 <AlertCircle className="h-12 w-12 mb-4" />
//                 <p>No projects created yet</p>
//               </div>
//             )}
//           </ScrollArea>
//         </TabsContent>
//         <TabsContent value="joined">
//           <ScrollArea className="h-[400px] w-full rounded-md border p-4">
//             {userProjects.joinedProjects.length > 0 ? (
//               userProjects.joinedProjects.map(project => (
//                 <ProjectCard 
//                   key={project.id} 
//                   project={project} 
//                   type="joined" 
//                 />
//               ))
//             ) : (
//               <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
//                 <AlertCircle className="h-12 w-12 mb-4" />
//                 <p>No projects joined yet</p>
//               </div>
//             )}
//           </ScrollArea>
//         </TabsContent>
//       </Tabs>

//       {/* Existing Content Sections */}
//       <ContentSection 
//         title="Posts" 
//         items={createdContent.posts} 
//         Component={CreatedPost} 
//         emptyMessage="No posts created yet." 
//       />

//       {/* Saved Items Section */}
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold mb-4">Saved Items</h2>
//         {savedItems.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {savedItems.map(item => (
//               <div 
//                 key={item.id} 
//                 className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
//               >
//                 <Link 
//                   href={`/${item.contentRef}`} 
//                   className="text-blue-500 hover:underline"
//                 >
//                   {item.contentType} - {item.contentId}
//                 </Link>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-muted-foreground">No saved items yet</p>
//         )}
//       </div>
//     </div>
//   );
// }












"use client";
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

import { 
  FolderPlus, 
  Layers,
  ChevronRight,
  BookmarkPlus,
  Clock,
  AlertCircle,
  Feather,
  CalendarDays,
  Briefcase,
  PanelTop,
  User,
  Sparkles,
  Plus,
  ExternalLink
} from "lucide-react";

import CreatedPost from '@/components/content/CreatedPost';
import CreatedProject from '@/components/content/CreatedProject';
import { Post, Project } from '@/types/content';

// Generic Empty State Component
const EmptyState = ({ 
  icon: Icon, 
  message, 
  actionLabel, 
  actionHref,
  onAction 
}: { 
  icon: React.ElementType, 
  message: string, 
  actionLabel?: string, 
  actionHref?: string,
  onAction?: () => void
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="rounded-full bg-muted p-6 mb-4">
      <Icon className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium mb-2">{message}</h3>
    {(actionLabel && (actionHref || onAction)) && (
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2"
        onClick={onAction}
        asChild={!!actionHref}
      >
        {actionHref ? (
          <Link href={actionHref}>
            {actionLabel} <Plus className="ml-2 h-4 w-4" />
          </Link>
        ) : (
          <>
            {actionLabel} <Plus className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    )}
  </div>
);



export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const [createdContent, setCreatedContent] = useState<{
    posts: Post[];
    projects: Project[];
    tweets: any[];
    articles: any[];
    notes: any[];
    events: any[];
    job_openings: any[];
    freelance_projects: any[];
  }>({
    posts: [],
    projects: [],
    tweets: [],
    articles: [],
    notes: [],
    events: [],
    job_openings: [],
    freelance_projects: []
  });

  // State for joined and created projects
  const [userProjects, setUserProjects] = useState<{
    createdProjects: Project[];
    joinedProjects: Project[];
  }>({
    createdProjects: [],
    joinedProjects: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<any[]>([]);

  // Fetch saved items
  useEffect(() => {
    if (!user?.uid) return;
  
    const savedQuery = query(
      collection(db, 'saves'),
      where('userId', '==', user.uid)
    );
  
    const unsubscribe = onSnapshot(savedQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        contentRef: doc.data().contentType + '/' + doc.data().contentId
      }));
      setSavedItems(items);
    }, (error) => {
      console.error('Error fetching saved items:', error);
      toast.error('Failed to load saved items');
    });
  
    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
  
    const userDocRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const savedPostIds = userData.savedPosts || [];
  
        // Fetch details for each saved post
        const postsPromises = savedPostIds.map((postId: string) => 
          getDoc(doc(db, 'posts', postId))
        );
  
        try {
          const postSnapshots = await Promise.all(postsPromises);
          const savedPosts = postSnapshots
            .filter(snap => snap.exists())
            .map(snap => ({ id: snap.id, ...snap.data() }));
  
          setSavedItems(savedPosts);
        } catch (error) {
          console.error('Error fetching saved posts:', error);
          toast.error('Failed to load saved items');
        }
      }
    }, (error) => {
      console.error('Error fetching user document:', error);
      toast.error('Failed to load saved items');
    });
  
    return () => unsubscribe();
  }, [user?.uid]);


  // Fetch projects (created and joined)
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const createdProjectsQuery = query(
      collection(db, 'projects'),
      where('ownerId', '==', user.uid)
    );

    const joinedProjectsQuery = query(
      collection(db, 'projects'),
      where('currentMembers', 'array-contains', user.uid)
    );

    const createdUnsubscribe = onSnapshot(
      createdProjectsQuery,
      (snapshot) => {
        const projects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        
        setUserProjects(prev => ({
          ...prev,
          createdProjects: projects
        }));
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching created projects:', error);
        setError('Failed to load projects');
        toast.error('Failed to load your created projects');
        setLoading(false);
      }
    );

    const joinedUnsubscribe = onSnapshot(
      joinedProjectsQuery,
      (snapshot) => {
        const projects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        
        setUserProjects(prev => ({
          ...prev,
          joinedProjects: projects.filter(p => p.ownerId !== user.uid)
        }));
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching joined projects:', error);
        setError('Failed to load projects');
        toast.error('Failed to load your joined projects');
        setLoading(false);
      }
    );

    // Cleanup function
    return () => {
      createdUnsubscribe();
      joinedUnsubscribe();
    };
  }, [user?.uid]);

  // Main content fetch (existing logic)
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const contentTypes = [
      'posts', 'projects', 'tweets', 'articles', 
      'notes', 'events', 'job_openings', 'freelance_projects'
    ];
    
    const unsubscribers = contentTypes.map(type => {
      const contentQuery = query(
        collection(db, type),
        where('authorId', '==', user.uid)
      );
      
      return onSnapshot(
        contentQuery,
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          
          setCreatedContent(prev => ({
            ...prev,
            [type]: items
          }));
          
          setLoading(false);
        },
        (error) => {
          console.error(`Error fetching ${type}:`, error);
          setError(`Failed to load ${type}`);
          toast.error(`Failed to load your ${type}`);
          setLoading(false);
        }
      );
    });
    
    // Cleanup function to unsubscribe from all listeners
    return () => unsubscribers.forEach(unsub => unsub());
  }, [user?.uid]);

  // Project Card Component - Redesigned for mobile-first approach
  const ProjectCard = ({ project, type }: { project: Project, type: 'created' | 'joined' }) => {
    const projectDate = project.createdAt ? new Date(project.createdAt.seconds * 1000) : new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(projectDate);

    return (
      <Card 
        className="hover:shadow-md transition-shadow duration-200 border-l-4" 
        style={{ borderLeftColor: type === 'created' ? 'var(--primary)' : 'var(--secondary)' }}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {type === 'created' ? 
                  <FolderPlus className="h-4 w-4 text-primary" /> : 
                  <Layers className="h-4 w-4 text-secondary" />
                }
                <CardTitle className="text-base sm:text-lg line-clamp-1">{project.title}</CardTitle>
              </div>
              <CardDescription className="mt-1 flex items-center text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {formattedDate}
              </CardDescription>
            </div>
            <Badge variant={type === 'created' ? 'default' : 'secondary'} className="text-xs">
              {type === 'created' ? 'Owner' : 'Member'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {project.category}
            </Badge>
            <Badge variant="outline" className="text-xs flex items-center">
              <User className="h-3 w-3 mr-1" /> 
              {project.teamSize || 0}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => router.push(`/projects/${project.id}`)}
          >
            View Details
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Saved Item Card - New component for better UI
  const SavedItemCard = ({ item }: { item: any }) => {
    const contentTypes: Record<string, { icon: React.ElementType, color: string }> = {
      posts: { icon: Feather, color: "text-blue-500" },
      projects: { icon: FolderPlus, color: "text-emerald-500" },
      tweets: { icon: Sparkles, color: "text-sky-500" },
      articles: { icon: PanelTop, color: "text-violet-500" },
      notes: { icon: Feather, color: "text-amber-500" },
      events: { icon: CalendarDays, color: "text-red-500" },
      job_openings: { icon: Briefcase, color: "text-indigo-500" },
      freelance_projects: { icon: Layers, color: "text-teal-500" }
    };

    const postDate = item.createdAt?.seconds 
    ? new Date(item.createdAt.seconds * 1000)
    : new Date();

    const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((postDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 
      'day'
    );
    
    const { icon: Icon, color } = contentTypes[item.contentType] || { icon: BookmarkPlus, color: "text-gray-500" };
    const savedDate = item.savedAt ? new Date(item.savedAt.seconds * 1000) : new Date();
   
    return (
  <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="p-2 rounded-full mr-3 bg-blue-100">
            <Feather className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="font-medium line-clamp-1">{item.title || 'Saved Post'}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Posted {timeAgo} • {item.category || 'Post'}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${item.contentType}/${item.id}`}>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-6xl flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-center mb-2">Something went wrong</h2>
        <p className="text-muted-foreground text-center mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <Toaster position="top-center" />
      
      {/* Main content area */}
      <main className="mb-8">{children}</main>

      {/* Projects Section */}
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FolderPlus className="mr-2 h-5 w-5 text-primary" />
              Your Projects
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/create">
                <Plus className="h-4 w-4 mr-1" /> New Project
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <Tabs defaultValue="created" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="created" className="text-xs sm:text-sm">
                <FolderPlus className="mr-2 h-4 w-4" /> Created
                <Badge variant="outline" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {userProjects.createdProjects.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="joined" className="text-xs sm:text-sm">
                <Layers className="mr-2 h-4 w-4" /> Joined
                <Badge variant="outline" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {userProjects.joinedProjects.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="created">
              {userProjects.createdProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {userProjects.createdProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      type="created" 
                    />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={FolderPlus} 
                  message="You haven't created any projects yet" 
                  actionLabel="Create your first project"
                  actionHref="/projects/new"
                />
              )}
            </TabsContent>
            
            <TabsContent value="joined">
              {userProjects.joinedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {userProjects.joinedProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      type="joined" 
                    />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={Layers} 
                  message="You haven't joined any projects yet" 
                  actionLabel="Explore projects"
                  actionHref="/projects/explore"
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Activity - New Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

        

        
        {/* Saved Items Section - Redesigned */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BookmarkPlus className="mr-2 h-5 w-5 text-primary" />
                Saved Items
              </CardTitle>
              <CardDescription>
                Items you've bookmarked for later
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedItems.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {savedItems.map(item => (
                      <SavedItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <EmptyState 
                  icon={BookmarkPlus} 
                  message="No saved items yet" 
                  actionLabel="Explore content"
                  actionHref="/explore"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}