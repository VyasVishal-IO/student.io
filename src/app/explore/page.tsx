// // // src/app/explore/page.tsx
// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
// // import { db } from '@/lib/firebase';
// // // import PostCard from '@/components/content/PostCard';
// // import ProjectCard from '@/components/content/ProjectCard';
// // import PostCard from '@/components/content/PostCard';
// // import EventCard from '@/components/content/EventCard';
// // // import EventCard from '@/components/content/EventCard';

// // export default function ExplorePage() {
// //   const [content, setContent] = useState<{
// //     posts: any[];
// //     projects: any[];
// //     events: any[];
// //   }>({ posts: [], projects: [], events: [] });

// //   useEffect(() => {
// //     const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
// //     const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
// //     const eventsQuery = query(collection(db, 'events'), orderBy('startDate', 'desc'));

// //     const unsubscribers = [
// //       onSnapshot(postsQuery, (snapshot) => {
// //         setContent(prev => ({ ...prev, posts: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) }));
// //       }),
// //       onSnapshot(projectsQuery, (snapshot) => {
// //         setContent(prev => ({ ...prev, projects: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) }));
// //       }),
// //       onSnapshot(eventsQuery, (snapshot) => {
// //         setContent(prev => ({ ...prev, events: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) }));
// //       })
// //     ];

// //     return () => unsubscribers.forEach(unsub => unsub());
// //   }, []);

// //   return (
// //     <div className="container mx-auto p-4">
// //       <h1 className="text-3xl font-bold mb-8">Explore Content</h1>

// //       <section className="mb-12">
// //         <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>
// //         {content.posts.map(post => (
// //           <PostCard key={post.id} post={post} />
// //         ))}
// //       </section>

// //       <section className="mb-12">
// //         <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
// //         {content.projects.map(project => (
// //           <ProjectCard key={project.id} project={project} />
// //         ))}
// //       </section>

// //       <section className="mb-12">
// //         <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
// //         {content.events.map(event => (
// //           <EventCard key={event.id} event={event} />
// //         ))}
// //       </section>
// //     </div>
// //   );
// // }



// // src/app/explore/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import ProjectCard from '@/components/content/ProjectCard';
// import PostCard from '@/components/content/PostCard';
// import EventCard from '@/components/content/EventCard';
// import SearchBar from '@/components/explore/SearchBar';
// import FilterButton from '@/components/explore/FilterButton';

// type ContentType = 'all' | 'posts' | 'projects' | 'events';

// export default function ExplorePage() {
//   const [content, setContent] = useState<{
//     posts: any[];
//     projects: any[];
//     events: any[];
//   }>({ posts: [], projects: [], events: [] });
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeFilter, setActiveFilter] = useState<ContentType>('all');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     setIsLoading(true);
    
//     const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
//     const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
//     const eventsQuery = query(collection(db, 'events'), orderBy('startDate', 'desc'));

//     const unsubscribers = [
//       onSnapshot(postsQuery, (snapshot) => {
//         setContent(prev => ({ ...prev, posts: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) }));
//         setIsLoading(false);
//       }),
//       onSnapshot(projectsQuery, (snapshot) => {
//         setContent(prev => ({ ...prev, projects: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) }));
//         setIsLoading(false);
//       }),
//       onSnapshot(eventsQuery, (snapshot) => {
//         setContent(prev => ({ ...prev, events: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) }));
//         setIsLoading(false);
//       })
//     ];

//     return () => unsubscribers.forEach(unsub => unsub());
//   }, []);

//   // Filter content based on search query
//   const filteredContent = {
//     posts: content.posts.filter(post => 
//       post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//       post.content?.toLowerCase().includes(searchQuery.toLowerCase())
//     ),
//     projects: content.projects.filter(project => 
//       project.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//       project.description?.toLowerCase().includes(searchQuery.toLowerCase())
//     ),
//     events: content.events.filter(event => 
//       event.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//       event.description?.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   };

//   // Handle search input
//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//   };

//   // Handle filter change
//   const handleFilterChange = (type: ContentType) => {
//     setActiveFilter(type);
//   };

//   // Determine what content to show based on active filter
//   const showPosts = activeFilter === 'all' || activeFilter === 'posts';
//   const showProjects = activeFilter === 'all' || activeFilter === 'projects';
//   const showEvents = activeFilter === 'all' || activeFilter === 'events';

//   return (
//     <div className="bg-white text-black min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
//         <header className="mb-10">
//           <h1 className="text-4xl font-bold mb-6">Explore</h1>
          
//           <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
//             <SearchBar onSearch={handleSearch} />
            
