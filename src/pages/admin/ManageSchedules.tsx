import React, { FormEvent, useEffect, useState } from 'react';
import { CalendarDays, Pencil, Plus, Settings, Trash2, Wand2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

type ScheduleEntry = {
  id: string;
  day: string;
  period: number;
  className: string;
  subject: string;
  teacher: string;
};

type ScheduleDraft = Omit<ScheduleEntry, 'id'>;

const STORAGE_KEY = 'sw-school:schedules';
const DAYS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
const PERIODS = [
  { id: 1, time: '08:30-09:20' },
  { id: 2, time: '09:20-10:10' },
  { id: 3, time: '10:10-11:00' },
  { id: 4, time: '11:00-11:50' },
  { id: 5, time: '13:00-13:50' },
  { id: 6, time: '13:50-14:40' }
];
const CLASSES = ['ม.1/1', 'ม.1/2', 'ม.2/1'];
const TEACHERS = ['ครูสมใจ รักเรียน', 'ครูมานะ ขยันยิ่ง', 'ครูวิไล สวยงาม'];
const SUBJECTS = ['ภาษาไทยพื้นฐาน 1', 'คณิตศาสตร์พื้นฐาน 1', 'วิทยาศาสตร์', 'ภาษาอังกฤษ', 'สังคมศึกษา', 'สุขศึกษา'];

const DEFAULT_SCHEDULE: ScheduleEntry[] = [
  { id: 'default-1', day: 'จันทร์', period: 1, className: 'ม.1/1', subject: 'ภาษาไทยพื้นฐาน 1', teacher: TEACHERS[0] },
  { id: 'default-2', day: 'จันทร์', period: 2, className: 'ม.1/1', subject: 'คณิตศาสตร์พื้นฐาน 1', teacher: TEACHERS[2] },
  { id: 'default-3', day: 'อังคาร', period: 1, className: 'ม.1/1', subject: 'วิทยาศาสตร์', teacher: TEACHERS[1] },
  { id: 'default-4', day: 'พุธ', period: 2, className: 'ม.1/2', subject: 'ภาษาไทยพื้นฐาน 1', teacher: TEACHERS[0] },
  { id: 'default-5', day: 'พฤหัสบดี', period: 3, className: 'ม.2/1', subject: 'ภาษาอังกฤษ', teacher: TEACHERS[2] }
];

const isScheduleEntry = (value: unknown): value is ScheduleEntry => {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Partial<ScheduleEntry>;
  return typeof entry.id === 'string'
    && DAYS.includes(entry.day as string)
    && PERIODS.some(period => period.id === entry.period)
    && typeof entry.className === 'string'
    && typeof entry.subject === 'string'
    && typeof entry.teacher === 'string';
};

const readSchedule = (): ScheduleEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SCHEDULE;
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.every(isScheduleEntry) ? parsed : DEFAULT_SCHEDULE;
  } catch {
    return DEFAULT_SCHEDULE;
  }
};

const emptyDraft = (className: string, teacher: string): ScheduleDraft => ({
  day: DAYS[0],
  period: 1,
  className,
  subject: SUBJECTS[0],
  teacher
});

