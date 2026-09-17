import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, FileText, Send, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const MOCK_DOCS = [
  { id: 1, docNo: 'ศธ 0401/123', title: 'ขอเชิญประชุมผู้ปกครอง', type: 'หนังสือส่งออก', date: '2026-09-01', status: 'ดำเนินการแล้ว' },
  { id: 2, docNo: 'ศธ 0401/124', title: 'แจ้งการหยุดเรียนกรณีพิเศษ', type: 'หนังสือส่งออก', date: '2026-09-03', status: 'ดำเนินการแล้ว' },
  { id: 3, docNo: 'สพฐ 001/45', title: 'นโยบายการจัดการศึกษาใหม่', type: 'หนังสือรับเข้า', date: '2026-09-04', status: 'รอการลงนาม' },
];

export function AdminManageDocuments() {
  const [docs, setDocs] = useState(MOCK_DOCS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = docs.filter(d => 
    d.title.includes(searchTerm) || d.docNo.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-amber-500" /> ระบบสารบรรณอิเล็กทรอนิกส์
          </h2>
          <p className="text-slate-500 text-sm mt-1">จัดการหนังสือรับ-ส่ง และเอกสารราชการภายในสถานศึกษา</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50">
             <Download size={18} className="mr-2" /> รับหนังสือ
           </Button>
           <Button className="bg-amber-500 hover:bg-amber-600 shadow-md text-white">
             <Send size={18} className="mr-2" /> สร้างหนังสือส่ง
           </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="ค้นหาเลขที่หนังสือ หรือชื่อเรื่อง..." 
            className="pl-10 bg-slate-50 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">เลขที่หนังสือ</th>
              <th className="px-6 py-4 font-bold">เรื่อง</th>
              <th className="px-6 py-4 font-bold">ประเภท</th>
              <th className="px-6 py-4 font-bold">วันที่</th>
              <th className="px-6 py-4 font-bold">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((d) => (
              <tr key={d.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{d.docNo}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{d.title}</td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                     d.type === 'หนังสือรับเข้า' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                   }`}>
                     {d.type}
                   </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{d.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                     d.status === 'ดำเนินการแล้ว' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                   }`}>
                     {d.status}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
