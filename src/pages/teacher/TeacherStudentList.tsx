import React, { useState } from 'react';
import { User } from '@/lib/types';
import { Users, Search, Filter, Phone, Mail, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const MOCK_STUDENTS = [
  { id: '65001', name: 'เด็กชาย สมชาย รักเรียน', nickname: 'ชาย', class: 'ม.1/1', number: 1, phone: '081-111-1111', parent: 'นาย สมศักดิ์ รักเรียน', address: '123 ถ.สุขุมวิท กรุงเทพฯ' },
  { id: '65002', name: 'เด็กหญิง สมหญิง จริงใจ', nickname: 'หญิง', class: 'ม.1/1', number: 2, phone: '082-222-2222', parent: 'นาง สมใจ จริงใจ', address: '456 ถ.ลาดพร้าว กรุงเทพฯ' },
  { id: '65003', name: 'เด็กชาย เก่งกาจ สามารถ', nickname: 'เก่ง', class: 'ม.1/1', number: 3, phone: '083-333-3333', parent: 'นาย สามารถ สามารถ', address: '789 ถ.พหลโยธิน กรุงเทพฯ' },
];

export function TeacherStudentList({ user, viewType = 'list' }: { user: User, viewType?: 'list' | 'info' | 'parent' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const filtered = MOCK_STUDENTS.filter(s => s.name.includes(searchTerm) || s.id.includes(searchTerm));

  const renderTitle = () => {
    if (viewType === 'list') return 'รายชื่อนักเรียน (ม.1/1)';
    if (viewType === 'info') return 'ข้อมูลนักเรียน (ม.1/1)';
    return 'ข้อมูลผู้ปกครอง (ม.1/1)';
  };

  const renderIcon = () => {
    if (viewType === 'list') return <FileText className="text-blue-500" />;
    return <Users className="text-emerald-500" />;
  };

  if (selectedStudent) {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <button onClick={() => setSelectedStudent(null)} className="text-slate-500 hover:text-blue-600 font-bold text-sm mb-6 flex items-center transition-colors">
          &larr; กลับไปหน้ารายการ
        </button>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner text-slate-300">
              👤
            </div>
            <h3 className="text-2xl font-bold text-slate-800 text-center">{selectedStudent.name}</h3>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mt-2">
              รหัส: {selectedStudent.id}
            </span>
            <div className="w-full h-px bg-slate-100 my-6"></div>
            <div className="w-full space-y-3">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm">
                <Phone size={16} className="mr-2"/> โทรหาผู้ปกครอง
              </Button>
              <Button variant="outline" className="w-full text-slate-600 border-slate-200">
                <Mail size={16} className="mr-2"/> ส่งข้อความ
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-2/3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2">ข้อมูลส่วนตัว</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">ชื่อเล่น</p>
                <p className="text-sm font-medium text-slate-800">{selectedStudent.nickname}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">ชั้น / เลขที่</p>
                <p className="text-sm font-medium text-slate-800">{selectedStudent.class} / {selectedStudent.number}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">เบอร์โทรศัพท์ (นักเรียน)</p>
                <p className="text-sm font-medium text-slate-800">{selectedStudent.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-500 font-bold mb-1">ที่อยู่ปัจจุบัน</p>
                <p className="text-sm font-medium text-slate-800">{selectedStudent.address}</p>
              </div>
            </div>

            <h4 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2">ข้อมูลผู้ปกครอง</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">ชื่อ-นามสกุล ผู้ปกครอง</p>
                <p className="text-sm font-medium text-slate-800">{selectedStudent.parent}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">ความสัมพันธ์</p>
                <p className="text-sm font-medium text-slate-800">บิดา / มารดา</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">เบอร์โทรศัพท์ (ผู้ปกครอง)</p>
                <p className="text-sm font-medium text-blue-600">{selectedStudent.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {renderIcon()} {renderTitle()}
          </h2>
          <p className="text-slate-500 text-sm mt-1">คลิกที่รายชื่อเพื่อดูรายละเอียดเพิ่มเติม</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="ค้นหาชื่อ, รหัสนักเรียน..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50"
            />
          </div>
          <Button variant="outline" className="text-slate-600 shadow-sm">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(student => (
          <div 
            key={student.id} 
            onClick={() => setSelectedStudent(student)}
            className="p-5 border border-slate-100 rounded-2xl bg-white hover:border-blue-300 hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl text-slate-300 flex-shrink-0 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
              👤
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{student.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">รหัส: {student.id} | เลขที่ {student.number}</p>
              {viewType === 'parent' && (
                <p className="text-xs text-emerald-600 mt-1 font-medium truncate">ผปค: {student.parent}</p>
              )}
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
