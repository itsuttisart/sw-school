const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/ManageStudents.tsx', 'utf8');

// replace view type
code = code.replace(/useState<'list' \| 'form'>\('list'\);/, "useState<'list' | 'form' | 'report'>('list');");

// import icons for report
code = code.replace(/import \{ (.*) \} from 'lucide-react';/, "import { $1, FileText, PieChart, Download, BarChart2 } from 'lucide-react';");

// add report button to header (when view === 'list')
const headerHTML = `
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="text-emerald-500" /> จัดการข้อมูลนักเรียน
          </h2>
          <p className="text-slate-500 text-sm mt-1">เพิ่ม ลบ แก้ไข ข้อมูลนักเรียนทั้งหมดในสถานศึกษา</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={() => setView('report')} className="flex-1 md:flex-none text-blue-600 border-blue-200 hover:bg-blue-50">
            <BarChart2 size={18} className="mr-2" /> รายงาน/สถิติ
          </Button>
          <Button variant="outline" onClick={handleImportExcel} className="flex-1 md:flex-none text-slate-600">
            <Upload size={18} className="mr-2" /> นำเข้า (Excel)
          </Button>
          <Button onClick={handleAdd} className="flex-1 md:flex-none shadow-md bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus size={18} className="mr-2" /> เพิ่มนักเรียน
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
              <BarChart2 className="text-blue-500" /> รายงานข้อมูลนักเรียน
            </h2>
            <p className="text-slate-500 text-sm mt-1">ดาวน์โหลดข้อมูลสถิติที่เกี่ยวข้องกับนักเรียน</p>
          </div>
          <Button variant="ghost" onClick={() => setView('list')} className="text-slate-400 hover:text-slate-600">
            <X size={20} /> กลับหน้ารายชื่อ
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50">
              <PieChart size={24} className="text-emerald-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">สรุปการมาเรียนประจำเดือน</h4>
              <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">ข้อมูลสถิติการเข้าเรียน สาย ขาด ของนักเรียนทั้งหมดแยกตามระดับชั้น</p>
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
          
          <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <FileText size={24} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">รายงานผลการเรียนเฉลี่ย (GPA)</h4>
              <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">สรุปเกรดเฉลี่ยรายห้อง และภาพรวมของสถานศึกษาประจำภาคเรียน</p>
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

fs.writeFileSync('src/pages/admin/ManageStudents.tsx', code);
console.log("Updated ManageStudents");
