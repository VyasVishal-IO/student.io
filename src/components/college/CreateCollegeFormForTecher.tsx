// // src/components/college/CreateCollegeForm.tsx
// import { useState } from 'react';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { useAuth } from '@/context/AuthContext';

// interface CreateCollegeFormProps {
//   onClose: () => void;
// }

// export default function CreateCollegeForm({ onClose }: CreateCollegeFormProps) {
//   const { user } = useAuth();
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [department, setDepartment] = useState('');
//   const [subjects, setSubjects] = useState<string[]>([]);
//   const [subjectInput, setSubjectInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleAddSubject = () => {
//     if (subjectInput.trim() && !subjects.includes(subjectInput.trim())) {
//       setSubjects([...subjects, subjectInput.trim()]);
//       setSubjectInput('');
//     }
//   };

//   const handleRemoveSubject = (subjectToRemove: string) => {
//     setSubjects(subjects.filter(subject => subject !== subjectToRemove));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!name.trim()) {
//       setError('College name is required');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError('');
      
//       await addDoc(collection(db, 'colleges'), {
//         name: name.trim(),
//         description: description.trim(),
//         department: department.trim(),
//         subjects: subjects,
//         createdBy: user?.uid,
//         createdAt: serverTimestamp(),
//         teachers: [user?.uid], // Add creator as a teacher by default
//       });
      
//       setName('');
//       setDescription('');
//       setDepartment('');
//       setSubjects([]);
//       onClose();
//     } catch (err) {
//       console.error('Error creating college:', err);
//       setError('Failed to create college. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200">
//       <h3 className="text-lg font-medium text-gray-900 mb-4">Create New College</h3>
      
//       {error && (
//         <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
//           {error}
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//             College Name *
//           </label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             required
//           />
//         </div>
        
//         <div className="mb-4">
//           <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//             Description
//           </label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows={3}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
        
//         <div className="mb-4">
//           <label htmlFor="department" className="block text-sm font-medium text-gray-700">
//             Department
//           </label>
//           <input
//             type="text"
//             id="department"
//             value={department}
//             onChange={(e) => setDepartment(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
        
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Subjects
//           </label>
//           <div className="flex mt-1">
//             <input
//               type="text"
//               value={subjectInput}
//               onChange={(e) => setSubjectInput(e.target.value)}
//               className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               placeholder="Add a subject"
//             />
//             <button
//               type="button"
//               onClick={handleAddSubject}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Add
//             </button>
//           </div>
//           {subjects.length > 0 && (
//             <div className="mt-2 flex flex-wrap gap-2">
//               {subjects.map((subject, index) => (
//                 <span
//                   key={index}
//                   className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
//                 >
//                   {subject}
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveSubject(subject)}
//                     className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
        
//         <div className="mt-6 flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
//           >
//             {isLoading ? 'Creating...' : 'Create College'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// src/components/college/CreateCollegeForm.tsx
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import ImageUploader from '@/components/common/ImageUploader'; // Import the ImageUploader component

interface CreateCollegeFormProps {
  onClose: () => void;
}

export default function CreateCollegeForm({ onClose }: CreateCollegeFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectInput, setSubjectInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined); // State for college logo URL

  const handleAddSubject = () => {
    if (subjectInput.trim() && !subjects.includes(subjectInput.trim())) {
      setSubjects([...subjects, subjectInput.trim()]);
      setSubjectInput('');
    }
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    setSubjects(subjects.filter(subject => subject !== subjectToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('College name is required');
      return;
    }

    if (!logoUrl) {
      setError('College logo is required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await addDoc(collection(db, 'colleges'), {
        name: name.trim(),
        description: description.trim(),
        department: department.trim(),
        subjects: subjects,
        logoUrl: logoUrl, // Include the logo URL in the college data
        createdBy: user?.uid,
        createdAt: serverTimestamp(),
        teachers: [user?.uid], // Add creator as a teacher by default
      });
      
      setName('');
      setDescription('');
      setDepartment('');
      setSubjects([]);
      setLogoUrl(undefined); // Reset logo URL
      onClose();
    } catch (err) {
      console.error('Error creating college:', err);
      setError('Failed to create college. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create New College</h3>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            College Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <input
            type="text"
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Subjects
          </label>
          <div className="flex mt-1">
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add a subject"
            />
            <button
              type="button"
              onClick={handleAddSubject}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          {subjects.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {subjects.map((subject, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(subject)}
                    className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* College Logo Upload Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            College Logo *
          </label>
          <ImageUploader
            onUpload={(url) => setLogoUrl(url)} // Set the logo URL when uploaded
            currentImage={logoUrl} // Pass the current logo URL for preview
            onRemove={() => setLogoUrl(undefined)} // Reset the logo URL when removed
          />
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create College'}
          </button>
        </div>
      </form>
    </div>
  );
}