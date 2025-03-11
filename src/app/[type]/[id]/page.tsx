// src/app/[type]/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
// import PostDetail from '@/components/content/PostDetail';
import ProjectDetail from '@/components/content/ProjectDetail';
import ArticleDetail from '@/components/content/ArticleDetail';
import JobDetail from '@/components/content/JobDetail';
import FreelanceDetail from '@/components/content/FreelanceDetail';
import PostDetail from '@/components/content/PostDetail';
import TweetDetail from '@/components/content/TweetDetail';

export default function ContentPage() {
  const params = useParams();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const docRef = doc(db, params.type as string, params.id as string);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setContent({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };

    fetchContent();
  }, [params]);

  if (loading) return <div>Loading...</div>;
  if (!content) return <div>Content not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {params.type === 'posts' && <PostDetail post={content} />}
      {params.type === 'projects' && <ProjectDetail project={content} />}
     
{params.type === 'articles' && <ArticleDetail article={content} />}
{params.type === 'job_openings' && <JobDetail job={content} />}
{params.type === 'freelance_projects' && <FreelanceDetail project={content} />}
{params.type === 'tweets' && <TweetDetail tweet={content} />}
    </div>
  );
}