import React, { useState, createContext, useContext } from 'react';
import { Upload, 
  BookOpen, Edit, Trash2, Plus, Filter, Search, ClipboardCheck, 
  FileOutput, Download, Users, FileText, CheckCircle2, User, BookMarked
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

// --- Types & Context ---
type Subject = {
  id: string;
  name: string;
  category: 'general' | 'religion';
  type: string;
  credit: number;
  grade: string;
};

type Teacher = { id: string; name: string; };

type TaughtSubject = {
  id: string;
  subjectId: string;
  term: string;
  teacherId: string;
};

type CurriculumContextType = {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  teachers: Teacher[];
  taughtSubjects: TaughtSubject[];
  setTaughtSubjects: React.Dispatch<React.SetStateAction<TaughtSubject[]>>;
  learningPlans: Record<string, string[]>;
  setLearningPlans: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  registrations: Record<string, boolean>;
  setRegistrations: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
};

const CurriculumContext = createContext<CurriculumContextType | null>(null);

const useCurriculum = () => {
  const ctx = useContext(CurriculumContext);
  if (!ctx) throw new Error('useCurriculum must be used within CurriculumProvider');
  return ctx;
};

const CurriculumProvider = ({ children }: { children: React.ReactNode }) => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 'ท21101', name: 'ภาษาไทย 1', category: 'general', type: 'พื้นฐาน', credit: 1.5, grade: 'มัธยมศึกษาปีที่ 1' },
    { id: 'ค21101', name: 'คณิตศาสตร์ 1', category: 'general', type: 'พื้นฐาน', credit: 1.5, grade: 'มัธยมศึกษาปีที่ 1' },
    { id: 'ว21201', name: 'คอมพิวเตอร์เพิ่มเติม 1', category: 'general', type: 'เพิ่มเติม', credit: 1.0, grade: 'มัธยมศึกษาปีที่ 1' },
    { id: 'ก21901', name: 'กิจกรรมแนะแนว', category: 'general', type: 'กิจกรรมพัฒนาผู้เรียน', credit: 0, grade: 'มัธยมศึกษาปีที่ 1' },
    { id: 'ศ21101', name: 'อัลกุรอาน 1', category: 'religion', type: 'พื้นฐาน', credit: 1.0, grade: 'ชั้นศาสนา 1' },
    { id: 'ศ21102', name: 'อัลฮะดีษ 1', category: 'religion', type: 'พื้นฐาน', credit: 1.0, grade: 'ชั้นศาสนา 1' },
    { id: 'ศ21201', name: 'ภาษาอาหรับ 1', category: 'religion', type: 'เพิ่มเติม', credit: 1.5, grade: 'ชั้นศาสนา 1' },
  ]);

  const [teachers] = useState<Teacher[]>([
    { id: 'T1', name: 'อ.สมใจ รักเรียน (สามัญ)' },
    { id: 'T2', name: 'อ.มานะ อุตสาหะ (สามัญ)' },
    { id: 'T3', name: 'อ.มูฮัมหมัด ซาเล็ม (ศาสนา)' },
    { id: 'T4', name: 'อ.ฟารีดา บินฮาซัน (ศาสนา)' },
  ]);

  const [taughtSubjects, setTaughtSubjects] = useState<TaughtSubject[]>([
    { id: 'TS1', subjectId: 'ท21101', term: '1/2567', teacherId: 'T1' },
    { id: 'TS2', subjectId: 'ศ21101', term: '1/2567', teacherId: 'T3' },
  ]);

  const [learningPlans, setLearningPlans] = useState<Record<string, string[]>>({
    'ม.1/1': ['ท21101', 'ค21101', 'ว21201', 'ศ21101', 'ศ21102'],
    'ม.1/2': ['ท21101', 'ค21101', 'ก21901', 'ศ21101'],
  });

  const [registrations, setRegistrations] = useState<Record<string, boolean>>({
    'ม.1/1': false,
    'ม.1/2': false,
  });

  return (
    <CurriculumContext.Provider value={{
      subjects, setSubjects, teachers, taughtSubjects, setTaughtSubjects,
      learningPlans, setLearningPlans, registrations, setRegistrations
    }}>
      {children}
    </CurriculumContext.Provider>
  );
};

