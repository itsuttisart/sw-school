import React, { useState } from 'react';
import { ShieldCheck, Users, Plus, Edit, Trash2, Search, Filter, Settings, Key } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

const MOCK_ROLES = [
  { id: 1, name: 'ผู้ดูแลระบบสูงสุด (Super Admin)', description: 'เข้าถึงได้ทุกเมนูและทุกการตั้งค่า', isSystem: true },
  { id: 2, name: 'แอดมินฝ่ายวิชาการ', description: 'จัดการหลักสูตร ตารางสอน แผนการเรียน และเอกสาร ปพ.', isSystem: false },
  { id: 3, name: 'แอดมินฝ่ายปกครอง', description: 'จัดการข้อมูลกิจการนักเรียน การขาดลามาสาย และพฤติกรรม', isSystem: false },
  { id: 4, name: 'ครูผู้สอน (ทั่วไป)', description: 'เช็คชื่อ ให้คะแนน และดูข้อมูลนักเรียนในที่ปรึกษา', isSystem: true },
];

const MOCK_TEACHER_ROLES = [
  { id: 1, teacherName: 'ครูสมใจ รักเรียน', role: 'แอดมินฝ่ายวิชาการ', department: 'วิทยาศาสตร์' },
  { id: 2, teacherName: 'ครูมานะ ขยันยิ่ง', role: 'ผู้ดูแลระบบสูงสุด (Super Admin)', department: 'คณิตศาสตร์' },
  { id: 3, teacherName: 'ครูวิไล สวยงาม', role: 'ครูผู้สอน (ทั่วไป)', department: 'ภาษาต่างประเทศ' },
];

export function AdminRoleManagement() {
  const [activeTab, setActiveTab] = useState<'roles' | 'assign'>('roles');

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="text-emerald-500" /> จัดการสิทธิ์การใช้งาน/บทบาท
        </h2>
        <p className="text-slate-500 text-sm mt-1">สร้างบทบาทใหม่ และกำหนดสิทธิ์การเข้าถึงเมนูต่างๆ ให้กับบุคลากร</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors ${activeTab === 'roles' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}`}
        >
          <div className="flex items-center gap-2"><Settings size={16} /> กำหนดโครงสร้างบทบาท (Roles)</div>
        </button>
        <button
          onClick={() => setActiveTab('assign')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors ${activeTab === 'assign' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}`}
        >
          <div className="flex items-center gap-2"><Users size={16} /> มอบหมายบทบาทให้บุคลากร</div>
        </button>
      </div>

      {activeTab === 'roles' && <ManageRoles />}
      {activeTab === 'assign' && <AssignRoles />}
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------


const SYSTEM_MENUS = [
  { id: 'students', name: 'จัดการนักเรียน', subMenus: [] },
  { id: 'teachers', name: 'จัดการครู', subMenus: [] },
  { id: 'parents', name: 'จัดการผู้ปกครอง', subMenus: [] },
  { id: 'curriculum', name: 'ระบบหลักสูตร (ทั้งหมด)', subMenus: [
    { id: 'curr_subject', name: 'รายวิชา' },
    { id: 'curr_plan', name: 'แผนการเรียน' },
    { id: 'curr_doc', name: 'เอกสาร ปพ.' }
  ]},
  { id: 'schedule', name: 'จัดการตารางเรียน/สอน', subMenus: [] },
  { id: 'finance', name: 'ระบบการเงิน', subMenus: [] },
  { id: 'inventory', name: 'ระบบพัสดุ', subMenus: [] },
  { id: 'affairs', name: 'ระบบกิจการนักเรียน', subMenus: [] },
  { id: 'maintenance', name: 'แจ้งซ่อมแซม', subMenus: [] },
  { id: 'docs', name: 'ระบบสารบรรณ', subMenus: [] },
  { id: 'archive', name: 'คลังเอกสาร', subMenus: [] },
  { id: 'announcement', name: 'ระบบประกาศ', subMenus: [] },
  { id: 'popup', name: 'จัดการป็อปอัพ', subMenus: [] },
];

