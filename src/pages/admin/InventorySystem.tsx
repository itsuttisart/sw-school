import React from 'react';
import { Package, Plus, Search, Box } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function AdminInventorySystem() {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-orange-500" /> ระบบพัสดุและครุภัณฑ์
          </h2>
          <p className="text-slate-500 text-sm mt-1">จัดการทะเบียนคุมพัสดุ การเบิกจ่าย และการยืม-คืนอุปกรณ์</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 shadow-md text-white">
          <Plus size={18} className="mr-2" /> เพิ่มรายการพัสดุ
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="ค้นหารหัสครุภัณฑ์ หรือชื่อรายการ..." 
            className="pl-10 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">รหัสครุภัณฑ์</th>
              <th className="px-6 py-4 font-bold">รายการ</th>
              <th className="px-6 py-4 font-bold text-center">คงเหลือ</th>
              <th className="px-6 py-4 font-bold">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">IT-66-001</td>
              <td className="px-6 py-4">โปรเจคเตอร์ Epson EB-X06</td>
              <td className="px-6 py-4 text-center font-bold">12</td>
              <td className="px-6 py-4">
                 <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold">พร้อมใช้งาน</span>
              </td>
            </tr>
            <tr className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">SP-66-045</td>
              <td className="px-6 py-4">ลูกฟุตบอลมาตรฐาน มอก.</td>
              <td className="px-6 py-4 text-center font-bold text-rose-500">0</td>
              <td className="px-6 py-4">
                 <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded-md text-xs font-bold">ถูกยืมทั้งหมด</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
