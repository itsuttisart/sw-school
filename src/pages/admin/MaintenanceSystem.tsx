import { FormEvent, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Plus, Search, Trash2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { readLocalData, writeLocalData } from '@/lib/localData';
import Swal from 'sweetalert2';

type RepairStatus = 'pending' | 'in_progress' | 'completed';
type Repair = { id: string; title: string; location: string; date: string; status: RepairStatus; reporter: string; description: string };
const STORAGE_KEY = 'sw-school:maintenance';
const INITIAL_REPAIRS: Repair[] = [
  { id: 'R001', title: 'หลอดไฟหน้าห้อง ม.1/1 ขาด', location: 'อาคาร 1 ชั้น 2', date: '2026-09-10', status: 'pending', reporter: 'นาย สมชาย (ครู)', description: 'หลอดไฟดับ ต้องเปลี่ยนใหม่' },
  { id: 'R002', title: 'แอร์ห้องคอมพิวเตอร์ 3 ไม่เย็น', location: 'อาคาร 2 ชั้น 3', date: '2026-09-09', status: 'in_progress', reporter: 'นางสาว สมหญิง (ครู)', description: 'เครื่องปรับอากาศทำงานแต่ไม่เย็น' },
  { id: 'R003', title: 'ก๊อกน้ำอ่างล้างมือหัก', location: 'โรงอาหาร', date: '2026-09-08', status: 'completed', reporter: 'ด.ช. เก่งกาจ (นักเรียน)', description: 'เปลี่ยนก๊อกน้ำเรียบร้อยแล้ว' }
];

export function AdminMaintenance() {
  const [repairs, setRepairs] = useState(() => readLocalData(STORAGE_KEY, INITIAL_REPAIRS));
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ title: '', location: '', reporter: '', description: '' });

  useEffect(() => {
    if (!writeLocalData(STORAGE_KEY, repairs)) Swal.fire('บันทึกไม่สำเร็จ', 'พื้นที่จัดเก็บในเบราว์เซอร์อาจเต็ม', 'error');
  }, [repairs]);

  const createRepair = (event: FormEvent) => {
    event.preventDefault();
    setRepairs(current => [{ ...draft, id: `R-${Date.now()}`, date: new Date().toISOString().slice(0, 10), status: 'pending' }, ...current]);
    setDraft({ title: '', location: '', reporter: '', description: '' });
    setShowForm(false);
  };

  const changeStatus = async (repair: Repair) => {
    const result = await Swal.fire({ title: `อัปเดต ${repair.id}`, input: 'select', inputOptions: { pending: 'รอดำเนินการ', in_progress: 'กำลังดำเนินการ', completed: 'เสร็จสิ้น' }, inputValue: repair.status, inputLabel: 'สถานะงานซ่อม', showCancelButton: true, confirmButtonText: 'บันทึก', cancelButtonText: 'ยกเลิก' });
    if (result.isConfirmed) setRepairs(current => current.map(item => item.id === repair.id ? { ...item, status: result.value as RepairStatus } : item));
  };

  const deleteRepair = async (repair: Repair) => {
    const result = await Swal.fire({ title: 'ลบใบแจ้งซ่อม?', text: repair.title, icon: 'warning', showCancelButton: true, confirmButtonText: 'ลบ', cancelButtonText: 'ยกเลิก' });
    if (result.isConfirmed) setRepairs(current => current.filter(item => item.id !== repair.id));
  };

  const statusLabel = (status: RepairStatus) => status === 'completed' ? 'เสร็จสิ้น' : status === 'in_progress' ? 'กำลังดำเนินการ' : 'รอดำเนินการ';
  const filtered = repairs.filter(item => `${item.id} ${item.title} ${item.location} ${item.reporter}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:rounded-3xl md:p-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 md:text-2xl"><Wrench className="text-blue-600" /> ระบบแจ้งซ่อมแซม</h2><p className="mt-1 text-sm text-slate-500">สร้างใบแจ้ง ติดตามสถานะ และจัดการงานซ่อม</p></div><Button type="button" onClick={() => setShowForm(value => !value)}><Plus size={18} className="mr-2" />แจ้งซ่อมใหม่</Button></header>
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">{([['ทั้งหมด', repairs.length, 'text-blue-700'], ['รอดำเนินการ', repairs.filter(item => item.status === 'pending').length, 'text-amber-700'], ['กำลังซ่อม', repairs.filter(item => item.status === 'in_progress').length, 'text-sky-700'], ['เสร็จสิ้น', repairs.filter(item => item.status === 'completed').length, 'text-emerald-700']] as const).map(([label, count, color]) => <div key={label} className="rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-500">{label}</p><p className={`mt-1 text-2xl font-bold ${color}`}>{count}</p></div>)}</div>
      {showForm && <form onSubmit={createRepair} className="mb-5 grid grid-cols-1 gap-3 rounded-xl border border-blue-200 bg-blue-50/40 p-4 sm:grid-cols-2"><label className="text-sm font-semibold">รายการที่ชำรุด<Input required value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} /></label><label className="text-sm font-semibold">สถานที่<Input required value={draft.location} onChange={event => setDraft({ ...draft, location: event.target.value })} /></label><label className="text-sm font-semibold">ผู้แจ้ง<Input required value={draft.reporter} onChange={event => setDraft({ ...draft, reporter: event.target.value })} /></label><label className="text-sm font-semibold">รายละเอียด<Input value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} /></label><div className="flex gap-2 sm:col-span-2"><Button type="submit">บันทึกใบแจ้ง</Button><Button type="button" variant="outline" onClick={() => setShowForm(false)}>ยกเลิก</Button></div></form>}
      <div className="relative mb-4 max-w-xl"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="ค้นหารหัส รายการ สถานที่ หรือผู้แจ้ง" className="pl-10" /></div>
      <div className="space-y-3">{filtered.map(repair => <article key={repair.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-slate-500">{repair.id} · {repair.date}</span><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${repair.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : repair.status === 'in_progress' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'}`}>{repair.status === 'completed' ? <CheckCircle size={14} /> : repair.status === 'in_progress' ? <Clock size={14} /> : <AlertTriangle size={14} />}{statusLabel(repair.status)}</span></div><h3 className="mt-2 font-bold text-slate-800">{repair.title}</h3><p className="text-sm text-slate-600">{repair.location} · ผู้แจ้ง {repair.reporter}</p>{repair.description && <p className="mt-1 text-sm text-slate-500">{repair.description}</p>}</div><div className="flex shrink-0 gap-2"><Button type="button" variant="outline" size="sm" onClick={() => void changeStatus(repair)}>เปลี่ยนสถานะ</Button><Button type="button" variant="ghost" size="icon" aria-label="ลบใบแจ้ง" onClick={() => void deleteRepair(repair)}><Trash2 size={16} /></Button></div></div></article>)}{filtered.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">ไม่พบใบแจ้งซ่อม</p>}</div>
    </section>
  );
}