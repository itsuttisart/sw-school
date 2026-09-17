const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');

const newMenuLogic = `const getMenuItems = (role: string): MenuItem[] => {
  const commonDashboard = { label: 'Dashboard', icon: Home };
  
  if (role === 'admin') {
    return [
      commonDashboard,
      { label: 'จัดการป็อปอัพ', icon: MessageSquare },
      
      { label: 'ระบบหลัก', isHeader: true },
      { label: 'จัดการข้อมูลนักเรียน', icon: Users },
      { label: 'จัดการครูและบุคลากร', icon: Briefcase },
      { label: 'โครงสร้างโรงเรียน', icon: School },
      
      { label: 'ระบบจัดการ', isHeader: true },
      { label: 'ระบบการเงิน', icon: CreditCard },
      { label: 'ระบบพัสดุและคลัง', icon: Package },
      { label: 'ระบบกิจการนักเรียน', icon: Activity },
      { label: 'ระบบประกาศ', icon: Megaphone },
      
      { label: 'เอกสารและรายงาน', isHeader: true },
      { label: 'คลังเอกสาร', icon: Archive },
    ];
  }
  
  if (role === 'teacher') {
    return [
      commonDashboard,
      { label: 'จัดการป็อปอัพ', icon: MessageSquare },
      
      { label: 'การสอน', isHeader: true },
      { label: 'ตารางสอน', icon: CalendarDays },
      { label: 'เช็คชื่อ', icon: ClipboardList }, // This acts as เช็คชื่อรายวิชา + โฮมรูม
      { label: 'บันทึกคะแนน', icon: Award },
      
      { label: 'งานที่ปรึกษา', isHeader: true },
      { label: 'ข้อมูลนักเรียน', icon: Users },
      { label: 'ประเมิน SDQ/EQ', icon: FileText },
      { label: 'บันทึกพฤติกรรม', icon: Heart },
      { label: 'เยี่ยมบ้าน', icon: MapPin },
      
      { label: 'เอกสาร', isHeader: true },
      { label: 'เอกสารของครู', icon: FolderOpen },
      { label: 'ดาวน์โหลดแบบฟอร์ม', icon: Download },
    ];
  }
  
  if (role === 'student') {
    return [
      commonDashboard,
      { label: 'ข้อมูลและเอกสาร', isHeader: true },
      { label: 'ข้อมูลส่วนตัว', icon: UserCircle },
      { label: 'เอกสาร', icon: FileText },
      { label: 'กิจกรรม/ผลงาน', icon: Trophy },
      
      { label: 'การเรียน', isHeader: true },
      { label: 'ตารางเรียน', icon: BookOpen },
      { label: 'การเข้าเรียน', icon: Clock },
      { label: 'การบ้าน', icon: FileEdit },
      
      { label: 'ผลการศึกษา', isHeader: true },
      { label: 'คะแนน', icon: BarChart },
      { label: 'ผลการเรียน', icon: GraduationCap },
      
      { label: 'ข่าวสารและกิจกรรม', isHeader: true },
      { label: 'ข่าวสาร', icon: Megaphone },
      { label: 'ปฏิทินกิจกรรม', icon: Calendar },
      { label: 'แจ้งเตือน', icon: Bell },
    ];
  }
  
  if (role === 'parent') {
    return [
      commonDashboard,
      { label: 'ข้อมูลบุตร', isHeader: true },
      { label: 'ข้อมูลส่วนตัว', icon: UserCircle },
      { label: 'การมาเรียน', icon: Clock },
      
      { label: 'การเรียน', isHeader: true },
      { label: 'ตารางเรียน', icon: BookOpen },
      { label: 'การบ้าน', icon: FileEdit },
      { label: 'คะแนน', icon: BarChart },
      { label: 'ผลการเรียน', icon: GraduationCap },
      
      { label: 'ข่าวสารและการติดต่อ', isHeader: true },
      { label: 'ข่าวสาร', icon: Megaphone },
      { label: 'กิจกรรม', icon: Calendar },
      { label: 'แชทกับครูที่ปรึกษา', icon: MessageCircle },
      { label: 'การแจ้งเตือน', icon: Bell },
    ];
  }
  
  return [commonDashboard];
};`;

code = code.replace(/const getMenuItems = \(role: string\): MenuItem\[\] => \{[\s\S]*?return \[commonDashboard\];\n\};/, newMenuLogic);

fs.writeFileSync('src/components/layout/AppLayout.tsx', code);
