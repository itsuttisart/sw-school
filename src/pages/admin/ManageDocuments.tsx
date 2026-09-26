import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Download, FileText, Paperclip, Plus, Search, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { readLocalData, writeLocalData } from '@/lib/localData';
import Swal from 'sweetalert2';

type DocumentType = 'หนังสือรับเข้า' | 'หนังสือส่งออก';
type DocumentRecord = { id: string; docNo: string; title: string; type: DocumentType; date: string; status: string; attachmentName?: string; attachmentData?: string };
const STORAGE_KEY = 'sw-school:documents';
const INITIAL_DOCS: DocumentRecord[] = [
  { id: 'd1', docNo: 'ศธ 0401/123', title: 'ขอเชิญประชุมผู้ปกครอง', type: 'หนังสือส่งออก', date: '2026-09-01', status: 'ดำเนินการแล้ว' },
  { id: 'd2', docNo: 'ศธ 0401/124', title: 'แจ้งการหยุดเรียนกรณีพิเศษ', type: 'หนังสือส่งออก', date: '2026-09-03', status: 'ดำเนินการแล้ว' },
  { id: 'd3', docNo: 'สพฐ 001/45', title: 'นโยบายการจัดการศึกษาใหม่', type: 'หนังสือรับเข้า', date: '2026-09-04', status: 'รอการลงนาม' }
];

export function AdminManageDocuments() {
  const [docs, setDocs] = useState(() => readLocalData(STORAGE_KEY, INITIAL_DOCS));
  const [search, setSearch] = useState('');
  const [draftType, setDraftType] = useState<DocumentType | null>(null);
  const [draft, setDraft] = useState({ docNo: '', title: '', status: 'รอดำเนินการ', attachmentName: '', attachmentData: '' });

  useEffect(() => {
    if (!writeLocalData(STORAGE_KEY, docs)) Swal.fire('บันทึกไม่สำเร็จ', 'ไฟล์หรือข้อมูลเอกสารใช้พื้นที่จัดเก็บมากเกินไป', 'error');
  }, [docs]);

  const readAttachment = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('ไฟล์มีขนาดใหญ่เกินไป', 'แนบไฟล์ได้ไม่เกิน 2 MB ในระบบตัวอย่างนี้', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => Swal.fire('อ่านไฟล์ไม่สำเร็จ', 'กรุณาลองเลือกไฟล์ใหม่', 'error');
    reader.onload = () => setDraft(current => ({ ...current, attachmentName: file.name, attachmentData: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const saveDocument = (event: FormEvent) => {
    event.preventDefault();
    if (!draftType) return;
    if (docs.some(document => document.docNo.trim().toLowerCase() === draft.docNo.trim().toLowerCase())) {
      Swal.fire('เลขที่หนังสือซ้ำ', 'กรุณาตรวจสอบเลขที่หนังสือ', 'warning');
      return;
    }
    setDocs(current => [{ ...draft, id: crypto.randomUUID(), docNo: draft.docNo.trim(), title: draft.title.trim(), type: draftType, date: new Date().toISOString().slice(0, 10) }, ...current]);
    setDraft({ docNo: '', title: '', status: 'รอดำเนินการ', attachmentName: '', attachmentData: '' });
    setDraftType(null);
  };

  const updateStatus = (id: string, status: string) => setDocs(current => current.map(document => document.id === id ? { ...document, status } : document));
  const removeDocument = async (document: DocumentRecord) => {
    const result = await Swal.fire({ title: 'ลบรายการหนังสือ?', text: `${document.docNo} ${document.title}`, icon: 'warning', showCancelButton: true, confirmButtonText: 'ลบรายการ', cancelButtonText: 'ยกเลิก' });
    if (result.isConfirmed) setDocs(current => current.filter(item => item.id !== document.id));
  };

  const filtered = docs.filter(document => `${document.docNo} ${document.title} ${document.type} ${document.status}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:rounded-3xl md:p-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 md:text-2xl"><FileText className="text-amber-500" /> ระบบสารบรรณอิเล็กทรอนิกส์</h2><p className="mt-1 text-sm text-slate-500">ทะเบียนรับ-ส่งหนังสือ พร้อมสถานะและไฟล์แนบ</p></div><div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => setDraftType('หนังสือรับเข้า')}><Download size={17} className="mr-2" />ลงทะเบียนรับ</Button><Button type="button" onClick={() => setDraftType('หนังสือส่งออก')}><Send size={17} className="mr-2" />สร้างหนังสือส่ง</Button></div></header>
      {draftType && <form onSubmit={saveDocument} className="mb-5 grid grid-cols-1 gap-3 rounded-xl border border-amber-200 bg-amber-50/40 p-4 sm:grid-cols-2"><h3 className="font-bold text-slate-800 sm:col-span-2">{draftType}</h3><label className="text-sm font-semibold">เลขที่หนังสือ<Input required value={draft.docNo} onChange={event => setDraft({ ...draft, docNo: event.target.value })} /></label><label className="text-sm font-semibold">สถานะ<select value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value })} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3"><option>รอดำเนินการ</option><option>รอการลงนาม</option><option>ดำเนินการแล้ว</option></select></label><label className="text-sm font-semibold sm:col-span-2">เรื่อง<Input required value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} /></label><label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2"><Paperclip size={16} /><span>ไฟล์แนบ (ไม่เกิน 2 MB)</span><input type="file" onChange={readAttachment} className="max-w-full text-sm" /></label>{draft.attachmentName && <p className="text-xs text-slate-500 sm:col-span-2">แนบ: {draft.attachmentName}</p>}<div className="flex gap-2 sm:col-span-2"><Button type="submit">บันทึกหนังสือ</Button><Button type="button" variant="outline" onClick={() => setDraftType(null)}>ยกเลิก</Button></div></form>}
      <div className="relative mb-4 max-w-xl"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="ค้นหาเลขที่หนังสือ เรื่อง หรือสถานะ" className="pl-10" /></div>
      <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-180 text-left text-sm text-slate-600"><thead className="bg-slate-50 text-xs text-slate-700"><tr><th className="px-4 py-3">เลขที่ / เรื่อง</th><th className="px-4 py-3">ประเภท</th><th className="px-4 py-3">วันที่</th><th className="px-4 py-3">สถานะ</th><th className="px-4 py-3 text-right">จัดการ</th></tr></thead><tbody>{filtered.map(document => <tr key={document.id} className="border-t border-slate-100"><td className="px-4 py-3"><p className="font-bold text-slate-800">{document.title}</p><p className="text-xs text-slate-500">{document.docNo}</p></td><td className="px-4 py-3">{document.type}</td><td className="px-4 py-3">{document.date}</td><td className="px-4 py-3"><select aria-label={`สถานะ ${document.docNo}`} value={document.status} onChange={event => updateStatus(document.id, event.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1"><option>รอดำเนินการ</option><option>รอการลงนาม</option><option>ดำเนินการแล้ว</option></select></td><td className="px-4 py-3"><div className="flex justify-end gap-1">{document.attachmentData && <a href={document.attachmentData} download={document.attachmentName} aria-label={`ดาวน์โหลด ${document.attachmentName}`} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"><Download size={16} /></a>}<Button type="button" variant="ghost" size="icon" aria-label={`ลบ ${document.docNo}`} onClick={() => void removeDocument(document)}><Trash2 size={16} /></Button></div></td></tr>)}{filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">ไม่พบรายการหนังสือ</td></tr>}</tbody></table></div>
    </section>
  );
}