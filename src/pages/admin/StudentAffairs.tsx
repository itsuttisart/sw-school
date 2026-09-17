import React from 'react';
import { Activity, ShieldAlert, Award, Search, FileText, PieChart, Download, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function AdminStudentAffairs() {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-rose-500" /> ระบบกิจการนักเรียน
          </h2>
          <p className="text-slate-500 text-sm mt-1">จัดการคะแนนความประพฤติ บันทึกความดี และบทลงโทษ</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
             <Award size={18} className="mr-2" /> บันทึกความดี
           </Button>
           <Button className="bg-rose-500 hover:bg-rose-600 shadow-md text-white">
             <ShieldAlert size={18} className="mr-2" /> หักคะแนนพฤติกรรม
           </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="ค้นหารหัสนักเรียน เพื่อดูประวัติพฤติกรรม..." 
            className="pl-10 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl bg-slate-50 p-8 flex flex-col items-center justify-center text-center">
         <Activity size={48} className="text-slate-300 mb-4" />
         <h3 className="text-lg font-bold text-slate-700 mb-2">ค้นหานักเรียนเพื่อจัดการข้อมูล</h3>
         <p className="text-slate-500 text-sm max-w-md">
           กรุณาพิมพ์รหัสนักเรียนหรือชื่อในช่องค้นหาด้านบน เพื่อตรวจสอบคะแนนความประพฤติปัจจุบันและประวัติการตัดคะแนน
         </p>
      </div>
    </div>
  );
}
