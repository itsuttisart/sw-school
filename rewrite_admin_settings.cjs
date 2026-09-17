const fs = require('fs');

let code = fs.readFileSync('src/pages/AdminSettings.tsx', 'utf8');

// 1. Add new imports
const importComponents = `
import { AdminManageSchoolInfo } from './admin/ManageSchoolInfo';
import { AdminManageMasterData } from './admin/ManageMasterData';
import { AdminManageEducationLevels } from './admin/ManageEducationLevels';
import { AdminManageAcademicYears } from './admin/ManageAcademicYears';
import { AdminManagePeriods } from './admin/ManagePeriods';
import { AdminManageClasses } from './admin/ManageClasses';
import { AdminRoleManagement } from './admin/RoleManagement';
import { Building2, Database, School, ShieldCheck, Settings } from 'lucide-react';
`;
code = code.replace("import Swal from 'sweetalert2';", "import Swal from 'sweetalert2';\n" + importComponents);

// Default active tab to school_info
code = code.replace("useState('student_time')", "useState('school_info')");

// 2. Rewrite the tab buttons section
const oldNav = `          <nav className="flex flex-col gap-1">
            {renderTabButton('student_time', <Clock size={18} />, 'เวลามาโรงเรียนนักเรียน')}
            {renderTabButton('staff_groups', <Users size={18} />, 'กลุ่มและเวลาเข้างานบุคลากร')}
            {renderTabButton('checkin_sys', <QrCode size={18} />, 'ระบบเช็คอิน / สแกน')}
            {renderTabButton('positions', <Briefcase size={18} />, 'ตำแหน่งบุคลากร')}
            {renderTabButton('teacher_schedule', <BookOpen size={18} />, 'ตารางสอนบุคลากร')}
            {renderTabButton('auto_schedule', <Building size={18} />, 'จัดตารางเรียนอัตโนมัติ')}
          </nav>`;

const newNav = `          <nav className="flex flex-col gap-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-2">ข้อมูลองค์กร</div>
            {renderTabButton('school_info', <Building2 size={18} />, 'ข้อมูลโรงเรียน')}
            {renderTabButton('master_data', <Database size={18} />, 'ข้อมูลพื้นฐาน')}
            {renderTabButton('edu_levels', <Layers size={18} />, 'จัดการระดับการศึกษา')}
            {renderTabButton('classrooms', <School size={18} />, 'จัดการห้องเรียน')}
            {renderTabButton('periods', <Clock size={18} />, 'จัดการคาบเรียน')}
            {renderTabButton('academic_years', <Calendar size={18} />, 'จัดการปีการศึกษา')}
            {renderTabButton('roles', <ShieldCheck size={18} />, 'จัดการสิทธิ์/บทบาท')}
            
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-4">การตั้งค่าอื่นๆ (รอพัฒนา)</div>
            {renderTabButton('student_time', <Clock size={18} />, 'เวลามาโรงเรียนนักเรียน')}
            {renderTabButton('staff_groups', <Users size={18} />, 'เวลาเข้างานบุคลากร')}
            {renderTabButton('checkin_sys', <QrCode size={18} />, 'ระบบเช็คอิน / สแกน')}
            {renderTabButton('positions', <Briefcase size={18} />, 'ตำแหน่งบุคลากร')}
            {renderTabButton('teacher_schedule', <BookOpen size={18} />, 'ผูกตารางสอนครู')}
            {renderTabButton('auto_schedule', <Building size={18} />, 'จัดตารางเรียนอัตโนมัติ')}
          </nav>`;

code = code.replace(oldNav, newNav);

// 3. Rewrite the content wrapper logic
const isOldTabCheck = `
      <div className="md:col-span-9">
        {['student_time', 'staff_groups', 'checkin_sys', 'positions', 'teacher_schedule', 'auto_schedule'].includes(activeTab) ? (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">`;

const oldContentStart = `      <div className="md:col-span-9 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">`;

code = code.replace(oldContentStart, isOldTabCheck);

const endOldContent = `      </div>
    </div>
  );
}`;

const newEndContent = `          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {activeTab === 'school_info' && <AdminManageSchoolInfo />}
            {activeTab === 'master_data' && <AdminManageMasterData />}
            {activeTab === 'edu_levels' && <AdminManageEducationLevels />}
            {activeTab === 'academic_years' && <AdminManageAcademicYears />}
            {activeTab === 'periods' && <AdminManagePeriods />}
            {activeTab === 'classrooms' && <AdminManageClasses />}
            {activeTab === 'roles' && <AdminRoleManagement />}
          </div>
        )}
      </div>
    </div>
  );
}`;

code = code.replace(endOldContent, newEndContent);

fs.writeFileSync('src/pages/AdminSettings.tsx', code);
console.log("Rewrote AdminSettings.tsx");
