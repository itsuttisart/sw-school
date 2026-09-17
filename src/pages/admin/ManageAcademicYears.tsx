import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Swal from 'sweetalert2';

type AcademicYear = {
  id: number;
  year: string;
  semester: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

const MOCK_YEARS: AcademicYear[] = [
  { id: 1, year: '2569', semester: '1', startDate: '2569-05-16', endDate: '2569-10-10', isActive: true },
  { id: 2, year: '2568', semester: '2', startDate: '2568-11-01', endDate: '2569-03-31', isActive: false },
  { id: 3, year: '2568', semester: '1', startDate: '2568-05-16', endDate: '2568-10-10', isActive: false },
];

export function AdminManageAcademicYears() {
  const [years, setYears] = useState<AcademicYear[]>(MOCK_YEARS);

  const handleAdd = () => {
    Swal.fire({
      title: 'เพิ่มปีการศึกษา',
      html: `
        <div class="flex flex-col gap-3 text-left">
          <div class="flex gap-2">
            <div class="flex-1">
              <label class="text-sm font-medium text-slate-700">ปีการศึกษา</label>
              <input id="a-year" class="swal2-input m-0 w-full" placeholder="เช่น 2569">
            </div>
            <div class="flex-1">
              <label class="text-sm font-medium text-slate-700">ภาคเรียน</label>
              <select id="a-term" class="swal2-select m-0 w-full h-[54px]">
                <option value="1">ภาคเรียนที่ 1</option>
                <option value="2">ภาคเรียนที่ 2</option>
                <option value="3">ภาคฤดูร้อน</option>
              </select>
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-slate-700">วันที่เริ่มต้น</label>
            <input id="a-start" type="date" class="swal2-input m-0 w-full">
          </div>
          <div>
            <label class="text-sm font-medium text-slate-700">วันที่สิ้นสุด</label>
            <input id="a-end" type="date" class="swal2-input m-0 w-full">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#10b981',
      preConfirm: () => {
        const year = (document.getElementById('a-year') as HTMLInputElement).value;
        const semester = (document.getElementById('a-term') as HTMLSelectElement).value;
        const startDate = (document.getElementById('a-start') as HTMLInputElement).value;
        const endDate = (document.getElementById('a-end') as HTMLInputElement).value;
        
        if (!year || !startDate || !endDate) {
          Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
          return false;
        }
        return { year, semester, startDate, endDate };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setYears([{ id: Date.now(), isActive: false, ...result.value }, ...years]);
        Swal.fire('สำเร็จ', 'เพิ่มข้อมูลปีการศึกษาแล้ว', 'success');
      }
    });
  };

  const handleEdit = (item: AcademicYear) => {
    Swal.fire({
      title: 'แก้ไขปีการศึกษา',
      html: `
        <div class="flex flex-col gap-3 text-left">
          <div class="flex gap-2">
            <div class="flex-1">
              <label class="text-sm font-medium text-slate-700">ปีการศึกษา</label>
              <input id="e-year" class="swal2-input m-0 w-full" value="${item.year}">
            </div>
            <div class="flex-1">
              <label class="text-sm font-medium text-slate-700">ภาคเรียน</label>
              <select id="e-term" class="swal2-select m-0 w-full h-[54px]">
                <option value="1" ${item.semester === '1' ? 'selected' : ''}>ภาคเรียนที่ 1</option>
                <option value="2" ${item.semester === '2' ? 'selected' : ''}>ภาคเรียนที่ 2</option>
                <option value="3" ${item.semester === '3' ? 'selected' : ''}>ภาคฤดูร้อน</option>
              </select>
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-slate-700">วันที่เริ่มต้น</label>
            <input id="e-start" type="date" class="swal2-input m-0 w-full" value="${item.startDate}">
          </div>
          <div>
            <label class="text-sm font-medium text-slate-700">วันที่สิ้นสุด</label>
            <input id="e-end" type="date" class="swal2-input m-0 w-full" value="${item.endDate}">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3b82f6',
      preConfirm: () => {
        const year = (document.getElementById('e-year') as HTMLInputElement).value;
        const semester = (document.getElementById('e-term') as HTMLSelectElement).value;
        const startDate = (document.getElementById('e-start') as HTMLInputElement).value;
        const endDate = (document.getElementById('e-end') as HTMLInputElement).value;
        
        if (!year || !startDate || !endDate) {
          Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
          return false;
        }
        return { year, semester, startDate, endDate };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setYears(years.map(y => y.id === item.id ? { ...y, ...result.value } : y));
        Swal.fire('สำเร็จ', 'แก้ไขข้อมูลปีการศึกษาแล้ว', 'success');
      }
    });
  };

  const handleSetActive = (id: number) => {
    Swal.fire({
      title: 'ตั้งเป็นปีการศึกษาปัจจุบัน?',
      text: "ระบบจะปรับให้ปีการศึกษานี้เป็นค่าเริ่มต้นสำหรับการกรอกคะแนนและข้อมูลอื่นๆ",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'ใช่, ตั้งเป็นปัจจุบัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        setYears(years.map(y => ({ ...y, isActive: y.id === id })));
        Swal.fire('สำเร็จ!', 'อัปเดตปีการศึกษาปัจจุบันแล้ว', 'success');
      }
    });
  };

  const handleDelete = (id: number, isActive: boolean) => {
    if (isActive) {
      Swal.fire('ไม่สามารถลบได้', 'ไม่สามารถลบปีการศึกษาที่กำลังใช้งานอยู่ได้', 'error');
      return;
    }
    Swal.fire({
      title: 'ลบข้อมูล?',
      text: "คุณต้องการลบข้อมูลปีการศึกษานี้ใช่หรือไม่",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'ลบข้อมูล',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        setYears(years.filter(y => y.id !== id));
        Swal.fire('ลบสำเร็จ!', '', 'success');
      }
    });
  };

  // Helper to format date nicely
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr.replace('256', '202').replace('257', '203')); // naive thai year conversion mapping just for display logic safety if they enter real dates but we're storing strings. Actually if they use standard date inputs it returns YYYY-MM-DD. Let's just output as is or simple split.
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        return `${parseInt(parts[2])} ${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-emerald-500" /> จัดการปีการศึกษา
          </h2>
          <p className="text-slate-500 text-sm mt-1">กำหนดปีการศึกษาและภาคเรียนปัจจุบันของระบบ</p>
        </div>
        <Button onClick={handleAdd} className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white shadow-md">
          <Plus size={18} className="mr-2" /> เพิ่มปีการศึกษา
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold border-r border-slate-200">ปีการศึกษา / ภาคเรียน</th>
              <th className="px-6 py-4 font-bold border-r border-slate-200">ระยะเวลา</th>
              <th className="px-6 py-4 font-bold text-center border-r border-slate-200">สถานะ</th>
              <th className="px-6 py-4 font-bold text-center w-28">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {years.map((y) => (
              <tr key={y.id} className={`border-b border-slate-100 transition-colors ${y.isActive ? 'bg-emerald-50/30' : 'bg-white hover:bg-slate-50'}`}>
                <td className="px-6 py-4 font-bold text-slate-900 text-base border-r border-slate-200">
                  {y.year} / {y.semester}
                </td>
                <td className="px-6 py-4 text-slate-500 border-r border-slate-200">
                  {formatDate(y.startDate)} - {formatDate(y.endDate)}
                </td>
                <td className="px-6 py-4 text-center border-r border-slate-200">
                  {y.isActive ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold text-xs">
                      <CheckCircle2 size={14} /> ภาคเรียนปัจจุบัน
                    </span>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleSetActive(y.id)} className="text-xs h-7">
                      ตั้งเป็นปัจจุบัน
                    </Button>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(y)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(y.id, y.isActive)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {years.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
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
