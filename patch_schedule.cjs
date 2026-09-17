const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/ManageSchedules.tsx', 'utf8');

// Add "ตั้งค่ารายวิชาและผู้สอน" button and section
code = code.replace(/<div className="flex bg-slate-100 p-1 rounded-lg">/, `<Button onClick={() => setViewMode('setup')} variant="outline" className={\`mr-4 \${viewMode === 'setup' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'text-slate-600'}\`}>
          <Settings size={18} className="mr-2" /> ผูกรายวิชาและผู้สอน
        </Button>
        <div className="flex bg-slate-100 p-1 rounded-lg">`);

code = code.replace(/\{viewMode === 'class' \? \(/, `{viewMode === 'setup' ? null : viewMode === 'class' ? (`);

code = code.replace(/<div className="border border-slate-200 rounded-xl bg-slate-50 p-8 flex flex-col items-center justify-center text-center">/, `{viewMode === 'setup' ? (
        <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">ตั้งค่าความสัมพันธ์: รายวิชา - ผู้สอน - ห้องเรียน</h3>
            <Button onClick={() => Swal.fire('สำเร็จ', 'จัดตารางเรียนอัตโนมัติเรียบร้อยแล้ว', 'success')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Wand2 size={18} className="mr-2" /> จัดตารางอัตโนมัติ
            </Button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
            <p className="text-sm text-blue-800 font-medium">ระบบจะดึงรายวิชาจาก <b>"ระบบหลักสูตร"</b> มาแสดงให้คุณผูกครูผู้สอนและห้องเรียน จากนั้นคุณสามารถกด "จัดตารางอัตโนมัติ" ได้</p>
          </div>
          
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold">รหัสวิชา</th>
                  <th className="px-4 py-3 font-bold">ชื่อวิชา (จากหลักสูตร)</th>
                  <th className="px-4 py-3 font-bold">ผู้สอน</th>
                  <th className="px-4 py-3 font-bold">กลุ่มเรียน/ห้อง</th>
                  <th className="px-4 py-3 font-bold text-center">ชั่วโมง/สัปดาห์</th>
                  <th className="px-4 py-3 font-bold text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-800">ท21101</td>
                  <td className="px-4 py-3">ภาษาไทยพื้นฐาน 1</td>
                  <td className="px-4 py-3">
                    <select className="border border-slate-200 rounded p-1 text-xs">
                      <option>ครูสมใจ รักเรียน</option>
                      <option>ครูมานะ ขยันยิ่ง</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input type="text" className="border border-slate-200 rounded p-1 text-xs w-24" defaultValue="ม.1/1, ม.1/2" />
                  </td>
                  <td className="px-4 py-3 text-center">3</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="text-indigo-600">บันทึก</Button>
                  </td>
                </tr>
                <tr className="bg-white border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-800">ค21101</td>
                  <td className="px-4 py-3">คณิตศาสตร์พื้นฐาน 1</td>
                  <td className="px-4 py-3">
                    <select className="border border-slate-200 rounded p-1 text-xs">
                      <option>ครูวิไล สวยงาม</option>
                      <option>ครูสมใจ รักเรียน</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input type="text" className="border border-slate-200 rounded p-1 text-xs w-24" defaultValue="ม.1/1" />
                  </td>
                  <td className="px-4 py-3 text-center">4</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="text-indigo-600">บันทึก</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
      <div className="border border-slate-200 rounded-xl bg-slate-50 p-8 flex flex-col items-center justify-center text-center">`);

// Add missing closing brace for the ternary condition
code = code.replace(/ตารางเรียนรูปแบบตารางกริด \(Grid\)\s*<\/p>\s*<\/div>/, `ตารางเรียนรูปแบบตารางกริด (Grid)
         </p>
      </div>)}`);

// Add imports
if (!code.includes('Settings')) {
  code = code.replace(/import \{ CalendarDays, Edit, Eye \} from 'lucide-react';/, "import { CalendarDays, Edit, Eye, Settings, Wand2 } from 'lucide-react';\nimport Swal from 'sweetalert2';");
}

code = code.replace(/useState\<'class' | 'teacher'\>\('class'\)/, "useState<'class' | 'teacher' | 'setup'>('setup')");
code = code.replace(/<div className="flex flex-col md:flex-row gap-4 mb-6">/, `{viewMode !== 'setup' && (<div className="flex flex-col md:flex-row gap-4 mb-6">`);
code = code.replace(/<Edit size=\{18\} className="mr-2" \/> จัดตาราง\s*<\/Button>\s*<\/div>/, `<Edit size={18} className="mr-2" /> จัดตาราง\n        </Button>\n      </div>)}`);

fs.writeFileSync('src/pages/admin/ManageSchedules.tsx', code);
