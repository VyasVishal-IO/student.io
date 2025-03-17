// /lib/students.ts

// Type definitions
export interface Student {
    id: string;
    name: string;
    email: string;
    enrollmentNumber: string;
    collegeId: string;
    program: string;
    year: number;
    section?: string;
    phoneNumber?: string;
  }
  
  // In-memory mock database for demonstration
  // In a real application, this would be fetched from an API
  const mockStudents: Student[] = [
    {
      id: "s001",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      enrollmentNumber: "EN2021001",
      collegeId: "college1",
      program: "Computer Science",
      year: 2,
      section: "A",
      phoneNumber: "555-0101"
    },
    {
      id: "s002",
      name: "Bob Smith",
      email: "bob.smith@example.com",
      enrollmentNumber: "EN2021002",
      collegeId: "college1",
      program: "Computer Science",
      year: 2,
      section: "A",
      phoneNumber: "555-0102"
    },
    {
      id: "s003",
      name: "Charlie Davis",
      email: "charlie.davis@example.com",
      enrollmentNumber: "EN2021003",
      collegeId: "college1",
      program: "Electrical Engineering",
      year: 3,
      section: "B",
      phoneNumber: "555-0103"
    },
    {
      id: "s004",
      name: "Diana Miller",
      email: "diana.miller@example.com",
      enrollmentNumber: "EN2021004",
      collegeId: "college2",
      program: "Business Administration",
      year: 1,
      section: "A",
      phoneNumber: "555-0104"
    },
    {
      id: "s005",
      name: "Ethan Wilson",
      email: "ethan.wilson@example.com",
      enrollmentNumber: "EN2021005",
      collegeId: "college2",
      program: "Business Administration",
      year: 1,
      section: "B",
      phoneNumber: "555-0105"
    },
    {
      id: "s006",
      name: "Fiona Brown",
      email: "fiona.brown@example.com",
      enrollmentNumber: "EN2021006",
      collegeId: "college1",
      program: "Mathematics",
      year: 4,
      section: "A"
    }
  ];
  
  // Get all students
  export async function getAllStudents(): Promise<Student[]> {
    try {
      // This would typically be an API call
      // For example:
      // const response = await fetch('/api/students');
      // return response.json();
      
      // Mock implementation with artificial delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return [...mockStudents];
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw new Error('Failed to fetch all students');
    }
  }
  
  // Get students by college
  export async function getStudentsByCollege(collegeId: string): Promise<Student[]> {
    try {
      // This would typically be an API call
      // For example:
      // const response = await fetch(`/api/colleges/${collegeId}/students`);
      // return response.json();
      
      // Mock implementation with artificial delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockStudents.filter(student => student.collegeId === collegeId);
    } catch (error) {
      console.error(`Failed to fetch students for college ${collegeId}:`, error);
      throw new Error(`Failed to fetch students for college ${collegeId}`);
    }
  }
  
  // Get student by ID
  export async function getStudentById(studentId: string): Promise<Student | null> {
    try {
      // This would typically be an API call
      // For example:
      // const response = await fetch(`/api/students/${studentId}`);
      // return response.json();
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 200));
      const student = mockStudents.find(s => s.id === studentId);
      return student || null;
    } catch (error) {
      console.error(`Failed to fetch student ${studentId}:`, error);
      throw new Error(`Failed to fetch student ${studentId}`);
    }
  }
  
  // Create new student
  export async function createStudent(studentData: Omit<Student, 'id'>): Promise<Student> {
    try {
      // This would typically be an API call
      // For example:
      // const response = await fetch('/api/students', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(studentData),
      // });
      // return response.json();
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 400));
      const newId = `s${String(mockStudents.length + 1).padStart(3, '0')}`;
      
      const newStudent: Student = {
        id: newId,
        ...studentData
      };
      
      // In a real app, this would be handled by the server
      mockStudents.push(newStudent);
      
      return newStudent;
    } catch (error) {
      console.error('Failed to create student:', error);
      throw new Error('Failed to create student');
    }
  }
  
  // Update student
  export async function updateStudent(studentId: string, updates: Partial<Student>): Promise<Student> {
    try {
      // This would typically be an API call
      // For example:
      // const response = await fetch(`/api/students/${studentId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updates),
      // });
      // return response.json();
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const studentIndex = mockStudents.findIndex(s => s.id === studentId);
      if (studentIndex === -1) {
        throw new Error(`Student with ID ${studentId} not found`);
      }
      
      const updatedStudent = {
        ...mockStudents[studentIndex],
        ...updates
      };
      
      // In a real app, this would be handled by the server
      mockStudents[studentIndex] = updatedStudent;
      
      return updatedStudent;
    } catch (error) {
      console.error(`Failed to update student ${studentId}:`, error);
      throw new Error(`Failed to update student ${studentId}`);
    }
  }
  
  // Delete student
  export async function deleteStudent(studentId: string): Promise<void> {
    try {
      // This would typically be an API call
      // For example:
      // await fetch(`/api/students/${studentId}`, {
      //   method: 'DELETE',
      // });
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const studentIndex = mockStudents.findIndex(s => s.id === studentId);
      if (studentIndex === -1) {
        throw new Error(`Student with ID ${studentId} not found`);
      }
      
      // In a real app, this would be handled by the server
      mockStudents.splice(studentIndex, 1);
    } catch (error) {
      console.error(`Failed to delete student ${studentId}:`, error);
      throw new Error(`Failed to delete student ${studentId}`);
    }
  }
  
  // Search students by query
  export async function searchStudents(query: string, collegeId?: string): Promise<Student[]> {
    try {
      // This would typically be an API call
      // For example:
      // const response = await fetch(`/api/students/search?q=${query}${collegeId ? `&collegeId=${collegeId}` : ''}`);
      // return response.json();
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const normalizedQuery = query.toLowerCase();
      
      let results = mockStudents.filter(student => {
        return (
          student.name.toLowerCase().includes(normalizedQuery) ||
          student.email.toLowerCase().includes(normalizedQuery) ||
          student.enrollmentNumber.toLowerCase().includes(normalizedQuery) ||
          student.program.toLowerCase().includes(normalizedQuery)
        );
      });
      
      // Filter by college if specified
      if (collegeId) {
        results = results.filter(student => student.collegeId === collegeId);
      }
      
      return results;
    } catch (error) {
      console.error(`Failed to search students with query "${query}":`, error);
      throw new Error('Failed to search students');
    }
  }