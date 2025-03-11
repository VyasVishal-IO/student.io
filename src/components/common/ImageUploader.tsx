// // 'use client';

// // import { useState } from 'react';
// // import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';

// // interface ImageUploaderProps {
// //   onUpload: (url: string) => void;
// // }

// // export default function ImageUploader({ onUpload }: ImageUploaderProps) {
// //   const [error, setError] = useState<string | null>(null);
// //   const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// //   if (!cloudName) {
// //     return <p className="text-red-500 text-sm">Cloudinary configuration is missing!</p>;
// //   }

// //   return (
// //     <div>
// //       <CldUploadWidget
// //         uploadPreset="studentio_upload"
// //         options={{ maxFileSize: 3000000, multiple: false }}
// //         onError={(error) => {
// //           if (typeof error === 'string') {
// //             setError(error);
// //           } else if (error && typeof error === 'object' && 'statusText' in error) {
// //             setError(error.statusText);
// //           } else {
// //             setError('An unknown error occurred.');
// //           }
// //         }}
// //         onSuccess={(result: CloudinaryUploadWidgetResults) => {
// //           if (result.info && typeof result.info !== 'string' && 'secure_url' in result.info) {
// //             onUpload(result.info.secure_url as string);
// //           }
// //         }}
// //       >
// //         {({ open }) => (
// //           <button type="button" onClick={() => open()} className="border p-2 rounded">
// //             Upload Image
// //           </button>
// //         )}
// //       </CldUploadWidget>
// //       {error && <p className="text-red-500 text-sm">{error}</p>}
// //     </div>
// //   );
// // }



// // components/common/ImageUploader.tsx
// 'use client';

// import { useState, useRef } from 'react';
// import { Camera, Upload, X, Loader2 } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { Button } from '@/components/ui/button';

// interface ImageUploaderProps {
//   onUpload: (url: string) => void;
//   currentImage?: string;
//   onRemove?: () => void;
// }

// export default function ImageUploader({ onUpload, currentImage, onRemove }: ImageUploaderProps) {
//   const [isUploading, setIsUploading] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
//   const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'studentio_upload';
  
//   if (!cloudName) {
//     return <p className="text-red-500 text-sm">Cloudinary configuration is missing!</p>;
//   }
  
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       await uploadImage(files[0]);
//     }
//   };
  
//   const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       await uploadImage(e.dataTransfer.files[0]);
//     }
//   };
  
//   const uploadImage = async (file: File) => {
//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       toast.error('Please upload an image file');
//       return;
//     }
    
//     // Validate file size (3MB max)
//     if (file.size > 3 * 1024 * 1024) {
//       toast.error('Image size must be less than 3MB');
//       return;
//     }
    
//     setIsUploading(true);
//     const uploadToast = toast.loading('Uploading image...');
    
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('upload_preset', uploadPreset);
//       formData.append('cloud_name', cloudName);
      
//       const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
//         method: 'POST',
//         body: formData,
//       });
      
//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }
      
//       const data = await response.json();
      
//       if (data.secure_url) {
//         onUpload(data.secure_url);
//         toast.success('Image uploaded successfully', { id: uploadToast });
//       } else {
//         throw new Error('No URL returned');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Failed to upload image', { id: uploadToast });
//     } finally {
//       setIsUploading(false);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   };
  
//   // If an image is already uploaded, show preview with remove option
//   if (currentImage) {
//     return (
//       <div className="relative rounded-lg overflow-hidden">
//         <img 
//           src={currentImage} 
//           alt="Uploaded preview" 
//           className="w-full h-auto object-cover aspect-square" 
//         />
//         {onRemove && (
//           <button 
//             onClick={onRemove} 
//             className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
//             aria-label="Remove image"
//           >
//             <X className="h-5 w-5 text-white" />
//           </button>
//         )}
//       </div>
//     );
//   }
  
