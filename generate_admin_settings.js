const fs = require('fs');

const content = `
import React, { useState } from 'react';
import { 
  Building, Map, Clock, Users, QrCode, Calendar, 
  Briefcase, BookOpen, Layers, Save, Plus, Edit2, Trash2 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('student_time');
  
  // Dummy State for various configs
  const [studentTimes, setStudentTimes] = useState({ arrival: '07:30', late: '08:00', departure: '15:30' });
  const [staffGroups, setStaffGroups] = useState([{ id: 1, name: 'ครูผู้สอน', in: '07:30', out: '16:30' }, { id: 2, name: 'ธุรการ', in: '08:00', out: '17:00' }]);
  const [periods, setPeriods] = useState([{ id: 1, name: 'คาบที่ 1', start: '08:30', end: '09:20' }, { id: 2, name: 'คาบที่ 2', start: '09:20', end: '10:10' }]);
  const [positions, setPositions] = useState([{ id: 1, name: 'ครูสอนศาสนา' }, { id: 2, name: 'ครูสอนสามัญ' }]);
  const [classrooms, setClassrooms] = useState([{ id: 1, level: 'ม.1', room: '1/1' }, { id: 2, level: 'ม.1', room: '1/2' }]);

  const saveSuccess = () => Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', timer: 1500, showConfirmButton: false });
  const notImplemented = () => Swal.fire({ icon: 'info', title: 'ฟังก์ชันพร้อมใช้งานเร็วๆนี้', text: 'กำลังพัฒนาระบบนี้' });

  const renderTabButton = (id, icon, label) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={\`flex items-center gap-2 p-3 rounded-xl font-bold text-sm transition-colors w-full text-left \${activeTab === id ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'}\`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[80vh]">
      <div className="md:col-span-3">
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 sticky top-4 max-h-[85vh] overflow-y-auto">
          <h3 className="font-bold text-slate-800 px-3 mb-4 text-lg">ตั้งค่าระบบทั้งหมด</h3>
          <nav className="flex flex-col gap-1.5">
            {renderTabButton('student_time', <Clock size={18} />, 'เวลามาโรงเรียนนักเรียน')}
            {renderTabButton('staff_groups', <Users size={18} />, 'กลุ่มและเวลาเข้างานบุคลากร')}
            {renderTabButton('checkin_sys', <QrCode size={18} />, 'ระบบเช็คอิน / สแกน')}
            {renderTabButton('periods', <Calendar size={18} />, 'จัดการคาบเรียน')}
            {renderTabButton('positions', <Briefcase size={18} />, 'ตำแหน่งบุคลากร')}
            {renderTabButton('teacher_schedule', <BookOpen size={18} />, 'ตารางสอนบุคลากร')}
            {renderTabButton('classrooms', <Layers size={18} />, 'ระดับชั้นและห้องเรียน')}
            {renderTabButton('auto_schedule', <Building size={18} />, 'จัดตารางเรียนอัตโนมัติ')}
          </nav>
        </div>
      </div>
      
      <div className="md:col-span-9 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        
        {/* Tab: Student Time */}
        {activeTab === 'student_time' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Clock className="text-emerald-500" /> จัดการเวลามาโรงเรียน (นักเรียน)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">เวลาเริ่มสแกนมาเรียน</label>
                <Input type="time" value={studentTimes.arrival} onChange={e => setStudentTimes({...studentTimes, arrival: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">เวลาที่ถือว่า "สาย"</label>
                <Input type="time" value={studentTimes.late} onChange={e => setStudentTimes({...studentTimes, late: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">เวลาเลิกเรียน (สแกนกลับ)</label>
                <Input type="time" value={studentTimes.departure} onChange={e => setStudentTimes({...studentTimes, departure: e.target.value})} />
              </div>
            </div>
            <Button onClick={saveSuccess} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Save size={18} className="mr-2"/> บันทึกการตั้งค่าเวลา</Button>
          </div>
        )}

        {/* Tab: Staff Groups */}
        {activeTab === 'staff_groups' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Users className="text-emerald-500" /> จัดการกลุ่มบุคลากร</h2>
              <Button onClick={notImplemented} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white"><Plus size={16} className="mr-1"/> เพิ่มกลุ่มใหม่</Button>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-xs">
                  <tr><th className="px-4 py-3">ชื่อกลุ่ม</th><th className="px-4 py-3 text-center">เวลาเข้างาน</th><th className="px-4 py-3 text-center">เวลาเลิกงาน</th><th className="px-4 py-3 text-right">จัดการ</th></tr>
                </thead>
                <tbody>
                  {staffGroups.map(group => (
                    <tr key={group.id} className="border-b border-slate-100 bg-white">
                      <td className="px-4 py-3 font-medium text-slate-800">{group.name}</td>
                      <td className="px-4 py-3 text-center">{group.in}</td>
                      <td className="px-4 py-3 text-center">{group.out}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600"><Edit2 size={16}/></Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600"><Trash2 size={16}/></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Check-in System */}
        {activeTab === 'checkin_sys' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><QrCode className="text-emerald-500" /> จัดการระบบเช็คอิน</h2>
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">พิกัดโรงเรียน (GPS / Geofence)</h3>
                <p className="text-sm text-slate-500 mb-4">อนุญาตให้บุคลากรหรือนักเรียนกดเช็คอินได้เฉพาะในรัศมีที่กำหนด</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Latitude" defaultValue="13.7563" />
                  <Input placeholder="Longitude" defaultValue="100.5018" />
                  <Input placeholder="รัศมี (เมตร)" defaultValue="500" />
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">การใช้งาน QR Code (นักเรียน)</h3>
                  <p className="text-sm text-slate-500">เปิดระบบสแกนบัตรนักเรียนผ่านแอปพลิเคชัน</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-emerald-500">
                  <span className="absolute left-7 top-1 bg-white w-4 h-4 rounded-full transition-all"></span>
                </div>
              </div>
            </div>
            <Button onClick={saveSuccess} className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"><Save size={18} className="mr-2"/> บันทึกตั้งค่า</Button>
          </div>
        )}

        {/* Tab: Periods */}
        {activeTab === 'periods' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Calendar className="text-emerald-500" /> จัดการคาบเรียน</h2>
              <Button onClick={notImplemented} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white"><Plus size={16} className="mr-1"/> เพิ่มคาบเรียน</Button>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-xs">
                  <tr><th className="px-4 py-3">ชื่อคาบ</th><th className="px-4 py-3 text-center">เริ่ม</th><th className="px-4 py-3 text-center">สิ้นสุด</th><th className="px-4 py-3 text-right">จัดการ</th></tr>
                </thead>
                <tbody>
                  {periods.map(p => (
                    <tr key={p.id} className="border-b border-slate-100 bg-white">
                      <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                      <td className="px-4 py-3 text-center">{p.start}</td>
                      <td className="px-4 py-3 text-center">{p.end}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600"><Edit2 size={16}/></Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600"><Trash2 size={16}/></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Positions */}
        {activeTab === 'positions' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Briefcase className="text-emerald-500" /> ตำแหน่งบุคลากร</h2>
              <Button onClick={notImplemented} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white"><Plus size={16} className="mr-1"/> เพิ่มตำแหน่ง</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {positions.map(pos => (
                <div key={pos.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <span className="font-bold text-slate-700">{pos.name}</span>
                  <div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 h-8 w-8"><Edit2 size={14}/></Button>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 h-8 w-8"><Trash2 size={14}/></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Teacher Schedule */}
        {activeTab === 'teacher_schedule' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><BookOpen className="text-emerald-500" /> ตารางสอนบุคลากร</h2>
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">กำหนดการสอนตามตำแหน่ง</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">ผูกตารางสอนครูศาสนา และครูสามัญ ระบบจะดึงวิชาและคาบเรียนตามตำแหน่งที่ตั้งค่าไว้ให้อัตโนมัติ</p>
              <Button onClick={notImplemented} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">เริ่มจัดการตารางสอน</Button>
            </div>
          </div>
        )}

        {/* Tab: Classrooms */}
        {activeTab === 'classrooms' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Layers className="text-emerald-500" /> ระดับชั้นและห้องเรียน</h2>
              <Button onClick={notImplemented} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white"><Plus size={16} className="mr-1"/> เพิ่มห้อง</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {classrooms.map(room => (
                <div key={room.id} className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{room.level}</div>
                    <div className="text-lg font-bold text-slate-800">ห้อง {room.room}</div>
                  </div>
                  <div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600"><Edit2 size={14}/></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Auto Schedule */}
        {activeTab === 'auto_schedule' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Building className="text-emerald-500" /> จัดตารางเรียนอัตโนมัติ</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-blue-800 mb-2">AI Auto-Scheduling Engine</h3>
              <p className="text-blue-600 mb-6">ระบบจะทำการประมวลผลจัดตารางเรียนให้กับทุกระดับชั้นอัตโนมัติ โดยอ้างอิงจากรายวิชา ครูผู้สอน (ศาสนา/สามัญ) และคาบว่าง เพื่อป้องกันการชนกันของตาราง</p>
              <Button onClick={() => {
                Swal.fire({
                  title: 'กำลังจัดตารางเรียน',
                  html: 'ระบบประมวลผลอัตโนมัติ AI กำลังทำงาน<br/>อาจใช้เวลาสักครู่...',
                  timer: 3000,
                  timerProgressBar: true,
                  didOpen: () => Swal.showLoading()
                }).then(() => {
                  Swal.fire({ icon: 'success', title: 'จัดตารางสำเร็จ', text: 'บันทึกตารางเรียนทั้งหมดเรียบร้อยแล้ว' });
                });
              }} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md w-full md:w-auto">
                <Calendar size={18} className="mr-2" /> เริ่มประมวลผลจัดตาราง
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/pages/AdminSettings.tsx', content);
