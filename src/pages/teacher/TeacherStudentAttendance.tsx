import React, { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { CheckSquare, QrCode, Search, Filter, CheckCircle, XCircle, AlertCircle, Clock, FileText, AlertTriangle, Calendar, UserX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

const MOCK_STUDENTS = [
  { id: '65001', name: 'ด.ช. สมชาย รักเรียน', class: 'ม.1/1', number: 1, arrival: '07:30', departure: null, status: 'present' },
  { id: '65002', name: 'ด.ญ. สมหญิง จริงใจ', class: 'ม.1/1', number: 2, arrival: null, departure: null, status: 'absent' },
  { id: '65003', name: 'ด.ช. เก่งกาจ สามารถ', class: 'ม.1/1', number: 3, arrival: '07:45', departure: '16:00', status: 'present' },
  { id: '65004', name: 'ด.ญ. มาลี สวยงาม', class: 'ม.1/1', number: 4, arrival: null, departure: null, status: 'leave' },
  { id: '65005', name: 'ด.ช. วิชา สมาร์ท', class: 'ม.1/1', number: 5, arrival: null, departure: null, status: 'pending' },
];

const MOCK_REPORT_SUMMARY = [
  { id: '65001', name: 'ด.ช. สมชาย รักเรียน', number: 1, present: 45, absent: 0, leave: 1, late: 1, total: 47 },
  { id: '65002', name: 'ด.ญ. สมหญิง จริงใจ', number: 2, present: 40, absent: 5, leave: 2, late: 0, total: 47 },
  { id: '65003', name: 'ด.ช. เก่งกาจ สามารถ', number: 3, present: 43, absent: 0, leave: 0, late: 4, total: 47 },
  { id: '65004', name: 'ด.ญ. มาลี สวยงาม', number: 4, present: 42, absent: 1, leave: 4, late: 0, total: 47 },
  { id: '65005', name: 'ด.ช. วิชา สมาร์ท', number: 5, present: 44, absent: 0, leave: 0, late: 3, total: 47 },
];

export function TeacherStudentAttendance({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<'checkin' | 'report'>('checkin');
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'monthly' | 'termly'>('monthly');

  useEffect(() => {
    if (activeTab === 'report') {
      const lateStudents = MOCK_REPORT_SUMMARY.filter(s => s.late >= 3);
      if (lateStudents.length > 0) {
        Swal.fire({
          title: 'แจ้งเตือนพฤติกรรมสาย',
          html: `<div class="text-left text-sm text-slate-600 mt-2">พบนักเรียนในที่ปรึกษามีสถิติมาสายสะสมเกิน 3 ครั้ง จำนวน <b>${lateStudents.length}</b> คน ระบบได้ส่งรายการนี้ไปยังฝ่ายปกครองแล้ว<br/><br/><ul class="list-disc pl-5">${lateStudents.map(s => `<li>${s.name} (สาย ${s.late} ครั้ง)</li>`).join('')}</ul></div>`,
          icon: 'warning',
          confirmButtonColor: '#f59e0b',
          confirmButtonText: 'รับทราบและบันทึก'
        });
      }
    }
  }, [activeTab]);

  const total = students.length;
  const present = students.filter(s => s.status === 'present').length;
  const absent = students.filter(s => s.status === 'absent').length;
  const leave = students.filter(s => s.status === 'leave').length;
  const late = students.filter(s => s.status === 'late').length;

  const LATE_THRESHOLD = "08:00";

  const handleScan = () => {
    Swal.fire({
      title: 'สแกนบัตรนักเรียน',
      html: `
        <div class="flex flex-col items-center justify-center p-4">
          <div class="w-48 h-48 border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center mb-4 bg-slate-50 relative overflow-hidden">
            <div class="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
            <div class="w-full h-1 bg-blue-500 absolute top-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
          </div>
          <p class="text-sm text-slate-500">จำลองการสแกน QR Code / บาร์โค้ด</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'จำลองสแกน',
      cancelButtonText: 'ปิด',
      confirmButtonColor: '#10b981',
    }).then((result) => {
      if (result.isConfirmed) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const isLate = time > LATE_THRESHOLD;
        
        setStudents(students.map(s => 
          s.status === 'pending' 
            ? { ...s, status: isLate ? 'late' : 'present', arrival: time } 
            : s
        ));
        
        Swal.fire({
          title: 'สำเร็จ',
          text: `บันทึกเวลาเข้าเรียนแล้ว ${isLate ? '(บันทึกว่าสายเนื่องจากเลยเวลา 08:00)' : ''}`,
          icon: isLate ? 'warning' : 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isLate = (newStatus === 'present' || newStatus === 'late') && time > LATE_THRESHOLD;
    const finalStatus = (newStatus === 'present' && isLate) ? 'late' : newStatus;

    setStudents(students.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: finalStatus,
          arrival: (finalStatus === 'present' || finalStatus === 'late') && !s.arrival ? time : s.arrival,
          departure: (finalStatus === 'present' || finalStatus === 'late') && s.arrival && !s.departure ? time : s.departure
        };
      }
      return s;
    }));
  };

  const filtered = students.filter(s => 
    s.name.includes(searchTerm) || s.id.includes(searchTerm)
  );

  const filteredReport = MOCK_REPORT_SUMMARY.filter(s => 
    s.name.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CheckSquare className="text-emerald-500" /> จัดการโฮมรูม
          </h2>
          <p className="text-slate-500 text-sm mt-1">จัดการเวลาเข้าเรียนและดูรายงานชั้น ม.1/1</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('checkin')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'checkin' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            เช็คชื่อประจำวัน
          </button>
          <button 
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'report' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            รายงานสรุป
          </button>
        </div>
      </div>

      {activeTab === 'checkin' ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex gap-2 w-full md:w-auto">
              <Input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full md:w-auto bg-slate-50"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button onClick={handleScan} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md w-full md:w-auto">
                <QrCode size={18} className="mr-2" /> สแกนบัตรนักเรียน
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
             <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col justify-between shadow-sm">
                <span className="font-bold text-slate-600 text-sm mb-1">ทั้งหมด</span>
                <h3 className="text-2xl font-bold text-slate-800">{total}</h3>
             </div>
             <div className="p-4 border border-emerald-100 rounded-2xl bg-emerald-50 flex flex-col justify-between shadow-sm">
                <span className="font-bold text-emerald-700 text-sm mb-1">มาเรียน</span>
                <h3 className="text-2xl font-bold text-emerald-600">{present}</h3>
             </div>
             <div className="p-4 border border-rose-100 rounded-2xl bg-rose-50 flex flex-col justify-between shadow-sm">
                <span className="font-bold text-rose-700 text-sm mb-1">ขาดเรียน</span>
                <h3 className="text-2xl font-bold text-rose-600">{absent}</h3>
             </div>
             <div className="p-4 border border-amber-100 rounded-2xl bg-amber-50 flex flex-col justify-between shadow-sm">
                <span className="font-bold text-amber-700 text-sm mb-1">ลากิจ/ป่วย</span>
                <h3 className="text-2xl font-bold text-amber-600">{leave}</h3>
             </div>
             <div className="p-4 border border-orange-100 rounded-2xl bg-orange-50 flex flex-col justify-between shadow-sm">
                <span className="font-bold text-orange-700 text-sm mb-1">สาย</span>
                <h3 className="text-2xl font-bold text-orange-600">{late}</h3>
             </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <Input 
                placeholder="ค้นหารหัสนักเรียน, ชื่อ-นามสกุล..." 
                className="pl-10 bg-slate-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <p className="text-xs font-bold text-slate-400 text-right">* สแกนหลัง 08:00 ถือว่าสาย</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm text-left text-slate-600 min-w-[800px]">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold w-16 text-center">เลขที่</th>
                  <th className="px-4 py-3 font-bold">รหัส</th>
                  <th className="px-4 py-3 font-bold">ชื่อ-นามสกุล</th>
                  <th className="px-4 py-3 font-bold text-center">เวลามา</th>
                  <th className="px-4 py-3 font-bold text-center">สถานะ</th>
                  <th className="px-4 py-3 font-bold text-right">อัปเดต</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr key={student.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-center font-bold text-slate-400">{student.number}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{student.id}</td>
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-700">{student.arrival || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      {student.status === 'present' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle size={12}/> มา</span>}
                      {student.status === 'absent' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-700"><XCircle size={12}/> ขาด</span>}
                      {student.status === 'leave' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700"><AlertCircle size={12}/> ลา</span>}
                      {student.status === 'late' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700"><Clock size={12}/> สาย</span>}
                      {student.status === 'pending' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600">รอเช็ค</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          onClick={() => handleUpdateStatus(student.id, 'present')}
                          variant="outline" size="icon" 
                          className={`w-8 h-8 ${student.status === 'present' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'text-slate-400 hover:text-emerald-600'}`}
                          title="มาเรียน"
                        ><CheckCircle size={14} /></Button>
                        <Button 
                          onClick={() => handleUpdateStatus(student.id, 'late')}
                          variant="outline" size="icon" 
                          className={`w-8 h-8 ${student.status === 'late' ? 'bg-orange-50 border-orange-200 text-orange-600' : 'text-slate-400 hover:text-orange-600'}`}
                          title="สาย"
                        ><Clock size={14} /></Button>
                        <Button 
                          onClick={() => handleUpdateStatus(student.id, 'absent')}
                          variant="outline" size="icon" 
                          className={`w-8 h-8 ${student.status === 'absent' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'text-slate-400 hover:text-rose-600'}`}
                          title="ขาดเรียน"
                        ><XCircle size={14} /></Button>
                        <Button 
                          onClick={() => handleUpdateStatus(student.id, 'leave')}
                          variant="outline" size="icon" 
                          className={`w-8 h-8 ${student.status === 'leave' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'text-slate-400 hover:text-amber-600'}`}
                          title="ลากิจ/ลาป่วย"
                        ><AlertCircle size={14} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex gap-2 w-full md:w-auto p-1 bg-slate-50 border border-slate-200 rounded-lg">
              <button 
                onClick={() => setReportPeriod('daily')} 
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${reportPeriod === 'daily' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                รายวัน
              </button>
              <button 
                onClick={() => setReportPeriod('monthly')} 
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${reportPeriod === 'monthly' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                รายเดือน
              </button>
              <button 
                onClick={() => setReportPeriod('termly')} 
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${reportPeriod === 'termly' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                รายเทอม
              </button>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="ค้นหานักเรียน..." 
                className="pl-10 h-9 bg-slate-50 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-6 p-4 rounded-xl border border-orange-200 bg-orange-50 flex items-start gap-3">
            <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-orange-800 text-sm">การแจ้งเตือนนักเรียนมาสาย (ฝ่ายปกครอง)</h4>
              <p className="text-sm text-orange-700/80 mt-1">
                ระบบจะส่งการแจ้งเตือนอัตโนมัติไปยังครูที่ปรึกษาและฝ่ายปกครองทันที หากพบนักเรียนคนใดมีสถิติมาสายสะสม <b>ตั้งแต่ 3 ครั้งขึ้นไป</b>
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm text-left text-slate-600 min-w-[700px]">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold w-16 text-center">เลขที่</th>
                  <th className="px-4 py-3 font-bold">ชื่อ-นามสกุล</th>
                  <th className="px-4 py-3 font-bold text-center">มาเรียน</th>
                  <th className="px-4 py-3 font-bold text-center">สาย</th>
                  <th className="px-4 py-3 font-bold text-center">ขาด</th>
                  <th className="px-4 py-3 font-bold text-center">ลา</th>
                  <th className="px-4 py-3 font-bold text-center">รวม (วัน)</th>
                  <th className="px-4 py-3 font-bold text-center">สถานะการเตือน</th>
                </tr>
              </thead>
              <tbody>
                {filteredReport.map((student) => (
                  <tr key={student.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4 text-center font-bold text-slate-400">{student.number}</td>
                    <td className="px-4 py-4 font-medium text-slate-900">{student.name}</td>
                    <td className="px-4 py-4 text-center text-emerald-600 font-bold">{student.present}</td>
                    <td className="px-4 py-4 text-center text-orange-600 font-bold">{student.late}</td>
                    <td className="px-4 py-4 text-center text-rose-600 font-bold">{student.absent}</td>
                    <td className="px-4 py-4 text-center text-amber-600 font-bold">{student.leave}</td>
                    <td className="px-4 py-4 text-center font-bold text-slate-500">{student.total}</td>
                    <td className="px-4 py-4 text-center">
                      {student.late >= 3 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                          <AlertTriangle size={12} /> แจ้งฝ่ายปกครอง
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                          ปกติ
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
