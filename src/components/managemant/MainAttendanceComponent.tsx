'use client';

import { useState } from 'react';
import FileUploadComponent from './FileUploadComponent';
import AttendanceTableComponent from './AttendanceTableComponent';
import AttendanceHistoryComponent from './AttendanceHistoryComponent';

export default function MainAttendanceComponent() {
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
  const [students, setStudents] = useState<{ uid: string; displayName: string; email: string }[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<
    { id: string; date: Date; presentStudents: string[]; absentStudents: string[] }[]
  >([]);
  const [viewMode, setViewMode] = useState<'create' | 'history'>('create');

  const handleFileProcessed = (data: { [key: string]: boolean }) => {
    setAttendance(data);
  };

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: isPresent,
    }));
  };

  return (
    <div>
      <FileUploadComponent onFileProcessed={handleFileProcessed} />
      {viewMode === 'create' && (
        <AttendanceTableComponent
          students={students}
          attendance={attendance}
          onAttendanceChange={handleAttendanceChange}
        />
      )}
      {viewMode === 'history' && (
        <AttendanceHistoryComponent
          attendanceHistory={attendanceHistory}
          decodedName="guni"
        />
      )}
    </div>
  );
}