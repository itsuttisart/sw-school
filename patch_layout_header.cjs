const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');

// 1. Update AppLayoutProps
code = code.replace(/interface AppLayoutProps \{[\s\S]*?onMenuChange: \(menu: string\) => void;\n\}/, 
`interface AppLayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  currentMenu: string;
  onMenuChange: (menu: string) => void;
  simulatedUser?: User | null;
  onSimulateUser?: (u: User | null) => void;
}`);

// 2. Destructure new props
code = code.replace(/export function AppLayout\(\{ user, onLogout, children, currentMenu, onMenuChange \}: AppLayoutProps\) \{/, 
`export function AppLayout({ user, onLogout, children, currentMenu, onMenuChange, simulatedUser, onSimulateUser }: AppLayoutProps) {`);

// 3. Add to desktop header
code = code.replace(/<div className="flex gap-2">\s*<Button variant="ghost" size="icon" className="text-slate-500 rounded-lg bg-slate-50 hover:bg-slate-100">/, 
`<div className="flex items-center gap-4">
             {user.role === 'admin' && onSimulateUser && (
                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-700">จำลองมุมมองข้อมูล:</span>
                  <select 
                    className="text-xs border border-indigo-200 rounded p-1 bg-white text-indigo-900 font-medium outline-none"
                    value={simulatedUser ? simulatedUser.role : ''}
                    onChange={(e) => {
                       const role = e.target.value;
                       if (!role) onSimulateUser(null);
                       else if (role === 'teacher') onSimulateUser({ id: 't1', name: 'ครูสมใจ รักเรียน', role: 'teacher' });
                       else if (role === 'student') onSimulateUser({ id: 's1', name: 'ด.ช. สมชาย เรียนดี', role: 'student' });
                       else if (role === 'parent') onSimulateUser({ id: 'p1', name: 'นาย ผู้ปกครอง สมชาย', role: 'parent' });
                    }}
                  >
                    <option value="">(ตัวเอง)</option>
                    <option value="teacher">ครู (สมใจ)</option>
                    <option value="student">นักเรียน (สมชาย)</option>
                    <option value="parent">ผู้ปกครอง (สมชาย)</option>
                  </select>
                </div>
             )}
             <Button variant="ghost" size="icon" className="text-slate-500 rounded-lg bg-slate-50 hover:bg-slate-100">`);

// 4. Update the getMenuItems for Admin
const newMenuLogic = `const getMenuItems = (role: string): MenuItem[] => {
  const commonDashboard = { label: 'Dashboard', icon: Home };
  
  if (role === 'admin') {
    return [
      commonDashboard,
      { label: 'จัดการข้อมูลผู้ใช้', isHeader: true },
      { label: 'จัดการนักเรียน', icon: Users },
      { label: 'จัดการครู', icon: Briefcase },
      { label: 'จัดการผู้ปกครอง', icon: Users },
      
      { label: 'ข้อมูลโรงเรียน', isHeader: true },
      { label: 'ระบบหลักสูตร (ทั้งหมด)', icon: BookOpen },
      { label: 'จัดการตารางเรียน/สอน', icon: CalendarDays },
      
      { label: 'ระบบจัดการ', isHeader: true },
      { label: 'ระบบการเงิน', icon: CreditCard },
      { label: 'ระบบพัสดุ', icon: Package },
      { label: 'ระบบกิจการนักเรียน', icon: Activity },
      { label: 'แจ้งซ่อมแซม', icon: Wrench },
      
      { label: 'งานสารบรรณและประกาศ', isHeader: true },
      { label: 'ระบบสารบรรณ', icon: FileText },
      { label: 'คลังเอกสาร', icon: Archive },
      { label: 'ระบบประกาศ', icon: Megaphone },
      { label: 'จัดการป็อปอัพ', icon: MessageSquare },
      
      { label: 'ตั้งค่า', isHeader: true },
      { label: 'ตั้งค่าระบบ', icon: Settings },
      
      { label: '--- มุมมองของครู ---', isHeader: true },
      { label: 'ลงเวลาปฏิบัติงาน', icon: Clock },
      { label: 'เช็คชื่อ', icon: ClipboardCheck },
      { label: 'บันทึกคะแนน', icon: Award },
      { label: 'สแกนมาโรงเรียน', icon: MonitorPlay },
      { label: 'รายชื่อนักเรียน', icon: Users },
      { label: 'ข้อมูลนักเรียน', icon: FileText },
      { label: 'ข้อมูลผู้ปกครอง', icon: Users },
      { label: 'แชทกับผู้ปกครอง', icon: MessageCircle },
      
      { label: '--- มุมมองของนักเรียน ---', isHeader: true },
      { label: 'ข้อมูลส่วนตัว', icon: UserCircle },
      { label: 'ตารางเรียน', icon: BookOpen },
      { label: 'การเข้าเรียน', icon: Clock },
      { label: 'การบ้าน', icon: FileEdit },
      { label: 'คะแนน', icon: BarChart },
      { label: 'ผลการเรียน', icon: GraduationCap },
      { label: 'ข่าวสาร', icon: Megaphone },
      { label: 'ปฏิทินกิจกรรม', icon: Calendar },
      { label: 'เอกสาร', icon: FileText },
      { label: 'กิจกรรม/ผลงาน', icon: Trophy },
      { label: 'แจ้งเตือน', icon: Bell },
      
      { label: '--- มุมมองของผู้ปกครอง ---', isHeader: true },
      { label: 'ข้อมูลบุตร', icon: UserCircle },
      { label: 'การมาเรียน', icon: Clock },
      { label: 'แชทกับครูที่ปรึกษา', icon: MessageCircle }
    ];
  }`;

code = code.replace(/const getMenuItems = \(role: string\): MenuItem\[\] => \{[\s\S]*?if \(role === 'admin'\) \{[\s\S]*?return \[[^]*?\];\n  \}/, newMenuLogic);

// Add missing icon imports if needed
if (!code.includes('ClipboardCheck,')) {
    code = code.replace(/import \{ /, "import { ClipboardCheck, MonitorPlay, ");
}

fs.writeFileSync('src/components/layout/AppLayout.tsx', code);
