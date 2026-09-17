const fs = require('fs');

const code = `import React, { useState } from 'react';
import { User } from '@/lib/types';
import { BookOpen, Search, CheckCircle, XCircle, AlertCircle, Clock, Save, Filter, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

const MOCK_SUBJECTS = [
  { id: 'MATH101', name: 'ค21101 คณิตศาสตร์', class: 'ม.1/1' },
  { id: 'MATH102', name: 'ค21101 คณิตศาสตร์', class: 'ม.1/2' },
  { id: 'MATH103', name: 'ค21101 คณิตศาสตร์', class: 'ม.1/3' },
];

const MOCK_STUDENTS = [
  { id: '65001', name: 'ด.ช. สมชาย รักเรียน', number: 1, status: 'present' },
  { id: '65002', name: 'ด.ญ. สมหญิง จริงใจ', number: 2, status: 'present' },
  { id: '65003', name: 'ด.ช. เก่งกาจ สามารถ', number: 3, status: 'absent' },
  { id: '65004', name: 'ด.ญ. มาลี สวยงาม', number: 4, status: 'leave' },
  { id: '65005', name: 'ด.ช. วิชา สมาร์ท', number: 5, status: 'late' },
];

const MOCK_SUMMARY = [
  { id: '65001', name: 'ด.ช. สมชาย รักเรียน', number: 1, present: 18, absent: 0, leave: 1, late: 1, total: 20 },
  { id: '65002', name: 'ด.ญ. สมหญิง จริงใจ', number: 2, present: 20, absent: 0, leave: 0, late: 0, total: 20 },
  { id: '65003', name: 'ด.ช. เก่งกาจ สามารถ', number: 3, present: 15, absent: 3, leave: 1, late: 1, total: 20 },
  { id: '65004', name: 'ด.ญ. มาลี สวยงาม', number: 4, present: 17, absent: 0, leave: 3, late: 0, total: 20 },
  { id: '65005', name: 'ด.ช. วิชา สมาร์ท', number: 5, present: 16, absent: 1, leave: 0, late: 3, total: 20 },
];

export function TeacherSubjectAttendance({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<'record' | 'summary'>('record');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState(MOCK_STUDENTS);

  const handleStatusChange = (id: string, newStatus: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const markAllPresent = () => {
    setStudents(students.map(s => ({ ...s, status: 'present' })));
  };

  const handleSave = () => {
    if (!selectedSubject) {
      Swal.fire('ข้อผิดพลาด', 'กรุณาเลือกรายวิชาและห้องเรียน', 'error');
      return;
    }
    Swal.fire({
      title: 'บันทึกสำเร็จ',
      text: 'บันทึกการเข้าเรียนรายวิชาเรียบร้อยแล้ว',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-blue-500" /> เช็คชื่อรายวิชา
          </h2>
          <p className="text-slate-500 text-sm mt-1">เลือกวิชาและห้องเพื่อบันทึกหรือดูสรุปการเข้าเรียน</p>
        </div>
        
        {activeTab === 'record' && (
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
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 p-2 rounded-2xl border border-slate-100">
        <button
          onClick={() => setActiveTab('record')}
          className={\`px-4 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 flex-1 justify-center min-w-[140px] \${
            activeTab === 'record' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-200 border border-transparent'
          }\`}
        >
          <BookOpen size={16} /> บันทึกการเข้าเรียน
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={\`px-4 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 flex-1 justify-center min-w-[140px] \${
            activeTab === 'summary' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-200 border border-transparent'
          }\`}
        >
          <BarChart2 size={16} /> สรุปการเข้าเรียน
        </button>
      </div>

      <div className="mb-8">
        <label className="text-sm font-bold text-slate-700 mb-2 block">เลือกรายวิชาและห้องเรียน</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_SUBJECTS.map((sub) => (
            <div 
              key={sub.id} 
              onClick={() => setSelectedSubject(sub.id)}
              className={\`p-4 rounded-xl border cursor-pointer transition-all \${selectedSubject === sub.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-300'}\`}
            >
              <h4 className={\`font-bold \${selectedSubject === sub.id ? 'text-blue-700' : 'text-slate-700'}\`}>{sub.name}</h4>
              <p className={\`text-sm mt-1 \${selectedSubject === sub.id ? 'text-blue-600' : 'text-slate-500'}\`}>ห้อง: {sub.class}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedSubject ? (
        <div className="animate-in fade-in duration-300">
          {activeTab === 'record' ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <span className="font-bold text-slate-600 text-xs">ทั้งหมด</span>
                  <span className="text-xl font-bold text-slate-800">{students.length}</span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col justify-between">
                  <span className="font-bold text-emerald-700 text-xs">มา</span>
                  <span className="text-xl font-bold text-emerald-600">{students.filter(s => s.status === 'present').length}</span>
                </div>
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex flex-col justify-between">
                  <span className="font-bold text-rose-700 text-xs">ขาด</span>
                  <span className="text-xl font-bold text-rose-600">{students.filter(s => s.status === 'absent').length}</span>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col justify-between">
                  <span className="font-bold text-amber-700 text-xs">ลา</span>
                  <span className="text-xl font-bold text-amber-600">{students.filter(s => s.status === 'leave').length}</span>
                </div>
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col justify-between">
                  <span className="font-bold text-orange-700 text-xs">สาย</span>
                  <span className="text-xl font-bold text-orange-600">{students.filter(s => s.status === 'late').length}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input placeholder="ค้นหานักเรียน..." className="pl-10 h-9 bg-slate-50 text-sm" />
                </div>
                <Button variant="outline" size="sm" onClick={markAllPresent} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 ml-4">
                  <CheckCircle size={14} className="mr-1" /> มาเรียนทั้งหมด
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
                          {student.status === 'present' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">มาเรียน</span>}
                          {student.status === 'absent' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">ขาดเรียน</span>}
                          {student.status === 'leave' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">ลา</span>}
                          {student.status === 'late' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">สาย</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-1">
                            <button onClick={() => handleStatusChange(student.id, 'present')} className={\`p-1.5 rounded-lg transition-colors \${student.status === 'present' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}\`} title="มา"><CheckCircle size={16}/></button>
                            <button onClick={() => handleStatusChange(student.id, 'absent')} className={\`p-1.5 rounded-lg transition-colors \${student.status === 'absent' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}\`} title="ขาด"><XCircle size={16}/></button>
                            <button onClick={() => handleStatusChange(student.id, 'leave')} className={\`p-1.5 rounded-lg transition-colors \${student.status === 'leave' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}\`} title="ลา"><AlertCircle size={16}/></button>
                            <button onClick={() => handleStatusChange(student.id, 'late')} className={\`p-1.5 rounded-lg transition-colors \${student.status === 'late' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}\`} title="สาย"><Clock size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700">สรุปเวลาเรียนสะสม ({MOCK_SUBJECTS.find(s => s.id === selectedSubject)?.class})</h3>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input placeholder="ค้นหานักเรียน..." className="pl-10 h-9 bg-slate-50 text-sm" />
                </div>
              </div>
              
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm text-left text-slate-600 min-w-[600px]">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold w-16 text-center">เลขที่</th>
                      <th className="px-4 py-3 font-bold">ชื่อ-นามสกุล</th>
                      <th className="px-4 py-3 font-bold text-center">มาเรียน</th>
                      <th className="px-4 py-3 font-bold text-center">ขาด</th>
                      <th className="px-4 py-3 font-bold text-center">ลา</th>
                      <th className="px-4 py-3 font-bold text-center">สาย</th>
                      <th className="px-4 py-3 font-bold text-center">รวมเวลาเรียน (ชั่วโมง)</th>
                      <th className="px-4 py-3 font-bold text-center">เวลาเรียน (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_SUMMARY.map(student => {
                      const percent = Math.round(((student.present + student.late) / student.total) * 100);
                      const percentColor = percent >= 80 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold';
                      
                      return (
                        <tr key={student.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-400 text-center">{student.number}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                          <td className="px-4 py-3 text-center text-emerald-600 font-medium">{student.present}</td>
                          <td className="px-4 py-3 text-center text-rose-600 font-medium">{student.absent}</td>
                          <td className="px-4 py-3 text-center text-amber-600 font-medium">{student.leave}</td>
                          <td className="px-4 py-3 text-center text-orange-600 font-medium">{student.late}</td>
                          <td className="px-4 py-3 text-center font-bold text-slate-700">{student.total}</td>
                          <td className={\`px-4 py-3 text-center \${percentColor}\`}>{percent}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-blue-500 mt-0.5" size={18} />
                <div className="text-sm text-blue-800">
                  <p className="font-bold">หมายเหตุเวลาเรียน</p>
                  <p className="mt-1 opacity-90">นักเรียนต้องมีเวลาเรียนไม่น้อยกว่า 80% จึงจะมีสิทธิ์สอบ หากเวลาเรียนไม่ถึงเกณฑ์ ระบบจะแจ้งเตือนด้วยสีแดง</p>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
          <BookOpen size={48} className="mb-4 text-slate-300" />
          <p className="font-medium">กรุณาเลือกรายวิชาเพื่อทำการเช็คชื่อ หรือดูสรุปการเข้าเรียน</p>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/pages/teacher/TeacherSubjectAttendance.tsx', code);
console.log("Rewrite completed");
