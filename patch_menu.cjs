const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');

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
    ];
  }
  
  if (role === 'teacher') {
    return [
      commonDashboard,
      { label: 'ระบบหลัก', isHeader: true },
      { label: 'ลงเวลาปฏิบัติงาน', icon: Clock },
      { label: 'ตารางสอน', icon: CalendarDays },
      { label: 'เช็คชื่อ', icon: ClipboardCheck },
      { label: 'เช็คชื่อละหมาด', icon: Heart },
      { label: 'บันทึกคะแนน', icon: Award },
      
      { label: 'งานที่ปรึกษา', isHeader: true },
      { label: 'สแกนมาโรงเรียน', icon: MonitorPlay },
      { label: 'รายชื่อนักเรียน', icon: Users },
      { label: 'ข้อมูลนักเรียน', icon: FileText },
      { label: 'ข้อมูลผู้ปกครอง', icon: Users },
      { label: 'แชทกับผู้ปกครอง', icon: MessageCircle },
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
      { label: 'ข้อมูลบุตร', icon: UserCircle },
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
