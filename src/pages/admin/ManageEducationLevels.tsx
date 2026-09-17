import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowDown, ArrowUp, Check, X, Layers, Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const MOCK_LEVELS = [
  { id: 1, name: 'เตรียมอนุบาล', abbr: 'เตรียมอนุบาล', status: false },
  { id: 2, name: 'Nursery', abbr: 'Nursery', status: false },
  { id: 3, name: 'เตรียมอนุบาล 1', abbr: 'เตรียมอนุบาล 1', status: false },
  { id: 9, name: 'อนุบาลปีที่ 1', abbr: 'อ.1', status: false },
  { id: 10, name: 'อนุบาลปีที่ 2', abbr: 'อ.2', status: false },
  { id: 11, name: 'อนุบาลปีที่ 3', abbr: 'อ.3', status: false },
  { id: 14, name: 'ประถมศึกษาปีที่ 1', abbr: 'ป.1', status: false },
  { id: 15, name: 'ประถมศึกษาปีที่ 2', abbr: 'ป.2', status: false },
  { id: 21, name: 'มัธยมศึกษาปีที่ 1', abbr: 'ม.1', status: true },
  { id: 22, name: 'มัธยมศึกษาปีที่ 2', abbr: 'ม.2', status: true },
  { id: 23, name: 'มัธยมศึกษาปีที่ 3', abbr: 'ม.3', status: true },
  { id: 24, name: 'มัธยมศึกษาปีที่ 4', abbr: 'ม.4', status: true },
  { id: 25, name: 'มัธยมศึกษาปีที่ 5', abbr: 'ม.5', status: true },
  { id: 26, name: 'มัธยมศึกษาปีที่ 6', abbr: 'ม.6', status: true },
  { id: 27, name: 'ชั้นศาสนา 1', abbr: 'ชั้นศาสนา 1', status: false },
];

export function AdminManageEducationLevels() {
  const [levels, setLevels] = useState(MOCK_LEVELS);

  const toggleStatus = (id: number) => {
    setLevels(levels.map(lvl => lvl.id === id ? { ...lvl, status: !lvl.status } : lvl));
  };

  const handleAdd = () => {
    Swal.fire({
      title: 'เพิ่มระดับการศึกษา',
      html: `
        <div class="flex flex-col gap-3">
          <input id="l-name" class="swal2-input m-0 w-full" placeholder="ชื่อระดับการศึกษา (เช่น ประถมศึกษาปีที่ 1)">
          <input id="l-abbr" class="swal2-input m-0 w-full" placeholder="ชื่อย่อ (เช่น ป.1)">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#10b981',
      preConfirm: () => {
        const name = (document.getElementById('l-name') as HTMLInputElement).value;
        const abbr = (document.getElementById('l-abbr') as HTMLInputElement).value;
        if (!name || !abbr) {
          Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
          return false;
        }
        return { name, abbr };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newId = Math.max(...levels.map(l => l.id), 0) + 1;
        setLevels([...levels, { id: newId, name: result.value.name, abbr: result.value.abbr, status: true }]);
        Swal.fire('สำเร็จ', 'เพิ่มระดับการศึกษาเรียบร้อยแล้ว', 'success');
      }
    });
  };

  const handleEdit = (level: typeof MOCK_LEVELS[0]) => {
    Swal.fire({
      title: 'แก้ไขระดับการศึกษา',
      html: `
        <div class="flex flex-col gap-3">
          <input id="e-name" class="swal2-input m-0 w-full" placeholder="ชื่อระดับการศึกษา" value="${level.name}">
          <input id="e-abbr" class="swal2-input m-0 w-full" placeholder="ชื่อย่อ" value="${level.abbr}">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3b82f6',
      preConfirm: () => {
        const name = (document.getElementById('e-name') as HTMLInputElement).value;
        const abbr = (document.getElementById('e-abbr') as HTMLInputElement).value;
        if (!name || !abbr) {
          Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
          return false;
        }
        return { name, abbr };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setLevels(levels.map(l => l.id === level.id ? { ...l, name: result.value.name, abbr: result.value.abbr } : l));
        Swal.fire('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อยแล้ว', 'success');
      }
    });
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'ลบข้อมูล?',
      text: "คุณต้องการลบข้อมูลระดับการศึกษานี้ใช่หรือไม่",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'ลบข้อมูล'
    }).then((result) => {
      if (result.isConfirmed) {
        setLevels(levels.filter(l => l.id !== id));
        Swal.fire('ลบสำเร็จ!', '', 'success');
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="text-emerald-500" /> จัดการระดับการศึกษา
          </h2>
          <p className="text-slate-500 text-sm mt-1">กำหนดระดับการศึกษาที่เปิดสอนในสถานศึกษา</p>
        </div>
        <Button onClick={handleAdd} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md">
          <Plus size={18} className="mr-2" /> เพิ่มระดับการศึกษา
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-bold border-r border-slate-200 text-center w-16">#</th>
              <th className="px-6 py-3 font-bold border-r border-slate-200 text-left">
                <div className="flex items-center justify-between">
                  <span>ชื่อระดับการศึกษา</span>
                  <div className="flex flex-col opacity-50"><ArrowUp size={12} /><ArrowDown size={12} /></div>
                </div>
              </th>
              <th className="px-6 py-3 font-bold border-r border-slate-200 text-left">ชื่อย่อ</th>
              <th className="px-4 py-3 font-bold text-center w-24 border-r border-slate-200">
                <div className="flex items-center justify-center gap-1">
                  <span>สถานะ</span>
                  <div className="flex flex-col opacity-50"><ArrowUp size={12} /><ArrowDown size={12} /></div>
                </div>
              </th>
              <th className="px-6 py-3 font-bold text-center w-28">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((lvl, index) => (
              <tr key={lvl.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-center border-r border-slate-200">{index + 1}</td>
                <td className="px-6 py-3 font-medium text-slate-700 border-r border-slate-200">{lvl.name}</td>
                <td className="px-6 py-3 text-slate-600 border-r border-slate-200">{lvl.abbr}</td>
                <td className="px-4 py-3 text-center border-r border-slate-200">
                  <button 
                    onClick={() => toggleStatus(lvl.id)}
                    title={lvl.status ? "ปิดการใช้งาน" : "เปิดการใช้งาน"}
                    className={`inline-flex items-center justify-center w-6 h-6 rounded ${lvl.status ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}
                  >
                    {lvl.status && <Check size={14} strokeWidth={3} />}
                  </button>
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(lvl)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(lvl.id)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {levels.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  ไม่มีข้อมูล กรุณาเพิ่มรายการใหม่
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
