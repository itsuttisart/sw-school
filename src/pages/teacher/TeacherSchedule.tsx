import React, { useState } from 'react';
import { User } from '@/lib/types';
import { CalendarDays, BookOpen, Clock, Users, ArrowLeft, CheckCircle, XCircle, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Swal from 'sweetalert2';

// Mock schedule data
const SCHEDULE = [
  { day: 'จันทร์', slots: [
    { time: '08:30-09:20', subject: 'ค21101 คณิตศาสตร์', class: 'ม.1/1', type: 'teach' },
    { time: '09:20-10:10', subject: 'ค21101 คณิตศาสตร์', class: 'ม.1/2', type: 'teach' },
    { time: '10:10-11:00', subject: '', class: '', type: 'free' },
    { time: '11:00-11:50', subject: 'ค21101 คณิตศาสตร์', class: 'ม.1/3', type: 'teach' },
  ]},
  { day: 'อังคาร', slots: [
    { time: '08:30-09:20', subject: '', class: '', type: 'free' },
    { time: '09:20-10:10', subject: 'ค21101 คณิตศาสตร์', class: 'ม.1/1', type: 'teach' },
    { time: '10:10-11:00', subject: 'ค21101 คณิตศาสตร์', class: 'ม.1/2', type: 'teach' },
    { time: '11:00-11:50', subject: '', class: '', type: 'free' },
  ]},
];

const MOCK_STUDENTS = [
  { id: '65001', name: 'ด.ช. สมชาย รักเรียน', number: 1, status: 'present' },
  { id: '65002', name: 'ด.ญ. สมหญิง จริงใจ', number: 2, status: 'present' },
  { id: '65003', name: 'ด.ช. เก่งกาจ สามารถ', number: 3, status: 'absent' },
  { id: '65004', name: 'ด.ญ. มาลี สวยงาม', number: 4, status: 'leave' },
  { id: '65005', name: 'ด.ช. วิชา สมาร์ท', number: 5, status: 'present' },
];

export function TeacherSchedule({ user }: { user: User }) {
  const [activeView, setActiveView] = useState<'schedule' | 'attendance'>('schedule');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [students, setStudents] = useState(MOCK_STUDENTS);

  const handleClassClick = (slot: any) => {
    if (slot.type === 'free') return;
    
    Swal.fire({
      title: `${slot.subject}`,
      text: `ห้อง ${slot.class} | เวลา ${slot.time}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'เช็คชื่อเข้าเรียน',
      cancelButtonText: 'ปิด',
      confirmButtonColor: '#10b981'
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedClass(slot);
        setActiveView('attendance');
        // Reset mock students to default for demo
        setStudents(MOCK_STUDENTS.map(s => ({ ...s, status: 'present' })));
      }
    });
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const saveAttendance = () => {
    Swal.fire({
      title: 'บันทึกสำเร็จ',
      text: 'บันทึกการเข้าเรียนรายวิชาเรียบร้อยแล้ว',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
    setActiveView('schedule');
  };

  if (activeView === 'attendance' && selectedClass) {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div>
            <button onClick={() => setActiveView('schedule')} className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 mb-2 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> กลับไปตารางสอน
            </button>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-emerald-500" /> เช็คชื่อ: {selectedClass.subject}
            </h2>
            <p className="text-slate-500 text-sm mt-1">ห้อง {selectedClass.class} | เวลา {selectedClass.time}</p>
          </div>
          <Button onClick={saveAttendance} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
            <Save size={18} className="mr-2" /> บันทึกข้อมูล
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
            <span className="font-bold text-slate-600">ทั้งหมด</span>
            <span className="text-xl font-bold text-slate-800">{students.length}</span>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center">
            <span className="font-bold text-emerald-700">มา</span>
            <span className="text-xl font-bold text-emerald-600">{students.filter(s => s.status === 'present').length}</span>
          </div>
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex justify-between items-center">
            <span className="font-bold text-rose-700">ขาด</span>
            <span className="text-xl font-bold text-rose-600">{students.filter(s => s.status === 'absent').length}</span>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex justify-between items-center">
            <span className="font-bold text-amber-700">ลา</span>
            <span className="text-xl font-bold text-amber-600">{students.filter(s => s.status === 'leave').length}</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold w-20 text-center">เลขที่</th>
                <th className="px-6 py-4 font-bold">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4 font-bold text-center">สถานะปัจจุบัน</th>
                <th className="px-6 py-4 font-bold text-center">อัปเดต</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-400 text-center">{student.number}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                  <td className="px-6 py-4 text-center">
                    {student.status === 'present' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">มาเรียน</span>}
                    {student.status === 'absent' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">ขาดเรียน</span>}
                    {student.status === 'leave' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">ลา</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleStatusChange(student.id, 'present')} className={`p-2 rounded-lg transition-colors ${student.status === 'present' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}><CheckCircle size={18}/></button>
                      <button onClick={() => handleStatusChange(student.id, 'absent')} className={`p-2 rounded-lg transition-colors ${student.status === 'absent' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}><XCircle size={18}/></button>
                      <button onClick={() => handleStatusChange(student.id, 'leave')} className={`p-2 rounded-lg transition-colors ${student.status === 'leave' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}><AlertCircle size={18}/></button>
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

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="text-blue-500" /> ตารางสอน
          </h2>
          <p className="text-slate-500 text-sm mt-1">ภาคเรียนที่ 1/2569 | คลิกที่รายวิชาเพื่อเช็คชื่อนักเรียน</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr>
              <th className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-600 text-center w-24">วัน / เวลา</th>
              <th className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-600 text-center">08:30-09:20</th>
              <th className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-600 text-center">09:20-10:10</th>
              <th className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-600 text-center">10:10-11:00</th>
              <th className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-600 text-center">11:00-11:50</th>
            </tr>
          </thead>
          <tbody>
            {SCHEDULE.map((dayData, i) => (
              <tr key={i}>
                <td className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-700 text-center">{dayData.day}</td>
                {dayData.slots.map((slot, j) => (
                  <td key={j} className="p-2 border border-slate-200 text-center h-24 align-top">
                    {slot.type === 'teach' ? (
                      <div 
                        onClick={() => handleClassClick(slot)}
                        className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-3 h-full cursor-pointer transition-colors flex flex-col justify-center items-center group"
                      >
                        <span className="font-bold text-blue-800 text-sm">{slot.subject}</span>
                        <span className="text-xs text-blue-600 mt-1">{slot.class}</span>
                        <span className="text-[10px] text-blue-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center"><CheckCircle size={10} className="mr-1"/> แตะเพื่อเช็คชื่อ</span>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-3 h-full flex items-center justify-center text-slate-400 text-sm">
                        ว่าง
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
