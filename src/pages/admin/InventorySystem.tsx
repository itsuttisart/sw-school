import { FormEvent, useEffect, useState } from 'react';
import { ArrowDownToLine, Box, Package, Pencil, Plus, Search, Trash2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { readLocalData, writeLocalData } from '@/lib/localData';
import Swal from 'sweetalert2';

type InventoryItem = { id: string; code: string; name: string; category: string; quantity: number; unit: string; location: string };
type StockMovement = { id: string; itemId: string; code: string; name: string; direction: 'issue' | 'return'; quantity: number; createdAt: string };
const STORAGE_KEY = 'sw-school:inventory';
const MOVEMENT_KEY = 'sw-school:inventory-movements';
const DEFAULT_ITEMS: InventoryItem[] = [
  { id: 'i-1', code: 'IT-66-001', name: 'โปรเจคเตอร์ Epson EB-X06', category: 'ครุภัณฑ์ไอที', quantity: 12, unit: 'เครื่อง', location: 'ห้องพัสดุ' },
  { id: 'i-2', code: 'SP-66-045', name: 'ลูกฟุตบอลมาตรฐาน มอก.', category: 'อุปกรณ์กีฬา', quantity: 0, unit: 'ลูก', location: 'ห้องพละ' }
];
const emptyItem = (): InventoryItem => ({ id: '', code: '', name: '', category: '', quantity: 0, unit: 'ชิ้น', location: '' });

export function AdminInventorySystem() {
  const [items, setItems] = useState(() => readLocalData(STORAGE_KEY, DEFAULT_ITEMS));
  const [movements, setMovements] = useState(() => readLocalData<StockMovement[]>(MOVEMENT_KEY, []));
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<InventoryItem | null>(null);

  useEffect(() => {
    if (!writeLocalData(STORAGE_KEY, items)) Swal.fire('บันทึกไม่สำเร็จ', 'พื้นที่จัดเก็บในเบราว์เซอร์อาจเต็ม', 'error');
  }, [items]);

  useEffect(() => {
    if (!writeLocalData(MOVEMENT_KEY, movements)) Swal.fire('บันทึกประวัติไม่สำเร็จ', 'พื้นที่จัดเก็บในเบราว์เซอร์อาจเต็ม', 'error');
  }, [movements]);

  const saveItem = (event: FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    const normalized = { ...draft, code: draft.code.trim(), name: draft.name.trim(), quantity: Math.max(0, Number(draft.quantity)) };
    const duplicate = items.some(item => item.code.toLowerCase() === normalized.code.toLowerCase() && item.id !== normalized.id);
    if (duplicate) {
      Swal.fire('รหัสซ้ำ', 'รหัสพัสดุนี้มีอยู่แล้ว', 'warning');
      return;
    }
    setItems(current => normalized.id ? current.map(item => item.id === normalized.id ? normalized : item) : [{ ...normalized, id: crypto.randomUUID() }, ...current]);
    setDraft(null);
  };

  const removeItem = async (item: InventoryItem) => {
    const result = await Swal.fire({ title: 'ลบรายการพัสดุ?', text: `${item.code} ${item.name}`, icon: 'warning', showCancelButton: true, confirmButtonText: 'ลบรายการ', cancelButtonText: 'ยกเลิก' });
    if (result.isConfirmed) setItems(current => current.filter(candidate => candidate.id !== item.id));
  };

  const moveStock = async (item: InventoryItem, direction: StockMovement['direction']) => {
    const isIssue = direction === 'issue';
    const result = await Swal.fire({
      title: isIssue ? `เบิก ${item.name}` : `รับคืน ${item.name}`,
      input: 'number', inputValue: 1, inputAttributes: { min: '1', ...(isIssue ? { max: String(item.quantity) } : {}) },
      inputLabel: `จำนวน (${item.unit}) · คงเหลือ ${item.quantity}`,
      inputValidator: value => !value || Number(value) < 1 ? 'กรุณาระบุจำนวนอย่างน้อย 1' : isIssue && Number(value) > item.quantity ? 'จำนวนเบิกเกินยอดคงเหลือ' : undefined,
      showCancelButton: true, confirmButtonText: isIssue ? 'ยืนยันเบิก' : 'ยืนยันรับคืน', cancelButtonText: 'ยกเลิก'
    });
    if (!result.isConfirmed) return;
    const quantity = Number(result.value);
    setItems(current => current.map(candidate => candidate.id === item.id ? { ...candidate, quantity: candidate.quantity + (isIssue ? -quantity : quantity) } : candidate));
    setMovements(current => [{ id: crypto.randomUUID(), itemId: item.id, code: item.code, name: item.name, direction, quantity, createdAt: new Date().toISOString() }, ...current].slice(0, 100));
  };

  const filtered = items.filter(item => `${item.code} ${item.name} ${item.category} ${item.location}`.toLowerCase().includes(search.toLowerCase()));
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:rounded-3xl md:p-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 md:text-2xl"><Package className="text-orange-500" /> ระบบพัสดุและครุภัณฑ์</h2><p className="mt-1 text-sm text-slate-500">ทะเบียนรายการและจำนวนคงเหลือ</p></div>
        <Button type="button" onClick={() => setDraft(emptyItem())}><Plus size={18} className="mr-2" />เพิ่มรายการ</Button>
      </header>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:max-w-lg">
        <div className="rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-500">รายการพัสดุ</p><p className="mt-1 text-2xl font-bold text-slate-800">{items.length}</p></div>
        <div className="rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-500">จำนวนคงเหลือรวม</p><p className="mt-1 text-2xl font-bold text-orange-600">{totalUnits}</p></div>
      </div>

      {draft && <form onSubmit={saveItem} className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-orange-200 bg-orange-50/50 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm font-semibold">รหัสพัสดุ<Input required value={draft.code} onChange={event => setDraft({ ...draft, code: event.target.value })} /></label>
        <label className="text-sm font-semibold">ชื่อรายการ<Input required value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} /></label>
        <label className="text-sm font-semibold">หมวดหมู่<Input required value={draft.category} onChange={event => setDraft({ ...draft, category: event.target.value })} /></label>
        <label className="text-sm font-semibold">จำนวน<Input required type="number" min="0" value={draft.quantity} onChange={event => setDraft({ ...draft, quantity: Number(event.target.value) })} /></label>
        <label className="text-sm font-semibold">หน่วย<Input required value={draft.unit} onChange={event => setDraft({ ...draft, unit: event.target.value })} /></label>
        <label className="text-sm font-semibold">สถานที่จัดเก็บ<Input value={draft.location} onChange={event => setDraft({ ...draft, location: event.target.value })} /></label>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-3"><Button type="submit">บันทึกรายการ</Button><Button type="button" variant="outline" onClick={() => setDraft(null)}>ยกเลิก</Button></div>
      </form>}

      <div className="relative mb-4 max-w-xl"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="ค้นหารหัส ชื่อ หรือหมวดหมู่" className="pl-10" /></div>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-197.5 text-left text-sm text-slate-600"><thead className="bg-slate-50 text-xs text-slate-700"><tr><th className="px-4 py-3">รหัส / รายการ</th><th className="px-4 py-3">หมวดหมู่</th><th className="px-4 py-3 text-center">คงเหลือ</th><th className="px-4 py-3">สถานที่</th><th className="px-4 py-3 text-right">จัดการ</th></tr></thead>
          <tbody>{filtered.map(item => <tr key={item.id} className="border-t border-slate-100"><td className="px-4 py-3"><p className="font-bold text-slate-800">{item.name}</p><p className="text-xs text-slate-500">{item.code}</p></td><td className="px-4 py-3">{item.category}</td><td className="px-4 py-3 text-center"><span className={item.quantity ? 'font-bold text-emerald-700' : 'font-bold text-rose-600'}>{item.quantity} {item.unit}</span></td><td className="px-4 py-3">{item.location || '-'}</td><td className="px-4 py-3"><div className="flex justify-end gap-1"><Button type="button" size="sm" variant="outline" onClick={() => void moveStock(item, 'issue')} disabled={item.quantity === 0}><ArrowDownToLine size={14} className="mr-1" />เบิก</Button><Button type="button" size="sm" variant="outline" onClick={() => void moveStock(item, 'return')}><Undo2 size={14} className="mr-1" />รับคืน</Button><Button type="button" size="icon" variant="ghost" aria-label={`แก้ไข ${item.name}`} onClick={() => setDraft(item)}><Pencil size={16} /></Button><Button type="button" size="icon" variant="ghost" aria-label={`ลบ ${item.name}`} onClick={() => void removeItem(item)}><Trash2 size={16} /></Button></div></td></tr>)}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500"><Box className="mx-auto mb-2" />ไม่พบรายการพัสดุ</td></tr>}
          </tbody>
        </table>
      </div>
      {movements.length > 0 && <section className="mt-6"><h3 className="mb-2 font-bold text-slate-800">ประวัติเบิก-รับคืนล่าสุด</h3><div className="divide-y divide-slate-100 rounded-xl border border-slate-200">{movements.slice(0, 8).map(movement => <div key={movement.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm"><div><span className="font-semibold text-slate-800">{movement.name}</span><span className="ml-2 text-xs text-slate-500">{movement.code}</span></div><div className="text-xs text-slate-600">{movement.direction === 'issue' ? 'เบิกออก' : 'รับคืน'} {movement.quantity} · {new Date(movement.createdAt).toLocaleString('th-TH')}</div></div>)}</div></section>}
    </section>
  );
}