function ManageRoles() {
  const [editingRole, setEditingRole] = useState<any>(null);
  
  const handleEditRole = (role: any) => {
    setEditingRole(role);
  };
  
  const handleCloseModal = () => {
    setEditingRole(null);
  };

  const handleSaveModal = () => {
    Swal.fire('สำเร็จ', 'บันทึกสิทธิ์การใช้งานเรียบร้อยแล้ว', 'success');
    setEditingRole(null);
  };

  return (
    <div className="space-y-6">
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">ตั้งค่าสิทธิ์การใช้งาน: {editingRole?.name}</h3>
                <p className="text-sm text-slate-500 mt-1">กำหนดสิทธิ์การเข้าถึงและการจัดการข้อมูลในแต่ละเมนู</p>
              </div>
              <button onClick={handleCloseModal} className="text-slate-400 hover:bg-slate-200 p-2 rounded-full">✕</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="overflow-x-auto"><div className="space-y-4 min-w-[600px]">
                <div className="grid grid-cols-12 gap-4 pb-2 border-b-2 border-slate-200 font-bold text-slate-700 text-sm">
                  <div className="col-span-4">เมนูในระบบ</div>
                  <div className="col-span-2 text-center">เข้าถึง (View)</div>
                  <div className="col-span-2 text-center">เพิ่ม (Add)</div>
                  <div className="col-span-2 text-center">แก้ไข (Edit)</div>
                  <div className="col-span-2 text-center text-rose-600">ลบ (Delete)</div>
                </div>
                {SYSTEM_MENUS.map(menu => (
                  <div key={menu.id} className="border-b border-slate-100 pb-4">
                    <div className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-2 rounded-lg">
                      <div className="col-span-4 font-bold text-slate-800">{menu.name}</div>
                      <div className="col-span-2 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" defaultChecked /></div>
                      <div className="col-span-2 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" defaultChecked /></div>
                      <div className="col-span-2 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" defaultChecked /></div>
                      <div className="col-span-2 flex justify-center"><input type="checkbox" className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500" /></div>
                    </div>
                    {menu.subMenus.length > 0 && (
                      <div className="pl-8 pr-2 pt-2 space-y-2 mt-1">
                        {menu.subMenus.map(sub => (
                          <div key={sub.id} className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-4 text-sm text-slate-600">└ {sub.name}</div>
                            <div className="col-span-2 flex justify-center"><input type="checkbox" className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500" defaultChecked /></div>
                            <div className="col-span-2 flex justify-center"><input type="checkbox" className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500" defaultChecked /></div>
                            <div className="col-span-2 flex justify-center"><input type="checkbox" className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500" defaultChecked /></div>
                            <div className="col-span-2 flex justify-center"><input type="checkbox" className="w-3.5 h-3.5 rounded text-rose-600 focus:ring-rose-500" /></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div></div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
              <Button variant="outline" onClick={handleCloseModal}>ยกเลิก</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveModal}>บันทึกสิทธิ์การใช้งาน</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-700">โครงสร้างบทบาทในระบบ</h3>
        <Button onClick={() => setEditingRole({name: 'บทบาทใหม่'})} className="shadow-md bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus size={18} className="mr-2" /> สร้างบทบาทใหม่
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_ROLES.map((role) => (
          <div key={role.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className={role.isSystem ? 'text-rose-500' : 'text-blue-500'} size={24} />
                <h4 className="font-bold text-slate-800">{role.name}</h4>
              </div>
              {role.isSystem && (
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase">System Default</span>
              )}
            </div>
            <p className="text-sm text-slate-500 mb-6 flex-1">{role.description}</p>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border-slate-200"
                onClick={() => handleEditRole(role)}
              >
                <Key size={14} className="mr-1.5" /> จัดการสิทธิ์
              </Button>
              {!role.isSystem && (
                <Button variant="outline" size="sm" className="text-slate-400 hover:text-rose-700 hover:bg-rose-50 border-slate-200" onClick={() => Swal.fire('ยืนยันลบ', 'ต้องการลบบทบาทนี้หรือไม่?', 'warning')}>
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function AssignRoles() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-700">มอบหมายบทบาทให้บุคลากร</h3>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input placeholder="ค้นหาชื่อครู..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-slate-50" />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="text-slate-400" size={20} />
          <select className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700">
            <option value="ทั้งหมด">บทบาท (ทั้งหมด)</option>
            {MOCK_ROLES.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">ชื่อ-นามสกุล บุคลากร</th>
              <th className="px-6 py-4 font-bold">กลุ่มสาระ/ฝ่าย</th>
              <th className="px-6 py-4 font-bold">บทบาทในระบบ</th>
              <th className="px-6 py-4 font-bold text-right">เปลี่ยนบทบาท</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TEACHER_ROLES.map((t) => (
              <tr key={t.id} className="bg-white border-b border-slate-100">
                <td className="px-6 py-4 font-medium text-slate-900">{t.teacherName}</td>
                <td className="px-6 py-4">{t.department}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                    t.role.includes('Admin') ? 'bg-amber-100 text-amber-800' :
                    t.role.includes('แอดมิน') ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {t.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select defaultValue={t.role} className="p-1.5 border border-slate-200 rounded-md text-sm bg-slate-50 outline-none focus:border-emerald-500">
                    {MOCK_ROLES.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
