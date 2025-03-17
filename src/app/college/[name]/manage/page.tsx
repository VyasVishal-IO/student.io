
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CalendarClock, 
  ClipboardCheck, 
  Award, 
  FileText, 
  Users, 
  School,
  BookOpen,
  MessageSquare,
  Bell
} from 'lucide-react';

type College = {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  students: string[];
  teachers: string[];
};

export default function ManageCollegePage() {
  const { name } = useParams();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'teacher' | 'student' | 'none'>('none');

  const decodedName = decodeURIComponent(name as string);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        // Find the college by name
        const collegeQuery = query(collection(db, 'colleges'), where('name', '==', decodedName));
        const collegeSnapshot = await getDocs(collegeQuery);
        
        if (collegeSnapshot.empty) {
          router.push('/colleges');
          return;
        }
        
        const collegeDoc = collegeSnapshot.docs[0];
        const collegeData = collegeDoc.data() as Omit<College, 'id'>;
        const collegeWithId = { id: collegeDoc.id, ...collegeData } as College;
        setCollege(collegeWithId);

        // Determine user role
        if (collegeWithId.createdBy === user?.uid) {
          setUserRole('admin');
        } else if (collegeWithId.teachers?.includes(user?.uid)) {
          setUserRole('teacher');
        } else if (collegeWithId.students?.includes(user?.uid)) {
          setUserRole('student');
        } else {
          // User doesn't belong to this college
          router.push(`/college/${encodeURIComponent(decodedName)}`);
          return;
        }
      } catch (error) {
        console.error('Error fetching college:', error);
      } finally {
        setLoading(false);
      }
    };

    if (decodedName && user?.uid) {
      fetchCollege();
    }
  }, [decodedName, user?.uid, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading college information...</p>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">College not found</h2>
        <p className="text-gray-600">The college you're looking for doesn't exist or has been removed.</p>
        <Link href="/colleges" className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Browse Colleges
        </Link>
      </div>
    );
  }

  const managementCards = [
    { 
      title: 'Attendance Management', 
      description: 'Record and manage student attendance for courses.', 
      icon: <ClipboardCheck className="w-8 h-8 text-blue-600" />,
      path: `/college/${encodeURIComponent(decodedName)}/manage/attendance`,
      permissions: ['admin', 'teacher']
    },
    { 
      title: 'Timetable Management', 
      description: 'Create and update class schedules and timetables.', 
      icon: <CalendarClock className="w-8 h-8 text-green-600" />, 
      path: `/college/${encodeURIComponent(decodedName)}/manage/timetable`,
      permissions: ['admin', 'teacher']
    },
    { 
      title: 'Assignment Management', 
      description: 'Create, distribute, and grade student assignments.', 
      icon: <FileText className="w-8 h-8 text-orange-600" />, 
      path: `/college/${encodeURIComponent(decodedName)}/manage/assignments`,
      permissions: ['admin', 'teacher', 'student']
    },
    { 
      title: 'Results Management', 
      description: 'Record and manage student grades and performance.', 
      icon: <Award className="w-8 h-8 text-purple-600" />, 
      path: `/college/${encodeURIComponent(decodedName)}/manage/results`,
      permissions: ['admin', 'teacher']
    },
    { 
      title: 'Members Management', 
      description: 'Manage students and teachers of the college.', 
      icon: <Users className="w-8 h-8 text-indigo-600" />, 
      path: `/college/${encodeURIComponent(decodedName)}/manage/members`,
      permissions: ['admin']
    },
    { 
      title: 'Announcements', 
      description: 'Post important announcements for students and teachers.', 
      icon: <Bell className="w-8 h-8 text-red-600" />, 
      path: `/college/${encodeURIComponent(decodedName)}/manage/announcements`,
      permissions: ['admin', 'teacher']
    },
    { 
      title: 'Discussion Forums', 
      description: 'Engage in topic-based discussions with students and teachers.', 
      icon: <MessageSquare className="w-8 h-8 text-teal-600" />, 
      path: `/college/${encodeURIComponent(decodedName)}/manage/forums`,
      permissions: ['admin', 'teacher', 'student']
    },
  ];

  // Filter cards based on user role
  const accessibleCards = managementCards.filter(card => 
    card.permissions.includes(userRole)
  );

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <School className="w-8 h-8 text-blue-600" />
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage {college.name}</h1>
                </div>
                <p className="mt-2 text-gray-600">{college.description}</p>
              </div>
              
              <div className="flex gap-2">
                <Link 
                  href={`/college/${encodeURIComponent(decodedName)}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to College
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {accessibleCards.map((card, index) => (
              <Link 
                key={index} 
                href={card.path}
                className="p-6 transition-all bg-white rounded-lg shadow hover:shadow-md hover:translate-y-[-2px]"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    {card.icon}
                    <h2 className="ml-3 text-xl font-medium text-gray-900">{card.title}</h2>
                  </div>
                  <p className="mb-4 text-gray-600">{card.description}</p>
                  <div className="mt-auto text-sm font-medium text-blue-600">
                    Manage {card.title.split(' ')[0]} →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
