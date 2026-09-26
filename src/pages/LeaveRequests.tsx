import { FormEvent, useEffect, useState } from 'react';
import { CalendarDays, Check, Clock, FileText, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockUsers } from '@/lib/data';
import { readLocalData, writeLocalData } from '@/lib/localData';
import { User } from '@/lib/types';
import Swal from 'sweetalert2';

type LeaveStatus = 'pending' | 'approved' | 'rejected';
type LeaveRequest = { id: string; requesterId: string; requesterName: string; requesterRole: string; studentId?: string; studentName?: string; leaveType: string; startDate: string; endDate: string; reason: string; status: LeaveStatus; reviewerNote: string; createdAt: string };
const STORAGE_KEY = 'sw-school:leave-requests';
const LEAVE_TYPES = ['ลาป่วย', 'ลากิจ', 'ลาเข้าร่วมกิจกรรม', 'อื่น ๆ'];
const students = mockUsers.filter((user): user is User & { studentId: string } => user.role === 'student' && Boolean(user.studentId));
const roleName: Record<string, string> = { student: 'นักเรียน', teacher: 'ครู', parent: 'ผู้ปกครอง' };

export function LeaveRequests({ user }: { user: User }) {
  const isAdmin = user.role === 'admin';
  const children = user.role === 'parent' ? students.filter(student => user.childrenIds?.includes(student.id)) : [];
  const [requests, setRequests] = useState(() => readLocalData<LeaveRequest[]>(STORAGE_KEY, []));
  const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0]);
  const [studentId, setStudentId] = useState(children[0]?.id || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!writeLocalData(STORAGE_KEY, requests)) Swal.fire('บันทึกไม่สำเร็จ', 'พื้นที่จัดเก็บในเบราว์เซอร์อาจเต็ม', 'error');
  }, [requests]);

  const submitRequest = (event: FormEvent) => {
    event.preventDefault();
    if (endDate < startDate) {
      Swal.fire('ช่วงวันลาไม่ถูกต้อง', 'วันสิ้นสุดต้องไม่อยู่ก่อนวันเริ่มลา', 'warning');
      return;
    }
    if (user.role === 'parent' && !children.some(child => child.id === studentId)) {
      Swal.fire('ยังไม่มีข้อมูลบุตร', 'บัญชีผู้ปกครองนี้ไม่มีรายชื่อนักเรียนที่ผูกไว้', 'warning');
      return;
    }
    const student = children.find(child => child.id === studentId);
    const record: LeaveRequest = {
      id: crypto.randomUUID(), requesterId: user.id, requesterName: user.name, requesterRole: user.role,
      studentId: student?.id, studentName: student?.name, leaveType, startDate, endDate, reason: reason.trim(),
      status: 'pending', reviewerNote: '', createdAt: new Date().toISOString()
    };
    setRequests(current => [record, ...current]);
    setStartDate(''); setEndDate(''); setReason('');
    Swal.fire({ title: 'ส่งคำขอลาแล้ว', text: 'ตรวจสอบสถานะได้จากรายการด้านล่าง', icon: 'success', timer: 1400, showConfirmButton: false });
  };

  const reviewRequest = async (request: LeaveRequest, status: Exclude<LeaveStatus, 'pending'>) => {
    const result = await Swal.fire({
      title: status === 'approved' ? 'อนุมัติคำขอลา?' : 'ไม่อนุมัติคำขอลา?',
      input: 'textarea', inputLabel: 'หมายเหตุผู้พิจารณา (ไม่บังคับ)', inputPlaceholder: 'บันทึกเหตุผลหรือหมายเหตุ',
      showCancelButton: true, confirmButtonText: status === 'approved' ? 'อนุมัติ' : 'ไม่อนุมัติ', cancelButtonText: 'กลับ'
    });
    if (result.isConfirmed) setRequests(current => current.map(item => item.id === request.id ? { ...item, status, reviewerNote: String(result.value || '').trim() } : item));
  };

  const cancelRequest = async (request: LeaveRequest) => {
    const result = await Swal.fire({ title: 'ยกเลิกคำขอ?', text: 'ยกเลิกได้เฉพาะคำขอที่ยังรอพิจารณา', icon: 'question', showCancelButton: true, confirmButtonText: 'ยกเลิกคำขอ', cancelButtonText: 'กลับ' });
    if (result.isConfirmed) setRequests(current => current.filter(item => item.id !== request.id));
  };

  const visibleRequests = isAdmin ? requests : requests.filter(request => request.requesterId === user.id);
  const statusText = (status: LeaveStatus) => status === 'approved' ? 'อนุมัติแล้ว' : status === 'rejected' ? 'ไม่อนุมัติ' : 'รอพิจารณา';
  const statusStyle = (status: LeaveStatus) => status === 'approved' ? 'bg-emerald-50 text-emerald-700' : status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700';

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:rounded-3xl md:p-8">
      <header className="mb-6"><h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 md:text-2xl"><CalendarDays className="text-emerald-600" />{isAdmin ? 'จัดการคำขอลา' : 'ยื่นคำขอลา'}</h2><p className="mt-1 text-sm text-slate-500">{isAdmin ? 'ตรวจสอบคำขอและบันทึกผลการพิจารณา' : 'ส่งคำขอลาและติดตามสถานะการพิจารณา'}</p></header>
      {!isAdmin && <form onSubmit={submitRequest} className="mb-7 grid grid-cols-1 gap-4 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 md:grid-cols-2">
        {user.role === 'parent' && <label className="text-sm font-semibold text-slate-700 md:col-span-2">นักเรียน<select required value={studentId} onChange={event => setStudentId(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3">{children.map(child => <option key={child.id} value={child.id}>{child.name} · {child.studentId} · {child.class}</option>)}</select>{children.length === 0 && <span className="mt-1 block text-xs font-normal text-rose-600">ไม่พบบุตรที่ผูกกับบัญชีนี้</span>}</label>}
        <label className="text-sm font-semibold text-slate-700">ประเภทการลา<select value={leaveType} onChange={event => setLeaveType(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3">{LEAVE_TYPES.map(type => <option key={type}>{type}</option>)}</select></label>
        <div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold text-slate-700">วันเริ่ม<Input required type="date" value={startDate} onChange={event => setStartDate(event.target.value)} /></label><label className="text-sm font-semibold text-slate-700">วันสิ้นสุด<Input required type="date" min={startDate || undefined} value={endDate} onChange={event => setEndDate(event.target.value)} /></label></div>
        <label className="text-sm font-semibold text-slate-700 md:col-span-2">เหตุผลการลา<textarea required minLength={4} maxLength={500} value={reason} onChange={event => setReason(event.target.value)} placeholder="ระบุเหตุผลและข้อมูลประกอบ" className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm" /></label>
        <div className="flex items-center justify-between gap-3 md:col-span-2"><p className="text-xs text-slate-500">ผู้ยื่น: {user.name} · {roleName[user.role]}</p><Button type="submit" disabled={user.role === 'parent' && children.length === 0}><Send size={16} className="mr-2" />ส่งคำขอ</Button></div>
      </form>}
      <div className="mb-3 flex items-center gap-2 font-bold text-slate-800"><FileText size={18} />{isAdmin ? 'คำขอทั้งหมด' : 'ประวัติคำขอของฉัน'}<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{visibleRequests.length}</span></div>
      <div className="space-y-3">{visibleRequests.map(request => <article key={request.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle(request.status)}`}>{request.status === 'approved' ? <Check size={14} /> : request.status === 'rejected' ? <X size={14} /> : <Clock size={14} />}{statusText(request.status)}</span><span className="text-xs text-slate-500">ยื่นเมื่อ {new Date(request.createdAt).toLocaleDateString('th-TH')}</span></div><h3 className="mt-2 font-bold text-slate-800">{request.leaveType} · {request.startDate} ถึง {request.endDate}</h3><p className="text-sm text-slate-600">ผู้ยื่น {request.requesterName} ({roleName[request.requesterRole]}){request.studentName ? ` · นักเรียน ${request.studentName}` : ''}</p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{request.reason}</p>{request.reviewerNote && <p className="mt-2 rounded-lg bg-slate-50 p-2 text-sm text-slate-600">หมายเหตุ: {request.reviewerNote}</p>}</div>
          {isAdmin && request.status === 'pending' && <div className="flex shrink-0 gap-2"><Button type="button" size="sm" onClick={() => void reviewRequest(request, 'approved')}><Check size={15} className="mr-1" />อนุมัติ</Button><Button type="button" size="sm" className="bg-rose-600 hover:bg-rose-700" onClick={() => void reviewRequest(request, 'rejected')}><X size={15} className="mr-1" />ไม่อนุมัติ</Button></div>}
          {!isAdmin && request.status === 'pending' && <Button type="button" variant="outline" size="sm" onClick={() => void cancelRequest(request)}>ยกเลิกคำขอ</Button>}
        </div></article>)}{visibleRequests.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">{isAdmin ? 'ยังไม่มีคำขอลา' : 'คุณยังไม่มีประวัติการยื่นลา'}</p>}</div>
    </section>
  );
}