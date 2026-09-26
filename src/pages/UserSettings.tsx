import React, { useState } from 'react';
import { User } from '@/lib/types';
import { southProvinces } from '@/lib/addressData';
import { UserCircle, Lock, Save, Camera, Mail, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { setUserPassword, verifyUserPassword } from '@/lib/authStore';
import Swal from 'sweetalert2';

export function UserSettings({ user, onUpdate }: { user: User, onUpdate?: (u: User) => void }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || ''
  });
  const [avatar, setAvatar] = useState(user.avatar || '');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const initialProvince = southProvinces.find(province => province.name === user.province) || southProvinces[0];
  const initialDistrict = initialProvince.districts.find(district => district.name === user.district) || initialProvince.districts[0];
  const [selectedProvince, setSelectedProvince] = useState(initialProvince.name);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict.name);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState(
    initialDistrict.subdistricts.includes(user.subdistrict || '') ? user.subdistrict! : initialDistrict.subdistricts[0]
  );

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      Swal.fire('เลือกรูปไม่ได้', 'รองรับไฟล์รูปภาพขนาดไม่เกิน 5 MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => Swal.fire('อ่านรูปไม่ได้', 'กรุณาลองเลือกไฟล์อื่น', 'error');
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => Swal.fire('อ่านรูปไม่ได้', 'กรุณาลองเลือกไฟล์อื่น', 'error');
      image.onload = () => {
        const scale = Math.min(1, 512 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        if (!context) return;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        setAvatar(canvas.toDataURL('image/jpeg', 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      ...profileForm,
      name: profileForm.name.trim(),
      avatar: avatar || undefined,
      province: selectedProvince,
      district: selectedDistrict,
      subdistrict: selectedSubdistrict
    };
    if (!updatedUser.name) {
      Swal.fire('ข้อมูลไม่ครบ', 'กรุณากรอกชื่อ-นามสกุล', 'warning');
      return;
    }
    onUpdate?.(updatedUser);
    Swal.fire({
      title: 'บันทึกสำเร็จ',
      text: 'ข้อมูลส่วนตัวของคุณได้รับการอัปเดตเรียบร้อยแล้ว',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleSavePassword = async () => {
    if (isSavingPassword) return;
    if (!await verifyUserPassword(user.id, currentPassword)) {
      Swal.fire('รหัสผ่านไม่ถูกต้อง', 'กรุณาตรวจสอบรหัสผ่านปัจจุบันแล้วลองอีกครั้ง', 'error');
      return;
    }
    if (newPassword.length < 12) {
      Swal.fire('รหัสผ่านยังไม่ปลอดภัยพอ', 'รหัสผ่านใหม่ต้องมีอย่างน้อย 12 ตัวอักษร', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire('ยืนยันรหัสผ่านไม่ตรงกัน', 'กรุณากรอกรหัสผ่านใหม่ทั้งสองช่องให้ตรงกัน', 'warning');
      return;
    }
    if (newPassword === currentPassword) {
      Swal.fire('รหัสผ่านซ้ำเดิม', 'กรุณาเลือกรหัสผ่านใหม่ที่ต่างจากรหัสปัจจุบัน', 'warning');
      return;
    }

    setIsSavingPassword(true);
    try {
      await setUserPassword(user.id, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      await Swal.fire({
        title: 'เปลี่ยนรหัสผ่านสำเร็จ',
        text: 'ใช้รหัสผ่านใหม่ในการเข้าสู่ระบบครั้งถัดไป',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
    } catch {
      Swal.fire('เปลี่ยนรหัสผ่านไม่สำเร็จ', 'ไม่สามารถบันทึกข้อมูลในอุปกรณ์นี้ได้ กรุณาลองใหม่', 'error');
    } finally {
      setIsSavingPassword(false);
    }
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
                    {avatar ? <img src={avatar} alt="รูปโปรไฟล์" className="h-full w-full object-cover" /> : user.name.charAt(0)}
                  </div>
                  <label title="อัปโหลดรูปโปรไฟล์" className="absolute bottom-0 right-0 cursor-pointer p-2 bg-slate-800 text-white rounded-full shadow-md hover:bg-slate-700 transition-colors">
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="sr-only" />
                    <Camera size={14} />
                  </label>
                </div>
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <h4 className="text-lg font-bold text-slate-800">{user.name}</h4>
                  <p className="text-slate-500 text-sm capitalize">บทบาท: {user.role}</p>
                  <p className="text-slate-500 text-sm">{user.email || user.username || 'ยังไม่ได้เพิ่มอีเมล'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">ชื่อ-นามสกุล</label>
                    <Input value={profileForm.name} onChange={event => setProfileForm({ ...profileForm, name: event.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">อีเมล</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input type="email" value={profileForm.email} onChange={event => setProfileForm({ ...profileForm, email: event.target.value })} className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">เบอร์โทรศัพท์</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input type="tel" value={profileForm.phone} onChange={event => setProfileForm({ ...profileForm, phone: event.target.value })} className="pl-10" />
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
                      className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-h-20"
                      placeholder="รายละเอียดที่อยู่เพิ่มเติม เช่น บ้านเลขที่, หมู่, ถนน, ซอย..."
                      value={profileForm.address}
                      onChange={event => setProfileForm({ ...profileForm, address: event.target.value })}
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
                    <Input type={showCurrent ? "text" : "password"} autoComplete="current-password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} placeholder="รหัสผ่านปัจจุบัน" className="pr-10" />
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
                    <Input type={showNew ? "text" : "password"} autoComplete="new-password" value={newPassword} onChange={event => setNewPassword(event.target.value)} placeholder="อย่างน้อย 12 ตัวอักษร" className="pr-10" />
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
                    <Input type={showConfirm ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="ยืนยันรหัสผ่านใหม่" className="pr-10" />
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
                <Button type="button" onClick={handleSavePassword} disabled={isSavingPassword} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
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
