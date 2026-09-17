import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Clock, Plus, Minus, ArrowUp, ArrowDown, Check, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

type Period = {
  id: number;
  name: string;
  nameEn: string;
  start: string;
  late: string;
  end: string;
  check: boolean;
  status: boolean;
  selected?: boolean;
};

const MOCK_PERIODS: Period[] = [
  { id: 1, name: 'โฮมรูม', nameEn: 'Homeroom', start: '07:45', late: '08:00', end: '08:15', check: true, status: true },
  { id: 2, name: 'กิจกรรมหน้าเสาธง', nameEn: 'Morning Activity', start: '08:15', late: '08:20', end: '08:30', check: true, status: true },
  { id: 3, name: 'คาบเรียนที่ 1', nameEn: 'Class 1', start: '08:30', late: '08:40', end: '09:20', check: true, status: true },
  { id: 4, name: 'คาบเรียนที่ 2', nameEn: 'Class 2', start: '09:20', late: '09:30', end: '10:10', check: true, status: true },
  { id: 5, name: 'พักเบรค', nameEn: 'Break', start: '10:10', late: '-', end: '10:30', check: false, status: true },
  { id: 6, name: 'คาบเรียนที่ 3', nameEn: 'Class 3', start: '10:30', late: '10:40', end: '11:20', check: true, status: true },
  { id: 7, name: 'คาบเรียนที่ 4', nameEn: 'Class 4', start: '11:20', late: '11:30', end: '12:10', check: true, status: true },
  { id: 8, name: 'พักกลางวัน', nameEn: 'Lunch Break', start: '12:10', late: '-', end: '13:00', check: false, status: true },
  { id: 9, name: 'คาบเรียนที่ 5', nameEn: 'Class 5', start: '13:00', late: '13:10', end: '13:50', check: true, status: true },
  { id: 10, name: 'คาบเรียนที่ 6', nameEn: 'Class 6', start: '13:50', late: '14:00', end: '14:40', check: true, status: true },
  { id: 11, name: 'คาบเรียนที่ 7', nameEn: 'Class 7', start: '14:40', late: '14:50', end: '15:30', check: true, status: true },
  { id: 12, name: 'คาบเรียนที่ 8', nameEn: 'Class 8', start: '15:30', late: '15:40', end: '16:20', check: true, status: true },
];

