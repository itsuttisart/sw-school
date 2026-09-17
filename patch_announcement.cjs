const fs = require('fs');

const code = `import React, { useState } from 'react';
import { Megaphone, Plus, Bell, Save, X, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

export function AdminAnnouncementSystem() {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [targetAudience, setTargetAudience] = useState({
    student: true,
    parent: true,
    teacher: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: 'สร้างประกาศสำเร็จ',
      text: 'ระบบได้ส่งประกาศไปยังกลุ่มเป้าหมายแล้ว',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    }).then(() => setView('list'));
  };

  if (view === 'create') {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Plus className="text-fuchsia-500" /> สร้างประกาศใหม่
            </h2>
            <p className="text-slate-500 text-sm mt-1">กำหนดเนื้อหาและกลุ่มเป้าหมายที่ต้องการให้เห็นประกาศ</p>
          </div>
          <Button variant="ghost" onClick={() => setView('list')} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">หัวข้อประกาศ</label>
            <Input required placeholder="เช่น แจ้งหยุดเรียนกรณีพิเศษ, กำหนดการสอบกลางภาค" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">เนื้อหาประกาศ</label>
            <textarea 
              required
              className="w-full h-32 rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 bg-slate-50"
              placeholder="รายละเอียดข่าวสาร..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">กลุ่มเป้าหมาย (ผู้ที่สามารถเห็นประกาศนี้)</label>
            <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={targetAudience.student} 
                  onChange={(e) => setTargetAudience({...targetAudience, student: e.target.checked})}
                  className="w-5 h-5 rounded text-fuchsia-600 focus:ring-fuchsia-500"
                />
                <span className="font-medium text-slate-700">นักเรียน</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={targetAudience.parent} 
                  onChange={(e) => setTargetAudience({...targetAudience, parent: e.target.checked})}
                  className="w-5 h-5 rounded text-fuchsia-600 focus:ring-fuchsia-500"
                />
                <span className="font-medium text-slate-700">ผู้ปกครอง</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={targetAudience.teacher} 
                  onChange={(e) => setTargetAudience({...targetAudience, teacher: e.target.checked})}
                  className="w-5 h-5 rounded text-fuchsia-600 focus:ring-fuchsia-500"
                />
                <span className="font-medium text-slate-700">ครู / บุคลากร</span>
              </label>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <Bell size={12}/> หากไม่เลือกกลุ่มใดเลย ประกาศจะถูกเก็บเป็นแบบร่าง
            </p>
          </div>

          <div className="pt-6 flex gap-3">
            <Button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-md flex-1 md:flex-none md:w-32">
              <Save size={18} className="mr-2" /> เผยแพร่
            </Button>
            <Button type="button" variant="outline" onClick={() => setView('list')} className="flex-1 md:flex-none md:w-32">
              ยกเลิก
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Megaphone className="text-fuchsia-500" /> ระบบประกาศข่าวสาร
          </h2>
          <p className="text-slate-500 text-sm mt-1">กระจายข่าวสาร ประชาสัมพันธ์ไปยังครู นักเรียน และผู้ปกครอง</p>
        </div>
        <Button onClick={() => setView('create')} className="bg-fuchsia-600 hover:bg-fuchsia-700 shadow-md text-white w-full md:w-auto">
          <Plus size={18} className="mr-2" /> สร้างประกาศใหม่
        </Button>
      </div>

      <div className="space-y-4">
         <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-fuchsia-300 transition-colors shadow-sm">
            <div className="flex justify-between items-start">
               <div>
                  <h4 className="font-bold text-slate-800 text-lg">ประกาศหยุดเรียนกรณีพิเศษ (ฝุ่น PM 2.5)</h4>
                  <p className="text-sm text-slate-500 mt-2">แจ้งผู้ปกครองและนักเรียนทุกระดับชั้น งดการเรียนการสอนในวันที่...</p>
               </div>
               <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">เผยแพร่แล้ว</span>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                 <span className="flex items-center gap-1.5"><Bell size={14} className="text-slate-400" /> กลุ่มเป้าหมาย: <span className="text-fuchsia-600 font-bold bg-fuchsia-50 px-2 py-0.5 rounded-md">นักเรียน</span> <span className="text-fuchsia-600 font-bold bg-fuchsia-50 px-2 py-0.5 rounded-md">ผู้ปกครอง</span></span>
                 <span>• เมื่อ 2 วันที่แล้ว</span>
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="h-8 text-slate-500"><Eye size={14} className="mr-1"/> ดู</Button>
                 <Button variant="outline" size="sm" className="h-8 text-blue-500 border-blue-100 hover:bg-blue-50"><Edit size={14} className="mr-1"/> แก้ไข</Button>
                 <Button variant="outline" size="sm" className="h-8 text-rose-500 border-rose-100 hover:bg-rose-50"><Trash2 size={14} className="mr-1"/> ลบ</Button>
               </div>
            </div>
         </div>

         <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-fuchsia-300 transition-colors shadow-sm">
            <div className="flex justify-between items-start">
               <div>
                  <h4 className="font-bold text-slate-800 text-lg">กำหนดการประชุมผู้ปกครอง ภาคเรียนที่ 1/2568</h4>
                  <p className="text-sm text-slate-500 mt-2">ขอเชิญผู้ปกครองเข้าร่วมประชุมเพื่อรับฟังนโยบายและแนวทางการจัดการศึกษา...</p>
               </div>
               <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">เผยแพร่แล้ว</span>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                 <span className="flex items-center gap-1.5"><Bell size={14} className="text-slate-400" /> กลุ่มเป้าหมาย: <span className="text-fuchsia-600 font-bold bg-fuchsia-50 px-2 py-0.5 rounded-md">ผู้ปกครอง</span> <span className="text-fuchsia-600 font-bold bg-fuchsia-50 px-2 py-0.5 rounded-md">ครู</span></span>
                 <span>• เมื่อ 5 วันที่แล้ว</span>
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="h-8 text-slate-500"><Eye size={14} className="mr-1"/> ดู</Button>
                 <Button variant="outline" size="sm" className="h-8 text-blue-500 border-blue-100 hover:bg-blue-50"><Edit size={14} className="mr-1"/> แก้ไข</Button>
                 <Button variant="outline" size="sm" className="h-8 text-rose-500 border-rose-100 hover:bg-rose-50"><Trash2 size={14} className="mr-1"/> ลบ</Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/pages/admin/AnnouncementSystem.tsx', code);
console.log("Updated Announcement System");
