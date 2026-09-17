import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, GraduationCap, School, BookOpen, Settings, Briefcase, Bell, UserCheck, QrCode, CheckCircle2, AlertCircle, CalendarDays, XCircle, Clock, LayoutDashboard } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* System Overview Stats (Grouped into one card like Student Attendance) */}
      <div className="md:col-span-12 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <LayoutDashboard className="text-emerald-500" /> ข้อมูลภาพรวมระบบ
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-white rounded-xl text-emerald-600 shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-100 px-2 py-1 rounded-full">+12</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">1,245</p>
              <p className="text-slate-500 text-xs font-bold mt-1 uppercase">นักเรียนทั้งหมด</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-blue-500 bg-blue-100 px-2 py-1 rounded-full">+8</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">950</p>
              <p className="text-slate-500 text-xs font-bold mt-1 uppercase">ผู้ปกครองเข้าระบบ</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-white rounded-xl text-purple-600 shadow-sm">
                <School className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">36</p>
              <p className="text-slate-500 text-xs font-bold mt-1 uppercase">ห้องเรียน</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-white rounded-xl text-amber-600 shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-100 px-2 py-1 rounded-full">+5</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">128</p>
              <p className="text-slate-500 text-xs font-bold mt-1 uppercase">รายวิชา</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Attendance Section */}
      <div className="md:col-span-12 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <QrCode className="text-indigo-500" /> สถิติการมาเรียนวันนี้ (สแกน QR Code)
          </h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            อัปเดตล่าสุด: {new Date().toLocaleTimeString('th-TH')}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50 flex items-center gap-4">
             <div className="p-3 bg-white rounded-full text-emerald-500 shadow-sm">
               <CheckCircle2 className="w-6 h-6" />
             </div>
             <div>
               <p className="text-2xl font-bold text-emerald-700">1,180</p>
               <p className="text-xs font-bold text-emerald-600 uppercase">มาเรียนปกติ</p>
             </div>
          </div>
          
          <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50 flex items-center gap-4">
             <div className="p-3 bg-white rounded-full text-amber-500 shadow-sm">
               <Clock className="w-6 h-6" />
             </div>
             <div>
               <p className="text-2xl font-bold text-amber-700">45</p>
               <p className="text-xs font-bold text-amber-600 uppercase">มาสาย</p>
             </div>
          </div>
          
          <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50 flex items-center gap-4">
             <div className="p-3 bg-white rounded-full text-blue-500 shadow-sm">
               <CalendarDays className="w-6 h-6" />
             </div>
             <div>
               <p className="text-2xl font-bold text-blue-700">15</p>
               <p className="text-xs font-bold text-blue-600 uppercase">ลา</p>
             </div>
          </div>
          
          <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50 flex items-center gap-4">
             <div className="p-3 bg-white rounded-full text-rose-500 shadow-sm">
               <XCircle className="w-6 h-6" />
             </div>
             <div>
               <p className="text-2xl font-bold text-rose-700">5</p>
               <p className="text-xs font-bold text-rose-600 uppercase">ขาดเรียน</p>
             </div>
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="md:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          ⚡ ทางลัดจัดการระบบ
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
          <MenuBtn icon={<UserCheck />} label="ผู้ปกครอง" color="blue" />
          <MenuBtn icon={<Briefcase />} label="ระบบสารบรรณ" color="amber" />
          <MenuBtn icon={<BookOpen />} label="หลักสูตร" color="purple" />
          <MenuBtn icon={<Bell />} label="ประกาศข่าวสาร" color="rose" />
          <MenuBtn icon={<Settings />} label="ตั้งค่าระบบ" color="slate" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="md:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col h-[400px]">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          🔔 กิจกรรมล่าสุด
        </h3>
        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          <ActivityItem 
            title="อัปเดตระบบสารบรรณ V.2.1" 
            desc="ดำเนินการเสร็จสิ้นโดย Admin"
            time="10 นาทีที่แล้ว"
            type="system"
          />
          <ActivityItem 
            title="เพิ่มรายวิชาใหม่ 5 วิชา" 
            desc="หมวดหมู่วิทยาศาสตร์และเทคโนโลยี"
            time="1 ชม. ที่แล้ว"
            type="academic"
          />
          <ActivityItem 
            title="ประกาศ: กำหนดการสอบปลายภาค" 
            desc="แจ้งเตือนไปยังครูและนักเรียนทั้งหมด"
            time="3 ชม. ที่แล้ว"
            type="announcement"
          />
          <ActivityItem 
            title="สำรองข้อมูลประจำสัปดาห์" 
            desc="Database backup completed"
            time="12 ชม. ที่แล้ว"
            type="system"
          />
        </div>
      </div>

    </div>
  );
}

function MenuBtn({ label, icon, color }: any) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-100",
    purple: "bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-100",
    rose: "bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100",
    slate: "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100",
  };
  return (
    <button className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-colors border ${colorClasses[color]}`}>
      <div className="mb-2">{icon}</div>
      <span className="text-xs font-bold text-slate-700">{label}</span>
    </button>
  );
}

function ActivityItem({ title, desc, time, type }: any) {
  const typeColors: Record<string, string> = {
    system: "border-slate-500 bg-slate-50 text-slate-700",
    academic: "border-emerald-500 bg-emerald-50 text-emerald-700",
    announcement: "border-amber-500 bg-amber-50 text-amber-700",
  };
  
  return (
    <div className={`p-4 rounded-2xl border-l-4 border border-slate-100 shadow-sm ${typeColors[type] || typeColors.system}`}>
      <h5 className="font-bold text-sm mb-1">{title}</h5>
      <p className="text-xs opacity-80 mb-2">{desc}</p>
      <p className="text-[10px] font-bold opacity-60 uppercase">{time}</p>
    </div>
  );
}
