import React from 'react';
import { Archive, Folder, File, UploadCloud, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function AdminArchiveSystem() {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Archive className="text-indigo-500" /> คลังเอกสารองค์กร (Archive)
          </h2>
          <p className="text-slate-500 text-sm mt-1">จัดเก็บและสืบค้นเอกสารดิจิทัล แผนงาน และหลักสูตร</p>
        </div>
        <Button className="bg-indigo-500 hover:bg-indigo-600 shadow-md text-white">
          <UploadCloud size={18} className="mr-2" /> อัปโหลดไฟล์
        </Button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="ค้นหาเอกสาร..." 
            className="pl-10 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <div className="p-4 border border-slate-200 rounded-2xl bg-white hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center text-center">
            <Folder size={40} className="text-amber-400 mb-2 fill-amber-100" />
            <h4 className="font-bold text-sm text-slate-800">แผนปฏิบัติการประจำปี</h4>
            <p className="text-xs text-slate-500 mt-1">12 ไฟล์</p>
         </div>
         <div className="p-4 border border-slate-200 rounded-2xl bg-white hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center text-center">
            <Folder size={40} className="text-amber-400 mb-2 fill-amber-100" />
            <h4 className="font-bold text-sm text-slate-800">หลักสูตรสถานศึกษา</h4>
            <p className="text-xs text-slate-500 mt-1">5 ไฟล์</p>
         </div>
         <div className="p-4 border border-slate-200 rounded-2xl bg-white hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center text-center">
            <Folder size={40} className="text-amber-400 mb-2 fill-amber-100" />
            <h4 className="font-bold text-sm text-slate-800">รายงานการประเมินตนเอง (SAR)</h4>
            <p className="text-xs text-slate-500 mt-1">3 ไฟล์</p>
         </div>
         <div className="p-4 border border-slate-200 rounded-2xl bg-white hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center text-center">
            <Folder size={40} className="text-amber-400 mb-2 fill-amber-100" />
            <h4 className="font-bold text-sm text-slate-800">รูปภาพกิจกรรม</h4>
            <p className="text-xs text-slate-500 mt-1">45 ไฟล์</p>
         </div>
      </div>
    </div>
  );
}
