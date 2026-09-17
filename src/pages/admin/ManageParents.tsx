import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Users, Phone, Upload, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

const MOCK_PARENTS = [
  { id: 1, name: 'สมปอง ใจดี', phone: '089-876-5432', childrenCount: 1, childrenNames: ['ด.ช. สมชาย ใจดี (ม.1/1)'], address: '123 ถ.สุขุมวิท กทม.' },
  { id: 2, name: 'สมศรี รักเรียน', phone: '088-765-4321', childrenCount: 1, childrenNames: ['ด.ญ. สมหญิง รักเรียน (ม.1/1)'], address: '456 ถ.เพชรบุรี กทม.' },
  { id: 3, name: 'มานี อดทน', phone: '087-654-3210', childrenCount: 2, childrenNames: ['นาย มานะ อดทน (ม.2/3)', 'ด.ช. มีชัย อดทน (ม.1/2)'], address: '789 ถ.ลาดพร้าว กทม.' },
];

const AVAILABLE_CLASSES = ['ทั้งหมด', 'ม.1/1', 'ม.1/2', 'ม.2/1', 'ม.2/2', 'ม.2/3', 'ม.3/1', 'ม.3/2', 'ม.4/1', 'ม.5/1', 'ม.6/1'];

export function AdminManageParents() {
  const [parents, setParents] = useState(MOCK_PARENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('ทั้งหมด');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<any>(null);

  const filteredParents = parents.filter(p => {
    const matchesSearch = p.name.includes(searchTerm) || p.phone.includes(searchTerm) || p.childrenNames.join(', ').includes(searchTerm);
    const matchesClass = filterClass === 'ทั้งหมด' || p.childrenNames.some(child => child.includes(`(${filterClass})`));
    return matchesSearch && matchesClass;
  });

  const handleAdd = () => {
    setEditingParent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (p: any) => {
    setEditingParent(p);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    const newName = (form.elements.namedItem('p-firstname') as HTMLInputElement).value + ' ' + (form.elements.namedItem('p-lastname') as HTMLInputElement).value;
    const newPhone = (form.elements.namedItem('p-phone') as HTMLInputElement).value;
    const newAddress = (form.elements.namedItem('p-houseno') as HTMLInputElement).value + ' ' + (form.elements.namedItem('p-province') as HTMLSelectElement).value;

    if (editingParent) {
      setParents(parents.map(parent => parent.id === editingParent.id ? { ...parent, name: newName, phone: newPhone, address: newAddress } : parent));
      Swal.fire('สำเร็จ', 'แก้ไขข้อมูลผู้ปกครองเรียบร้อยแล้ว', 'success');
    } else {
      setParents([...parents, { id: Date.now(), childrenCount: 0, childrenNames: ['- (ยังไม่ได้ผูกข้อมูลบุตร)'], name: newName, phone: newPhone, address: newAddress }]);
      Swal.fire('สำเร็จ', 'เพิ่มข้อมูลผู้ปกครองเรียบร้อยแล้ว', 'success');
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
          Swal.fire('สำเร็จ', 'นำเข้าข้อมูลผู้ปกครอง 38 รายการ เรียบร้อยแล้ว', 'success');
        }, 1500);
      }
    });
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'ลบข้อมูลผู้ปกครอง?',
      text: "คุณต้องการลบข้อมูลผู้ปกครองท่านนี้ใช่หรือไม่",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'ลบข้อมูล'
    }).then((result) => {
      if (result.isConfirmed) {
        setParents(parents.filter(p => p.id !== id));
        Swal.fire('ลบสำเร็จ!', '', 'success');
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-emerald-500" /> จัดการข้อมูลผู้ปกครอง
          </h2>
          <p className="text-slate-500 text-sm mt-1">บันทึกข้อมูลติดต่อ และการผูกความสัมพันธ์กับนักเรียนในความดูแล</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={handleImportExcel} className="flex-1 md:flex-none text-slate-600">
            <Upload size={18} className="mr-2" /> นำเข้า (Excel)
          </Button>
          <Button onClick={handleAdd} className="flex-1 md:flex-none shadow-md">
            <Plus size={18} className="mr-2" /> เพิ่มผู้ปกครอง
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="ค้นหาชื่อผู้ปกครอง, เบอร์โทร, หรือชื่อนักเรียน..." 
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
              <option key={c} value={c}>{c === 'ทั้งหมด' ? 'ทุกห้องเรียน' : `ผู้ปกครองห้อง ${c}`}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">ชื่อ-นามสกุล ผู้ปกครอง</th>
              <th className="px-6 py-4 font-bold">เบอร์โทรศัพท์</th>
              <th className="px-6 py-4 font-bold">บุตรในความดูแล</th>
              <th className="px-6 py-4 font-bold">ที่อยู่ติดต่อ</th>
              <th className="px-6 py-4 font-bold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredParents.map((p) => (
              <tr key={p.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                <td className="px-6 py-4 text-slate-500">
                   <div className="flex items-center gap-1"><Phone size={14} className="text-slate-400" /> {p.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {p.childrenNames.map((child, idx) => (
                      <span key={idx} className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md inline-block w-fit">
                        {child}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs">{p.address}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(p)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8">
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl my-auto flex flex-col max-h-[90vh] relative">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-2xl z-10 sticky top-0 shrink-0">
              <h3 className="text-lg font-bold text-slate-800">
                {editingParent ? 'แก้ไขข้อมูลผู้ปกครอง' : 'เพิ่มข้อมูลผู้ปกครอง'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="parent-form" onSubmit={handleSaveModal} className="space-y-8">
                
                {/* ข้อมูลส่วนตัว */}
                <section>
                  <h4 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">ข้อมูลส่วนตัว</h4>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4">
                    <div className="md:col-span-12 flex flex-col md:flex-row gap-4 items-end mb-2">
                      <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์มือถือ (ค้นหาข้อมูล)</label>
                        <div className="flex gap-2">
                          <Input name="search_phone" placeholder="กรอกเบอร์มือถือเพื่อดึงข้อมูล" className="flex-1" />
                          <Button type="button" className="bg-pink-600 hover:bg-pink-700 text-white">ค้นหา</Button>
                        </div>
                        <p className="text-xs text-red-500 mt-1">*กรุณาค้นหาเบอร์มือถือเพื่อตรวจสอบข้อมูลในระบบ</p>
                      </div>
                      <div className="w-full md:w-32 hidden md:block"></div>
                    </div>

                    <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์มือถือ</label>
                        <Input name="p-phone" defaultValue={editingParent?.phone} required />
                        <label className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                          <input type="checkbox" className="rounded border-slate-300 text-pink-600 focus:ring-pink-500" />
                          ใช้รับข้อความ SMS (ใช้ได้ 1 เบอร์เท่านั้น)
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">คำนำหน้าชื่อ</label>
                        <select className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                          <option value="">กรุณาเลือก</option>
                          <option value="นาย">นาย</option>
                          <option value="นาง">นาง</option>
                          <option value="นางสาว">นางสาว</option>
                        </select>
                      </div>
                      <div className="hidden md:block"></div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ</label>
                        <Input name="p-firstname" defaultValue={editingParent?.name?.split(' ')[0]} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">นามสกุล</label>
                        <Input name="p-lastname" defaultValue={editingParent?.name?.split(' ').slice(1).join(' ')} required />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ (EN)</label>
                        <Input name="p-firstname_en" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">นามสกุล (EN)</label>
                        <Input name="p-lastname_en" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ความสัมพันธ์</label>
                        <select className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                          <option value="">ไม่ระบุ</option>
                          <option value="บิดา">บิดา</option>
                          <option value="มารดา">มารดา</option>
                          <option value="ผู้ปกครอง">ผู้ปกครอง (อื่นๆ)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">การศึกษา</label>
                        <select className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                          <option value="">ไม่ระบุ</option>
                          <option value="ประถมศึกษา">ประถมศึกษา</option>
                          <option value="มัธยมศึกษา">มัธยมศึกษา</option>
                          <option value="ปริญญาตรี">ปริญญาตรี</option>
                          <option value="สูงกว่าปริญญาตรี">สูงกว่าปริญญาตรี</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
                        <Input type="email" name="p-email" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">วัน/เดือน/ปี เกิด</label>
                        <Input type="date" name="p-dob" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">เลขบัตรประชาชน</label>
                        <Input name="p-idcard" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">พาสปอร์ต</label>
                        <Input name="p-passport" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">วันออกบัตร</label>
                        <Input type="date" name="p-issue_date" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">วันหมดอายุ</label>
                        <Input type="date" name="p-expire_date" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">สัญชาติ</label>
                        <Input name="p-nationality" defaultValue="ไทย" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">เชื้อชาติ</label>
                        <Input name="p-ethnicity" defaultValue="ไทย" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ศาสนา</label>
                        <Input name="p-religion" defaultValue="พุทธ" />
                      </div>
                    </div>
                    
                    <div className="md:col-span-4 flex flex-col items-center pt-4">
                      <div className="w-32 h-40 bg-slate-200 flex items-center justify-center text-slate-400 border border-slate-300 overflow-hidden">
                        <Users size={64} className="text-slate-400 opacity-50" />
                      </div>
                      <Button type="button" variant="outline" size="sm" className="mt-3">อัปโหลดรูปภาพ</Button>
                    </div>
                  </div>
                </section>

                {/* ข้อมูลที่อยู่ */}
                <section>
                  <h4 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">ข้อมูลที่อยู่</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">บ้านเลขที่</label>
                      <Input name="p-houseno" defaultValue={editingParent?.address?.split(' ')[0]} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">หมู่</label>
                      <Input name="p-moo" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ซอย</label>
                      <Input name="p-soi" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ถนน</label>
                      <Input name="p-street" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">แขวง/ตำบล</label>
                      <Input name="p-subdistrict" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">เขต/อำเภอ</label>
                      <Input name="p-district" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">จังหวัด</label>
                      <select name="p-province" defaultValue={editingParent?.address?.includes('กทม.') ? 'กทม.' : ''} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                        <option value="">ไม่ระบุ</option>
                        <option value="กทม.">กรุงเทพมหานคร</option>
                        <option value="สมุทรปราการ">สมุทรปราการ</option>
                        <option value="นนทบุรี">นนทบุรี</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">รหัสไปรษณีย์</label>
                      <Input name="p-zipcode" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์บ้าน</label>
                      <Input name="p-homephone" />
                    </div>
                  </div>
                </section>

                {/* ข้อมูลอาชีพ */}
                <section>
                  <h4 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">ข้อมูลอาชีพ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">อาชีพ</label>
                      <select className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                        <option value="">ไม่ระบุ</option>
                        <option value="พนักงานบริษัท">พนักงานบริษัท</option>
                        <option value="รับราชการ">รับราชการ</option>
                        <option value="ธุรกิจส่วนตัว">ธุรกิจส่วนตัว</option>
                        <option value="ค้าขาย">ค้าขาย</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">รายได้ต่อปี(บาท)</label>
                      <select className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                        <option value="">ไม่ระบุ</option>
                        <option value="< 150,000">น้อยกว่า 150,000</option>
                        <option value="150,000 - 300,000">150,000 - 300,000</option>
                        <option value="> 300,000">มากกว่า 300,000</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อที่ทำงาน</label>
                      <Input name="p-company" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">รายได้ต่อเดือน(บาท)</label>
                      <select className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                        <option value="">ไม่ระบุ</option>
                        <option value="< 15,000">น้อยกว่า 15,000</option>
                        <option value="15,000 - 30,000">15,000 - 30,000</option>
                        <option value="> 30,000">มากกว่า 30,000</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ที่อยู่ (ที่ทำงาน)</label>
                      <Input name="p-work_address" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">หมู่ (ที่ทำงาน)</label>
                      <Input name="p-work_moo" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ซอย (ที่ทำงาน)</label>
                      <Input name="p-work_soi" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ถนน (ที่ทำงาน)</label>
                      <Input name="p-work_street" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">แขวง/ตำบล (ที่ทำงาน)</label>
                      <Input name="p-work_subdistrict" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">เขต/อำเภอ (ที่ทำงาน)</label>
                      <Input name="p-work_district" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">จังหวัด (ที่ทำงาน)</label>
                      <select className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                        <option value="">ไม่ระบุ</option>
                        <option value="กทม.">กรุงเทพมหานคร</option>
                        <option value="สมุทรปราการ">สมุทรปราการ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">รหัสไปรษณีย์ (ที่ทำงาน)</label>
                      <Input name="p-work_zipcode" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์ที่ทำงาน</label>
                      <Input name="p-work_phone" />
                    </div>
                  </div>
                </section>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-center gap-3 shrink-0 rounded-b-2xl z-10 sticky bottom-0">
              <Button type="submit" form="parent-form" className="bg-pink-600 hover:bg-pink-700 text-white min-w-[120px]">
                <span className="flex items-center gap-2">💾 บันทึก</span>
              </Button>
              <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-pink-600 hover:bg-pink-700 text-white min-w-[120px]">ยกเลิก</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
