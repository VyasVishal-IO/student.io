// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { 
//   addDoc, 
//   collection, 
//   serverTimestamp 
// } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { Contribution } from '@/types/content';

// interface ContributionBoxProps {
//   projectId: string;
//   currentMembers: string[];
// }

// export default function ContributionBox({ 
//   projectId, 
//   currentMembers 
// }: ContributionBoxProps) {
//   const { user } = useAuth();
//   const [contribution, setContribution] = useState<Partial<Contribution>>({
//     title: '',
//     description: '',
//     links: [],
//     isPrivate: false
//   });
//   const [newLink, setNewLink] = useState({ title: '', url: '' });

//   const handleAddLink = () => {
//     if (newLink.title && newLink.url) {
//       setContribution(prev => ({
//         ...prev,
//         links: [...(prev.links || []), newLink]
//       }));
//       setNewLink({ title: '', url: '' });
//     }
//   };

//   const handleSubmitContribution = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     try {
//       await addDoc(collection(db, 'contributions'), {
//         ...contribution,
//         projectId,
//         userId: user.uid,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp()
//       });
      
//       // Reset form
//       setContribution({
//         title: '',
//         description: '',
//         links: [],
//         isPrivate: false
//       });
//     } catch (error) {
//       console.error('Error adding contribution:', error);
//     }
//   };

//   return (
//     <div className="bg-white shadow rounded-lg p-4">
//       <h2 className="text-xl font-semibold mb-4">Add Contribution</h2>
//       <form onSubmit={handleSubmitContribution} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Contribution Title"
//           value={contribution.title}
//           onChange={e => setContribution(prev => ({ ...prev, title: e.target.value }))}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <textarea
//           placeholder="Contribution Description"
//           value={contribution.description}
//           onChange={e => setContribution(prev => ({ ...prev, description: e.target.value }))}
//           className="w-full p-2 border rounded"
//           required
//         />

//         {/* Link Addition Section */}
//         <div className="space-y-2">
//           <div className="flex gap-2">
//             <input
//               placeholder="Link Title"
//               value={newLink.title}
//               onChange={e => setNewLink(prev => ({ ...prev, title: e.target.value }))}
//               className="flex-1 p-2 border rounded"
//             />
//             <input
//               placeholder="URL"
//               type="url"
//               value={newLink.url}
//               onChange={e => setNewLink(prev => ({ ...prev, url: e.target.value }))}
//               className="flex-1 p-2 border rounded"
//             />
//             <button
//               type="button"
//               onClick={handleAddLink}
//               className="bg-gray-200 px-4 rounded"
//             >
//               Add Link
//             </button>
//           </div>
//           {contribution.links?.map((link, index) => (
//             <div key={index} className="flex items-center gap-2">
//               <a href={link.url} target="_blank" className="text-blue-500">
//                 {link.title}
//               </a>
//             </div>
//           ))}
//         </div>

//         {/* Privacy Toggle */}
//         <div className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             id="privateContribution"
//             checked={contribution.isPrivate}
//             onChange={e => setContribution(prev => ({ 
//               ...prev, 
//               isPrivate: e.target.checked 
//             }))}
//             className="h-4 w-4"
//           />
//           <label htmlFor="privateContribution" className="text-sm">
//             Make this contribution private (only visible to project members)
//           </label>
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Add Contribution
//         </button>
//       </form>
//     </div>
//   );
// }




'use client';

import { useState } from 'react';
import { 
  addDoc, 
  collection, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { Contribution, MemberRole } from '@/types/project';

interface ContributionBoxProps {
  projectId: string;
  userRole: MemberRole | null;
}

export default function ContributionBox({ 
  projectId, 
  userRole 
}: ContributionBoxProps) {
  const { user } = useAuth();
  const [contribution, setContribution] = useState<Partial<Contribution>>({
    title: '',
    description: '',
    type: 'Other',
    visibility: 'Team',
    links: [],
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      setContribution(prev => ({
        ...prev,
        links: [...(prev.links || []), newLink]
      }));
      setNewLink({ title: '', url: '' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachments(Array.from(files));
    }
  };

  const handleSubmitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      // Upload attachments
      const attachmentUrls = await Promise.all(
        attachments.map(async (file) => {
          const fileRef = ref(storage, `contributions/${projectId}/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(fileRef, file);
          return await getDownloadURL(snapshot.ref);
        })
      );

      // Create contribution document
      const contributionDoc = await addDoc(collection(db, 'contributions'), {
        ...contribution,
        projectId,
        userId: user.uid,
        attachments: attachmentUrls.map((url, index) => ({
          name: attachments[index].name,
          url
        })),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Reset form
      setContribution({
        title: '',
        description: '',
        type: 'Other',
        visibility: 'Team',
        links: [],
      });
      setAttachments([]);

      // TODO: Add success notification
    } catch (error) {
      console.error('Error adding contribution:', error);
      // TODO: Add error notification
    }
};

// Restrict contribution options based on user role
const canContribute = userRole === MemberRole.CONTRIBUTOR 
  || userRole === MemberRole.ADMIN 
  || userRole === MemberRole.OWNER;

if (!canContribute) return null;

return (
  <div className="bg-white shadow-md rounded-lg p-6">
    <h2 className="text-xl font-semibold mb-4">Add Contribution</h2>
    
    <form onSubmit={handleSubmitContribution} className="space-y-4">
      {/* Contribution Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contribution Title
        </label>
        <input
          type="text"
          value={contribution.title}
          onChange={(e) => setContribution(prev => ({ 
            ...prev, 
            title: e.target.value 
          }))}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter contribution title"
        />
      </div>

      {/* Contribution Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={contribution.description}
          onChange={(e) => setContribution(prev => ({ 
            ...prev, 
            description: e.target.value 
          }))}
          required
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Describe your contribution"
        />
      </div>

      {/* Contribution Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contribution Type
        </label>
        <select
          value={contribution.type}
          onChange={(e) => setContribution(prev => ({ 
            ...prev, 
            type: e.target.value as Contribution['type'] 
          }))}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="Code">Code</option>
          <option value="Design">Design</option>
          <option value="Documentation">Documentation</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Visibility Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visibility
        </label>
        <select
          value={contribution.visibility}
          onChange={(e) => setContribution(prev => ({ 
            ...prev, 
            visibility: e.target.value as Contribution['visibility'] 
          }))}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="Team">Team Only</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>
      </div>

      {/* Links Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Related Links
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Link Title"
            value={newLink.title}
            onChange={(e) => setNewLink(prev => ({ 
              ...prev, 
              title: e.target.value 
            }))}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <input
            type="url"
            placeholder="URL"
            value={newLink.url}
            onChange={(e) => setNewLink(prev => ({ 
              ...prev, 
              url: e.target.value 
            }))}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={handleAddLink}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Link
          </button>
        </div>

        {/* Display Added Links */}
        {contribution.links && contribution.links.length > 0 && (
          <div className="mt-2 space-y-1">
            {contribution.links.map((link, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {link.title}
                </a>
                <button
                  type="button"
                  onClick={() => setContribution(prev => ({
                    ...prev,
                    links: prev.links?.filter((_, i) => i !== index)
                  }))}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Attachments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments
        </label>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        
        {/* Display Uploaded Files */}
        {attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {attachments.map((file, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachments(prev => 
                    prev.filter((_, i) => i !== index)
                  )}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
      >
        Submit Contribution
      </button>
    </form>
  </div>
);
}