export function AdminManageSchedules() {
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'setup'>('class');
  const [entries, setEntries] = useState<ScheduleEntry[]>(readSchedule);
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedTeacher, setSelectedTeacher] = useState(TEACHERS[0]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ScheduleDraft>(() => emptyDraft(CLASSES[0], TEACHERS[0]));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      Swal.fire('บันทึกไม่สำเร็จ', 'พื้นที่จัดเก็บในเบราว์เซอร์อาจเต็ม', 'error');
    }
  }, [entries]);

  const visibleEntries = entries.filter(entry =>
    viewMode === 'class' ? entry.className === selectedClass : entry.teacher === selectedTeacher
  );

  const openEditor = (entry?: ScheduleEntry, day = DAYS[0], period = 1) => {
    setEditingId(entry?.id || null);
    setDraft(entry ? { day: entry.day, period: entry.period, className: entry.className, subject: entry.subject, teacher: entry.teacher } : {
      ...emptyDraft(selectedClass, selectedTeacher), day, period
    });
    setIsEditorOpen(true);
  };

  const saveEntry = (event: FormEvent) => {
    event.preventDefault();
    const conflict = entries.find(entry => entry.id !== editingId && entry.day === draft.day && entry.period === Number(draft.period) && (
      entry.className === draft.className || entry.teacher === draft.teacher
    ));
    if (conflict) {
      Swal.fire('เวลาซ้ำ', 'ห้องเรียนหรือผู้สอนมีคาบเรียนในช่วงเวลานี้แล้ว', 'warning');
      return;
    }

    const updated: ScheduleEntry = { ...draft, period: Number(draft.period), id: editingId || `${Date.now()}` };
    setEntries(current => editingId ? current.map(entry => entry.id === editingId ? updated : entry) : [...current, updated]);
    setIsEditorOpen(false);
    Swal.fire({ icon: 'success', title: 'บันทึกตารางแล้ว', timer: 1200, showConfirmButton: false });
  };

  const deleteEntry = () => {
    if (!editingId) return;
    setEntries(current => current.filter(entry => entry.id !== editingId));
    setIsEditorOpen(false);
  };

  const autoFillClass = async () => {
    const result = await Swal.fire({
      title: 'จัดตารางอัตโนมัติ?',
      text: `จะเขียนทับตารางของห้อง ${selectedClass} ด้วยตัวอย่าง 5 คาบ`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'จัดตาราง',
      cancelButtonText: 'ยกเลิก'
    });
    if (!result.isConfirmed) return;

    const generated = DAYS.map((day, index): ScheduleEntry => ({
      id: `auto-${Date.now()}-${index}`,
      day,
      period: (index % PERIODS.length) + 1,
      className: selectedClass,
      subject: SUBJECTS[index],
      teacher: TEACHERS[index % TEACHERS.length]
    }));
    setEntries(current => [...current.filter(entry => entry.className !== selectedClass), ...generated]);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:rounded-3xl md:p-8">
      <header className="mb-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 md:text-2xl">
          <CalendarDays className="shrink-0 text-emerald-600" /> ตารางเรียนและตารางสอน
        </h2>
        <p className="mt-1 text-sm text-slate-500">เพิ่มและแก้ไขคาบเรียน ตรวจเวลาซ้ำ และบันทึกไว้ในเบราว์เซอร์นี้</p>
      </header>

      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="มุมมองตาราง">
        {([
          ['class', 'ตามห้องเรียน'],
          ['teacher', 'ตามบุคลากร'],
          ['setup', 'รายการคาบเรียน']
        ] as const).map(([mode, label]) => (
          <button key={mode} type="button" role="tab" aria-selected={viewMode === mode} onClick={() => setViewMode(mode)} className={`rounded-lg px-4 py-2 text-sm font-bold ${viewMode === mode ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        {viewMode === 'class' && (
          <label className="w-full text-sm font-semibold text-slate-700 sm:max-w-xs">ห้องเรียน
            <select value={selectedClass} onChange={event => setSelectedClass(event.target.value)} className="mt-1 block h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm">
              {CLASSES.map(className => <option key={className}>{className}</option>)}
            </select>
          </label>
        )}
        {viewMode === 'teacher' && (
          <label className="w-full text-sm font-semibold text-slate-700 sm:max-w-xs">ผู้สอน
            <select value={selectedTeacher} onChange={event => setSelectedTeacher(event.target.value)} className="mt-1 block h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm">
              {TEACHERS.map(teacher => <option key={teacher}>{teacher}</option>)}
            </select>
          </label>
        )}
        <div className="flex flex-wrap gap-2">
          {viewMode === 'class' && <Button type="button" variant="outline" onClick={autoFillClass}><Wand2 size={16} className="mr-2" />จัดอัตโนมัติ</Button>}
          {viewMode !== 'setup' && <Button type="button" onClick={() => openEditor()}><Plus size={17} className="mr-2" />เพิ่มคาบเรียน</Button>}
        </div>
      </div>

      {viewMode === 'setup' ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-175 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold text-slate-600">
              <tr><th className="px-4 py-3">วัน</th><th className="px-4 py-3">เวลา</th><th className="px-4 py-3">ห้องเรียน</th><th className="px-4 py-3">รายวิชา</th><th className="px-4 py-3">ผู้สอน</th><th className="px-4 py-3">แก้ไข</th></tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{entry.day}</td><td className="px-4 py-3">{PERIODS.find(period => period.id === entry.period)?.time}</td>
                  <td className="px-4 py-3">{entry.className}</td><td className="px-4 py-3">{entry.subject}</td><td className="px-4 py-3">{entry.teacher}</td>
                  <td className="px-4 py-3"><Button type="button" size="sm" variant="ghost" aria-label={`แก้ไข ${entry.subject}`} onClick={() => openEditor(entry)}><Pencil size={16} /></Button></td>
                </tr>
              ))}
              {entries.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">ยังไม่มีคาบเรียน กด “เพิ่มคาบเรียน” จากมุมมองตารางเพื่อเริ่มต้น</td></tr>}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-225 border-collapse text-sm">
            <thead><tr><th className="sticky left-0 z-10 border border-slate-200 bg-slate-50 p-3 text-left">วัน / เวลา</th>{PERIODS.map(period => <th key={period.id} className="border border-slate-200 bg-slate-50 p-3 text-center">{period.time}</th>)}</tr></thead>
            <tbody>{DAYS.map(day => (
              <tr key={day}>
                <th className="sticky left-0 z-10 border border-slate-200 bg-slate-50 p-3 text-left">{day}</th>
                {PERIODS.map(period => {
                  const entry = visibleEntries.find(item => item.day === day && item.period === period.id);
                  return <td key={period.id} className="h-28 min-w-32 border border-slate-200 p-1 align-top">
                    <button type="button" onClick={() => entry ? openEditor(entry) : openEditor(undefined, day, period.id)} aria-label={entry ? `แก้ไข ${entry.subject} ${day} ${period.time}` : `เพิ่มคาบ ${day} ${period.time}`} className={`flex h-full min-h-24 w-full flex-col items-start justify-center rounded-lg p-2 text-left ${entry ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100' : 'text-slate-400 hover:bg-slate-50 hover:text-emerald-700'}`}>
                      {entry ? <><span className="font-bold">{entry.subject}</span><span className="mt-1 text-xs">{viewMode === 'class' ? entry.teacher : entry.className}</span></> : <Plus size={18} />}
                    </button>
                  </td>;
                })}
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {isEditorOpen && (
        <div className="fixed inset-0 z-60 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4" role="presentation" onClick={event => { if (event.target === event.currentTarget) setIsEditorOpen(false); }}>
          <form onSubmit={saveEntry} className="max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-lg sm:rounded-2xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="schedule-editor-title">
            <div className="mb-5 flex items-center justify-between">
              <h3 id="schedule-editor-title" className="text-lg font-bold text-slate-800">{editingId ? 'แก้ไขคาบเรียน' : 'เพิ่มคาบเรียน'}</h3>
              <button type="button" aria-label="ปิด" onClick={() => setIsEditorOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">วัน<select value={draft.day} onChange={event => setDraft({ ...draft, day: event.target.value })} className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3">{DAYS.map(day => <option key={day}>{day}</option>)}</select></label>
              <label className="text-sm font-semibold">คาบ<select value={draft.period} onChange={event => setDraft({ ...draft, period: Number(event.target.value) })} className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3">{PERIODS.map(period => <option key={period.id} value={period.id}>{period.time}</option>)}</select></label>
              <label className="text-sm font-semibold">ห้องเรียน<select value={draft.className} onChange={event => setDraft({ ...draft, className: event.target.value })} className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3">{CLASSES.map(className => <option key={className}>{className}</option>)}</select></label>
              <label className="text-sm font-semibold">ผู้สอน<select value={draft.teacher} onChange={event => setDraft({ ...draft, teacher: event.target.value })} className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3">{TEACHERS.map(teacher => <option key={teacher}>{teacher}</option>)}</select></label>
              <label className="text-sm font-semibold sm:col-span-2">รายวิชา<select value={draft.subject} onChange={event => setDraft({ ...draft, subject: event.target.value })} className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3">{SUBJECTS.map(subject => <option key={subject}>{subject}</option>)}</select></label>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              {editingId ? <Button type="button" variant="outline" onClick={deleteEntry} className="text-rose-600"><Trash2 size={16} className="mr-2" />ลบคาบ</Button> : <span />}
              <div className="flex gap-2"><Button type="button" variant="outline" onClick={() => setIsEditorOpen(false)}>ยกเลิก</Button><Button type="submit">บันทึกคาบ</Button></div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
