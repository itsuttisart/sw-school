export type Role = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  password?: string;
  username?: string; // admin
  phone?: string; // teacher, parent
  studentId?: string; // student
  // Specific fields
  class?: string; // student
  childrenIds?: string[]; // parent
}

export interface StudentStats {
  gpa: number;
  attendance: number; // percentage
  missingAssignments: number;
}