export function AdminManagePeriods() {
  const [periods, setPeriods] = useState<Period[]>(MOCK_PERIODS);
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setPeriods(periods.map(p => ({ ...p, selected: newValue })));
  };

  const toggleSelect = (id: number) => {
    setPeriods(periods.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  const toggleStatus = (id: number, field: 'check' | 'status') => {
    setPeriods(periods.map(p => p.id === id ? { ...p, [field]: !p[field] } : p));
  };

  const movePeriod = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === periods.length - 1)) return;
    
    const newPeriods = [...periods];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newPeriods[index];
    newPeriods[index] = newPeriods[targetIndex];
    newPeriods[targetIndex] = temp;
    
    setPeriods(newPeriods);
  };

  const handleAdd = () => {
    Swal.fire({
      title: 'เพิ่มคาบเรียน',
      html: `
        <div class="flex flex-col gap-3 text-left">
          <div>
            <label class="text-sm font-medium text-slate-700">ชื่อคาบเรียน</label>
            <input id="p-name" class="swal2-input m-0 w-full" placeholder="เช่น คาบเรียนที่ 1">
          </div>
          <div>
            <label class="text-sm font-medium text-slate-700">ชื่อคาบเรียน (EN)</label>
            <input id="p-nameEn" class="swal2-input m-0 w-full" placeholder="เช่น Class 1">
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="text-sm font-medium text-slate-700">เริ่มคาบเวลา</label>
              <input id="p-start" type="time" class="swal2-input m-0 w-full px-2">
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">สายเวลา</label>
              <input id="p-late" type="time" class="swal2-input m-0 w-full px-2">
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">หมดเวลาคาบ</label>
              <input id="p-end" type="time" class="swal2-input m-0 w-full px-2">
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#10b981',
      preConfirm: () => {
        const name = (document.getElementById('p-name') as HTMLInputElement).value;
        const nameEn = (document.getElementById('p-nameEn') as HTMLInputElement).value;
        const start = (document.getElementById('p-start') as HTMLInputElement).value;
        const late = (document.getElementById('p-late') as HTMLInputElement).value;
        const end = (document.getElementById('p-end') as HTMLInputElement).value;
        
        if (!name || !start || !end) {
          Swal.showValidationMessage('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
          return false;
        }
        return { name, nameEn, start, late: late || '-', end };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newId = Math.max(...periods.map(p => p.id), 0) + 1;
        setPeriods([...periods, { 
          id: newId, 
          ...result.value, 
          check: true, 
          status: true,
          selected: false
        }]);
        Swal.fire('สำเร็จ', 'เพิ่มคาบเรียนเรียบร้อยแล้ว', 'success');
      }
    });
  };

  const handleEdit = (period: Period) => {
    Swal.fire({
      title: 'แก้ไขคาบเรียน',
      html: `
        <div class="flex flex-col gap-3 text-left">
          <div>
            <label class="text-sm font-medium text-slate-700">ชื่อคาบเรียน</label>
            <input id="e-name" class="swal2-input m-0 w-full" value="${period.name}">
          </div>
          <div>
            <label class="text-sm font-medium text-slate-700">ชื่อคาบเรียน (EN)</label>
            <input id="e-nameEn" class="swal2-input m-0 w-full" value="${period.nameEn}">
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="text-sm font-medium text-slate-700">เริ่มคาบเวลา</label>
              <input id="e-start" type="time" class="swal2-input m-0 w-full px-2" value="${period.start}">
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">สายเวลา</label>
              <input id="e-late" type="time" class="swal2-input m-0 w-full px-2" value="${period.late !== '-' ? period.late : ''}">
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">หมดเวลาคาบ</label>
              <input id="e-end" type="time" class="swal2-input m-0 w-full px-2" value="${period.end}">
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3b82f6',
      preConfirm: () => {
        const name = (document.getElementById('e-name') as HTMLInputElement).value;
        const nameEn = (document.getElementById('e-nameEn') as HTMLInputElement).value;
        const start = (document.getElementById('e-start') as HTMLInputElement).value;
        const late = (document.getElementById('e-late') as HTMLInputElement).value;
        const end = (document.getElementById('e-end') as HTMLInputElement).value;
        
        if (!name || !start || !end) {
          Swal.showValidationMessage('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
          return false;
        }
        return { name, nameEn, start, late: late || '-', end };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setPeriods(periods.map(p => p.id === period.id ? { ...p, ...result.value } : p));
        Swal.fire('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อยแล้ว', 'success');
      }
    });
  };

  const handleDeleteSelected = () => {
    const selectedCount = periods.filter(p => p.selected).length;
    if (selectedCount === 0) {
      Swal.fire('แจ้งเตือน', 'กรุณาเลือกรายการที่ต้องการลบ', 'warning');
      return;
    }

    Swal.fire({
      title: 'ลบข้อมูล?',
      text: `คุณต้องการลบข้อมูลคาบเรียน ${selectedCount} รายการใช่หรือไม่`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'ลบข้อมูล'
    }).then((result) => {
      if (result.isConfirmed) {
        setPeriods(periods.filter(p => !p.selected));
        setSelectAll(false);
        Swal.fire('ลบสำเร็จ!', '', 'success');
      }
    });
  };

  const handleDeleteSingle = (id: number) => {
    Swal.fire({
      title: 'ลบข้อมูล?',
      text: "คุณต้องการลบข้อมูลคาบเรียนนี้ใช่หรือไม่",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'ลบข้อมูล'
    }).then((result) => {
      if (result.isConfirmed) {
        setPeriods(periods.filter(p => p.id !== id));
        Swal.fire('ลบสำเร็จ!', '', 'success');
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-emerald-500" /> จัดการข้อมูลคาบเรียน
          </h2>
          <p className="text-slate-500 text-sm mt-1">กำหนดตารางเวลาและคาบเรียนของสถานศึกษา</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 items-center justify-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 whitespace-nowrap">คำสำคัญ</label>
            <Input className="bg-white max-w-xs" placeholder="ค้นหาคาบเรียน..." />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 whitespace-nowrap">สถานะ</label>
            <select className="rounded-md border border-slate-200 px-3 py-2 text-sm bg-white min-w-[120px]">
              <option>ทั้งหมด</option>
              <option>ใช้งาน</option>
              <option>ยกเลิกการใช้งาน</option>
            </select>
          </div>
          <Button className="bg-slate-800 hover:bg-slate-900 text-white min-w-[100px]">ค้นหา</Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>แสดง</span>
          <select className="border border-slate-200 rounded px-2 py-1 bg-white">
            <option>50</option>
            <option>100</option>
          </select>
          <span>รายการ</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAdd} className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 px-4 text-sm font-medium">
            <Plus size={16} className="mr-1" /> เพิ่ม
          </Button>
          <Button onClick={handleDeleteSelected} className="bg-rose-500 hover:bg-rose-600 text-white h-9 px-4 text-sm font-medium">
            <Trash2 size={16} className="mr-1" /> ลบที่เลือก
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-center text-slate-600">
          <thead className="text-xs text-slate-700 bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 border-r border-slate-200 w-10">
                <input 
                  type="checkbox" 
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300" 
                />
              </th>
              <th className="px-3 py-3 font-bold border-r border-slate-200 w-12">#</th>
              <th className="px-4 py-3 font-bold border-r border-slate-200 w-24">ลำดับ</th>
              <th className="px-6 py-3 font-bold border-r border-slate-200 text-left">ชื่อคาบเรียน</th>
              <th className="px-6 py-3 font-bold border-r border-slate-200 text-left">ชื่อคาบเรียน (EN)</th>
              <th className="px-4 py-3 font-bold border-r border-slate-200">เริ่มคาบเวลา</th>
              <th className="px-4 py-3 font-bold border-r border-slate-200">สายเวลา</th>
              <th className="px-4 py-3 font-bold border-r border-slate-200">หมดเวลาคาบ</th>
              <th className="px-4 py-3 font-bold border-r border-slate-200">เช็ก</th>
              <th className="px-4 py-3 font-bold border-r border-slate-200">สถานะ</th>
              <th className="px-6 py-3 font-bold w-28">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((p, idx) => (
              <tr key={p.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-3 py-2 border-r border-slate-200">
                  <input 
                    type="checkbox" 
                    checked={p.selected || false}
                    onChange={() => toggleSelect(p.id)}
                    className="rounded border-slate-300" 
                  />
                </td>
                <td className="px-3 py-2 border-r border-slate-200">{idx + 1}</td>
                <td className="px-4 py-2 border-r border-slate-200">
                  <div className="flex items-center justify-center gap-1">
                    <button 
                      onClick={() => movePeriod(idx, 'up')}
                      disabled={idx === 0}
                      className={`p-1 border border-slate-200 rounded ${idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100'}`}
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button 
                      onClick={() => movePeriod(idx, 'down')}
                      disabled={idx === periods.length - 1}
                      className={`p-1 border border-slate-200 rounded ${idx === periods.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100'}`}
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-2 border-r border-slate-200 text-left font-medium text-slate-700">{p.name}</td>
                <td className="px-6 py-2 border-r border-slate-200 text-left">{p.nameEn}</td>
                <td className="px-4 py-2 border-r border-slate-200">{p.start}</td>
                <td className="px-4 py-2 border-r border-slate-200 text-amber-600">{p.late}</td>
                <td className="px-4 py-2 border-r border-slate-200">{p.end}</td>
                <td className="px-4 py-2 border-r border-slate-200">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => toggleStatus(p.id, 'check')}
                      className={`w-6 h-6 flex items-center justify-center rounded ${p.check ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}
                    >
                      {p.check && <Check size={14} strokeWidth={3} />}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2 border-r border-slate-200">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => toggleStatus(p.id, 'status')}
                      className={`w-6 h-6 flex items-center justify-center rounded ${p.status ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}
                    >
                      {p.status && <Check size={14} strokeWidth={3} />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(p)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteSingle(p.id)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {periods.length === 0 && (
              <tr>
                <td colSpan={11} className="px-6 py-8 text-center text-slate-400">
                  ไม่มีข้อมูล กรุณาเพิ่มรายการใหม่
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {periods.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-slate-500">แสดง 1 ถึง {periods.length} จาก {periods.length} รายการ</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-sm border border-slate-200 bg-white text-slate-600 rounded-l hover:bg-slate-50 disabled:opacity-50">ย้อนกลับ</button>
            <button className="px-3 py-1 text-sm border border-slate-800 bg-slate-800 text-white font-medium">1</button>
            <button className="px-3 py-1 text-sm border border-slate-200 bg-white text-slate-600 rounded-r hover:bg-slate-50 disabled:opacity-50">ถัดไป</button>
          </div>
        </div>
      )}
    </div>
  );
}
