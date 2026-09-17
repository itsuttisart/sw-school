const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');

const oldAdminMenu = `  if (role === 'admin') {
    return [
      commonDashboard,
      { label: 'ผู้ใช้งานระบบ', isHeader: true },
      { label: 'จัดการนักเรียน', icon: GraduationCap },
      { label: 'จัดการครู', icon: Briefcase },
      { label: 'จัดการผู้ปกครอง', icon: Users },
      { label: 'ระบบจัดการหลักสูตร', isHeader: true },
      { label: 'ระบบหลักสูตร (ทั้งหมด)', icon: BookOpen },
      { label: 'ระบบปฏิบัติการ', isHeader: true },
      { label: 'จัดการตารางเรียน/สอน', icon: CalendarDays },
      { label: 'ระบบสารบรรณ', icon: FileText },
      { label: 'คลังเอกสาร', icon: Archive },
      { label: 'ระบบการเงิน', icon: CreditCard },
      { label: 'ระบบพัสดุ', icon: Package },
      { label: 'ระบบกิจการนักเรียน', icon: Activity },
      { label: 'ระบบประกาศ', icon: Megaphone },
      { label: 'ระบบรายงาน', icon: PieChart },
      { label: 'แจ้งซ่อมแซม', icon: Wrench },
      { label: 'ตั้งค่าระบบ', isHeader: true },
      { label: 'ข้อมูลโรงเรียน', icon: Building2 },
      { label: 'ข้อมูลพื้นฐาน', icon: Database },
      { label: 'จัดการระดับการศึกษา', icon: Layers },
      { label: 'จัดการปีการศึกษา', icon: Calendar },
      { label: 'จัดการคาบเรียน', icon: Clock },
      { label: 'จัดการห้องเรียน', icon: School },
      { label: 'จัดการสิทธิ์/บทบาท', icon: ShieldCheck },
      { label: 'ตั้งค่าทั่วไป', icon: Settings },
    ];
  }`;

const newAdminMenu = `  if (role === 'admin') {
    return [
      commonDashboard,
      { label: 'ผู้ใช้งานระบบ', isHeader: true },
      { label: 'จัดการนักเรียน', icon: GraduationCap },
      { label: 'จัดการครู', icon: Briefcase },
      { label: 'จัดการผู้ปกครอง', icon: Users },
      { label: 'ระบบจัดการหลักสูตร', isHeader: true },
      { label: 'ระบบหลักสูตร (ทั้งหมด)', icon: BookOpen },
      { label: 'ระบบปฏิบัติการ', isHeader: true },
      { label: 'จัดการตารางเรียน/สอน', icon: CalendarDays },
      { label: 'ระบบสารบรรณ', icon: FileText },
      { label: 'คลังเอกสาร', icon: Archive },
      { label: 'ระบบการเงิน', icon: CreditCard },
      { label: 'ระบบพัสดุ', icon: Package },
      { label: 'ระบบกิจการนักเรียน', icon: Activity },
      { label: 'ระบบประกาศ', icon: Megaphone },
      { label: 'ระบบรายงาน', icon: PieChart },
      { label: 'แจ้งซ่อมแซม', icon: Wrench },
      { label: 'ตั้งค่าระบบ', icon: Settings },
    ];
  }`;

if (code.includes(oldAdminMenu)) {
  code = code.replace(oldAdminMenu, newAdminMenu);
  fs.writeFileSync('src/components/layout/AppLayout.tsx', code);
  console.log("Patched AppLayout.tsx successfully.");
} else {
  console.log("Could not find oldAdminMenu block.");
}
