const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/FinanceSystem.tsx', 'utf8');

// ManagePayments: Add summary
code = code.replace(/<div className="flex flex-col md:flex-row justify-between items-center gap-4">/, `
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
`);

// MOCK_TUITION_FEES change to Groups
code = code.replace(/const MOCK_TUITION_FEES = \[[\s\S]*?\];/, `const MOCK_TUITION_FEES = [
  { id: 1, groupName: 'กลุ่มค่าเทอมปกติ (ม.1)', term: '1/2568', amount: 2500, deadline: '2025-06-30', studentsCount: 120 },
  { id: 2, groupName: 'กลุ่มเรียนพิเศษ (EP)', term: '1/2568', amount: 15000, deadline: '2025-06-30', studentsCount: 45 },
  { id: 3, groupName: 'กลุ่มนักเรียนทุน (ยกเว้น)', term: '1/2568', amount: 0, deadline: '2025-06-30', studentsCount: 15 },
];`);

// ManageTuition table update
code = code.replace(/<th className="px-6 py-4 font-bold">ระดับชั้น<\/th>/, `<th className="px-6 py-4 font-bold">ชื่อกลุ่มค่าธรรมเนียม</th><th className="px-6 py-4 font-bold text-center">จำนวนนักเรียน</th>`);
code = code.replace(/<td className="px-6 py-4">\{fee\.level\}<\/td>/, `<td className="px-6 py-4 font-bold text-slate-700">{fee.groupName}</td><td className="px-6 py-4 text-center"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-bold">{fee.studentsCount} คน</span></td>`);

// ManageTuition action buttons update - add manage students button
code = code.replace(/<td className="px-6 py-4 text-right">\s*<Button/m, `<td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 mr-2" onClick={() => Swal.fire('จัดการนักเรียน', 'เปิดหน้ารายชื่อนักเรียนในกลุ่ม ' + fee.groupName, 'info')}>
                    <Users size={14} className="mr-1" /> จัดการนักเรียน
                  </Button>
                  <Button`);


// Fix the Swal inside handleAddFee to match group input instead of just select level
code = code.replace(/<label class="block text-sm font-medium text-slate-700 mb-1">ระดับชั้น<\/label>[\s\S]*?<\/select>/, `<label class="block text-sm font-medium text-slate-700 mb-1">ชื่อกลุ่มค่าธรรมเนียม</label>
          <input type="text" class="swal2-input !w-full !m-0" placeholder="เช่น ค่าเทอม EP, กลุ่มนักเรียนทุน">`);


// Add Users icon to import if needed
if (!code.includes('Users')) {
  code = code.replace(/import \{ /, "import { Users, ");
}

fs.writeFileSync('src/pages/admin/FinanceSystem.tsx', code);
