'use client';

import Link from 'next/link';

type AttendanceHistoryComponentProps = {
  attendanceHistory: { id: string; date: Date; presentStudents: string[]; absentStudents: string[] }[];
  decodedName: string;
};

export default function AttendanceHistoryComponent({
  attendanceHistory,
  decodedName,
}: AttendanceHistoryComponentProps) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-medium">Attendance Records</h3>
      {attendanceHistory.length > 0 ? (
        <div className="overflow-hidden border border-gray-200 rounded-md shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Present
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Absent
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceHistory.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {record.date.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded-full inline-flex items-center">
                      <span>{record.presentStudents.length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="px-2 py-1 text-sm text-red-800 bg-red-100 rounded-full inline-flex items-center">
                      <span>{record.absentStudents.length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <Link
                      href={`/college/${encodeURIComponent(decodedName)}/manage/attendance/view/${record.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-gray-500">No attendance records found for this course.</p>
        </div>
      )}
    </div>
  );
}