//             <div className="flex gap-2">
//               <FilterButton 
//                 label="All" 
//                 active={activeFilter === 'all'} 
//                 onClick={() => handleFilterChange('all')} 
//               />
//               <FilterButton 
//                 label="Posts" 
//                 active={activeFilter === 'posts'} 
//                 onClick={() => handleFilterChange('posts')} 
//               />
//               <FilterButton 
//                 label="Projects" 
//                 active={activeFilter === 'projects'} 
//                 onClick={() => handleFilterChange('projects')} 
//               />
//               <FilterButton 
//                 label="Events" 
//                 active={activeFilter === 'events'} 
//                 onClick={() => handleFilterChange('events')} 
//               />
//             </div>
//           </div>
//         </header>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
//           </div>
//         ) : (
//           <div className="space-y-12">
//             {showPosts && filteredContent.posts.length > 0 && (
//               <section>
//                 <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200">Posts</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredContent.posts.map(post => (
//                     <PostCard key={post.id} post={post} />
//                   ))}
//                 </div>
//               </section>
//             )}

//             {showProjects && filteredContent.projects.length > 0 && (
//               <section>
//                 <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200">Projects</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredContent.projects.map(project => (
//                     <ProjectCard key={project.id} project={project} />
//                   ))}
//                 </div>
//               </section>
//             )}

//             {showEvents && filteredContent.events.length > 0 && (
//               <section>
//                 <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200">Events</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredContent.events.map(event => (
//                     <EventCard key={event.id} event={event} />
//                   ))}
//                 </div>
//               </section>
//             )}

//             {((showPosts && filteredContent.posts.length === 0) &&
//               (showProjects && filteredContent.projects.length === 0) &&
//               (showEvents && filteredContent.events.length === 0)) && (
//               <div className="text-center py-16">
//                 <h3 className="text-xl font-medium">No content matching your search</h3>
//                 <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/app/explore/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, limit, getDocs, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PostCard from '@/components/content/PostCard';
import ProjectCard from '@/components/content/ProjectCard';
import EventCard from '@/components/content/EventCard';
import Navbar from '@/components/Navbar';

type ContentItem = any;
type ContentType = 'all' | 'posts' | 'projects' | 'events';
type SortOption = 'recent' | 'popular' | 'trending';

