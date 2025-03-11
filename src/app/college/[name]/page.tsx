// src/app/college/[name]/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  arrayUnion,
  onSnapshot, 
  addDoc,
  Timestamp
} from 'firebase/firestore';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle, X, Check, UserPlus, Users, School, BookOpen } from 'lucide-react';

type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  role: string;
  username?: string;
  major?: string;
  department?: string;
};

type College = {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  students: string[];
  teachers: string[];
  createdAt: Timestamp;
};

type Request = {
  id: string;
  collegeId: string;
  studentId?: string;
  teacherId?: string;
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
  role: 'student' | 'teacher';
};

export default function CollegePage() {
  const { name } = useParams();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [college, setCollege] = useState<College | null>(null);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [teachers, setTeachers] = useState<UserProfile[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');

  const decodedName = useMemo(() => {
    return name ? decodeURIComponent(name as string) : '';
  }, [name]);

  useEffect(() => {
    if (!decodedName) return;
    
    // Fetch college data and set up listeners
    const setupCollegeData = async () => {
      try {
        // Find the college by name
        const collegeQuery = query(collection(db, 'colleges'), where('name', '==', decodedName));
        const collegeSnapshot = await getDocs(collegeQuery);
        
        if (collegeSnapshot.empty) {
          router.push('/colleges');
          return null;
        }
        
        const collegeDoc = collegeSnapshot.docs[0];
        const collegeData = collegeDoc.data() as Omit<College, 'id'>;
        const collegeWithId = { id: collegeDoc.id, ...collegeData } as College;
        setCollege(collegeWithId);
        
        // Set up real-time listeners for college updates, members, and requests
        const unsubscribers = setupListeners(collegeWithId);
        
        return () => {
          unsubscribers.forEach(unsubscribe => unsubscribe());
        };
      } catch (error) {
        console.error('Error setting up college data:', error);
        setLoading(false);
        return null;
      }
    };
    
    const cleanup = setupCollegeData();
    
    return () => {
      cleanup?.then(unsubscribe => unsubscribe?.());
    };
  }, [decodedName, router]);

  // Setup all necessary Firestore listeners
  const setupListeners = (college: College) => {
    const unsubscribers: (() => void)[] = [];
    
    // College data listener
    const collegeUnsubscribe = onSnapshot(
      doc(db, 'colleges', college.id),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const updatedCollege = {
            id: docSnapshot.id,
            ...docSnapshot.data()
          } as College;
          
          setCollege(updatedCollege);
          
          // Fetch members whenever college data changes
          fetchMembersDetails(updatedCollege.students || [], updatedCollege.teachers || []);
        }
      }
    );
    unsubscribers.push(collegeUnsubscribe);
    
    // Students/teachers join requests listener
    const requestsQuery = query(
      collection(db, 'requests'),
      where('collegeId', '==', college.id),
      where('status', '==', 'pending')
    );
    
    const requestsUnsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Request[];
      
      setRequests(requestsData);
      setLoading(false);
    });
    unsubscribers.push(requestsUnsubscribe);
    
    return unsubscribers;
  };
  
  // Fetch detailed profiles for students and teachers
  const fetchMembersDetails = async (studentIds: string[], teacherIds: string[]) => {
    try {
      // Fetch students details
      if (studentIds.length > 0) {
        const studentsQuery = query(
          collection(db, 'users'),
          where('uid', 'in', studentIds),
          where('role', '==', 'student')
        );
        
        const studentsSnapshot = await getDocs(studentsQuery);
        setStudents(studentsSnapshot.docs.map(doc => doc.data() as UserProfile));
      } else {
        setStudents([]);
      }
      
      // Fetch teachers details
      if (teacherIds.length > 0) {
        const teachersQuery = query(
          collection(db, 'users'),
          where('uid', 'in', teacherIds),
          where('role', '==', 'teacher')
        );
        
        const teachersSnapshot = await getDocs(teachersQuery);
        setTeachers(teachersSnapshot.docs.map(doc => doc.data() as UserProfile));
      } else {
        setTeachers([]);
      }
    } catch (error) {
      console.error('Error fetching members details:', error);
    }
  };

  const isAdmin = college?.createdBy === user?.uid;
  const isStudent = profile?.role === 'student';
  const isTeacher = profile?.role === 'teacher';
  const isMember = 
    (isStudent && college?.students?.includes(user?.uid)) || 
    (isTeacher && college?.teachers?.includes(user?.uid));
  
  // Filter requests based on role
  const studentRequests = requests.filter(r => r.role === 'student');
  const teacherRequests = requests.filter(r => r.role === 'teacher');

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
        <Link 
          href="/colleges" 
          className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Browse Colleges
        </Link>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <School className="w-8 h-8 text-blue-600" />
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">{college.name}</h1>
                </div>
                <p className="mt-2 text-gray-600">{college.description}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{students.length} Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{teachers.length} Teachers</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {(isAdmin || isMember) && (
                  <Link 
                    href={isTeacher ? `/home/teacher/${profile?.username}` : `/home/student/${profile?.username}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Link>
                )}
                
                {isAdmin && (
                  <Link 
                    href={`/college/${name}/manage`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Manage College
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Join Request Section for non-members */}
          {!isMember && (
            <>
              {isStudent && (
                <JoinRequestSection 
                  collegeId={college.id} 
                  userId={user?.uid} 
                  userName={profile?.displayName} 
                  userEmail={user?.email} 
                  role="student" 
                /> 
              )} 
              
              {isTeacher && ( 
                <JoinRequestSection 
                  collegeId={college.id} 
                  userId={user?.uid} 
                  userName={profile?.displayName} 
                  userEmail={user?.email} 
                  role="teacher" 
                />
              )}
            </>
          )}

          {/* Pending Requests Section (for admin) */}
          {isAdmin && (requests.length > 0) && ( 
            <div className="p-4 mb-6 bg-white rounded-lg shadow"> 
              <div className="flex items-center justify-between mb-4"> 
                <h2 className="text-xl font-semibold">Pending Requests ({requests.length})</h2> 
                <Link 
                  href={`/notifications/${profile?.username}`} 
                  className="text-sm font-medium text-blue-600 hover:text-blue-800" 
                > 
                  View All Notifications 
                </Link> 
              </div> 
              
              {studentRequests.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 text-lg font-medium">Student Requests ({studentRequests.length})</h3>
                  <RequestsList 
                    requests={studentRequests} 
                    collegeId={college.id} 
                    role="student"
                  />
                </div>
              )}
              
              {teacherRequests.length > 0 && (
                <div>
                  <h3 className="mb-2 text-lg font-medium">Teacher Requests ({teacherRequests.length})</h3>
                  <RequestsList 
                    requests={teacherRequests} 
                    collegeId={college.id} 
                    role="teacher"
                  />
                </div>
              )}
            </div>
          )}

          {/* College Members Tabs */}
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="mb-4 border-b">
              <div className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('students')}
                  className={`py-2 px-4 font-medium text-sm border-b-2 ${
                    activeTab === 'students' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Students ({students.length})
                </button>
                <button
                  onClick={() => setActiveTab('teachers')}
                  className={`py-2 px-4 font-medium text-sm border-b-2 ${
                    activeTab === 'teachers' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Teachers ({teachers.length})
                </button>
              </div>
            </div>
            
            {/* Students List */}
            {activeTab === 'students' && (
              <div>
                {students.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No students have joined this college yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {students.map(student => (
                      <MemberCard 
                        key={student.uid} 
                        member={student} 
                        isAdmin={isAdmin}
                        collegeId={college.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Teachers List */}
            {activeTab === 'teachers' && (
              <div>
                {teachers.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No teachers have joined this college yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {teachers.map(teacher => (
                      <MemberCard 
                        key={teacher.uid} 
                        member={teacher} 
                        isAdmin={isAdmin}
                        collegeId={college.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

// Join Request Section Component
function JoinRequestSection({ collegeId, userId, userName, userEmail, role }: { 
  collegeId: string; 
  userId: string; 
  userName: string; 
  userEmail: string;
  role: 'student' | 'teacher';
}) {
  const [hasRequested, setHasRequested] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Check if user already has a pending request
    const checkExistingRequest = async () => {
      if (!userId || !collegeId) return;
      
      const q = query(
        collection(db, 'requests'),
        where('collegeId', '==', collegeId),
        where(role === 'student' ? 'studentId' : 'teacherId', '==', userId),
        where('status', '==', 'pending')
      );
      
      const snapshot = await getDocs(q);
      setHasRequested(!snapshot.empty);
    };
    
    checkExistingRequest();
  }, [collegeId, userId, role]);

  const handleJoin = async () => {
    if (!userId || !collegeId || !userName || !userEmail) return;
    
    setIsSubmitting(true);
    
    try {
      const requestData = {
        collegeId,
        [role === 'student' ? 'studentId' : 'teacherId']: userId,
        name: userName || 'Anonymous',
        email: userEmail || 'no-email',
        status: 'pending',
        createdAt: new Date(),
        role: role
      };
      
      await addDoc(collection(db, 'requests'), requestData);
      setHasRequested(true);
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow">
      <div className="flex items-center gap-3 mb-4">
        <UserPlus className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-medium">Join This College as a {role === 'student' ? 'Student' : 'Teacher'}</h3>
      </div>
      
      {hasRequested ? (
        <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-md">
          <CheckCircle className="w-5 h-5 mr-2" />
          <div>
            <p className="font-medium">Join request sent!</p>
            <p className="text-sm text-green-600">Your request is pending approval. You'll be notified when it's processed.</p>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-gray-600">
            Join this college to access courses, resources, and connect with {role === 'student' ? 'teachers' : 'students'}.
          </p>
          <button
            onClick={handleJoin}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
            disabled={isSubmitting || !userName || !userEmail}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                Submitting...
              </>
            ) : (
              <>Request to Join</>
            )}
          </button>
          {(!userName || !userEmail) && (
            <p className="mt-2 text-sm text-red-500">
              Please complete your profile information before joining.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Requests List Component
function RequestsList({ requests, collegeId, role }: { 
  requests: Request[]; 
  collegeId: string;
  role: 'student' | 'teacher';
}) {
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const handleRequest = async (requestId: string, action: 'accept' | 'reject') => {
    setProcessingIds(prev => [...prev, requestId]);
    
    try {
      const requestRef = doc(db, 'requests', requestId);
      const collegeRef = doc(db, 'colleges', collegeId);

      // Update request status
      await updateDoc(requestRef, { status: action });
      
      if (action === 'accept') {
        // Get request data to identify user ID
        const requestDoc = await getDoc(requestRef);
        const requestData = requestDoc.data();
        const memberId = role === 'student' ? requestData?.studentId : requestData?.teacherId;
        
        if (memberId) {
          // Add user to appropriate array in college document
          const arrayField = role === 'student' ? 'students' : 'teachers';
          await updateDoc(collegeRef, {
            [arrayField]: arrayUnion(memberId)
          });
        }
      }
    } catch (error) {
      console.error('Error handling request:', error);
      alert('Failed to process request. Please try again.');
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== requestId));
    }
  };

  return (
    <div className="space-y-3">
      {requests.length === 0 ? (
        <p className="p-3 text-gray-500 bg-gray-50 rounded-md">No pending requests</p>
      ) : (
        requests.map((request) => {
          const isProcessing = processingIds.includes(request.id);
          
          return (
            <div key={request.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-medium">{request.name}</h3>
                  <p className="text-sm text-gray-600">{request.email}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {request.createdAt?.toDate?.().toLocaleString() || 'Unknown date'}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequest(request.id, 'reject')}
                    className="inline-flex items-center px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="w-3 h-3 mr-1 border-t-2 border-b-2 border-red-600 rounded-full animate-spin"></span>
                    ) : (
                      <X className="w-3 h-3 mr-1" />
                    )}
                    Reject
                  </button>
                  <button
                    onClick={() => handleRequest(request.id, 'accept')}
                    className="inline-flex items-center px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="w-3 h-3 mr-1 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                    ) : (
                      <Check className="w-3 h-3 mr-1" />
                    )}
                    Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// Member Card Component
function MemberCard({ member, isAdmin, collegeId }: { 
  member: UserProfile; 
  isAdmin: boolean;
  collegeId: string;
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  
  const removeMember = async () => {
    if (!isAdmin || !collegeId || !member.uid) return;
    
    if (!confirm(`Are you sure you want to remove ${member.displayName} from this college?`)) {
      return;
    }
    
    setIsRemoving(true);
    
    try {
      const collegeRef = doc(db, 'colleges', collegeId);
      const collegeDoc = await getDoc(collegeRef);
      const collegeData = collegeDoc.data();
      
      const arrayField = member.role === 'student' ? 'students' : 'teachers';
      const updatedArray = (collegeData?.[arrayField] || []).filter((id: string) => id !== member.uid);
      
      await updateDoc(collegeRef, {
        [arrayField]: updatedArray
      });
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium">{member.displayName}</h3>
        {isAdmin && (
          <button
            onClick={removeMember}
            className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50"
            disabled={isRemoving}
            title="Remove member"
          >
            {isRemoving ? (
              <span className="w-4 h-4 border-t-2 border-b-2 border-red-500 rounded-full animate-spin"></span>
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600">{member.email}</p>
      
      {member.role === 'student' && member.major && (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Major:</span> {member.major}
        </p>
      )}
      
      {member.role === 'teacher' && member.department && (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Department:</span> {member.department}
        </p>
      )}
      
      <Link 
        href={`/profile/${member.username || member.uid}`}
        className="inline-block mt-3 text-xs text-blue-600 hover:underline"
      >
        View Profile
      </Link>
    </div>
  );
}