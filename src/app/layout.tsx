// src/app/layout.tsx
import type { Metadata } from 'next';

import './globals.css';
import { AuthProvider } from '@/context/AuthContext';


export const metadata: Metadata = {
  title: 'Student.io - Social media platform for students',
  description: 'A platform connecting students, teachers, mentors, and companies',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}