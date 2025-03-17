'use client';

import { Check, X } from 'lucide-react';

type AttendanceTableComponentProps = {
  students: { uid: string; displayName: string; email: string }[];
  attendance: { [key: string]: boolean };
  onAttendanceChange: (studentId: string, isPresent: boolean) => void;
};

export default function AttendanceTableComponent({
  students,
  attendance,
  onAttendanceChange,
}: AttendanceTableComponentProps) {
  return (
    <div>
      <div className="overflow-hidden border border-gray-200 rounded-md shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Student Name
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.uid}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{student.displayName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => onAttendanceChange(student.uid, true)}
                      className={`px-3 py-1 rounded-md ${
                        attendance[student.uid] === true
                          ? 'bg-green-100 text-green-800 ring-1 ring-green-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Check className="w-4 h-4 mr-1" />
                        Present
                      </div>
                    </button>
                    <button
                      onClick={() => onAttendanceChange(student.uid, false)}
                      className={`px-3 py-1 rounded-md ${
                        attendance[student.uid] === false
                          ? 'bg-red-100 text-red-800 ring-1 ring-red-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-red-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        Absent
                      </div>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}