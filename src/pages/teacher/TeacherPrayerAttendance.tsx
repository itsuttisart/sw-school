import React, { useState } from 'react';
import { User } from '@/lib/types';
import { Heart, Search, CheckCircle, XCircle, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

const MOCK_STUDENTS = [
  { id: '65001', name: 'ด.ช. สมชาย รักเรียน', number: 1, status: 'present' },
  { id: '65002', name: 'ด.ญ. สมหญิง จริงใจ', number: 2, status: 'present' },
  { id: '65003', name: 'ด.ช. เก่งกาจ สามารถ', number: 3, status: 'absent' },
  { id: '65004', name: 'ด.ญ. มาลี สวยงาม', number: 4, status: 'leave' },
  { id: '65005', name: 'ด.ช. วิชา สมาร์ท', number: 5, status: 'present' },
];

export function TeacherPrayerAttendance({ user }: { user: User }) {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState(MOCK_STUDENTS);

  const handleStatusChange = (id: string, newStatus: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const markAllPresent = () => {
    setStudents(students.map(s => ({ ...s, status: 'present' })));
  };

  const handleSave = () => {
    Swal.fire({
      title: 'บันทึกสำเร็จ',
      text: 'บันทึกการเข้าร่วมกิจกรรมละหมาดเรียบร้อยแล้ว',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Heart className="text-rose-500" /> เช็คชื่อละหมาด
          </h2>
          <p className="text-slate-500 text-sm mt-1">บันทึกการเข้าร่วมกิจกรรมละหมาดประจำวันของชั้น ม.1/1</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full md:w-40 bg-slate-50"
          />
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
            <Save size={18} className="mr-2" /> บันทึก
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <span className="font-bold text-slate-600 text-xs">ทั้งหมด</span>
          <span className="text-xl font-bold text-slate-800">{students.length}</span>
        </div>
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col justify-between">
          <span className="font-bold text-emerald-700 text-xs">เข้าร่วม</span>
          <span className="text-xl font-bold text-emerald-600">{students.filter(s => s.status === 'present').length}</span>
        </div>
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex flex-col justify-between">
          <span className="font-bold text-rose-700 text-xs">ไม่เข้าร่วม</span>
          <span className="text-xl font-bold text-rose-600">{students.filter(s => s.status === 'absent').length}</span>
        </div>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col justify-between">
          <span className="font-bold text-amber-700 text-xs">ลากิจ/ลาป่วย</span>
          <span className="text-xl font-bold text-amber-600">{students.filter(s => s.status === 'leave').length}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input placeholder="ค้นหานักเรียน..." className="pl-10 h-9 bg-slate-50 text-sm" />
        </div>
        <Button variant="outline" size="sm" onClick={markAllPresent} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 ml-4">
          <CheckCircle size={14} className="mr-1" /> เข้าร่วมทุกคน
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600 min-w-[600px]">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-bold w-16 text-center">เลขที่</th>
              <th className="px-4 py-3 font-bold">ชื่อ-นามสกุล</th>
              <th className="px-4 py-3 font-bold text-center">สถานะ</th>
              <th className="px-4 py-3 font-bold text-center">อัปเดตสถานะ</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-400 text-center">{student.number}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                <td className="px-4 py-3 text-center">
                  {student.status === 'present' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">เข้าร่วม</span>}
                  {student.status === 'absent' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">ไม่เข้าร่วม</span>}
                  {student.status === 'leave' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">ลา</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1">
                    <button onClick={() => handleStatusChange(student.id, 'present')} className={`p-1.5 rounded-lg transition-colors ${student.status === 'present' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`} title="เข้าร่วม"><CheckCircle size={16}/></button>
                    <button onClick={() => handleStatusChange(student.id, 'absent')} className={`p-1.5 rounded-lg transition-colors ${student.status === 'absent' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`} title="ไม่เข้าร่วม"><XCircle size={16}/></button>
                    <button onClick={() => handleStatusChange(student.id, 'leave')} className={`p-1.5 rounded-lg transition-colors ${student.status === 'leave' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`} title="ลา"><AlertCircle size={16}/></button>
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
