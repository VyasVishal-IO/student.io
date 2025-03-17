// /lib/attendance.ts

import { format } from 'date-fns';

// Type definitions
export interface Attendance {
  collegeId: string;
  date: string; // ISO format
  students: {
    [studentId: string]: boolean;
  };
}

// Get attendance record for a specific date
export async function getAttendance(
  collegeId: string, 
  date: Date
): Promise<Attendance | null> {
  try {
    // Format date to YYYY-MM-DD for consistent storage
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // This would typically be an API call
    // For example:
    // const response = await fetch(`/api/colleges/${collegeId}/attendance/${formattedDate}`);
    // return response.json();
    
    // Mock implementation with localStorage
    const key = `attendance_${collegeId}_${formattedDate}`;
    const data = localStorage.getItem(key);
    
    if (!data) return null;
    
    return JSON.parse(data) as Attendance;
  } catch (error) {
    console.error('Failed to get attendance:', error);
    throw new Error('Failed to get attendance data');
  }
}

// Save attendance record for a specific date
export async function saveAttendance(
  collegeId: string,
  date: Date,
  studentAttendance: Record<string, boolean>
): Promise<void> {
  try {
    // Format date to YYYY-MM-DD
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    const attendanceData: Attendance = {
      collegeId,
      date: date.toISOString(),
      students: studentAttendance
    };
    
    // This would typically be an API call
    // For example:
    // await fetch(`/api/colleges/${collegeId}/attendance/${formattedDate}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(attendanceData),
    // });
    
    // Mock implementation with localStorage
    const key = `attendance_${collegeId}_${formattedDate}`;
    localStorage.setItem(key, JSON.stringify(attendanceData));
    
    // Simulate network delay for demo purposes
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('Failed to save attendance:', error);
    throw new Error('Failed to save attendance data');
  }
}

// Get attendance report for a date range
export async function getAttendanceReport(
  collegeId: string,
  startDate: Date,
  endDate: Date
): Promise<Record<string, Attendance>> {
  try {
    // This would typically be an API call
    // For example:
    // const response = await fetch(
    //   `/api/colleges/${collegeId}/attendance/report?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    // );
    // return response.json();
    
    // Mock implementation (would be more complex in a real application)
    const report: Record<string, Attendance> = {};
    
    // Loop through dates in range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const attendance = await getAttendance(collegeId, new Date(currentDate));
      
      if (attendance) {
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        report[formattedDate] = attendance;
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return report;
  } catch (error) {
    console.error('Failed to get attendance report:', error);
    throw new Error('Failed to generate attendance report');
  }
}

// Calculate attendance statistics for a student
export async function getStudentAttendanceStats(
  collegeId: string,
  studentId: string,
  startDate: Date,
  endDate: Date
): Promise<{ total: number; present: number; percentage: number }> {
  try {
    const report = await getAttendanceReport(collegeId, startDate, endDate);
    
    let totalDays = 0;
    let presentDays = 0;
    
    Object.values(report).forEach(day => {
      totalDays++;
      if (day.students[studentId]) {
        presentDays++;
      }
    });
    
    return {
      total: totalDays,
      present: presentDays,
      percentage: totalDays > 0 ? (presentDays / totalDays) * 100 : 0
    };
  } catch (error) {
    console.error('Failed to get student attendance stats:', error);
    throw new Error('Failed to calculate attendance statistics');
  }
}