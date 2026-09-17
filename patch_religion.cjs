const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/CurriculumSystem.tsx', 'utf8');

const oldFuncRegex = /function ManageReligionSubjects\(\) \{[\s\S]*?return \([\s\S]*?\}\s*\);\s*\}/;

const newFunc = `function ManageReligionSubjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('ชั้นศาสนา 1');
  
  const GRADES = ['ชั้นศาสนา 1', 'ชั้นศาสนา 2', 'ชั้นศาสนา 3', 'ชั้นศาสนา 4', 'ชั้นศาสนา 5', 'ชั้นศาสนา 6'];
  const MOCK_SUBJECTS = [
    { id: 'ศ21101', name: 'อัลกุรอาน 1', type: 'พื้นฐาน', credit: 1.0, grade: 'ชั้นศาสนา 1' },
    { id: 'ศ21102', name: 'อัลฮะดีษ 1', type: 'พื้นฐาน', credit: 1.0, grade: 'ชั้นศาสนา 1' },
    { id: 'ศ21201', name: 'ภาษาอาหรับ 1', type: 'เพิ่มเติม', credit: 1.5, grade: 'ชั้นศาสนา 1' },
    { id: 'ก21901', name: 'กิจกรรมชมรมศาสนา', type: 'กิจกรรมพัฒนาผู้เรียน', credit: 0, grade: 'ชั้นศาสนา 1' },
    { id: 'ศ22101', name: 'อัลกุรอาน 2', type: 'พื้นฐาน', credit: 1.0, grade: 'ชั้นศาสนา 2' },
  ];
  
  const handleAdd = () => {
    Swal.fire({
      title: 'เพิ่มรายวิชา (ศาสนา)',
      html: \`
        <select id="sub-grade" class="swal2-select w-[70%]">
          \${GRADES.map(g => \`<option value="\${g}" \${g === selectedGrade ? 'selected' : ''}>\${g}</option>\`).join('')}
        </select>
        <input id="sub-id" class="swal2-input" placeholder="รหัสวิชา (เช่น ศ21101)">
        <input id="sub-name" class="swal2-input" placeholder="ชื่อวิชา (เช่น อัลกุรอาน 1)">
        <select id="sub-type" class="swal2-select w-[70%]">
          <option value="พื้นฐาน">วิชาพื้นฐาน</option>
          <option value="เพิ่มเติม">วิชาเพิ่มเติม</option>
          <option value="กิจกรรมพัฒนาผู้เรียน">กิจกรรมพัฒนาผู้เรียน</option>
        </select>
        <input id="sub-credit" type="number" step="0.5" class="swal2-input" placeholder="หน่วยกิต/คาบ (ถ้ามี)">
      \`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#10b981',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('สำเร็จ', 'เพิ่มรายวิชาศาสนาเรียบร้อยแล้ว', 'success');
      }
    });
  };

  const filteredSubjects = MOCK_SUBJECTS.filter(s => 
    s.grade === selectedGrade && 
    (s.id.includes(searchTerm) || s.name.includes(searchTerm))
  );

  const renderSubjectTable = (title: string, typeFilter: string, typeColorClass: string) => {
    const subjects = filteredSubjects.filter(s => s.type === typeFilter);
    
    return (
      <div className="mb-8 last:mb-0">
        <h4 className="text-md font-bold text-slate-700 mb-3 flex items-center gap-2">
          <div className={\`w-3 h-3 rounded-full \${typeColorClass.split(' ')[0]}\`}></div>
          {title} ({subjects.length} วิชา)
        </h4>
        {subjects.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold w-[15%]">รหัสวิชา</th>
                  <th className="px-6 py-4 font-bold w-[40%]">ชื่อวิชา</th>
                  <th className="px-6 py-4 font-bold w-[15%]">ประเภท</th>
                  <th className="px-6 py-4 font-bold w-[15%] text-center">หน่วยกิต</th>
                  <th className="px-6 py-4 font-bold w-[15%] text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s, idx) => (
                  <tr key={idx} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{s.id}</td>
                    <td className="px-6 py-4">{s.name}</td>
                    <td className="px-6 py-4">
                      <span className={\`\${typeColorClass} px-2 py-1 rounded-md text-xs font-bold\`}>{s.type}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold">{s.credit > 0 ? s.credit.toFixed(1) : '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 h-8 w-8"><Edit size={16} /></Button>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 h-8 w-8"><Trash2 size={16} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-sm">
            ไม่พบข้อมูลรายวิชา
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-lg font-bold text-slate-700">รายวิชาศาสนา/อิสลามศึกษา</h3>
        <Button onClick={handleAdd} className="shadow-md">
          <Plus size={18} className="mr-2" /> เพิ่มรายวิชา
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="text-slate-400" size={20} />
          <select 
            className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input placeholder="ค้นหารหัสวิชา หรือชื่อวิชา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white border-slate-200" />
        </div>
      </div>

      <div className="pt-4">
        {renderSubjectTable('วิชาพื้นฐาน', 'พื้นฐาน', 'bg-blue-100 text-blue-700')}
        {renderSubjectTable('วิชาเพิ่มเติม', 'เพิ่มเติม', 'bg-indigo-100 text-indigo-700')}
        {renderSubjectTable('กิจกรรมพัฒนาผู้เรียน', 'กิจกรรมพัฒนาผู้เรียน', 'bg-emerald-100 text-emerald-700')}
      </div>
    </div>
  );
}`;

if (oldFuncRegex.test(code)) {
  code = code.replace(oldFuncRegex, newFunc);
  fs.writeFileSync('src/pages/admin/CurriculumSystem.tsx', code);
  console.log("Patched successfully!");
} else {
  console.log("Could not find the function to replace.");
}

