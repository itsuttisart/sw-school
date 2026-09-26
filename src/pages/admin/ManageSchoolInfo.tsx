import { ChangeEvent, FormEvent, useState } from 'react';
import { Building2, ImagePlus, MapPin, Save, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { readLocalData, writeLocalData } from '@/lib/localData';
import Swal from 'sweetalert2';

type SchoolInfo = { code: string; name: string; shortName: string; nameEn: string; shortNameEn: string; phone: string; email: string; addressNo: string; moo: string; subdistrict: string; district: string; province: string; postalCode: string; location: string; logo: string; printLogo: string };
const STORAGE_KEY = 'sw-school:school-info';
const DEFAULT_INFO: SchoolInfo = { code: '1010010001', name: 'โรงเรียนตัวอย่างวิทยา', shortName: 'ต.ย.ว.', nameEn: 'Sample Wittaya School', shortNameEn: 'S.W.S.', phone: '02-123-4567', email: 'info@school.ac.th', addressNo: '123', moo: '1', subdistrict: 'บางรัก', district: 'บางรัก', province: 'กรุงเทพมหานคร', postalCode: '10500', location: '13.730248, 100.523450', logo: '', printLogo: '' };
const PROVINCES = ['กรุงเทพมหานคร', 'ยะลา', 'ปัตตานี', 'นราธิวาส', 'สงขลา', 'สตูล', 'สมุทรปราการ'];

export function AdminManageSchoolInfo() {
  const [savedInfo, setSavedInfo] = useState(() => readLocalData(STORAGE_KEY, DEFAULT_INFO));
  const [form, setForm] = useState(savedInfo);
  const [isEditing, setIsEditing] = useState(false);

  const update = (field: keyof SchoolInfo, value: string) => setForm(current => ({ ...current, [field]: value }));
  const uploadLogo = (field: 'logo' | 'printLogo', event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 1_500_000) {
      Swal.fire('เลือกภาพไม่ได้', 'รองรับไฟล์ภาพขนาดไม่เกิน 1.5 MB', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => Swal.fire('อ่านภาพไม่สำเร็จ', 'กรุณาเลือกไฟล์อื่น', 'error');
    reader.onload = () => update(field, String(reader.result));
    reader.readAsDataURL(file);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      Swal.fire('ข้อมูลไม่ครบ', 'กรุณากรอกรหัสและชื่อโรงเรียน', 'warning');
      return;
    }
    const confirmation = await Swal.fire({ title: 'บันทึกข้อมูลโรงเรียน?', icon: 'question', showCancelButton: true, confirmButtonText: 'บันทึก', cancelButtonText: 'ยกเลิก' });
    if (!confirmation.isConfirmed) return;
    const normalized = { ...form, name: form.name.trim(), code: form.code.trim() };
    if (!writeLocalData(STORAGE_KEY, normalized)) {
      Swal.fire('บันทึกไม่สำเร็จ', 'ข้อมูลหรือรูปโลโก้ใช้พื้นที่จัดเก็บมากเกินไป กรุณาใช้ภาพขนาดเล็กลง', 'error');
      return;
    }
    setSavedInfo(normalized);
    setForm(normalized);
    setIsEditing(false);
    Swal.fire({ title: 'บันทึกสำเร็จ', icon: 'success', timer: 1300, showConfirmButton: false });
  };

  const cancel = () => { setForm(savedInfo); setIsEditing(false); };
  const field = (label: string, key: keyof SchoolInfo, options: { type?: string; wide?: boolean } = {}) => (
    <label className={`block text-sm font-medium text-slate-700 ${options.wide ? 'md:col-span-2' : ''}`}>{label}<Input type={options.type || 'text'} value={form[key]} readOnly={!isEditing} onChange={event => update(key, event.target.value)} className={!isEditing ? 'bg-slate-50 text-slate-600' : ''} /></label>
  );

  const logoEditor = (fieldName: 'logo' | 'printLogo', title: string) => (
    <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-bold text-slate-700">{title}</h3>
      <div className="mb-3 flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-2">{form[fieldName] ? <img src={form[fieldName]} alt={title} className="h-full w-full object-contain" /> : <Building2 size={44} className="text-slate-300" />}</div>
      {isEditing && <div className="flex gap-2"><label className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-100"><Upload size={14} className="mr-2" />เลือกรูป<input type="file" accept="image/*" onChange={event => uploadLogo(fieldName, event)} className="sr-only" /></label>{form[fieldName] && <Button type="button" variant="ghost" size="icon" aria-label={`ลบ${title}`} onClick={() => update(fieldName, '')}><X size={16} /></Button>}</div>}
    </div>
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:rounded-3xl md:p-8">
      <header className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 md:text-2xl"><Building2 className="text-emerald-600" /> ข้อมูลโรงเรียน</h2><p className="mt-1 text-sm text-slate-500">ข้อมูลติดต่อ ที่อยู่ และตราสัญลักษณ์</p></div>{!isEditing && <Button type="button" onClick={() => setIsEditing(true)}>แก้ไขข้อมูล</Button>}</header>
      <form onSubmit={save} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{logoEditor('logo', 'ตราสัญลักษณ์โรงเรียน')}{logoEditor('printLogo', 'ตราสัญลักษณ์สำหรับพิมพ์')}</div>
        {isEditing && <p className="-mt-3 flex items-center gap-1 text-xs text-slate-500"><ImagePlus size={14} />ไฟล์ภาพต้องมีขนาดไม่เกิน 1.5 MB</p>}
        <section><h3 className="mb-3 border-b border-slate-100 pb-2 font-bold text-slate-800">ข้อมูลทั่วไป</h3><div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{field('รหัสสถานศึกษา', 'code')}{field('ชื่อโรงเรียน', 'name', { wide: true })}{field('ชื่อย่อ', 'shortName')}{field('ชื่อโรงเรียน (ภาษาอังกฤษ)', 'nameEn', { wide: true })}{field('ชื่อย่อ (ภาษาอังกฤษ)', 'shortNameEn')}</div></section>
        <section><h3 className="mb-3 border-b border-slate-100 pb-2 font-bold text-slate-800">ข้อมูลติดต่อและที่อยู่</h3><div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{field('เบอร์โทรศัพท์หลัก', 'phone', { type: 'tel' })}{field('อีเมล', 'email', { type: 'email' })}{field('บ้านเลขที่', 'addressNo')}{field('หมู่', 'moo')}{field('ตำบล/แขวง', 'subdistrict')}{field('อำเภอ/เขต', 'district')}<label className="block text-sm font-medium text-slate-700">จังหวัด<select disabled={!isEditing} value={form.province} onChange={event => update('province', event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-50 disabled:text-slate-600">{PROVINCES.map(province => <option key={province}>{province}</option>)}</select></label>{field('รหัสไปรษณีย์', 'postalCode')}
          <label className="block text-sm font-medium text-slate-700 md:col-span-2 lg:col-span-3">ที่ตั้ง (ลิงก์ Google Maps หรือพิกัด)<div className="relative"><MapPin size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input value={form.location} readOnly={!isEditing} onChange={event => update('location', event.target.value)} className={`pl-10 ${!isEditing ? 'bg-slate-50 text-slate-600' : ''}`} /></div></label></div></section>
        {isEditing && <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={cancel}>ยกเลิก</Button><Button type="submit"><Save size={17} className="mr-2" />บันทึกข้อมูล</Button></div>}
      </form>
    </section>
  );
}