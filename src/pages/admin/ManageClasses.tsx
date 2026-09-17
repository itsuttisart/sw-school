import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, School, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

const MOCK_CLASSES = [
  { id: 1, name: 'ม.1/1', level: 'มัธยมศึกษาปีที่ 1', advisor: 'ครูสมใจ รักเรียน', studentCount: 40 },
  { id: 2, name: 'ม.1/2', level: 'มัธยมศึกษาปีที่ 1', advisor: 'ครูวิไล สวยงาม', studentCount: 38 },
  { id: 3, name: 'ม.2/1', level: 'มัธยมศึกษาปีที่ 2', advisor: 'ครูมานะ ขยันยิ่ง', studentCount: 42 },
  { id: 4, name: 'ม.3/1', level: 'มัธยมศึกษาปีที่ 3', advisor: 'ครูสมคิด จิตดี', studentCount: 35 },
];

export function AdminManageClasses() {
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);

  const filteredClasses = classes.filter(c => 
    c.name.includes(searchTerm) || c.advisor.includes(searchTerm) || c.level.includes(searchTerm)
  );

  const handleAdd = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const handleEdit = (c: any) => {
    setEditingClass(c);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    const newName = (form.elements.namedItem('c-name') as HTMLInputElement).value;
    const newLevel = (form.elements.namedItem('c-level') as HTMLSelectElement).value;
    
    if (editingClass) {
      setClasses(classes.map(c => c.id === editingClass.id ? { ...c, name: newName, level: newLevel } : c));
      Swal.fire('สำเร็จ', 'แก้ไขข้อมูลห้องเรียนเรียบร้อยแล้ว', 'success');
    } else {
      setClasses([...classes, { id: Date.now(), name: newName, level: newLevel, advisor: 'ยังไม่ได้ระบุ', studentCount: 0 }]);
      Swal.fire('สำเร็จ', 'เพิ่มห้องเรียนเรียบร้อยแล้ว', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'ลบห้องเรียน?',
      text: "คุณต้องการลบห้องเรียนนี้ใช่หรือไม่",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'ลบข้อมูล'
    }).then((result) => {
      if (result.isConfirmed) {
        setClasses(classes.filter(c => c.id !== id));
        Swal.fire('ลบสำเร็จ!', '', 'success');
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <School className="text-emerald-500" /> จัดการห้องเรียน
          </h2>
          <p className="text-slate-500 text-sm mt-1">จัดการข้อมูลระดับชั้น ห้องเรียน และครูที่ปรึกษา</p>
        </div>
        <Button onClick={handleAdd} className="w-full md:w-auto shadow-md">
          <Plus size={18} className="mr-2" /> เพิ่มห้องเรียน
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="ค้นหาชื่อห้องเรียน, ระดับชั้น, หรือชื่อครูที่ปรึกษา..." 
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
              <th className="px-6 py-4 font-bold">ชื่อห้องเรียน</th>
              <th className="px-6 py-4 font-bold">ระดับชั้น</th>
              <th className="px-6 py-4 font-bold">ครูที่ปรึกษา</th>
              <th className="px-6 py-4 font-bold text-center">จำนวนนักเรียน</th>
              <th className="px-6 py-4 font-bold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((c) => (
              <tr key={c.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold">{c.name}</span>
                </td>
                <td className="px-6 py-4 text-slate-500">{c.level}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{c.advisor}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-500">
                    <Users size={16} /> {c.studentCount} คน
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(c)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-6 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-auto flex flex-col max-h-[90vh] relative">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-lg z-10 sticky top-0 shrink-0">
              <h3 className="text-lg font-bold text-slate-800">
                เพิ่ม/แก้ไข
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="class-form" onSubmit={handleSaveModal} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right">ระดับชั้น</label>
                    <select name="c-level" defaultValue={editingClass?.level} className="col-span-3 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                      <option value="">กรุณาเลือก</option>
                      <option value="มัธยมศึกษาปีที่ 1">มัธยมศึกษาปีที่ 1</option>
                      <option value="มัธยมศึกษาปีที่ 2">มัธยมศึกษาปีที่ 2</option>
                      <option value="มัธยมศึกษาปีที่ 3">มัธยมศึกษาปีที่ 3</option>
                      <option value="มัธยมศึกษาปีที่ 4">มัธยมศึกษาปีที่ 4</option>
                      <option value="มัธยมศึกษาปีที่ 5">มัธยมศึกษาปีที่ 5</option>
                      <option value="มัธยมศึกษาปีที่ 6">มัธยมศึกษาปีที่ 6</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right">ห้องเรียน</label>
                    <Input name="c-name" defaultValue={editingClass?.name} required className="col-span-3 border-pink-500 focus:ring-pink-500" />
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right">ห้องเรียน EN</label>
                    <Input name="c-name_en" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right">เข้าเรียนเวลา</label>
                    <Input type="time" name="c-start_time" defaultValue="06:00" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right">สาขา</label>
                    <select name="c-branch" className="col-span-3 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                      <option value="">ไม่ระบุ</option>
                      <option value="วิทย์-คณิต">วิทย์-คณิต</option>
                      <option value="ศิลป์-ภาษา">ศิลป์-ภาษา</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right">สถานะ</label>
                    <div className="col-span-3 flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="c-status" value="active" defaultChecked className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-sm text-slate-700">ใช้งาน</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="c-status" value="inactive" className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-sm text-slate-700">ยกเลิกการใช้งาน</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right">ประเภทห้อง</label>
                    <select name="c-room_type" className="col-span-3 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                      <option value="ปกติ">ปกติ</option>
                      <option value="พิเศษ">พิเศษ</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right">ชื่อย่อ</label>
                    <Input name="c-abbr" required className="col-span-3 border-pink-500 focus:ring-pink-500" />
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right">ชื่อย่อ EN</label>
                    <Input name="c-abbr_en" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right">มาสายหลังเวลา</label>
                    <Input type="time" name="c-late_time" defaultValue="08:00" className="col-span-3" />
                  </div>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0 rounded-b-lg z-10 sticky bottom-0">
              <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="min-w-[100px] bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200">ยกเลิก</Button>
              <Button type="submit" form="class-form" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]">บันทึก</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
