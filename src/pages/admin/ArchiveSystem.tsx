import { ChangeEvent, useEffect, useState } from 'react';
import { Archive, Download, File, Folder, Search, Trash2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { readLocalData, writeLocalData } from '@/lib/localData';
import Swal from 'sweetalert2';

type ArchivedFile = { id: string; name: string; category: string; size: number; type: string; addedAt: string; data: string };
const STORAGE_KEY = 'sw-school:archive-files';
const CATEGORIES = ['แผนปฏิบัติการประจำปี', 'หลักสูตรสถานศึกษา', 'รายงานการประเมินตนเอง (SAR)', 'รูปภาพกิจกรรม', 'อื่น ๆ'];

export function AdminArchiveSystem() {
  const [files, setFiles] = useState(() => readLocalData<ArchivedFile[]>(STORAGE_KEY, []));
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ทั้งหมด');
  const [uploadCategory, setUploadCategory] = useState(CATEGORIES[0]);

  useEffect(() => {
    if (!writeLocalData(STORAGE_KEY, files)) Swal.fire('บันทึกไม่สำเร็จ', 'พื้นที่จัดเก็บในเบราว์เซอร์อาจเต็ม กรุณาลบไฟล์เก่าก่อน', 'error');
  }, [files]);

  const uploadFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []) as File[];
    event.target.value = '';
    selected.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('ข้ามไฟล์ขนาดใหญ่', `${file.name} เกินขนาด 2 MB`, 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => Swal.fire('อ่านไฟล์ไม่สำเร็จ', file.name, 'error');
      reader.onload = () => setFiles(current => [{ id: crypto.randomUUID(), name: file.name, category: uploadCategory, size: file.size, type: file.type, addedAt: new Date().toISOString(), data: String(reader.result) }, ...current]);
      reader.readAsDataURL(file);
    });
  };

  const removeFile = async (file: ArchivedFile) => {
    const result = await Swal.fire({ title: 'ลบไฟล์จากคลัง?', text: file.name, icon: 'warning', showCancelButton: true, confirmButtonText: 'ลบไฟล์', cancelButtonText: 'ยกเลิก' });
    if (result.isConfirmed) setFiles(current => current.filter(item => item.id !== file.id));
  };

  const filtered = files.filter(file => (category === 'ทั้งหมด' || file.category === category) && `${file.name} ${file.category}`.toLowerCase().includes(search.toLowerCase()));
  const formatSize = (size: number) => size < 1024 * 1024 ? `${Math.max(1, Math.round(size / 1024))} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:rounded-3xl md:p-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 md:text-2xl"><Archive className="text-indigo-600" /> คลังเอกสารองค์กร</h2><p className="mt-1 text-sm text-slate-500">จัดเก็บ ค้นหา และดาวน์โหลดเอกสารตามหมวดหมู่</p></div><div className="flex flex-wrap items-center gap-2"><select value={uploadCategory} onChange={event => setUploadCategory(event.target.value)} aria-label="หมวดหมู่ไฟล์ที่จะอัปโหลด" className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm sm:flex-none">{CATEGORIES.map(item => <option key={item}>{item}</option>)}</select><label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white hover:bg-indigo-700"><UploadCloud size={17} className="mr-2" />อัปโหลดไฟล์<input type="file" multiple onChange={uploadFiles} className="sr-only" /></label></div></header>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{CATEGORIES.slice(0, 4).map((item, index) => <button type="button" key={item} onClick={() => setCategory(category === item ? 'ทั้งหมด' : item)} className={`rounded-xl border p-3 text-left transition-colors ${category === item ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}><Folder size={22} className="mb-2 text-amber-500" /><span className="block text-xs font-semibold text-slate-700">{item}</span><span className="mt-1 block text-xs text-slate-500">{files.filter(file => file.category === item).length} ไฟล์</span></button>)}</div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="ค้นหาชื่อไฟล์หรือหมวดหมู่" className="pl-10" /></div><select value={category} onChange={event => setCategory(event.target.value)} aria-label="กรองหมวดหมู่" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>ทั้งหมด</option>{CATEGORIES.map(item => <option key={item}>{item}</option>)}</select></div>
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">{filtered.map(file => <article key={file.id} className="flex items-center gap-3 p-3 sm:p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><File size={19} /></div><div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-800">{file.name}</p><p className="text-xs text-slate-500">{file.category} · {formatSize(file.size)} · {new Date(file.addedAt).toLocaleDateString('th-TH')}</p></div><a href={file.data} download={file.name} aria-label={`ดาวน์โหลด ${file.name}`} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"><Download size={17} /></a><Button type="button" variant="ghost" size="icon" aria-label={`ลบ ${file.name}`} onClick={() => void removeFile(file)}><Trash2 size={16} /></Button></article>)}{filtered.length === 0 && <div className="p-10 text-center text-sm text-slate-500">ยังไม่มีไฟล์ในหมวดนี้ · อัปโหลดได้สูงสุด 2 MB ต่อไฟล์</div>}</div>
    </section>
  );
}