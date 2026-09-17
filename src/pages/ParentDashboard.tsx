import React from 'react';
import { User } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import { BookOpen, Calendar, Clock, Trophy, MapPin, Heart, AlertTriangle } from 'lucide-react';

export function ParentDashboard({ user }: { user: User }) {
  const children = mockUsers.filter(u => user.childrenIds?.includes(u.id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full md:grid-rows-6">
      
      {/* Student Profile */}
      <div className="md:col-span-4 md:row-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
          <span>ข้อมูลนักเรียนในความดูแล</span>
        </h3>
        {children.map(child => (
          <div key={child.id} className="flex flex-col items-center flex-1 justify-center py-4">
            <div className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-3xl mb-4 shadow-inner">
              {child.name.charAt(0)}
            </div>
            <h4 className="text-xl font-bold text-slate-800 text-center">{child.name}</h4>
            <p className="text-sm text-slate-500 mt-1">ชั้น {child.class}</p>
            
            <div className="w-full mt-8 grid grid-cols-2 gap-3">
               <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                 <Trophy size={20} className="text-amber-500 mb-1" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase">เกรดเฉลี่ย</span>
                 <span className="text-lg font-bold text-slate-800">3.21</span>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                 <Clock size={20} className="text-emerald-500 mb-1" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase">เข้าเรียน</span>
                 <span className="text-lg font-bold text-slate-800">96%</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Status */}
      <div className="md:col-span-8 md:row-span-2 bg-emerald-600 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500 rounded-full opacity-50 blur-2xl pointer-events-none"></div>
        <div className="flex justify-between items-start z-10 relative">
          <div>
            <h3 className="text-xl font-bold mb-1">✅ มาโรงเรียนแล้ว</h3>
            <p className="text-emerald-100 text-sm">สแกนบัตรเมื่อเวลา 07:15 น.</p>
          </div>
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <MapPin className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="z-10 relative mt-4 md:mt-0">
          <p className="text-sm font-medium opacity-90">คาบเรียนปัจจุบัน:</p>
          <p className="text-xl font-bold">คณิตศาสตร์ (08:30 - 09:20)</p>
        </div>
      </div>

      {/* Notices */}
      <div className="md:col-span-4 md:row-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-rose-400 uppercase">Action Needed</span>
        </div>
        <div>
          <p className="text-lg font-bold text-slate-800">1 รายการ</p>
          <p className="text-slate-500 text-sm mt-1">การชำระค่าบำรุงการศึกษา</p>
        </div>
      </div>

      {/* Health */}
      <div className="md:col-span-4 md:row-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
            <Heart className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-400">อัปเดตล่าสุด: เมื่อวาน</span>
        </div>
        <div>
          <p className="text-lg font-bold text-slate-800">ปกติ</p>
          <p className="text-slate-500 text-sm mt-1">บันทึกสุขภาพและโภชนาการ</p>
        </div>
      </div>

      {/* Announcements */}
      <div className="md:col-span-12 md:row-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">📢 ประกาศจากโรงเรียน</h3>
        </div>
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                <h5 className="font-bold text-slate-800 mb-1">แจ้งกำหนดการประชุมผู้ปกครอง ภาคเรียนที่ 1/2567</h5>
                <p className="text-xs text-slate-500">วันอาทิตย์ที่ 10 มีนาคม 2567 เวลา 09:00 น. ณ หอประชุม</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                <h5 className="font-bold text-slate-800 mb-1">การชำระค่าบำรุงการศึกษา</h5>
                <p className="text-xs text-slate-500">สามารถชำระผ่านระบบ QR Code ได้ตั้งแต่วันนี้ถึง 31 มีนาคม</p>
             </div>
        </div>
      </div>

    </div>
  );
}
