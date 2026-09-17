import React, { useState } from 'react';
import { CreditCard, TrendingUp, TrendingDown, DollarSign, Search, Filter, Plus, Edit, CheckCircle, XCircle, AlertCircle, Trash2, FileSpreadsheet, Download, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

const MOCK_TUITION_FEES = [
  { id: 1, groupName: 'กลุ่มค่าเทอมปกติ (ม.1)', term: '1/2568', amount: 2500, deadline: '2025-06-30', studentsCount: 120 },
  { id: 2, groupName: 'กลุ่มเรียนพิเศษ (EP)', term: '1/2568', amount: 15000, deadline: '2025-06-30', studentsCount: 45 },
  { id: 3, groupName: 'กลุ่มนักเรียนทุน (ยกเว้น)', term: '1/2568', amount: 0, deadline: '2025-06-30', studentsCount: 15 },
];

const MOCK_STUDENT_PAYMENTS = [
  { id: 1, studentId: '65001', name: 'เด็กชาย สมศักดิ์ เก่งมาก', class: 'ม.1/1', term: '1/2568', amount: 2500, status: 'paid', paidDate: '2026-05-15' },
  { id: 2, studentId: '65002', name: 'เด็กหญิง มาลี สวยงาม', class: 'ม.1/1', term: '1/2568', amount: 2500, status: 'unpaid', paidDate: null },
  { id: 3, studentId: '65030', name: 'นาย สมชาย ใจดี', class: 'ม.4/2', term: '1/2568', amount: 3000, status: 'unpaid', paidDate: null },
];

export function AdminFinanceSystem() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fees' | 'payments'>('dashboard');

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="text-blue-500" /> ระบบการเงิน
          </h2>
          <p className="text-slate-500 text-sm mt-1">จัดการค่าธรรมเนียมการศึกษา แจ้งชำระเงิน และตรวจสอบการจ่ายเงิน</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b border-slate-200 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}`}
        >
          ภาพรวม (Dashboard)
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors whitespace-nowrap ${activeTab === 'fees' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}`}
        >
          จัดการค่าธรรมเนียมการศึกษา
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors whitespace-nowrap ${activeTab === 'payments' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}`}
        >
          ตรวจสอบการชำระเงิน (นักเรียน)
        </button>
      </div>

      {activeTab === 'dashboard' && <FinanceDashboard />}
      {activeTab === 'fees' && <ManageFees />}
      {activeTab === 'payments' && <ManagePayments />}
    </div>
  );
}

function FinanceDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="p-6 border border-slate-200 rounded-2xl bg-white flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={20} /></div>
               <span className="font-bold text-slate-600">รายรับรวม (เทอม 1/2568)</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">฿ 1,450,000</h3>
            <p className="text-sm text-emerald-600 mt-2 font-medium">ชำระแล้ว 75%</p>
         </div>
         <div className="p-6 border border-slate-200 rounded-2xl bg-white flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><AlertCircle size={20} /></div>
               <span className="font-bold text-slate-600">ค้างชำระ (เทอม 1/2568)</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">฿ 450,000</h3>
            <p className="text-sm text-rose-500 mt-2 font-medium">ยังไม่ชำระ 25%</p>
         </div>
         <div className="p-6 border border-slate-200 rounded-2xl bg-white flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><TrendingDown size={20} /></div>
               <span className="font-bold text-slate-600">รายจ่ายรวม (เดือนนี้)</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">฿ 32,450</h3>
            <p className="text-sm text-slate-400 mt-2 font-medium">อัปเดตล่าสุด: วันนี้</p>
         </div>
      </div>
    </>
  );
}

function ManageFees() {
  const handleAddFee = () => {
    Swal.fire({
      title: 'กำหนดค่าธรรมเนียมการศึกษา',
      html: `
        <div class="text-left mb-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">ปีการศึกษา/ภาคเรียน</label>
          <input class="swal2-input !w-full !m-0" placeholder="เช่น 1/2568">
        </div>
        <div class="text-left mb-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">ชื่อกลุ่มค่าธรรมเนียม</label>
          <input type="text" class="swal2-input !w-full !m-0" placeholder="เช่น ค่าเทอม EP, กลุ่มนักเรียนทุน">
        </div>
        <div class="text-left mb-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">จำนวนเงิน (บาท)</label>
          <input type="number" class="swal2-input !w-full !m-0" placeholder="เช่น 2500">
        </div>
        <div class="text-left mb-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">วันครบกำหนดชำระ</label>
          <input type="date" class="swal2-input !w-full !m-0">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'บันทึกและแจ้งเตือน',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#10b981',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('สำเร็จ', 'กำหนดค่าธรรมเนียมและส่งแจ้งเตือนให้นักเรียนเรียบร้อยแล้ว', 'success');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-700">รายการค่าธรรมเนียมการศึกษา</h3>
        <Button onClick={handleAddFee} className="shadow-md bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={18} className="mr-2" /> กำหนดค่าธรรมเนียม
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">ภาคเรียน</th>
              <th className="px-6 py-4 font-bold">ชื่อกลุ่มค่าธรรมเนียม</th><th className="px-6 py-4 font-bold text-center">จำนวนนักเรียน</th>
              <th className="px-6 py-4 font-bold text-right">จำนวนเงิน (บาท)</th>
              <th className="px-6 py-4 font-bold text-center">วันครบกำหนด</th>
              <th className="px-6 py-4 font-bold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TUITION_FEES.map((fee) => (
              <tr key={fee.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{fee.term}</td>
                <td className="px-6 py-4 font-bold text-slate-700">{fee.groupName}</td><td className="px-6 py-4 text-center"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-bold">{fee.studentsCount} คน</span></td>
                <td className="px-6 py-4 text-right font-bold text-blue-600">{(fee.amount).toLocaleString()}</td>
                <td className="px-6 py-4 text-center">{fee.deadline}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 mr-2" onClick={() => Swal.fire('จัดการนักเรียน', 'เปิดหน้ารายชื่อนักเรียนในกลุ่ม ' + fee.groupName, 'info')}>
                    <Users size={14} className="mr-1" /> จัดการนักเรียน
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 h-8 w-8"><Edit size={16} /></Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 h-8 w-8"><Trash2 size={16} /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManagePayments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState(MOCK_STUDENT_PAYMENTS);

  const togglePaymentStatus = (id: number, currentStatus: string) => {
    if (currentStatus === 'paid') {
      Swal.fire({
        title: 'ยกเลิกการชำระเงิน?',
        text: 'ต้องการเปลี่ยนสถานะเป็น "ยังไม่ชำระ" ใช่หรือไม่',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
      }).then(res => {
        if (res.isConfirmed) {
          setPayments(payments.map(p => p.id === id ? { ...p, status: 'unpaid', paidDate: null } : p));
        }
      });
    } else {
      Swal.fire({
        title: 'บันทึกการชำระเงิน',
        text: 'ยืนยันว่านักเรียนได้ชำระเงินเรียบร้อยแล้ว?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
      }).then(res => {
        if (res.isConfirmed) {
          setPayments(payments.map(p => p.id === id ? { ...p, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : p));
        }
      });
    }
  };

  const filtered = payments.filter(p => p.name.includes(searchTerm) || p.studentId.includes(searchTerm));

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <span className="text-slate-500 text-sm font-medium mb-1">ทั้งหมด</span>
          <span className="text-2xl font-bold text-slate-800">{payments.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm flex flex-col items-center justify-center">
          <span className="text-emerald-600 text-sm font-medium mb-1">ชำระแล้ว</span>
          <span className="text-2xl font-bold text-emerald-700">{payments.filter(p => p.status === 'paid').length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm flex flex-col items-center justify-center">
          <span className="text-rose-600 text-sm font-medium mb-1">ค้างชำระ</span>
          <span className="text-2xl font-bold text-rose-700">{payments.filter(p => p.status === 'unpaid').length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm flex flex-col items-center justify-center">
          <span className="text-blue-600 text-sm font-medium mb-1">ยอดรวมชำระแล้ว (บาท)</span>
          <span className="text-2xl font-bold text-blue-700">
            {payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <h3 className="text-lg font-bold text-slate-700">ตรวจสอบการชำระเงิน (เทอม 1/2568)</h3>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="ค้นหานักเรียน..." 
            className="pl-10 bg-slate-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">รหัสนักเรียน</th>
              <th className="px-6 py-4 font-bold">ชื่อ-นามสกุล</th>
              <th className="px-6 py-4 font-bold">ชั้นเรียน</th>
              <th className="px-6 py-4 font-bold text-right">ยอดชำระ (บาท)</th>
              <th className="px-6 py-4 font-bold text-center">สถานะ</th>
              <th className="px-6 py-4 font-bold text-right">อัปเดตสถานะ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((payment) => (
              <tr key={payment.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{payment.studentId}</td>
                <td className="px-6 py-4">{payment.name}</td>
                <td className="px-6 py-4">{payment.class}</td>
                <td className="px-6 py-4 text-right font-bold">{(payment.amount).toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  {payment.status === 'paid' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      <CheckCircle size={14} /> ชำระแล้ว
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                      <XCircle size={14} /> ค้างชำระ
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    onClick={() => togglePaymentStatus(payment.id, payment.status)}
                    variant="outline" 
                    size="sm" 
                    className={payment.status === 'paid' ? 'text-rose-600 border-rose-200 hover:bg-rose-50' : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'}
                  >
                    {payment.status === 'paid' ? 'ยกเลิก' : 'ยืนยันรับชำระ'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
