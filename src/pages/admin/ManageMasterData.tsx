import React, { useState } from 'react';
import { Database, Plus, Edit, Trash2, ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Swal from 'sweetalert2';

type MasterItem = { id: number, name: string, status: boolean };

const initialStudentLeaves: MasterItem[] = [
  { id: 1, name: 'ลาป่วย', status: true },
  { id: 2, name: 'ลากิจส่วนตัว', status: true },
];

const initialStaffLeaves: MasterItem[] = [
  { id: 1, name: 'ลาป่วย', status: true },
  { id: 2, name: 'ลากิจส่วนตัว', status: true },
  { id: 3, name: 'ลาคลอดบุตร', status: true },
  { id: 4, name: 'ลาพักผ่อน', status: true },
];

const initialStudentStatus: MasterItem[] = [
  { id: 1, name: 'กำลังศึกษา', status: true },
  { id: 2, name: 'จบการศึกษา', status: true },
  { id: 3, name: 'ลาออก', status: true },
  { id: 4, name: 'ย้ายสถานศึกษา', status: true },
  { id: 5, name: 'พักการเรียน', status: true },
];

const initialStaffStatus: MasterItem[] = [
  { id: 1, name: 'ปฏิบัติงานปกติ', status: true },
  { id: 2, name: 'ลาศึกษาต่อ', status: true },
  { id: 3, name: 'ลาออก', status: true },
  { id: 4, name: 'เกษียณอายุ', status: true },
  { id: 5, name: 'ย้ายสถานศึกษา', status: true },
];

export function AdminManageMasterData() {
  const [activeTab, setActiveTab] = useState<'studentLeave' | 'staffLeave' | 'studentStatus' | 'staffStatus'>('studentLeave');

  const [studentLeaves, setStudentLeaves] = useState(initialStudentLeaves);
  const [staffLeaves, setStaffLeaves] = useState(initialStaffLeaves);
  const [studentStatus, setStudentStatus] = useState(initialStudentStatus);
  const [staffStatus, setStaffStatus] = useState(initialStaffStatus);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'studentLeave': return studentLeaves;
      case 'staffLeave': return staffLeaves;
      case 'studentStatus': return studentStatus;
      case 'staffStatus': return staffStatus;
    }
  };

  const setCurrentData = (newData: MasterItem[]) => {
    switch (activeTab) {
      case 'studentLeave': setStudentLeaves(newData); break;
      case 'staffLeave': setStaffLeaves(newData); break;
      case 'studentStatus': setStudentStatus(newData); break;
      case 'staffStatus': setStaffStatus(newData); break;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'studentLeave': return 'ประเภทการลานักเรียน';
      case 'staffLeave': return 'ประเภทการลาบุคลากร';
      case 'studentStatus': return 'สถานะนักเรียน';
      case 'staffStatus': return 'สถานะบุคลากร';
    }
  };

  const toggleStatus = (id: number) => {
    const data = getCurrentData();
    setCurrentData(data.map(item => item.id === id ? { ...item, status: !item.status } : item));
  };

  const handleAdd = () => {
    Swal.fire({
      title: `เพิ่ม${getTitle()}`,
      input: 'text',
      inputPlaceholder: 'ระบุชื่อรายการ...',
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#10b981',
      inputValidator: (value) => {
        if (!value) return 'กรุณาระบุชื่อรายการ!';
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const data = getCurrentData();
        setCurrentData([...data, { id: Date.now(), name: result.value, status: true }]);
        Swal.fire('สำเร็จ', 'เพิ่มข้อมูลเรียบร้อยแล้ว', 'success');
      }
    });
  };

  const handleEdit = (item: MasterItem) => {
    Swal.fire({
      title: `แก้ไข${getTitle()}`,
      input: 'text',
      inputValue: item.name,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3b82f6',
      inputValidator: (value) => {
        if (!value) return 'กรุณาระบุชื่อรายการ!';
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const data = getCurrentData();
        setCurrentData(data.map(d => d.id === item.id ? { ...d, name: result.value } : d));
        Swal.fire('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อยแล้ว', 'success');
      }
    });
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'ลบข้อมูล?',
      text: "คุณต้องการลบรายการนี้ใช่หรือไม่",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = getCurrentData();
        setCurrentData(data.filter(d => d.id !== id));
        Swal.fire('สำเร็จ', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="text-emerald-500" /> จัดการข้อมูลพื้นฐาน (Master Data)
          </h2>
          <p className="text-slate-500 text-sm mt-1">จัดการประเภทการลาและสถานะของนักเรียนและบุคลากร</p>
        </div>
        <Button onClick={handleAdd} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md">
          <Plus size={18} className="mr-2" /> เพิ่มรายการใหม่
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          variant={activeTab === 'studentLeave' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('studentLeave')}
          className={activeTab === 'studentLeave' ? 'bg-slate-800' : ''}
        >
          ประเภทการลานักเรียน
        </Button>
        <Button 
          variant={activeTab === 'staffLeave' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('staffLeave')}
          className={activeTab === 'staffLeave' ? 'bg-slate-800' : ''}
        >
          ประเภทการลาบุคลากร
        </Button>
        <Button 
          variant={activeTab === 'studentStatus' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('studentStatus')}
          className={activeTab === 'studentStatus' ? 'bg-slate-800' : ''}
        >
          สถานะนักเรียน
        </Button>
        <Button 
          variant={activeTab === 'staffStatus' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('staffStatus')}
          className={activeTab === 'staffStatus' ? 'bg-slate-800' : ''}
        >
          สถานะบุคลากร
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-bold border-r border-slate-200 w-2/3">
                <div className="flex items-center justify-between">
                  <span>{getTitle()}</span>
                  <div className="flex flex-col opacity-50"><ArrowUp size={12} /><ArrowDown size={12} /></div>
                </div>
              </th>
              <th className="px-6 py-3 font-bold border-r border-slate-200 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span>ใช้งาน</span>
                  <div className="flex flex-col opacity-50"><ArrowUp size={12} /><ArrowDown size={12} /></div>
                </div>
              </th>
              <th className="px-6 py-3 font-bold text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentData().map((item) => (
              <tr key={item.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 font-medium text-slate-700 border-r border-slate-200">{item.name}</td>
                <td className="px-6 py-3 text-center border-r border-slate-200">
                  <button 
                    onClick={() => toggleStatus(item.id)}
                    className={`inline-flex items-center justify-center w-6 h-6 rounded ${item.status ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}
                  >
                    {item.status && <Check size={14} strokeWidth={3} />}
                  </button>
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {getCurrentData().length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
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
