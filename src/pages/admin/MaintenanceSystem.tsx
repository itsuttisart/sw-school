import React, { useState } from 'react';
import { Wrench, CheckCircle, Clock, Search, Plus, MoreHorizontal, Filter, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

const MOCK_REPAIRS = [
  { id: 'R001', title: 'หลอดไฟหน้าห้อง ม.1/1 ขาด', location: 'อาคาร 1 ชั้น 2', date: '2026-09-10', status: 'pending', reporter: 'นาย สมชาย (ครู)' },
  { id: 'R002', title: 'แอร์ห้องคอมพิวเตอร์ 3 ไม่เย็น', location: 'อาคาร 2 ชั้น 3', date: '2026-09-09', status: 'in_progress', reporter: 'นางสาว สมหญิง (ครู)' },
  { id: 'R003', title: 'ก๊อกน้ำอ่างล้างมือหัก', location: 'โรงอาหาร', date: '2026-09-08', status: 'completed', reporter: 'ด.ช. เก่งกาจ (นักเรียน)' },
  { id: 'R004', title: 'ประตูห้องน้ำหญิงล็อกไม่ได้', location: 'อาคาร 1 ชั้น 1', date: '2026-09-11', status: 'pending', reporter: 'นาง สมศรี (แม่บ้าน)' },
];

export function AdminMaintenance() {
  const [repairs, setRepairs] = useState(MOCK_REPAIRS);
  const [searchTerm, setSearchTerm] = useState('');

  const total = repairs.length;
  const pending = repairs.filter(r => r.status === 'pending').length;
  const inProgress = repairs.filter(r => r.status === 'in_progress').length;
  const completed = repairs.filter(r => r.status === 'completed').length;

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    Swal.fire({
      title: 'อัปเดตสถานะการแจ้งซ่อม',
      input: 'select',
      inputOptions: {
        'pending': 'รอดำเนินการ',
        'in_progress': 'กำลังดำเนินการ',
        'completed': 'เสร็จสิ้น'
      },
      inputValue: currentStatus,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        setRepairs(repairs.map(r => r.id === id ? { ...r, status: result.value } : r));
        Swal.fire('บันทึกสำเร็จ', 'อัปเดตสถานะเรียบร้อยแล้ว', 'success');
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle size={14}/> เสร็จสิ้น</span>;
      case 'in_progress': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700"><Clock size={14}/> กำลังดำเนินการ</span>;
      default: return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700"><AlertTriangle size={14}/> รอดำเนินการ</span>;
    }
  };

  const filtered = repairs.filter(r => r.title.includes(searchTerm) || r.location.includes(searchTerm));

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="text-blue-500" /> ระบบแจ้งซ่อมแซม
          </h2>
          <p className="text-slate-500 text-sm mt-1">รับแจ้งปัญหาและติดตามสถานะสำหรับฝ่ายอาคารสถานที่</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
          <Plus size={18} className="mr-2" /> แจ้งซ่อมใหม่
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <div className="p-5 border border-slate-200 rounded-2xl bg-white flex flex-col justify-between shadow-sm">
            <span className="font-bold text-slate-600 text-sm mb-2">เคสทั้งหมด</span>
            <h3 className="text-3xl font-bold text-blue-600">{total}</h3>
         </div>
         <div className="p-5 border border-amber-100 rounded-2xl bg-amber-50 flex flex-col justify-between shadow-sm">
            <span className="font-bold text-amber-700 text-sm mb-2">รอดำเนินการ</span>
            <h3 className="text-3xl font-bold text-amber-600">{pending}</h3>
         </div>
         <div className="p-5 border border-blue-100 rounded-2xl bg-blue-50 flex flex-col justify-between shadow-sm">
            <span className="font-bold text-blue-700 text-sm mb-2">กำลังดำเนินการ</span>
            <h3 className="text-3xl font-bold text-blue-600">{inProgress}</h3>
         </div>
         <div className="p-5 border border-emerald-100 rounded-2xl bg-emerald-50 flex flex-col justify-between shadow-sm">
            <span className="font-bold text-emerald-700 text-sm mb-2">เสร็จสิ้นแล้ว</span>
            <h3 className="text-3xl font-bold text-emerald-600">{completed}</h3>
         </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="ค้นหาชื่อรายการ, สถานที่..." 
            className="pl-10 bg-slate-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full md:w-auto text-slate-600">
          <Filter size={18} className="mr-2" /> ตัวกรอง
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">รหัสซ่อม</th>
              <th className="px-6 py-4 font-bold">รายการ</th>
              <th className="px-6 py-4 font-bold">สถานที่</th>
              <th className="px-6 py-4 font-bold">ผู้แจ้ง</th>
              <th className="px-6 py-4 font-bold">สถานะ</th>
              <th className="px-6 py-4 font-bold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-700">{item.id}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.date}</p>
                </td>
                <td className="px-6 py-4">{item.location}</td>
                <td className="px-6 py-4">{item.reporter}</td>
                <td className="px-6 py-4">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    onClick={() => handleUpdateStatus(item.id, item.status)}
                    variant="outline" 
                    size="sm" 
                    className="text-slate-600"
                  >
                    อัปเดต
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
