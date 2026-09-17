import React from 'react';
import { User } from '@/lib/types';
import { BookOpen, Calendar, Users, FileSignature, ClipboardCheck, MessageSquare } from 'lucide-react';

export function TeacherDashboard({ user }: { user: User }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full md:grid-rows-6">
      
      {/* Stat 1: Students */}
      <div className="md:col-span-4 md:row-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4 md:mb-0">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-emerald-400">+2 new</span>
        </div>
        <div>
          <p className="text-3xl font-bold text-slate-800">32</p>
          <p className="text-slate-500 text-sm">นักเรียนในความดูแล</p>
        </div>
      </div>

      {/* Stat 2: Tasks */}
      <div className="md:col-span-4 md:row-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4 md:mb-0">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
            <FileSignature className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-amber-400 font-mono">URGENT</span>
        </div>
        <div>
          <p className="text-3xl font-bold text-slate-800">12</p>
          <p className="text-slate-500 text-sm">การบ้านรอตรวจ</p>
        </div>
      </div>

      {/* Stat 3: Attendance */}
      <div className="md:col-span-4 md:row-span-2 bg-emerald-600 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4 md:mb-0">
          <p className="text-lg font-bold">สถานะเช็กชื่อ</p>
          <span className="px-2 py-1 bg-white/20 rounded text-[10px] uppercase font-bold tracking-widest">Today</span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs opacity-80">เช็กชื่อคาบเช้าสำเร็จแล้ว</p>
          <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white w-full"></div>
          </div>
          <p className="text-[10px] text-right font-bold tracking-widest">100% COMPLETE</p>
        </div>
      </div>

      {/* Main Schedule */}
      <div className="md:col-span-8 md:row-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
        <h3 className="font-bold text-slate-800 mb-6">📅 ตารางสอนวันนี้ (18 พฤษภาคม 2567)</h3>
        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          <div className="flex items-center p-4 bg-slate-50 rounded-2xl border-l-4 border-emerald-500">
            <div className="w-16 md:w-20 text-sm font-bold text-slate-400">08:30</div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">คณิตศาสตร์พื้นฐาน (ค22101)</h4>
              <p className="text-xs text-slate-500 mt-1">ชั้น ม.2/1 | ห้อง 421</p>
            </div>
            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg uppercase">DONE</div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm border-l-4 border-emerald-500">
            <div className="w-16 md:w-20 text-sm font-bold text-slate-800">10:30</div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">วิทยาศาสตร์กายภาพ (ว31102)</h4>
              <p className="text-xs text-slate-500 mt-1">ชั้น ม.3/1 | ห้องปฏิบัติการ 2</p>
            </div>
            <div className="hidden md:block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg uppercase">Next Class</div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-2xl opacity-50 grayscale border border-slate-100">
            <div className="w-16 md:w-20 text-sm font-bold text-slate-400">13:30</div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">โครงงานบูรณาการ</h4>
              <p className="text-xs text-slate-500 mt-1">ชั้น ม.3/1 | ห้องประชุม 1</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-2xl opacity-50 grayscale border border-slate-100">
            <div className="w-16 md:w-20 text-sm font-bold text-slate-400">15:30</div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">ประชุมสายวิชาการ</h4>
              <p className="text-xs text-slate-500 mt-1">ห้องพักครู</p>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="md:col-span-4 md:row-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
        <h3 className="font-bold text-slate-800 mb-4">📢 ประกาศล่าสุด</h3>
        <div className="space-y-4 flex-1 overflow-y-auto">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
            <h5 className="text-rose-700 font-bold text-[10px] uppercase tracking-wider mb-1.5">ด่วนมาก</h5>
            <p className="text-sm text-slate-800 font-medium leading-tight">ส่งผลการเรียน ภาคเรียนที่ 1 ภายในวันศุกร์นี้</p>
            <p className="text-[10px] text-slate-400 mt-2">โดย Admin • 2 ชม. ที่แล้ว</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <h5 className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1.5">ข่าวประชาสัมพันธ์</h5>
            <p className="text-sm text-slate-800 font-medium leading-tight">กำหนดการกิจกรรมวันไหว้ครู ประจำปีการศึกษา 2567</p>
            <p className="text-[10px] text-slate-400 mt-2">โดย งานกิจการนักเรียน • เมื่อวานนี้</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-medium">
          <div className="flex items-center gap-1.5"><MessageSquare size={14} /> 4 ข้อความใหม่</div>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-white"></div>
            <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white"></div>
            <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-white"></div>
          </div>
        </div>
      </div>

    </div>
  );
}
