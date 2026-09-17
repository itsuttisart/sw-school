const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/CurriculumSystem.tsx', 'utf8');

// The broken code starts right after ManageReligionSubjects ends
// Find the index of the end of ManageReligionSubjects
const endOfManageReligion = code.indexOf('  );\n};\n');
if (endOfManageReligion !== -1) {
  // Find where ManageTranscripts starts
  const startOfTranscripts = code.indexOf('function ManageTranscripts() {');
  
  const before = code.substring(0, endOfManageReligion + 7);
  const after = code.substring(startOfTranscripts);
  
  const newMiddle = `
function ManageTaughtSubjects() {
  const [selectedTerm, setSelectedTerm] = useState('1/2567');
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-700">รายวิชาที่เปิดสอน</h3>
        <Button className="shadow-md">
          <Plus size={18} className="mr-2" /> เปิดรายวิชาเพิ่ม
        </Button>
      </div>
      <div className="flex gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <select className="flex h-10 w-[200px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm" value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
          <option value="1/2567">ภาคเรียน 1/2567</option>
          <option value="2/2567">ภาคเรียน 2/2567</option>
        </select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input placeholder="ค้นหารายวิชา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white border-slate-200" />
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">รหัสวิชา</th>
              <th className="px-6 py-4 font-bold">ชื่อวิชา</th>
              <th className="px-6 py-4 font-bold">หน่วยกิต</th>
              <th className="px-6 py-4 font-bold text-center">ครูผู้สอน</th>
              <th className="px-6 py-4 font-bold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b border-slate-100 hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-900">ท21101</td>
              <td className="px-6 py-4">ภาษาไทย 1</td>
              <td className="px-6 py-4">1.5</td>
              <td className="px-6 py-4 text-center">อ.สมใจ รักเรียน</td>
              <td className="px-6 py-4 text-right">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 h-8 w-8"><Edit size={16} /></Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 h-8 w-8"><Trash2 size={16} /></Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManageLearningPlans() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-700">แผนการเรียนประจำห้อง</h3>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 border border-slate-200 rounded-xl p-4 bg-slate-50">
          <h4 className="font-bold text-slate-700 mb-3">เลือกห้องเรียน</h4>
          <select className="w-full p-2.5 rounded-lg border border-slate-200 bg-white mb-4">
            <option>ม.1/1</option>
            <option>ม.1/2</option>
            <option>ม.2/1</option>
          </select>
          <div className="text-sm text-slate-600">
            <p className="mb-2 font-semibold">สรุปหน่วยกิต: ม.1/1</p>
            <p>วิชาพื้นฐาน: 11.5 หน่วยกิต</p>
            <p>วิชาเพิ่มเติม: 2.0 หน่วยกิต</p>
            <p className="font-bold text-emerald-700 mt-2">รวม: 13.5 หน่วยกิต</p>
          </div>
        </div>
        
        <div className="w-full md:w-2/3 border border-slate-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-700">รายวิชาในแผนการเรียน</h4>
            <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
              <Plus size={14} className="mr-1" /> เพิ่มวิชาเข้าแผน
            </Button>
          </div>
          <div className="space-y-2">
            {['ท21101 ภาษาไทย 1', 'ค21101 คณิตศาสตร์ 1', 'ว21101 วิทยาศาสตร์ 1', 'ส21101 สังคมศึกษา 1', 'ส21201 อัลกุรอาน 1'].map((sub, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-slate-700">{sub}</span>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 h-8 w-8"><Trash2 size={14} /></Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ManageRegistration() {
  const handleRegister = () => {
    Swal.fire({
      title: 'ยืนยันการลงทะเบียนเรียน',
      text: 'ระบบจะดึงแผนการเรียนของแต่ละห้อง และลงทะเบียนวิชาเรียนให้กับนักเรียนทุกคนในห้องนั้นๆ อัตโนมัติ',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ดำเนินการ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#10b981',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('สำเร็จ', 'ลงทะเบียนเรียนอัตโนมัติเสร็จสิ้น', 'success');
      }
    });
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-700">ลงทะเบียนเรียนอัตโนมัติ</h3>
      </div>
      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center">
        <ClipboardCheck size={48} className="text-emerald-500 mx-auto mb-4" />
        <h4 className="text-xl font-bold text-emerald-800 mb-2">ระบบลงทะเบียนเรียนอ้างอิงจากแผนการเรียน</h4>
        <p className="text-emerald-600 max-w-lg mx-auto mb-6">
          เมื่อคุณจัดแผนการเรียนรายห้องเสร็จสิ้นแล้ว สามารถคลิกปุ่มด้านล่างเพื่อให้นำรายวิชาทั้งหมด ไปผูกเข้ากับนักเรียนทุกคนในห้องนั้นๆ อัตโนมัติ (ไม่ต้องให้นักเรียนลงทะเบียนเอง)
        </p>
        <Button onClick={handleRegister} className="shadow-md bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 h-auto text-lg rounded-xl">
          ประมวลผลลงทะเบียนเรียน ภาคเรียนที่ 1/2567
        </Button>
      </div>
    </div>
  );
}

`;
  
  fs.writeFileSync('src/pages/admin/CurriculumSystem.tsx', before + newMiddle + after);
  console.log("Fixed!");
} else {
  console.log("Could not find end of ManageReligionSubjects");
}