//   return (
//     <div className="w-full">
//       <div 
//         className={`border-2 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'} 
//                    rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 transition-colors
//                    ${isUploading ? 'opacity-75 pointer-events-none' : 'hover:bg-gray-100'}`}
//         onDragOver={(e) => { 
//           e.preventDefault(); 
//           e.stopPropagation();
//           setDragActive(true);
//         }}
//         onDragEnter={(e) => { 
//           e.preventDefault(); 
//           e.stopPropagation();
//           setDragActive(true);
//         }}
//         onDragLeave={(e) => { 
//           e.preventDefault(); 
//           e.stopPropagation();
//           setDragActive(false);
//         }}
//         onDrop={handleDrop}
//       >
//         {isUploading ? (
//           <div className="flex flex-col items-center">
//             <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-2" />
//             <p className="text-sm text-gray-500">Uploading...</p>
//           </div>
//         ) : (
//           <>
//             <Camera className="h-12 w-12 text-gray-400 mb-2" />
//             <p className="text-sm text-gray-500 text-center mb-4">
//               Drag and drop an image here, or click to select
//             </p>
//             <div className="flex gap-2">
//               <Button 
//                 type="button"
//                 variant="outline"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="flex items-center gap-2"
//               >
//                 <Upload className="h-4 w-4" />
//                 Select Image
//               </Button>
              
//               {/* Hidden file input */}
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleFileChange}
//               />
//             </div>
//             <p className="text-xs text-gray-400 mt-2">
//               Max file size: 3MB
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  onRemove?: () => void;
}

export default function ImageUploader({ onUpload, currentImage, onRemove }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'studentio_upload';
  
  if (!cloudName) {
    return <div className="text-red-500 text-sm rounded-md bg-red-50 p-2">
      <p>Cloudinary configuration is missing!</p>
      <p className="text-xs mt-1">Check your environment variables.</p>
    </div>;
  }
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadImage(files[0]);
    }
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadImage(e.dataTransfer.files[0]);
    }
  };
  
  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 95) {
        clearInterval(interval);
        progress = 95;
      }
      setUploadProgress(Math.min(progress, 95));
    }, 300);
    return () => clearInterval(interval);
  };
  
  const uploadImage = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Validate file size (3MB max)
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image size must be less than 3MB');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    const uploadToast = toast.loading('Uploading image...');
    
    // Start progress simulation
    const stopProgress = simulateProgress();
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('cloud_name', cloudName);
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      
      if (data.secure_url) {
        // Complete progress
        setUploadProgress(100);
        setTimeout(() => {
          onUpload(data.secure_url);
          toast.success('Image uploaded successfully', { id: uploadToast });
        }, 400); // Small delay to show 100% progress
      } else {
        throw new Error('No URL returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image', { id: uploadToast });
    } finally {
      stopProgress();
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // If an image is already uploaded, show preview with remove option
  if (currentImage) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img 
            src={currentImage} 
            alt="Profile" 
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105" 
          />
        </div>
        {onRemove && (
          <button 
            onClick={onRemove} 
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-1.5 rounded-full shadow-sm transition-all duration-200 transform hover:scale-110"
            aria-label="Remove image"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div 
        className={`border-2 rounded-lg overflow-hidden transition-all duration-300
                   ${dragActive 
                     ? 'border-blue-500 bg-blue-50 shadow-md' 
                     : 'border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'}
                   ${isUploading ? 'opacity-90' : ''}`}
        onDragOver={(e) => { 
          e.preventDefault(); 
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragEnter={(e) => { 
          e.preventDefault(); 
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={(e) => { 
          e.preventDefault(); 
          e.stopPropagation();
          setDragActive(false);
        }}
        onDrop={handleDrop}
      >
        <div className="p-6 flex flex-col items-center justify-center">
          {isUploading ? (
            <div className="flex flex-col items-center w-full">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
              <Progress value={uploadProgress} className="w-full h-2 mb-2" />
              <p className="text-sm text-gray-500">Uploading... {Math.round(uploadProgress)}%</p>
            </div>
          ) : (
            <>
              {dragActive ? (
                <ImageIcon className="h-12 w-12 text-blue-500 mb-2" />
              ) : (
                <Camera className="h-12 w-12 text-gray-400 mb-2" />
              )}
              <p className="text-sm text-gray-500 text-center mb-4">
                {dragActive 
                  ? 'Drop your image here' 
                  : 'Drag and drop an image here, or click to select'}
              </p>
              <Button 
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 transition-all hover:bg-blue-50"
              >
                <Upload className="h-4 w-4" />
                Select Image
              </Button>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              
              <div className="flex flex-col items-center mt-4">
                <p className="text-xs text-gray-400">
                  Maximum file size: 3MB
                </p>
                <p className="text-xs text-gray-400">
                  Recommended: Square image (1:1 ratio)
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}