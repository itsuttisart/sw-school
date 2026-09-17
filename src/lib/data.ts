import { User } from './types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'ผู้ดูแลระบบ', role: 'admin', username: 'admin', password: 'password123' },
  { id: 'u2', name: 'ครูสมชาย', role: 'teacher', phone: '0812345678', password: 'password123' },
  { id: 'u3', name: 'อาหมัด', role: 'student', class: 'ม.2/1', studentId: '65001', password: 'password123' },
  { id: 'u4', name: 'ฟาตีมะห์', role: 'student', class: 'ม.2/1', studentId: '65002', password: 'password123' },
  { id: 'u5', name: 'ผู้ปกครอง', role: 'parent', childrenIds: ['u3', 'u4'], phone: '0898765432', password: 'password123' }
];