// --- Main Component ---
export function AdminCurriculumSystem() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <CurriculumProvider>
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[80vh]">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
            <BookOpen size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">ระบบจัดการหลักสูตร (อ้างอิงข้อมูลเชื่อมโยงกัน)</h2>
            <p className="text-slate-500">จัดการรายวิชา แผนการเรียน และลงทะเบียนเรียนอัตโนมัติ</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 p-2 rounded-2xl border border-slate-100">
          {[
            { id: 'general', label: 'วิชาสามัญ', icon: BookOpen },
            { id: 'religion', label: 'วิชาศาสนา', icon: BookMarked },
            { id: 'taught', label: 'วิชาที่เปิดสอน', icon: Users },
            { id: 'plans', label: 'แผนการเรียนรายห้อง', icon: FileText },
            { id: 'registration', label: 'ลงทะเบียนเรียน', icon: ClipboardCheck },
            { id: 'transcripts', label: 'เอกสาร ปพ.', icon: FileOutput },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 flex-1 justify-center min-w-[140px] ${
                activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-200 border border-transparent'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[400px] animate-in fade-in duration-300">
          {activeTab === 'general' && <ManageSubjects category="general" />}
          {activeTab === 'religion' && <ManageSubjects category="religion" />}
          {activeTab === 'taught' && <ManageTaughtSubjects />}
          {activeTab === 'plans' && <ManageLearningPlans />}
          {activeTab === 'registration' && <ManageRegistration />}
          {activeTab === 'transcripts' && <ManageTranscripts />}
        </div>
      </div>
    </CurriculumProvider>
  );
}

// --- Sub Components ---

function ManageSubjects({ category }: { category: 'general' | 'religion' }) {
  const { subjects, setSubjects } = useCurriculum();
  const [searchTerm, setSearchTerm] = useState('');
  
  const GRADES = category === 'general' 
    ? ['มัธยมศึกษาปีที่ 1', 'มัธยมศึกษาปีที่ 2', 'มัธยมศึกษาปีที่ 3'] 
    : ['ชั้นศาสนา 1', 'ชั้นศาสนา 2', 'ชั้นศาสนา 3'];
    
  const [selectedGrade, setSelectedGrade] = useState(GRADES[0]);

  const handleAdd = () => {
    Swal.fire({
      title: `เพิ่มรายวิชา (${category === 'general' ? 'สามัญ' : 'ศาสนา'})`,
      html: `
        <select id="sub-grade" class="swal2-select w-[70%]">
          ${GRADES.map(g => `<option value="${g}" ${g === selectedGrade ? 'selected' : ''}>${g}</option>`).join('')}
        </select>
        <input id="sub-id" class="swal2-input" placeholder="รหัสวิชา (เช่น ${category === 'general' ? 'ท21101' : 'ศ21101'})">
        <input id="sub-name" class="swal2-input" placeholder="ชื่อวิชา">
        <select id="sub-type" class="swal2-select w-[70%]">
          <option value="พื้นฐาน">วิชาพื้นฐาน</option>
          <option value="เพิ่มเติม">วิชาเพิ่มเติม</option>
          <option value="กิจกรรมพัฒนาผู้เรียน">กิจกรรมพัฒนาผู้เรียน</option>
        </select>
        <input id="sub-credit" type="number" step="0.5" class="swal2-input" placeholder="หน่วยกิต/คาบ">
      `,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      preConfirm: () => {
        const grade = (document.getElementById('sub-grade') as HTMLSelectElement).value;
        const id = (document.getElementById('sub-id') as HTMLInputElement).value;
        const name = (document.getElementById('sub-name') as HTMLInputElement).value;
        const type = (document.getElementById('sub-type') as HTMLSelectElement).value;
        const credit = parseFloat((document.getElementById('sub-credit') as HTMLInputElement).value) || 0;
        
        if (!id || !name) {
          Swal.showValidationMessage('กรุณากรอกรหัสวิชาและชื่อวิชา');
          return false;
        }
        return { id, name, category, type, credit, grade };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setSubjects([...subjects, result.value as Subject]);
        Swal.fire('สำเร็จ', 'เพิ่มรายวิชาเรียบร้อยแล้ว', 'success');
      }
    });
  };

  const filteredSubjects = subjects.filter(s => 
    s.category === category &&
    s.grade === selectedGrade && 
    (s.id.includes(searchTerm) || s.name.includes(searchTerm))
  );

  const renderSubjectTable = (title: string, typeFilter: string, typeColorClass: string) => {
    const list = filteredSubjects.filter(s => s.type === typeFilter);
    return (
      <div className="mb-8 last:mb-0">
        <h4 className="text-md font-bold text-slate-700 mb-3 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${typeColorClass.split(' ')[0]}`}></div>
          {title} ({list.length} วิชา)
        </h4>
        {list.length > 0 ? (
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
                {list.map((s, idx) => (
                  <tr key={idx} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{s.id}</td>
                    <td className="px-6 py-4">{s.name}</td>
                    <td className="px-6 py-4"><span className={`${typeColorClass} px-2 py-1 rounded-md text-xs font-bold`}>{s.type}</span></td>
                    <td className="px-6 py-4 text-center font-bold">{s.credit > 0 ? s.credit.toFixed(1) : '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 h-8 w-8" onClick={() => setSubjects(subjects.filter(sub => sub.id !== s.id))}><Trash2 size={16} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-sm">ไม่พบข้อมูล</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-lg font-bold text-slate-700">รายวิชา{category === 'general' ? 'สามัญ' : 'ศาสนา/อิสลามศึกษา'}</h3>
        <Button onClick={handleAdd} className="shadow-md bg-emerald-600 hover:bg-emerald-700">
          <Plus size={18} className="mr-2" /> เพิ่มรายวิชา
        </Button>
      </div>
      <div className="flex gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <select className="flex h-10 w-[200px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
          {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
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
}

function ManageTaughtSubjects() {
  const { subjects, teachers, taughtSubjects, setTaughtSubjects } = useCurriculum();
  const [selectedTerm, setSelectedTerm] = useState('1/2567');
  
  const handleImport = () => {
    Swal.fire({
      title: 'นำเข้าข้อมูลหลักสูตร (Excel)',
      html: `
        <div class="text-sm text-slate-500 mb-2">กรุณาเลือกไฟล์ .xlsx หรือ .csv</div>
        <div class="mb-4">
          <a href="#" onclick="event.preventDefault(); alert('ดาวน์โหลดไฟล์แม่แบบ (Template) เรียบร้อย');" class="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            ดาวน์โหลดไฟล์แม่แบบ (Template)
          </a>
        </div>
        <input type="file" id="excel-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
      `,
      showCancelButton: true,
      confirmButtonText: 'นำเข้าข้อมูล',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#10b981',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'กำลังนำเข้าข้อมูล...',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); }
        });
        setTimeout(() => {
          Swal.fire('สำเร็จ', 'นำเข้าข้อมูลหลักสูตรเรียบร้อยแล้ว', 'success');
        }, 1500);
      }
    });
  };
  
  const handleOpenSubject = () => {
    const subOptions = subjects.map(s => `<option value="${s.id}">${s.id} - ${s.name} (${s.category === 'general' ? 'สามัญ' : 'ศาสนา'})</option>`).join('');
    const teacherOptions = teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    
    Swal.fire({
      title: 'เปิดรายวิชาที่สอน',
      html: `
        <div class="text-left mb-2 text-sm font-bold text-slate-600">เลือกวิชาจากหลักสูตร</div>
        <select id="ts-sub" class="swal2-select w-[90%] !text-sm">${subOptions}</select>
        <div class="text-left mt-4 mb-2 text-sm font-bold text-slate-600">เลือกครูผู้สอน</div>
        <select id="ts-teacher" class="swal2-select w-[90%] !text-sm">${teacherOptions}</select>
      `,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      preConfirm: () => {
        return {
          id: 'TS' + Date.now(),
          subjectId: (document.getElementById('ts-sub') as HTMLSelectElement).value,
          teacherId: (document.getElementById('ts-teacher') as HTMLSelectElement).value,
          term: selectedTerm
        };
      }
    }).then(res => {
      if (res.isConfirmed && res.value) {
        setTaughtSubjects([...taughtSubjects, res.value]);
        Swal.fire('สำเร็จ', 'เปิดรายวิชาเรียบร้อย', 'success');
      }
    });
  };

  const displayList = taughtSubjects.filter(ts => ts.term === selectedTerm).map(ts => {
    const sub = subjects.find(s => s.id === ts.subjectId);
    const teacher = teachers.find(t => t.id === ts.teacherId);
    return { ...ts, sub, teacher };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-700">รายวิชาที่เปิดสอน (อ้างอิงจากหลักสูตร)</h3>
        <Button variant="outline" onClick={handleImport} className="text-slate-600 mr-2 border-slate-200">
          <Upload size={18} className="mr-2" /> นำเข้าข้อมูล
        </Button>
        <Button onClick={handleOpenSubject} className="shadow-md bg-emerald-600 hover:bg-emerald-700">
          <Plus size={18} className="mr-2" /> เปิดรายวิชาเพิ่ม
        </Button>
      </div>
      <div className="flex gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <select className="flex h-10 w-[200px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
          <option value="1/2567">ภาคเรียน 1/2567</option>
          <option value="2/2567">ภาคเรียน 2/2567</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">รหัสวิชา</th>
              <th className="px-6 py-4 font-bold">ชื่อวิชา</th>
              <th className="px-6 py-4 font-bold text-center">หน่วยกิต</th>
              <th className="px-6 py-4 font-bold">ครูผู้สอน</th>
              <th className="px-6 py-4 font-bold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {displayList.map((item, idx) => (
              <tr key={idx} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{item.sub?.id || '-'}</td>
                <td className="px-6 py-4">
                  <div>{item.sub?.name || '-'}</div>
                  <div className="text-xs text-slate-400">{item.sub?.category === 'general' ? 'สามัญ' : 'ศาสนา'}</div>
                </td>
                <td className="px-6 py-4 text-center font-bold">{item.sub?.credit.toFixed(1) || '-'}</td>
                <td className="px-6 py-4 text-blue-700 font-medium">{item.teacher?.name || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600" onClick={() => setTaughtSubjects(taughtSubjects.filter(ts => ts.id !== item.id))}><Trash2 size={16} /></Button>
                </td>
              </tr>
            ))}
            {displayList.length === 0 && (
               <tr><td colSpan={5} className="text-center py-6 text-slate-500">ไม่มีรายวิชาที่เปิดสอนในเทอมนี้</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManageLearningPlans() {
  const { subjects, learningPlans, setLearningPlans } = useCurriculum();
  const [selectedRoom, setSelectedRoom] = useState('ม.1/1');
  const ROOMS = ['ม.1/1', 'ม.1/2', 'ม.2/1', 'ม.3/1'];

  const currentPlanIds = learningPlans[selectedRoom] || [];
  const currentSubjects = currentPlanIds.map(id => subjects.find(s => s.id === id)).filter(Boolean) as Subject[];

  const sumCredit = (type: string) => currentSubjects.filter(s => s.type === type).reduce((sum, s) => sum + s.credit, 0);
  const totalCredit = currentSubjects.reduce((sum, s) => sum + s.credit, 0);

  const handleAddSubjectToPlan = () => {
    const available = subjects.filter(s => !currentPlanIds.includes(s.id));
    if (available.length === 0) return Swal.fire('ข้อมูลครบแล้ว', 'วิชาทั้งหมดถูกเพิ่มในแผนแล้ว', 'info');
    
    const options = available.map(s => `<option value="${s.id}">${s.id} - ${s.name} (${s.category === 'general' ? 'สามัญ' : 'ศาสนา'})</option>`).join('');
    
    Swal.fire({
      title: 'เพิ่มวิชาเข้าแผนการเรียน',
      html: `<select id="plan-add" class="swal2-select w-[90%] !text-sm">${options}</select>`,
      showCancelButton: true,
      confirmButtonText: 'เพิ่มเข้าแผน',
      preConfirm: () => (document.getElementById('plan-add') as HTMLSelectElement).value
    }).then(res => {
      if (res.isConfirmed && res.value) {
        setLearningPlans({
          ...learningPlans,
          [selectedRoom]: [...currentPlanIds, res.value]
        });
      }
    });
  };

  const handleRemove = (id: string) => {
    setLearningPlans({
      ...learningPlans,
      [selectedRoom]: currentPlanIds.filter(subId => subId !== id)
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-700">แผนการเรียนประจำห้อง</h3>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 border border-slate-200 rounded-xl p-5 bg-slate-50 self-start sticky top-4">
          <h4 className="font-bold text-slate-700 mb-3">เลือกห้องเรียน</h4>
          <select className="w-full p-2.5 rounded-lg border border-slate-200 bg-white mb-6 font-bold text-slate-700" value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)}>
            {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="mb-3 font-bold text-slate-800 text-base border-b pb-2">สรุปหน่วยกิต: {selectedRoom}</p>
            <div className="space-y-2">
              <p className="flex justify-between"><span>วิชาพื้นฐาน:</span> <span className="font-bold">{sumCredit('พื้นฐาน').toFixed(1)}</span></p>
              <p className="flex justify-between"><span>วิชาเพิ่มเติม:</span> <span className="font-bold">{sumCredit('เพิ่มเติม').toFixed(1)}</span></p>
              <p className="flex justify-between"><span>กิจกรรม:</span> <span className="font-bold">{currentSubjects.filter(s => s.type === 'กิจกรรมพัฒนาผู้เรียน').length} กิจกรรม</span></p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between font-bold text-lg text-emerald-700">
              <span>รวมหน่วยกิต:</span> <span>{totalCredit.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-2/3 border border-slate-200 rounded-xl p-5 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-700">รายวิชาในแผนการเรียน</h4>
            <Button variant="outline" size="sm" onClick={handleAddSubjectToPlan} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
              <Plus size={14} className="mr-1" /> เพิ่มวิชาเข้าแผน
            </Button>
          </div>
          <div className="space-y-2">
            {currentSubjects.map((s) => (
              <div key={s.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-emerald-200 transition-colors">
                <div>
                  <span className="text-sm font-bold text-slate-800 mr-2">{s.id}</span>
                  <span className="text-sm text-slate-600">{s.name}</span>
                  <span className="text-xs ml-3 text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{s.credit.toFixed(1)} นก.</span>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 h-8 w-8" onClick={() => handleRemove(s.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            {currentSubjects.length === 0 && (
              <div className="text-center py-6 text-slate-400 border border-dashed rounded-lg bg-slate-50">ไม่มีรายวิชาในแผนการเรียน</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ManageRegistration() {
  const { learningPlans, registrations, setRegistrations, subjects } = useCurriculum();
  const ROOMS = ['ม.1/1', 'ม.1/2'];

  const handleRegister = (room: string) => {
    if (!learningPlans[room] || learningPlans[room].length === 0) {
      return Swal.fire('ไม่สามารถลงทะเบียนได้', 'ห้องนี้ยังไม่มีแผนการเรียน กรุณาจัดแผนการเรียนก่อน', 'warning');
    }

    Swal.fire({
      title: 'ประมวลผลลงทะเบียนเรียน',
      text: `ระบบจะนำ ${learningPlans[room].length} รายวิชาในแผนการเรียน ไปผูกกับนักเรียนทุกคนในห้อง ${room}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ดำเนินการ',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'กำลังประมวลผล',
          timer: 1500,
          didOpen: () => Swal.showLoading()
        }).then(() => {
          setRegistrations({ ...registrations, [room]: true });
          Swal.fire('สำเร็จ', 'ลงทะเบียนเรียนอัตโนมัติเสร็จสิ้น', 'success');
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-700">ประมวลผลลงทะเบียนเรียนอัตโนมัติ (อิงจากแผนการเรียน)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ROOMS.map(room => {
          const isReg = registrations[room];
          const planCount = learningPlans[room]?.length || 0;
          
          return (
            <div key={room} className={`border p-6 rounded-2xl shadow-sm transition-all ${isReg ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-slate-800">ห้อง {room}</h4>
                  <p className="text-sm text-slate-500 mt-1">นักเรียน: 30 คน | รายวิชาในแผน: {planCount} วิชา</p>
                </div>
                {isReg ? (
                  <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 size={14}/> ลงทะเบียนแล้ว
                  </div>
                ) : (
                  <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                    ยังไม่ประมวลผล
                  </div>
                )}
              </div>
              
              <div className="mt-6 border-t border-slate-100 pt-4">
                <Button 
                  onClick={() => handleRegister(room)} 
                  disabled={isReg}
                  className={`w-full ${isReg ? 'bg-slate-200 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                >
                  {isReg ? 'ประมวลผลแล้ว' : 'คลิกประมวลผลลงทะเบียน'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ManageTranscripts() {
  const handlePrint = (docType: string) => {
    Swal.fire({
      title: `กำลังสร้างเอกสาร ${docType}`,
      html: 'ดึงข้อมูลหน่วยกิต และผลการเรียนอ้างอิงจากรายวิชา...',
      timer: 1500,
      didOpen: () => Swal.showLoading()
    }).then(() => {
      Swal.fire('สำเร็จ', `สร้างเอกสาร ${docType} พร้อมพิมพ์`, 'success');
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-700">รายงาน และ เอกสาร ปพ.1-7 (ดึงข้อมูลโครงสร้างอัตโนมัติ)</h3>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center gap-4">
        <User className="text-blue-500" size={32} />
        <div>
          <p className="font-bold text-blue-800">จำลองการออกเอกสารให้: เด็กชาย สมชาย เรียนดี (ม.1/1)</p>
          <p className="text-sm text-blue-600">ระบบจะดึงรายวิชาที่นักเรียนลงทะเบียนตามแผนการเรียน ม.1/1 มาแสดงใน ปพ. อัตโนมัติ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[
          { id: 'ปพ.1', name: 'ระเบียนแสดงผลการเรียน', color: 'blue' },
          { id: 'ปพ.2', name: 'ประกาศนียบัตร', color: 'indigo' },
          { id: 'ปพ.3', name: 'แบบรายงานผู้สำเร็จการศึกษา', color: 'amber' },
          { id: 'ปพ.5', name: 'สมุดบันทึกผลการพัฒนาคุณภาพ', color: 'emerald' },
          { id: 'ปพ.6', name: 'สมุดรายงานผลการพัฒนา', color: 'rose' },
        ].map(doc => (
          <div key={doc.id} onClick={() => handlePrint(doc.id)} className="border border-slate-200 p-5 rounded-xl bg-white shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className={`bg-${doc.color}-50 p-3 rounded-lg text-${doc.color}-600 group-hover:scale-110 transition-transform`}>
                <FileOutput size={24} />
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400 group-hover:text-emerald-600"><Download size={18} /></Button>
            </div>
            <h4 className="font-bold text-slate-800 text-lg">{doc.id}</h4>
            <p className="text-sm text-slate-500 mt-1">{doc.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
