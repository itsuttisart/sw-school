const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/FinanceSystem.tsx', 'utf8');

// replace view type
code = code.replace(/useState<'list' \| 'form'>\('list'\);/, "useState<'list' | 'form' | 'report'>('list');");

// import icons for report
code = code.replace(/import \{ (.*) \} from 'lucide-react';/, "import { $1, FileSpreadsheet, Download, BarChart2 } from 'lucide-react';");

// add report button to header
const headerHTML = `
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="text-amber-500" /> ระบบการเงิน
          </h2>
          <p className="text-slate-500 text-sm mt-1">จัดการค่าธรรมเนียมการศึกษา และบันทึกการรับชำระเงิน</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={() => setView('report')} className="flex-1 md:flex-none text-blue-600 border-blue-200 hover:bg-blue-50">
            <BarChart2 size={18} className="mr-2" /> รายงาน/สถิติ
          </Button>
          <Button onClick={handleAdd} className="bg-amber-500 hover:bg-amber-600 shadow-md text-white flex-1 md:flex-none">
            <Plus size={18} className="mr-2" /> สร้างรายการเรียกเก็บ
          </Button>
        </div>
      </div>
`;

code = code.replace(/<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">[\s\S]*?<div className="flex gap-2 w-full md:w-auto">[\s\S]*?<\/div>\s*<\/div>/, headerHTML);

// add report view implementation
const reportHTML = `
  if (view === 'report') {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart2 className="text-blue-500" /> รายงานการเงิน
            </h2>
            <p className="text-slate-500 text-sm mt-1">ดาวน์โหลดข้อมูลสถิติและรายงานการรับชำระเงิน</p>
          </div>
          <Button variant="ghost" onClick={() => setView('list')} className="text-slate-400 hover:text-slate-600">
            <X size={20} /> กลับหน้าหลัก
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-50">
              <FileSpreadsheet size={24} className="text-amber-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">รายงานการรับชำระเงิน</h4>
              <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">สรุปยอดรายรับ ค่าธรรมเนียมการศึกษา และยอดค้างชำระประจำภาคเรียน</p>
              <div className="flex gap-2">
                <button className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  <Download size={14} /> PDF
                </button>
                <button className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  <Download size={14} /> Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
`;

code = code.replace(/if \(view === 'form'\) \{/, reportHTML + "\n  if (view === 'form') {");

fs.writeFileSync('src/pages/admin/FinanceSystem.tsx', code);
console.log("Updated FinanceSystem");
