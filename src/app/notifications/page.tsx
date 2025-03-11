// src/app/notifications/page.tsx
'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import NotificationProjectRequest from '@/components/notifications/NotificationProjectRequest';
import SaveNotificationsList from '@/components/notifications/SaveNotificationsList';

export default function NotificationsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Save Notifications</h1>
        <SaveNotificationsList />
        <NotificationProjectRequest />
      </div>
    </AuthGuard>
  );
}