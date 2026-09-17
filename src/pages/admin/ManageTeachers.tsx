import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Briefcase, Mail, Upload, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

const MOCK_TEACHERS = [
  { id: 1, teacherId: 'T001', name: 'สมใจ รักเรียน', department: 'กลุ่มสาระฯ วิทยาศาสตร์', advisoryClass: 'ม.1/1', phone: '081-234-5678', email: 'somjai@school.ac.th' },
  { id: 2, teacherId: 'T002', name: 'มานะ ขยันยิ่ง', department: 'กลุ่มสาระฯ คณิตศาสตร์', advisoryClass: 'ม.1/2', phone: '082-345-6789', email: 'mana@school.ac.th' },
  { id: 3, teacherId: 'T003', name: 'วิไล สวยงาม', department: 'กลุ่มสาระฯ ภาษาต่างประเทศ', advisoryClass: 'ม.2/1', phone: '083-456-7890', email: 'wilai@school.ac.th' },
];

const AVAILABLE_CLASSES = ['ทั้งหมด', 'ม.1/1', 'ม.1/2', 'ม.2/1', 'ม.2/2', 'ม.2/3', 'ม.3/1', 'ม.3/2', 'ม.4/1', 'ม.5/1', 'ม.6/1'];

export function AdminManageTeachers() {
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('ทั้งหมด');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.includes(searchTerm) || t.department.includes(searchTerm) || t.teacherId.includes(searchTerm);
    const matchesClass = filterClass === 'ทั้งหมด' || t.advisoryClass === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleAdd = () => {
    setEditingTeacher(null);
    setIsModalOpen(true);
  };

  const handleEdit = (t: any) => {
    setEditingTeacher(t);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    // Construct new teacher object
    const newName = (form.elements.namedItem('t-firstname') as HTMLInputElement).value + ' ' + (form.elements.namedItem('t-lastname') as HTMLInputElement).value;
    const newPhone = (form.elements.namedItem('t-phone') as HTMLInputElement).value;
    const newId = (form.elements.namedItem('t-idcard') as HTMLInputElement).value; // Or reference code
    const newEmail = (form.elements.namedItem('t-email') as HTMLInputElement).value || '-';
    // Mapped fields for simple table display based on the UI
    // department is not in the form explicitly, we can use "บทบาท" or just keep default
    const newRole = (form.elements.namedItem('t-role') as HTMLSelectElement).value;

    if (editingTeacher) {
      setTeachers(teachers.map(teacher => teacher.id === editingTeacher.id ? { ...teacher, name: newName, phone: newPhone, teacherId: newId, email: newEmail, department: newRole } : teacher));
      Swal.fire('สำเร็จ', 'แก้ไขข้อมูลครูเรียบร้อยแล้ว', 'success');
    } else {
      setTeachers([...teachers, { id: Date.now(), name: newName, phone: newPhone, teacherId: newId, email: newEmail, department: newRole, advisoryClass: 'ไม่มี' }]);
      Swal.fire('สำเร็จ', 'เพิ่มข้อมูลครูเรียบร้อยแล้ว', 'success');
    }
    setIsModalOpen(false);
  };

  const handleImportExcel = () => {
    Swal.fire({
      title: 'นำเข้าข้อมูลจาก Excel',
      html: `
        <div class="text-sm text-slate-500 mb-2">กรุณาเลือกไฟล์ .xlsx หรือ .csv</div>
       <div class="mb-4">
         <a href="#" onclick="event.preventDefault(); alert('ดาวน์โหลดไฟล์แม่แบบ (Template) เรียบร้อย');" class="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
           ดาวน์โหลดไฟล์แม่แบบ (Template)
         </a>
       </div>
        <input type="file" id="excel-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
      `,
      showCancelButton: true,
      confirmButtonText: 'อัปโหลด',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#10b981',
      preConfirm: () => {
        const fileInput = document.getElementById('excel-file') as HTMLInputElement;
        if (!fileInput.files || fileInput.files.length === 0) {
          Swal.showValidationMessage('กรุณาเลือกไฟล์');
        }
        return fileInput.files?.[0];
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'กำลังนำเข้าข้อมูล...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        setTimeout(() => {
          Swal.fire('สำเร็จ', 'นำเข้าข้อมูลครู 12 รายการ เรียบร้อยแล้ว', 'success');
        }, 1500);
      }
    });
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'ลบข้อมูลครู?',
      text: "คุณต้องการลบข้อมูลบุคลากรท่านนี้ใช่หรือไม่",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'ลบข้อมูล'
    }).then((result) => {
      if (result.isConfirmed) {
        setTeachers(teachers.filter(t => t.id !== id));
        Swal.fire('ลบสำเร็จ!', '', 'success');
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="text-emerald-500" /> จัดการข้อมูลครูและบุคลากร
          </h2>
          <p className="text-slate-500 text-sm mt-1">บริหารจัดการข้อมูลบุคลากรครู กลุ่มสาระ และข้อมูลการติดต่อ</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={handleImportExcel} className="flex-1 md:flex-none text-slate-600">
            <Upload size={18} className="mr-2" /> นำเข้า (Excel)
          </Button>
          <Button onClick={handleAdd} className="flex-1 md:flex-none shadow-md">
            <Plus size={18} className="mr-2" /> เพิ่มข้อมูลครู
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="ค้นหาชื่อ, รหัสครู, หรือกลุ่มสาระ..." 
            className="pl-10 bg-slate-50 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="text-slate-400" size={20} />
          <select 
            className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            {AVAILABLE_CLASSES.map(c => (
              <option key={c} value={c}>{c === 'ทั้งหมด' ? 'ชั้นที่ปรึกษา (ทั้งหมด)' : `ครูที่ปรึกษา ${c}`}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">รหัสครู</th>
              <th className="px-6 py-4 font-bold">ชื่อ-นามสกุล</th>
              <th className="px-6 py-4 font-bold">กลุ่มสาระฯ</th>
              <th className="px-6 py-4 font-bold">ครูที่ปรึกษาชั้น</th>
              <th className="px-6 py-4 font-bold">ข้อมูลติดต่อ</th>
              <th className="px-6 py-4 font-bold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((t) => (
              <tr key={t.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{t.teacherId}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{t.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md font-medium text-xs border border-amber-100">
                    {t.department}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {t.advisoryClass !== 'ไม่มี' && t.advisoryClass ? (
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md font-bold text-xs">{t.advisoryClass}</span>
                  ) : (
                    <span className="text-slate-400 text-xs">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1"><Mail size={12} /> {t.email}</span>
                    <span className="text-xs">{t.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(t)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8">
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl my-auto flex flex-col max-h-[90vh] relative">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-2xl z-10 sticky top-0 shrink-0">
              <h3 className="text-lg font-bold text-slate-800">
                {editingTeacher ? 'แก้ไขข้อมูลครู' : 'เพิ่มข้อมูลครู'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="teacher-form" onSubmit={handleSaveModal} className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-4">
                
                {/* Left Column */}
                <div className="md:col-span-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">ตำแหน่ง</label>
                    <select className="col-span-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                      <option value="">กรุณาเลือก</option>
                      <option value="ครูประจำการ">ครูประจำการ</option>
                      <option value="ครูอัตราจ้าง">ครูอัตราจ้าง</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">คำนำหน้า</label>
                    <div className="col-span-2 flex gap-2">
                      <select className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                        <option value="">กรุณาเลือก</option>
                        <option value="นาย">นาย</option>
                        <option value="นาง">นาง</option>
                        <option value="นางสาว">นางสาว</option>
                      </select>
                      <Input className="flex-1 bg-slate-50" readOnly />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">ชื่อ</label>
                    <Input name="t-firstname" defaultValue={editingTeacher?.name?.split(' ')[0]} required className="col-span-2 border-pink-500 focus:ring-pink-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">ชื่อ (EN)</label>
                    <Input name="t-firstname_en" className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">เลขบัตรประชาชน</label>
                    <Input name="t-idcard" className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">ที่อยู่บ้านเลขที่</label>
                    <Input name="t-houseno" className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">ซอย</label>
                    <Input name="t-soi" className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">แขวง/ตำบล</label>
                    <Input name="t-subdistrict" className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">จังหวัด</label>
                    <select className="col-span-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                      <option value="">กรุณาเลือก</option>
                      <option value="กทม.">กรุงเทพมหานคร</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">เบอร์โทรศัพท์มือถือ</label>
                    <Input name="t-phone" defaultValue={editingTeacher?.phone} required className="col-span-2 border-pink-500 focus:ring-pink-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2 text-[11px] leading-tight">แสดงเบอร์มือถือบนระบบ SDC Mobile app</label>
                    <div className="col-span-2 flex items-center h-full">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-pink-600 focus:ring-pink-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">รหัสผ่าน</label>
                    <Input type="password" required className="col-span-2 border-pink-500 focus:ring-pink-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">ยืนยันรหัสผ่าน</label>
                    <Input type="password" required className="col-span-2 border-pink-500 focus:ring-pink-500" />
                  </div>
                </div>

                {/* Right Column */}
                <div className="md:col-span-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">รหัสอ้างอิง</label>
                    <Input name="t-ref" defaultValue={editingTeacher?.teacherId} className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">รหัสบัตร</label>
                    <Input name="t-cardid" className="col-span-2 bg-slate-100" readOnly />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">นามสกุล</label>
                    <Input name="t-lastname" defaultValue={editingTeacher?.name?.split(' ').slice(1).join(' ')} required className="col-span-2 border-pink-500 focus:ring-pink-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">นามสกุล (EN)</label>
                    <Input name="t-lastname_en" className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">วัน/เดือน/ปี เกิด</label>
                    <Input placeholder="14/09/2569" className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">หมู่ที่</label>
                    <Input name="t-moo" className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">ถนน</label>
                    <Input name="t-street" className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">เขต /อำเภอ</label>
                    <Input name="t-district" className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">รหัสไปรษณีย์</label>
                    <Input name="t-zipcode" className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">อีเมล</label>
                    <Input name="t-email" defaultValue={editingTeacher?.email} type="email" className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2 text-[11px] leading-tight">แสดงอีเมล์บนระบบ SDC Mobile app</label>
                    <div className="col-span-2 flex items-center h-full">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-pink-600 focus:ring-pink-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">สถานะครู</label>
                    <select className="col-span-2 rounded-md border border-pink-500 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white" required>
                      <option value="">กรุณาเลือก</option>
                      <option value="ปกติ">ปกติ</option>
                      <option value="ลาออก">ลาออก</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700 text-right pr-2">บทบาท</label>
                    <select name="t-role" defaultValue={editingTeacher?.department} className="col-span-2 rounded-md border border-pink-500 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white" required>
                      <option value="">กรุณาเลือก</option>
                      <option value="กลุ่มสาระฯ วิทยาศาสตร์">กลุ่มสาระฯ วิทยาศาสตร์</option>
                      <option value="กลุ่มสาระฯ คณิตศาสตร์">กลุ่มสาระฯ คณิตศาสตร์</option>
                      <option value="กลุ่มสาระฯ ภาษาต่างประเทศ">กลุ่มสาระฯ ภาษาต่างประเทศ</option>
                    </select>
                  </div>
                </div>

                {/* Far Right Column (Image) */}
                <div className="md:col-span-2 flex flex-col items-center pt-4">
                  <span className="text-sm font-medium text-slate-700 mb-2">รูปภาพ</span>
                  <div className="w-32 h-40 bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-slate-300 overflow-hidden relative mb-3">
                    {/* Placeholder with crossed lines and LOGO text */}
                    <div className="absolute inset-0">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                         <line x1="0" y1="0" x2="100%" y2="100%" stroke="#cbd5e1" strokeWidth="2" />
                         <line x1="100%" y1="0" x2="0" y2="100%" stroke="#cbd5e1" strokeWidth="2" />
                      </svg>
                    </div>
                    <span className="font-bold text-slate-300 z-10 text-xl tracking-wider">LOGO</span>
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-[128px]">
                    <Button type="button" className="bg-pink-600 hover:bg-pink-700 text-white w-full h-8 text-sm">เลือกรูปภาพ</Button>
                    <Button type="button" className="bg-red-500 hover:bg-red-600 text-white w-full h-8 flex justify-center items-center">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <p className="text-[11px] text-red-500 mt-4 text-center">* ขนาดรูปแนะนำ 150 x 200 Pixel</p>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-center gap-3 shrink-0 rounded-b-2xl z-10 sticky bottom-0">
              <Button type="submit" form="teacher-form" className="bg-pink-600 hover:bg-pink-700 text-white min-w-[100px]">บันทึก</Button>
              <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-pink-600 hover:bg-pink-700 text-white min-w-[100px]">ยกเลิก</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

