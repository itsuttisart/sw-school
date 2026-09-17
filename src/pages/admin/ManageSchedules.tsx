import React, { useState } from 'react';
import { CalendarDays, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function AdminManageSchedules() {
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'setup'>('setup');

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="text-emerald-500" /> จัดการตารางเรียน/ตารางสอน
          </h2>
          <p className="text-slate-500 text-sm mt-1">จัดตารางเรียนสำหรับห้องเรียน หรือตารางสอนสำหรับครู</p>
        </div>
        <Button onClick={() => setViewMode('setup')} variant="outline" className={`mr-4 ${viewMode === 'setup' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'text-slate-600'}`}>
          <Settings size={18} className="mr-2" /> ผูกรายวิชาและผู้สอน
        </Button>
        <div className="flex bg-slate-100 p-1 rounded-lg">
           <button 
             onClick={() => setViewMode('class')}
             className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${viewMode === 'class' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             ตามห้องเรียน
           </button>
           <button 
             onClick={() => setViewMode('teacher')}
             className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${viewMode === 'teacher' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             ตามบุคลากร
           </button>
        </div>
      </div>

      {viewMode !== 'setup' && (<div className="flex flex-col md:flex-row gap-4 mb-6">
        <select className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 font-medium min-w-[200px]">
          {viewMode === 'setup' ? null : viewMode === 'class' ? (
            <>
              <option value="">-- เลือกห้องเรียน --</option>
              <option value="m1-1">ม.1/1</option>
              <option value="m1-2">ม.1/2</option>
              <option value="m2-1">ม.2/1</option>
            </>
          ) : (
            <>
              <option value="">-- เลือกบุคลากรครู --</option>
              <option value="t1">ครูสมใจ รักเรียน</option>
              <option value="t2">ครูมานะ ขยันยิ่ง</option>
              <option value="t3">ครูวิไล สวยงาม</option>
            </>
          )}
        </select>
        <Button className="shadow-md">
          <Edit size={18} className="mr-2" /> จัดตาราง
        </Button>
      </div>)}

      {viewMode === 'setup' ? (
        <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">ตั้งค่าความสัมพันธ์: รายวิชา - ผู้สอน - ห้องเรียน</h3>
            <Button onClick={() => Swal.fire('สำเร็จ', 'จัดตารางเรียนอัตโนมัติเรียบร้อยแล้ว', 'success')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Wand2 size={18} className="mr-2" /> จัดตารางอัตโนมัติ
            </Button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
            <p className="text-sm text-blue-800 font-medium">ระบบจะดึงรายวิชาจาก <b>"ระบบหลักสูตร"</b> มาแสดงให้คุณผูกครูผู้สอนและห้องเรียน จากนั้นคุณสามารถกด "จัดตารางอัตโนมัติ" ได้</p>
          </div>
          
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold">รหัสวิชา</th>
                  <th className="px-4 py-3 font-bold">ชื่อวิชา (จากหลักสูตร)</th>
                  <th className="px-4 py-3 font-bold">ผู้สอน</th>
                  <th className="px-4 py-3 font-bold">กลุ่มเรียน/ห้อง</th>
                  <th className="px-4 py-3 font-bold text-center">ชั่วโมง/สัปดาห์</th>
                  <th className="px-4 py-3 font-bold text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-800">ท21101</td>
                  <td className="px-4 py-3">ภาษาไทยพื้นฐาน 1</td>
                  <td className="px-4 py-3">
                    <select className="border border-slate-200 rounded p-1 text-xs">
                      <option>ครูสมใจ รักเรียน</option>
                      <option>ครูมานะ ขยันยิ่ง</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input type="text" className="border border-slate-200 rounded p-1 text-xs w-24" defaultValue="ม.1/1, ม.1/2" />
                  </td>
                  <td className="px-4 py-3 text-center">3</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="text-indigo-600">บันทึก</Button>
                  </td>
                </tr>
                <tr className="bg-white border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-800">ค21101</td>
                  <td className="px-4 py-3">คณิตศาสตร์พื้นฐาน 1</td>
                  <td className="px-4 py-3">
                    <select className="border border-slate-200 rounded p-1 text-xs">
                      <option>ครูวิไล สวยงาม</option>
                      <option>ครูสมใจ รักเรียน</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input type="text" className="border border-slate-200 rounded p-1 text-xs w-24" defaultValue="ม.1/1" />
                  </td>
                  <td className="px-4 py-3 text-center">4</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="text-indigo-600">บันทึก</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
      <div className="border border-slate-200 rounded-xl bg-slate-50 p-8 flex flex-col items-center justify-center text-center">
         <CalendarDays size={48} className="text-slate-300 mb-4" />
         <h3 className="text-lg font-bold text-slate-700 mb-2">เลือกข้อมูลที่ต้องการจัดตาราง</h3>
         <p className="text-slate-500 text-sm max-w-md">
           กรุณาเลือก{viewMode === 'class' ? 'ห้องเรียน' : 'ครูผู้สอน'}จากเมนูตัวเลือกด้านบน แล้วคลิกปุ่ม "จัดตาราง" เพื่อเข้าสู่ระบบจัดตารางเรียนรูปแบบตารางกริด (Grid)
         </p>
      </div>)}
    </div>
  );
}
