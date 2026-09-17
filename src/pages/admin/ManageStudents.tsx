import React, { useState } from 'react';
import { GraduationCap, Search, Filter, Edit, Trash2, Plus, Upload, X, Save, FileText, PieChart, Download, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

const MOCK_STUDENTS = [
  { id: 1, studentId: '65001', name: 'เด็กชาย สมศักดิ์ เก่งมาก', class: 'ม.1/1', phone: '081-234-5678', parentName: 'นาย วิชา เก่งมาก' },
  { id: 2, studentId: '65002', name: 'เด็กหญิง มาลี สวยงาม', class: 'ม.1/1', phone: '089-876-5432', parentName: 'นาง สมศรี สวยงาม' },
  { id: 3, studentId: '65030', name: 'นาย สมชาย ใจดี', class: 'ม.4/2', phone: '082-333-4444', parentName: 'นาย สมเกียรติ ใจดี' },
];

const AVAILABLE_CLASSES = ['ทั้งหมด', 'ม.1/1', 'ม.1/2', 'ม.2/1', 'ม.2/2', 'ม.3/1', 'ม.4/1', 'ม.4/2', 'ม.5/1', 'ม.6/1'];

export function AdminManageStudents() {
  const [view, setView] = useState<'list' | 'form' | 'report'>('list');
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('ทั้งหมด');
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.includes(searchTerm) || s.studentId.includes(searchTerm);
    const matchClass = filterClass === 'ทั้งหมด' || s.class === filterClass;
    return matchSearch && matchClass;
  });

  const handleAdd = () => {
    setEditingStudent(null);
    setView('form');
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setView('form');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: 'บันทึกข้อมูล',
      text: 'ต้องการบันทึกข้อมูลนักเรียนใช่หรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('สำเร็จ!', 'บันทึกข้อมูลเรียบร้อยแล้ว', 'success');
        setView('list');
      }
    });
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
          Swal.fire('สำเร็จ', 'นำเข้าข้อมูลนักเรียน 45 รายการ เรียบร้อยแล้ว', 'success');
        }, 1500);
      }
    });
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'ลบข้อมูลนักเรียน?',
      text: "การดำเนินการนี้ไม่สามารถย้อนกลับได้",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'ลบข้อมูล'
    }).then((result) => {
      if (result.isConfirmed) {
        setStudents(students.filter(s => s.id !== id));
        Swal.fire('ลบสำเร็จ!', '', 'success');
      }
    });
  };

  
  if (view === 'report') {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart2 className="text-blue-500" /> รายงานข้อมูลนักเรียน
            </h2>
            <p className="text-slate-500 text-sm mt-1">ดาวน์โหลดข้อมูลสถิติที่เกี่ยวข้องกับนักเรียน</p>
          </div>
          <Button variant="ghost" onClick={() => setView('list')} className="text-slate-400 hover:text-slate-600">
            <X size={20} /> กลับหน้ารายชื่อ
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50">
              <PieChart size={24} className="text-emerald-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">สรุปการมาเรียนประจำเดือน</h4>
              <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">ข้อมูลสถิติการเข้าเรียน สาย ขาด ของนักเรียนทั้งหมดแยกตามระดับชั้น</p>
              <div className="flex gap-2">
                <button className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  <Download size={14} /> PDF
                </button>
                <button className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  <Download size={14} /> Excel
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <FileText size={24} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">รายงานผลการเรียนเฉลี่ย (GPA)</h4>
              <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">สรุปเกรดเฉลี่ยรายห้อง และภาพรวมของสถานศึกษาประจำภาคเรียน</p>
              <div className="flex gap-2">
                <button className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  <Download size={14} /> PDF
                </button>
                <button className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  <Download size={14} /> Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'form') {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {editingStudent ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มข้อมูลนักเรียนใหม่'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">กรอกข้อมูลส่วนบุคคลและข้อมูลพื้นฐานของนักเรียนอย่างละเอียด</p>
          </div>
          <Button variant="outline" onClick={() => setView('list')} className="text-slate-600">
            <X size={18} className="mr-2" /> ยกเลิก
          </Button>
        </div>

        <form onSubmit={handleSaveForm}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
            
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">รหัสนักเรียน</label>
                  <Input defaultValue={editingStudent?.studentId || ""} className="bg-slate-50" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">ประเภทนักเรียน</label>
                  <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    <option>ไม่ระบุ</option>
                    <option>ปกติ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">ประเภทพิเศษ/ทุน</label>
                <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option>ไม่ระบุ</option>
                  <option>นักกีฬา</option>
                  <option>เรียนดี</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">รหัสบัตร</label>
                <Input className="bg-slate-50" />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">ระดับ</label>
                  <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    <option>โปรดเลือก</option>
                    <option>มัธยมศึกษาตอนต้น</option>
                    <option>มัธยมศึกษาตอนปลาย</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">กลุ่มเรียน</label>
                  <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    <option>ไม่มีกลุ่ม</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">หลักสูตรรายบุคคล</label>
                <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option>ไม่ระบุ</option>
                </select>
              </div>

              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-sm font-bold text-slate-700 mb-1">คำนำหน้า</label>
                  <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    <option>กรุณาเลือก</option>
                    <option>ด.ช.</option>
                    <option>ด.ญ.</option>
                    <option>นาย</option>
                    <option>นางสาว</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="block text-sm font-bold text-slate-700 mb-1">ชื่อ</label>
                  <Input defaultValue={editingStudent ? editingStudent.name.split(' ')[1] : ""} className="bg-white" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">ชื่อเล่น</label>
                <Input className="bg-white" />
              </div>

              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-sm font-bold text-slate-700 mb-1">คำนำหน้า (EN)</label>
                  <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    <option>ไม่ระบุ</option>
                    <option>Mr.</option>
                    <option>Miss</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="block text-sm font-bold text-slate-700 mb-1">ชื่อ (EN)</label>
                  <Input className="bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">ชื่อเล่น (EN)</label>
                <Input className="bg-white" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">เลขบัตรประชาชน</label>
                <Input className="bg-white" maxLength={13} />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">พาสปอร์ต</label>
                <Input className="bg-white" />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">วันออกบัตร</label>
                  <Input type="date" className="bg-white" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">สัญชาติ</label>
                  <Input className="bg-white" defaultValue="ไทย" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">ศาสนา</label>
                <Input className="bg-white" defaultValue="พุทธ" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Facebook</label>
                <Input className="bg-white" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">สถานะ</label>
                <select defaultValue="กำลังศึกษา" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option value="กรุณาเลือก">กรุณาเลือก</option>
                  <option value="กำลังศึกษา">กำลังศึกษา</option>
                  <option value="จบการศึกษา">จบการศึกษา</option>
                  <option value="ลาออก">ลาออก</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">วันที่ออกบัตรนักเรียน</label>
                <Input type="date" className="bg-white" />
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-4">
              
              <div className="mb-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">การมาเรียน</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                    <input type="radio" name="commute" className="text-emerald-600 focus:ring-emerald-500" defaultChecked />
                    ไป - กลับ
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                    <input type="radio" name="commute" className="text-emerald-600 focus:ring-emerald-500" />
                    ประจำ
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">รหัสบัตรชั่วคราว</label>
                <Input className="bg-slate-50" />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">ห้องเรียน</label>
                  <select defaultValue={editingStudent?.class} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    <option>โปรดเลือก</option>
                    {AVAILABLE_CLASSES.filter(c=>c!=='ทั้งหมด').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-bold text-slate-700 mb-1">เลขที่</label>
                  <Input type="number" className="bg-slate-50" />
                </div>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">เพศ</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                    <input type="radio" name="gender" className="text-emerald-600 focus:ring-emerald-500" defaultChecked={editingStudent?.name?.includes('ด.ช.') || editingStudent?.name?.includes('นาย')} />
                    ชาย
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                    <input type="radio" name="gender" className="text-emerald-600 focus:ring-emerald-500" defaultChecked={editingStudent?.name?.includes('ด.ญ.') || editingStudent?.name?.includes('นาง')} />
                    หญิง
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">นามสกุล</label>
                  <Input defaultValue={editingStudent ? editingStudent.name.split(' ').slice(2).join(' ') : ""} className="bg-white" required />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-bold text-slate-700 mb-1">เป็นบุตรคนที่</label>
                  <Input type="number" className="bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">นามสกุล (EN)</label>
                <Input className="bg-white" />
              </div>

              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">วัน/เดือน/ปี เกิด</label>
                  <Input type="date" className="bg-white" />
                </div>
                <div className="text-sm font-medium text-slate-500 mb-2">
                  อายุ 0 ปี 0 เดือน 0 วัน
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">เบอร์โทรศัพท์มือถือ</label>
                <Input defaultValue={editingStudent?.phone || ""} className="bg-white" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">วันหมดอายุ (บัตรประชาชน)</label>
                <Input type="date" className="bg-white" />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">เชื้อชาติ</label>
                  <Input className="bg-white" defaultValue="ไทย" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">หมู่เลือด</label>
                  <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    <option>ไม่ระบุ</option>
                    <option>A</option>
                    <option>B</option>
                    <option>AB</option>
                    <option>O</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Line ID</label>
                <Input className="bg-white" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">วันหมดอายุ (บัตรนักเรียน)</label>
                <Input type="date" className="bg-white" />
              </div>

            </div>

          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-100 flex justify-center gap-4">
            <Button type="submit" className="bg-rose-500 hover:bg-rose-600 min-w-[120px] shadow-md">
              <Save size={18} className="mr-2" /> บันทึก
            </Button>
            <Button type="button" variant="outline" onClick={() => setView('list')} className="min-w-[120px] text-slate-600 border-slate-300">
              ยกเลิก
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="text-emerald-500" /> จัดการข้อมูลนักเรียน
          </h2>
          <p className="text-slate-500 text-sm mt-1">เพิ่ม ลบ แก้ไข ข้อมูลนักเรียนทั้งหมดในสถานศึกษา</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={() => setView('report')} className="flex-1 md:flex-none text-blue-600 border-blue-200 hover:bg-blue-50">
            <BarChart2 size={18} className="mr-2" /> รายงาน/สถิติ
          </Button>
          <Button variant="outline" onClick={handleImportExcel} className="flex-1 md:flex-none text-slate-600">
            <Upload size={18} className="mr-2" /> นำเข้า (Excel)
          </Button>
          <Button onClick={handleAdd} className="flex-1 md:flex-none shadow-md bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus size={18} className="mr-2" /> เพิ่มนักเรียน
          </Button>
        </div>
      </div>


      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="ค้นหารหัสนักเรียน, ชื่อ-นามสกุล..." 
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
              <option key={c} value={c}>{c === 'ทั้งหมด' ? 'ทุกห้องเรียน' : `ห้อง \${c}`}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">รหัสนักเรียน</th>
              <th className="px-6 py-4 font-bold">ชื่อ-นามสกุล</th>
              <th className="px-6 py-4 font-bold">ชั้นเรียน</th>
              <th className="px-6 py-4 font-bold">เบอร์โทรศัพท์</th>
              <th className="px-6 py-4 font-bold">ผู้ปกครอง</th>
              <th className="px-6 py-4 font-bold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{s.studentId}</td>
                <td className="px-6 py-4">{s.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-bold">{s.class}</span>
                </td>
                <td className="px-6 py-4 text-slate-500">{s.phone}</td>
                <td className="px-6 py-4 text-slate-500">{s.parentName}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button onClick={() => handleEdit(s)} variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
