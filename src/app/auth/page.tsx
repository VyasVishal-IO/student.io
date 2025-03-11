// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { auth, RecaptchaVerifier } from '@/lib/firebase';
// import { ConfirmationResult } from 'firebase/auth';

// export default function AuthPage() {
//   const { user, profile, loading, signInWithPhone, verifyOTP } = useAuth();
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
//   const [step, setStep] = useState<1 | 2>(1);
//   const router = useRouter();

//   useEffect(() => {
//     window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//       size: 'invisible',
//       callback: () => {}
//     });
//   }, []);

//   const handleSendOTP = async () => {
//     try {
//       const confirmation = await signInWithPhone(`+${phone}`);
//       setConfirmation(confirmation);
//       setStep(2);
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//     }
//   };

//   const handleVerifyOTP = async () => {
//     try {
//       await verifyOTP(confirmation!, otp);
//       // OTP verified, check profile status
//       if (!profile?.role) {
//         router.push('/role-selection');
//       } else {
//         router.push(`/home/${profile.role}/${profile.username}`);
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-6 text-center">Student.io Authentication</h1>
        
//         <div id="recaptcha-container" />
        
//         {step === 1 ? (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Phone Number</label>
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
//                 className="w-full p-2 border rounded-md"
//                 placeholder="Enter phone number"
//               />
//             </div>
//             <button
//               onClick={handleSendOTP}
//               className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
//             >
//               Send OTP
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">OTP</label>
//               <input
//                 type="text"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
//                 className="w-full p-2 border rounded-md"
//                 placeholder="Enter OTP"
//               />
//             </div>
//             <button
//               onClick={handleVerifyOTP}
//               className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
//             >
//               Verify OTP
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }