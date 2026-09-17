import React from 'react';
import { User } from '@/lib/types';
import { Calendar, BookOpen, Clock, FileEdit, CheckCircle, XCircle, AlertCircle, CalendarDays, Upload, FileText, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Swal from 'sweetalert2';

// ---------------------------------------------------------
// 1. ตารางเรียน (Student Schedule)
// ---------------------------------------------------------
const STUDENT_SCHEDULE = [
  { day: 'จันทร์', slots: [
    { time: '08:30-09:20', subject: 'ค21101 คณิตศาสตร์', teacher: 'ครูจิตตรา รักเรียน', room: 'อาคาร 1 ห้อง 124' },
    { time: '09:20-10:10', subject: 'ท21101 ภาษาไทย', teacher: 'ครูสมปอง ทองดี', room: 'อาคาร 2 ห้อง 201' },
    { time: '10:10-11:00', subject: 'ว21101 วิทยาศาสตร์', teacher: 'ครูวิชัย ใจเย็น', room: 'ห้องแล็บ 1' },
    { time: '11:00-11:50', subject: 'พักกลางวัน', teacher: '', room: '' },
  ]},
  { day: 'อังคาร', slots: [
    { time: '08:30-09:20', subject: 'อ21101 ภาษาอังกฤษ', teacher: 'ครูแอนนา สมิธ', room: 'อาคาร 3 ห้อง 305' },
    { time: '09:20-10:10', subject: 'ค21101 คณิตศาสตร์', teacher: 'ครูจิตตรา รักเรียน', room: 'อาคาร 1 ห้อง 124' },
    { time: '10:10-11:00', subject: 'ส21101 สังคมศึกษา', teacher: 'ครูสมศรี ดีใจ', room: 'อาคาร 2 ห้อง 202' },
    { time: '11:00-11:50', subject: 'พักกลางวัน', teacher: '', room: '' },
  ]},
];

export function StudentSchedule({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-blue-500" /> ตารางเรียน
          </h2>
          <p className="text-slate-500 text-sm mt-1">ภาคเรียนที่ 1/2569 | ชั้น ม.1/1</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr>
              <th className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-600 text-center w-24">วัน / เวลา</th>
              <th className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-600 text-center w-1/4">08:30-09:20</th>
              <th className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-600 text-center w-1/4">09:20-10:10</th>
              <th className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-600 text-center w-1/4">10:10-11:00</th>
              <th className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-600 text-center w-1/4">11:00-11:50</th>
            </tr>
          </thead>
          <tbody>
            {STUDENT_SCHEDULE.map((dayData, i) => (
              <tr key={i}>
                <td className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-700 text-center">{dayData.day}</td>
                {dayData.slots.map((slot, j) => (
                  <td key={j} className="p-2 border border-slate-200 text-center h-24 align-top">
                    {slot.subject === 'พักกลางวัน' ? (
                      <div className="bg-amber-50 rounded-xl p-3 h-full flex flex-col items-center justify-center text-amber-700">
                        <span className="font-bold text-sm">{slot.subject}</span>
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 h-full flex flex-col justify-center items-center">
                        <span className="font-bold text-blue-800 text-sm">{slot.subject}</span>
                        <span className="text-xs text-blue-600 mt-1">{slot.teacher}</span>
                        <span className="text-[10px] text-blue-400 mt-1">{slot.room}</span>
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

// ---------------------------------------------------------
// 2. การบ้าน (Student Homework)
// ---------------------------------------------------------
const HOMEWORK_LIST = [
  { id: 1, subject: 'ค21101 คณิตศาสตร์', title: 'แบบฝึกหัดเรื่องสมการเชิงเส้น', dueDate: '2026-09-12', status: 'pending', teacher: 'ครูจิตตรา รักเรียน' },
  { id: 2, subject: 'ท21101 ภาษาไทย', title: 'แต่งกลอนสุภาพ 2 บท', dueDate: '2026-09-15', status: 'pending', teacher: 'ครูสมปอง ทองดี' },
  { id: 3, subject: 'ว21101 วิทยาศาสตร์', title: 'สรุปการทดลองเรื่องเซลล์', dueDate: '2026-09-10', status: 'submitted', teacher: 'ครูวิชัย ใจเย็น' },
];

export function StudentHomework({ user }: { user: User }) {
  const handleSubmit = (id: number) => {
    Swal.fire({
      title: 'ส่งการบ้าน',
      text: 'คุณต้องการแนบไฟล์ส่งการบ้านใช่หรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'เลือกไฟล์และส่ง',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('สำเร็จ!', 'ส่งการบ้านเรียบร้อยแล้ว', 'success');
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileEdit className="text-blue-500" /> การบ้าน / ภาระงาน
          </h2>
          <p className="text-slate-500 text-sm mt-1">รายการภาระงานที่ต้องส่ง</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HOMEWORK_LIST.map(hw => (
          <div key={hw.id} className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{hw.subject}</span>
                {hw.status === 'submitted' ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1"><CheckCircle size={12}/> ส่งแล้ว</span>
                ) : (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 flex items-center gap-1"><AlertCircle size={12}/> ยังไม่ส่ง</span>
                )}
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">{hw.title}</h3>
              <p className="text-sm text-slate-500 mb-1">กำหนดส่ง: <span className="font-medium text-rose-500">{hw.dueDate}</span></p>
              <p className="text-xs text-slate-400">ผู้สั่ง: {hw.teacher}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100">
              {hw.status === 'pending' ? (
                <Button onClick={() => handleSubmit(hw.id)} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  <Upload size={16} className="mr-2" /> ส่งงาน
                </Button>
              ) : (
                <Button variant="outline" className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                  <CheckSquare size={16} className="mr-2" /> ดูงานที่ส่งแล้ว
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 3. การเข้าเรียน (Student Attendance)
// ---------------------------------------------------------
const ATTENDANCE_LOG = [
  { date: '2026-09-11', type: 'homeroom', status: 'present', time: '07:30' },
  { date: '2026-09-11', type: 'class', subject: 'ค21101 คณิตศาสตร์', status: 'present', time: '08:30' },
  { date: '2026-09-10', type: 'homeroom', status: 'present', time: '07:45' },
  { date: '2026-09-10', type: 'class', subject: 'ว21101 วิทยาศาสตร์', status: 'present', time: '09:20' },
  { date: '2026-09-09', type: 'homeroom', status: 'absent', time: '-' },
];

const SUBJECT_ATTENDANCE_SUMMARY = [
  { subject: 'ค21101 คณิตศาสตร์', present: 18, absent: 1, leave: 1, late: 0, total: 20 },
  { subject: 'ท21101 ภาษาไทย', present: 19, absent: 0, leave: 0, late: 1, total: 20 },
  { subject: 'ว21101 วิทยาศาสตร์', present: 15, absent: 3, leave: 0, late: 2, total: 20 },
  { subject: 'อ21101 ภาษาอังกฤษ', present: 20, absent: 0, leave: 0, late: 0, total: 20 },
];

export function StudentAttendance({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-emerald-500" /> สถิติการเข้าเรียน
          </h2>
          <p className="text-slate-500 text-sm mt-1">ประวัติการเข้าแถวโฮมรูมและรายวิชา</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <div className="p-4 border border-emerald-100 rounded-2xl bg-emerald-50 flex flex-col justify-between shadow-sm">
            <span className="font-bold text-emerald-700 text-sm mb-1">มาเรียน (โฮมรูม)</span>
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-600">45</h3>
         </div>
         <div className="p-4 border border-rose-100 rounded-2xl bg-rose-50 flex flex-col justify-between shadow-sm">
            <span className="font-bold text-rose-700 text-sm mb-1">ขาดเรียน</span>
            <h3 className="text-2xl md:text-3xl font-bold text-rose-600">2</h3>
         </div>
         <div className="p-4 border border-amber-100 rounded-2xl bg-amber-50 flex flex-col justify-between shadow-sm">
            <span className="font-bold text-amber-700 text-sm mb-1">ลากิจ/ป่วย</span>
            <h3 className="text-2xl md:text-3xl font-bold text-amber-600">3</h3>
         </div>
         <div className="p-4 border border-blue-100 rounded-2xl bg-blue-50 flex flex-col justify-between shadow-sm">
            <span className="font-bold text-blue-700 text-sm mb-1">เปอร์เซ็นต์มาเรียน</span>
            <h3 className="text-2xl md:text-3xl font-bold text-blue-600">90%</h3>
         </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">สรุปการเข้าเรียนรายวิชา</h3>
      <div className="overflow-x-auto rounded-xl border border-slate-200 mb-8">
        <table className="w-full text-sm text-left text-slate-600 min-w-[600px]">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">รายวิชา</th>
              <th className="px-6 py-4 font-bold text-center">มาเรียน</th>
              <th className="px-6 py-4 font-bold text-center">ขาด</th>
              <th className="px-6 py-4 font-bold text-center">ลา</th>
              <th className="px-6 py-4 font-bold text-center">สาย</th>
              <th className="px-6 py-4 font-bold text-center">คาบเรียนทั้งหมด</th>
            </tr>
          </thead>
          <tbody>
            {SUBJECT_ATTENDANCE_SUMMARY.map((sub, idx) => (
              <tr key={idx} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-800">{sub.subject}</td>
                <td className="px-6 py-4 text-center text-emerald-600 font-bold">{sub.present}</td>
                <td className="px-6 py-4 text-center text-rose-600 font-bold">{sub.absent}</td>
                <td className="px-6 py-4 text-center text-amber-600 font-bold">{sub.leave}</td>
                <td className="px-6 py-4 text-center text-orange-600 font-bold">{sub.late}</td>
                <td className="px-6 py-4 text-center text-slate-500 font-bold">{sub.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">ประวัติการบันทึก</h3>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">วันที่</th>
              <th className="px-6 py-4 font-bold">ประเภท / รายวิชา</th>
              <th className="px-6 py-4 font-bold">เวลาเข้า</th>
              <th className="px-6 py-4 font-bold">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {ATTENDANCE_LOG.map((log, idx) => (
              <tr key={idx} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{log.date}</td>
                <td className="px-6 py-4">
                  {log.type === 'homeroom' ? (
                    <span className="font-bold text-blue-600">เข้าแถว / โฮมรูม</span>
                  ) : (
                    <span>เข้าเรียนวิชา: <span className="font-bold text-slate-700">{log.subject}</span></span>
                  )}
                </td>
                <td className="px-6 py-4">{log.time}</td>
                <td className="px-6 py-4">
                  {log.status === 'present' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle size={12}/> มา</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700"><XCircle size={12}/> ขาด</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