export default function ExplorePage() {
  // Main content state
  const [content, setContent] = useState<{
    posts: ContentItem[];
    projects: ContentItem[];
    events: ContentItem[];
  }>({ posts: [], projects: [], events: [] });
  
  // UI state
  const [activeTab, setActiveTab] = useState<ContentType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showFilters, setShowFilters] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Pagination
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>({
    posts: null,
    projects: null,
    events: null
  });
  
  // Filter options
  const [filters, setFilters] = useState({
    showFeatured: false,
    showVerified: false,
    categories: [] as string[]
  });

  // Categories (sample - you can fetch these from Firebase)
  const categories = ['Technology', 'Design', 'Business', 'Arts', 'Education'];

  const ITEMS_PER_PAGE = 6;

  // Initial data fetch
  useEffect(() => {
    setIsLoading(true);
    fetchInitialContent();
  }, [sortBy, filters]);

  const fetchInitialContent = async () => {
    try {
      // Create queries with proper ordering and limits
      const postsQuery = query(
        collection(db, 'posts'), 
        orderBy(getSortField('posts'), 'desc'),
        limit(ITEMS_PER_PAGE)
      );
      
      const projectsQuery = query(
        collection(db, 'projects'), 
        orderBy(getSortField('projects'), 'desc'),
        limit(ITEMS_PER_PAGE)
      );
      
      const eventsQuery = query(
        collection(db, 'events'), 
        orderBy(getSortField('events'), 'desc'),
        limit(ITEMS_PER_PAGE)
      );

      // Setup snapshot listeners
      const unsubscribers = [
        onSnapshot(postsQuery, (snapshot) => {
          const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setContent(prev => ({ ...prev, posts }));
          setLastVisible(prev => ({ 
            ...prev, 
            posts: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null 
          }));
          setHasMore(snapshot.docs.length >= ITEMS_PER_PAGE);
          setIsLoading(false);
        }),
        
        onSnapshot(projectsQuery, (snapshot) => {
          const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setContent(prev => ({ ...prev, projects }));
          setLastVisible(prev => ({ 
            ...prev, 
            projects: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null 
          }));
          setIsLoading(false);
        }),
        
        onSnapshot(eventsQuery, (snapshot) => {
          const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setContent(prev => ({ ...prev, events }));
          setLastVisible(prev => ({ 
            ...prev, 
            events: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null 
          }));
          setIsLoading(false);
        })
      ];

      return () => unsubscribers.forEach(unsub => unsub());
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  // Load more content
  const loadMore = async (type: ContentType | 'all') => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    try {
      // If 'all' is selected, load more for each content type
      if (type === 'all') {
        await Promise.all([
          loadMoreForType('posts'),
          loadMoreForType('projects'),
          loadMoreForType('events')
        ]);
      } else {
        await loadMoreForType(type);
      }
    } catch (error) {
      console.error("Error loading more content:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMoreForType = async (type: 'posts' | 'projects' | 'events') => {
    if (!lastVisible[type]) return;
    
    const collectionName = type;
    const sortField = getSortField(type);
    
    const nextQuery = query(
      collection(db, collectionName),
      orderBy(sortField, 'desc'),
      startAfter(lastVisible[type]),
      limit(ITEMS_PER_PAGE)
    );
    
    const snapshot = await getDocs(nextQuery);
    
    if (!snapshot.empty) {
      const newItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setContent(prev => ({
        ...prev,
        [type]: [...prev[type], ...newItems]
      }));
      
      setLastVisible(prev => ({
        ...prev,
        [type]: snapshot.docs[snapshot.docs.length - 1]
      }));
      
      setHasMore(snapshot.docs.length >= ITEMS_PER_PAGE);
    } else {
      setHasMore(false);
    }
  };

  // Helper function to get the right field to sort by
  const getSortField = (type: string): string => {
    if (sortBy === 'recent') {
      return type === 'events' ? 'startDate' : 'createdAt';
    } else if (sortBy === 'popular') {
      return 'viewCount';
    } else {
      return 'trendScore';
    }
  };

  // Filter content based on search query and filters
  const getFilteredContent = (type: 'posts' | 'projects' | 'events') => {
    return content[type].filter(item => {
      // Search filter
      const matchesSearch = 
        !searchQuery || 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = 
        filters.categories.length === 0 || 
        (item.categories && filters.categories.some(cat => item.categories.includes(cat)));
      
      // Featured filter
      const matchesFeatured = 
        !filters.showFeatured || 
        item.featured === true;
      
      // Verified filter
      const matchesVerified = 
        !filters.showVerified || 
        item.verified === true;
      
      return matchesSearch && matchesCategory && matchesFeatured && matchesVerified;
    });
  };

  // Filter handlers
  const toggleCategory = (category: string) => {
    setFilters(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return { ...prev, categories };
    });
  };

  const toggleFilter = (filter: 'showFeatured' | 'showVerified') => {
    setFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const resetFilters = () => {
    setFilters({
      showFeatured: false,
      showVerified: false,
      categories: []
    });
    setSearchQuery('');
  };

  // Check if we have any active filters
  const hasActiveFilters = 
    searchQuery !== '' || 
    filters.showFeatured || 
    filters.showVerified || 
    filters.categories.length > 0;

  // Helper function to render content skeletons
  const renderSkeletons = (count: number) => {
    return Array(count).fill(0).map((_, i) => (
      <Card key={`skeleton-${i}`} className="overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-video bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="pt-2">
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  // Content counters
  const filteredPosts = getFilteredContent('posts');
  const filteredProjects = getFilteredContent('projects');
  const filteredEvents = getFilteredContent('events');

  // Helper function to determine if we should show the load more button
  const shouldShowLoadMore = (
    activeTab === 'all' && (
      (content.posts.length > 0 && filteredPosts.length > 0) ||
      (content.projects.length > 0 && filteredProjects.length > 0) ||
      (content.events.length > 0 && filteredEvents.length > 0)
    )
  ) || (
    activeTab !== 'all' && 
    content[`${activeTab}` as 'posts' | 'projects' | 'events'].length > 0 &&
    getFilteredContent(activeTab as 'posts' | 'projects' | 'events').length > 0
  );

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Explore</h1>
          
          <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-200 focus-visible:ring-gray-300"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      {hasActiveFilters ? 'Filters Active' : 'Filters'}
                      {hasActiveFilters && (
                        <Badge 
                          variant="secondary" 
                          className="ml-1 h-5 rounded-full px-2 py-0"
                        >
                          {filters.categories.length + (filters.showFeatured ? 1 : 0) + (filters.showVerified ? 1 : 0) + (searchQuery ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2">
                      <p className="font-medium text-sm mb-2">Filters</p>
                      <div className="space-y-2">
                        <DropdownMenuCheckboxItem
                          checked={filters.showFeatured}
                          onCheckedChange={() => toggleFilter('showFeatured')}
                        >
                          Featured Only
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filters.showVerified}
                          onCheckedChange={() => toggleFilter('showVerified')}
                        >
                          Verified Only
                        </DropdownMenuCheckboxItem>
                      </div>
                      
                      <div className="my-2 border-t pt-2">
                        <p className="font-medium text-sm mb-2">Categories</p>
                        <div className="space-y-2">
                          {categories.map(category => (
                            <DropdownMenuCheckboxItem
                              key={category}
                              checked={filters.categories.includes(category)}
                              onCheckedChange={() => toggleCategory(category)}
                            >
                              {category}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </div>
                      </div>
                      
                      {hasActiveFilters && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full mt-2" 
                          onClick={resetFilters}
                        >
                          Reset All
                        </Button>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Sort: {sortBy === 'recent' ? 'Recent' : sortBy === 'popular' ? 'Popular' : 'Trending'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                      checked={sortBy === 'recent'}
                      onCheckedChange={() => setSortBy('recent')}
                    >
                      Recent
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortBy === 'popular'}
                      onCheckedChange={() => setSortBy('popular')}
                    >
                      Popular
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortBy === 'trending'}
                      onCheckedChange={() => setSortBy('trending')}
                    >
                      Trending
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Content Type Tabs */}
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as ContentType)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                <TabsTrigger value="all">
                  All
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {filteredPosts.length + filteredProjects.length + filteredEvents.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="posts">
                  Posts
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {filteredPosts.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="projects">
                  Projects
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {filteredProjects.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="events">
                  Events
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {filteredEvents.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>

        {/* Content display area */}
        <div className="space-y-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderSkeletons(6)}
            </div>
          ) : (
            <Tabs value={activeTab} className="w-full">
              {/* All Content Tab */}
              <TabsContent value="all" className="mt-0">
                {(filteredPosts.length > 0 || filteredProjects.length > 0 || filteredEvents.length > 0) ? (
                  <div className="space-y-10">
                    {filteredPosts.length > 0 && (
                      <section>
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-2xl font-semibold">Posts</h2>
                          {filteredPosts.length > 3 && (
                            <Button 
                              variant="ghost" 
                              onClick={() => setActiveTab('posts')}
                              className="text-gray-600 hover:text-black"
                            >
                              View all
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredPosts.slice(0, 3).map(post => (
                            <PostCard key={post.id} post={post} />
                          ))}
                        </div>
                      </section>
                    )}
                    
                    {filteredProjects.length > 0 && (
                      <section>
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-2xl font-semibold">Projects</h2>
                          {filteredProjects.length > 3 && (
                            <Button 
                              variant="ghost" 
                              onClick={() => setActiveTab('projects')}
                              className="text-gray-600 hover:text-black"
                            >
                              View all
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredProjects.slice(0, 3).map(project => (
                            <ProjectCard key={project.id} project={project} />
                          ))}
                        </div>
                      </section>
                    )}
                    
                    {filteredEvents.length > 0 && (
                      <section>
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-2xl font-semibold">Events</h2>
                          {filteredEvents.length > 3 && (
                            <Button 
                              variant="ghost" 
                              onClick={() => setActiveTab('events')}
                              className="text-gray-600 hover:text-black"
                            >
                              View all
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredEvents.slice(0, 3).map(event => (
                            <EventCard key={event.id} event={event} />
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-medium">No content matching your search</h3>
                    <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
                    <Button 
                      variant="outline" 
                      onClick={resetFilters} 
                      className="mt-4 gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reset filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {/* Posts Tab */}
              <TabsContent value="posts" className="mt-0">
                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-medium">No posts matching your search</h3>
                    <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
                    <Button 
                      variant="outline" 
                      onClick={resetFilters} 
                      className="mt-4 gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reset filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {/* Projects Tab */}
              <TabsContent value="projects" className="mt-0">
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-medium">No projects matching your search</h3>
                    <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
                    <Button 
                      variant="outline" 
                      onClick={resetFilters} 
                      className="mt-4 gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reset filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {/* Events Tab */}
              <TabsContent value="events" className="mt-0">
                {filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-medium">No events matching your search</h3>
                    <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
                    <Button 
                      variant="outline" 
                      onClick={resetFilters} 
                      className="mt-4 gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reset filters
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          {/* Load More Button */}
          {shouldShowLoadMore && hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => loadMore(activeTab)}
                disabled={isLoadingMore}
                className="gap-2"
              >
                {isLoadingMore ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>




            <div className="h-18"></div>
      <Navbar />
    </div>
  );
}