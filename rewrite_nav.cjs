const fs = require('fs');

let code = fs.readFileSync('src/pages/AdminSettings.tsx', 'utf8');

const oldNavRegex = /<nav className="flex flex-col gap-1\.5">[\s\S]*?<\/nav>/;
const newNav = `<nav className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-2">ข้อมูลองค์กร</div>
            {renderTabButton('school_info', <Building2 size={18} />, 'ข้อมูลโรงเรียน')}
            {renderTabButton('master_data', <Database size={18} />, 'ข้อมูลพื้นฐาน')}
            {renderTabButton('edu_levels', <Layers size={18} />, 'จัดการระดับการศึกษา')}
            {renderTabButton('academic_years', <Calendar size={18} />, 'จัดการปีการศึกษา')}
            {renderTabButton('periods', <Clock size={18} />, 'จัดการคาบเรียน')}
            {renderTabButton('classrooms', <School size={18} />, 'จัดการห้องเรียน')}
            {renderTabButton('roles', <ShieldCheck size={18} />, 'จัดการสิทธิ์/บทบาท')}
            
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-4">การตั้งค่าอื่นๆ</div>
            {renderTabButton('student_time', <Clock size={18} />, 'เวลามาโรงเรียน')}
            {renderTabButton('staff_groups', <Users size={18} />, 'เวลาบุคลากร')}
            {renderTabButton('checkin_sys', <QrCode size={18} />, 'ระบบเช็คอิน')}
            {renderTabButton('positions', <Briefcase size={18} />, 'ตำแหน่งบุคลากร')}
            {renderTabButton('teacher_schedule', <BookOpen size={18} />, 'ผูกตารางสอน')}
            {renderTabButton('auto_schedule', <Building size={18} />, 'จัดตารางอัตโนมัติ')}
          </nav>`;

code = code.replace(oldNavRegex, newNav);

fs.writeFileSync('src/pages/AdminSettings.tsx', code);
console.log("Nav replaced.");
