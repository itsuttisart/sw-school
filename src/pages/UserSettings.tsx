import React, { useState } from 'react';
import { User } from '@/lib/types';
import { southProvinces } from '@/lib/addressData';
import { UserCircle, Lock, Save, Camera, Mail, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

export function UserSettings({ user, onUpdate }: { user: User, onUpdate?: (u: User) => void }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState(southProvinces[0].name);
  const [selectedDistrict, setSelectedDistrict] = useState(southProvinces[0].districts[0].name);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState(southProvinces[0].districts[0].subdistricts[0]);

  const handleSaveProfile = () => {
    Swal.fire({
      title: 'บันทึกสำเร็จ',
      text: 'ข้อมูลส่วนตัวของคุณได้รับการอัปเดตเรียบร้อยแล้ว',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleSavePassword = () => {
    Swal.fire({
      title: 'เปลี่ยนรหัสผ่านสำเร็จ',
      text: 'รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว กรุณาเข้าสู่ระบบใหม่ด้วยรหัสผ่านใหม่ในครั้งต่อไป',
      icon: 'success',
      confirmButtonColor: '#10b981'
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <UserCircle className="text-blue-500" /> ตั้งค่าบัญชีผู้ใช้
          </h2>
          <p className="text-slate-500 text-sm mt-1">จัดการข้อมูลส่วนตัวและรหัสผ่านของคุณ</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <UserCircle size={20} /> ข้อมูลส่วนตัว
          </button>
          <button 
            onClick={() => setActiveTab('password')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'password' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Lock size={20} /> เปลี่ยนรหัสผ่าน
          </button>
        </div>
        
        <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-100">
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-slate-800 mb-6">ข้อมูลส่วนตัว</h3>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-8 items-center sm:items-start">
                <div className="relative group">
                  <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-sm overflow-hidden">
                    {user.name.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-slate-800 text-white rounded-full shadow-md hover:bg-slate-700 transition-colors">
                    <Camera size={14} />
                  </button>
                </div>
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <h4 className="text-lg font-bold text-slate-800">{user.name}</h4>
                  <p className="text-slate-500 text-sm capitalize">บทบาท: {user.role}</p>
                  <p className="text-slate-500 text-sm">{user.username || 'example@email.com'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">ชื่อ-นามสกุล</label>
                  <Input defaultValue={user.name} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">อีเมล</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input defaultValue={user.username || 'example@email.com'} className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">เบอร์โทรศัพท์</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input defaultValue="089-123-4567" className="pl-10" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">ที่อยู่ปัจจุบัน</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">จังหวัด</label>
                      <select 
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedProvince}
                        onChange={(e) => {
                          setSelectedProvince(e.target.value);
                          const newProv = southProvinces.find(p => p.name === e.target.value);
                          if (newProv) {
                            setSelectedDistrict(newProv.districts[0].name);
                            setSelectedSubdistrict(newProv.districts[0].subdistricts[0]);
                          }
                        }}
                      >
                        {southProvinces.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">อำเภอ/เขต</label>
                      <select 
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedDistrict}
                        onChange={(e) => {
                          setSelectedDistrict(e.target.value);
                          const prov = southProvinces.find(p => p.name === selectedProvince);
                          const dist = prov?.districts.find(d => d.name === e.target.value);
                          if (dist) {
                            setSelectedSubdistrict(dist.subdistricts[0]);
                          }
                        }}
                      >
                        {southProvinces.find(p => p.name === selectedProvince)?.districts.map(d => (
                          <option key={d.name} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">ตำบล/แขวง</label>
                      <select 
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedSubdistrict}
                        onChange={(e) => setSelectedSubdistrict(e.target.value)}
                      >
                        {southProvinces.find(p => p.name === selectedProvince)
                          ?.districts.find(d => d.name === selectedDistrict)
                          ?.subdistricts.map(sd => (
                            <option key={sd} value={sd}>{sd}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
                    <textarea 
                      className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-h-[80px]" 
                      placeholder="รายละเอียดที่อยู่เพิ่มเติม เช่น บ้านเลขที่, หมู่, ถนน, ซอย..."
                      defaultValue="123/45 หมู่ 1"
                    />
                  </div>
                </div>
              </div>

              {user.role === 'teacher' && (
                <div className="mt-6 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">👨‍🏫 ผูกห้องเรียน (ครูที่ปรึกษา)</h4>
                  <p className="text-sm text-slate-500 mb-4">เลือกห้องเรียนที่คุณเป็นครูที่ปรึกษาเพื่อรับสิทธิ์ในการจัดการข้อมูลนักเรียน</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ระดับชั้น</label>
                      <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>มัธยมศึกษาปีที่ 1</option>
                        <option>มัธยมศึกษาปีที่ 2</option>
                        <option>มัธยมศึกษาปีที่ 3</option>
                        <option>มัธยมศึกษาปีที่ 4</option>
                        <option>มัธยมศึกษาปีที่ 5</option>
                        <option>มัธยมศึกษาปีที่ 6</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ห้อง</label>
                      <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>ห้อง 1</option>
                        <option>ห้อง 2</option>
                        <option>ห้อง 3</option>
                        <option>ห้อง 4</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {user.role === 'parent' && (
                <div className="mt-6 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">👨‍👩‍👦 ข้อมูลบุตร (นักเรียนในการดูแล)</h4>
                  <p className="text-sm text-slate-500 mb-4">ระบุรหัสนักเรียนของบุตรหลานเพื่อผูกบัญชีและติดตามผลการเรียน</p>
                  <div className="space-y-3">
                    {['65001', '66042'].map((childId, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            น.ร.
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">รหัสนักเรียน: {childId}</p>
                            <p className="text-xs text-slate-500">สถานะ: ยืนยันแล้ว</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 px-2">ลบ</Button>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <Input placeholder="กรอกรหัสนักเรียน 5 หลัก..." className="flex-1" />
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">เพิ่มบุตร</Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-end">
                <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  <Save size={18} className="mr-2" /> บันทึกข้อมูล
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="animate-in fade-in duration-300 max-w-md">
              <h3 className="text-xl font-bold text-slate-800 mb-6">เปลี่ยนรหัสผ่าน</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">รหัสผ่านปัจจุบัน</label>
                  <div className="relative">
                    <Input type={showCurrent ? "text" : "password"} placeholder="••••••••" className="pr-10" />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowCurrent(!showCurrent)}
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">รหัสผ่านใหม่</label>
                  <div className="relative">
                    <Input type={showNew ? "text" : "password"} placeholder="••••••••" className="pr-10" />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowNew(!showNew)}
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">ยืนยันรหัสผ่านใหม่</label>
                  <div className="relative">
                    <Input type={showConfirm ? "text" : "password"} placeholder="••••••••" className="pr-10" />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button onClick={handleSavePassword} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  <Save size={18} className="mr-2" /> เปลี่ยนรหัสผ่าน
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
