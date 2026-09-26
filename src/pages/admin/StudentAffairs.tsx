import { useEffect, useState } from 'react';
import { Activity, Award, Search, ShieldAlert, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockUsers } from '@/lib/data';
import { readLocalData, writeLocalData } from '@/lib/localData';
import { User } from '@/lib/types';
import Swal from 'sweetalert2';

type BehaviorRecord = { id: string; studentId: string; points: number; reason: string; createdAt: string; by: string };
const STORAGE_KEY = 'sw-school:student-behavior';
const students = mockUsers.filter((user): user is User & { studentId: string } => user.role === 'student' && Boolean(user.studentId));

export function AdminStudentAffairs() {
  const [records, setRecords] = useState(() => readLocalData<BehaviorRecord[]>(STORAGE_KEY, []));
  const [search, setSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');

  useEffect(() => {
    if (!writeLocalData(STORAGE_KEY, records)) Swal.fire('บันทึกไม่สำเร็จ', 'พื้นที่จัดเก็บในเบราว์เซอร์อาจเต็ม', 'error');
  }, [records]);

  const filteredStudents = students.filter(student => `${student.name} ${student.studentId} ${student.class || ''}`.toLowerCase().includes(search.toLowerCase()));
  const selectedStudent = students.find(student => student.id === selectedStudentId);
  const studentRecords = records.filter(record => record.studentId === selectedStudentId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const score = 100 + studentRecords.reduce((total, record) => total + record.points, 0);

  const addRecord = async (points: number) => {
    if (!selectedStudent) return;
    const result = await Swal.fire({
      title: points > 0 ? 'บันทึกความดี' : 'บันทึกการหักคะแนน',
      input: 'textarea',
      inputLabel: `${selectedStudent.name} · คะแนน ${points > 0 ? '+' : ''}${points}`,
      inputPlaceholder: 'ระบุเหตุผลหรือรายละเอียด',
      inputValidator: value => value?.trim() ? undefined : 'กรุณาระบุรายละเอียด',
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก'
    });
    if (!result.isConfirmed) return;
    setRecords(current => [{ id: crypto.randomUUID(), studentId: selectedStudent.id, points, reason: result.value.trim(), createdAt: new Date().toISOString(), by: 'ผู้ดูแลระบบ' }, ...current]);
  };

  const removeRecord = async (record: BehaviorRecord) => {
    const result = await Swal.fire({ title: 'ลบประวัตินี้?', text: record.reason, icon: 'warning', showCancelButton: true, confirmButtonText: 'ลบ', cancelButtonText: 'ยกเลิก' });
    if (result.isConfirmed) setRecords(current => current.filter(item => item.id !== record.id));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:rounded-3xl md:p-8">
      <header className="mb-6"><h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 md:text-2xl"><Activity className="text-rose-500" /> ระบบกิจการนักเรียน</h2><p className="mt-1 text-sm text-slate-500">บันทึกความดีและประวัติการปรับคะแนนความประพฤติ</p></header>
      <div className="grid gap-5 lg:grid-cols-[minmax(220px,0.8fr)_minmax(0,2fr)]">
        <aside className="rounded-xl border border-slate-200 p-4">
          <div className="relative mb-3"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="ค้นหาชื่อหรือรหัส" className="pl-9" /></div>
          <div className="max-h-[50vh] space-y-1 overflow-y-auto">{filteredStudents.map(student => <button type="button" key={student.id} onClick={() => setSelectedStudentId(student.id)} className={`w-full rounded-lg p-3 text-left ${selectedStudentId === student.id ? 'bg-rose-50 text-rose-800' : 'hover:bg-slate-50'}`}><span className="block text-sm font-bold">{student.name}</span><span className="text-xs text-slate-500">{student.studentId} · {student.class || 'ไม่ระบุห้อง'}</span></button>)}</div>
        </aside>
        {selectedStudent ? <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><div><p className="text-sm text-slate-500">คะแนนความประพฤติ</p><p className={`text-3xl font-bold ${score < 60 ? 'text-rose-600' : 'text-emerald-700'}`}>{score}<span className="ml-1 text-sm font-medium text-slate-500">คะแนน</span></p></div><div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => void addRecord(5)}><Award size={16} className="mr-2 text-emerald-600" />ความดี +5</Button><Button type="button" onClick={() => void addRecord(-5)} className="bg-rose-600 hover:bg-rose-700"><ShieldAlert size={16} className="mr-2" />หักคะแนน -5</Button></div></div>
          <h3 className="mb-2 font-bold text-slate-800">ประวัติของ {selectedStudent.name}</h3>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">{studentRecords.map(record => <article key={record.id} className="flex items-start justify-between gap-3 p-3"><div className="min-w-0"><p className="font-semibold text-slate-800">{record.reason}</p><p className="mt-1 text-xs text-slate-500">{new Date(record.createdAt).toLocaleString('th-TH')} · {record.by}</p></div><div className="flex items-center gap-2"><strong className={record.points > 0 ? 'text-emerald-700' : 'text-rose-600'}>{record.points > 0 ? '+' : ''}{record.points}</strong><Button type="button" variant="ghost" size="icon" aria-label="ลบประวัติ" onClick={() => void removeRecord(record)}><Trash2 size={16} /></Button></div></article>)}{studentRecords.length === 0 && <p className="p-8 text-center text-sm text-slate-500">ยังไม่มีประวัติความประพฤติ</p>}</div>
        </div> : <p className="p-8 text-center text-slate-500">ไม่พบนักเรียน</p>}
      </div>
    </section>
  );
}