const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state to App component
code = code.replace(/const \[user, setUser\] = useState<User \| null>\(null\);/, 
`const [user, setUser] = useState<User | null>(null);
  const [simulatedUser, setSimulatedUser] = useState<User | null>(null);`);

// 2. Pass to AppLayout
code = code.replace(/<AppLayout user=\{user\} onLogout=\{\(\) => setUser\(null\)\} currentMenu=\{currentMenu\} onMenuChange=\{setCurrentMenu\}>/,
`<AppLayout user={user} onLogout={() => setUser(null)} currentMenu={currentMenu} onMenuChange={setCurrentMenu} simulatedUser={simulatedUser} onSimulateUser={setSimulatedUser}>`);

// 3. Update the admin routing block
const newAdminRouting = `
    if (user.role === 'admin') {
      const activeUser = simulatedUser || user;
      
      // Admin exclusive routes
      if (currentMenu === 'จัดการนักเรียน') return <AdminManageStudents />;
      if (currentMenu === 'จัดการครู') return <AdminManageTeachers />;
      if (currentMenu === 'จัดการผู้ปกครอง') return <AdminManageParents />;
      if (currentMenu === 'ระบบหลักสูตร (ทั้งหมด)') return <AdminCurriculumSystem />;
      if (currentMenu === 'จัดการตารางเรียน/สอน') return <AdminManageSchedules />;
      if (currentMenu === 'ระบบสารบรรณ') return <AdminManageDocuments />;
      if (currentMenu === 'คลังเอกสาร') return <AdminArchiveSystem />;
      if (currentMenu === 'ระบบการเงิน') return <AdminFinanceSystem />;
      if (currentMenu === 'ระบบพัสดุ') return <AdminInventorySystem />;
      if (currentMenu === 'ระบบกิจการนักเรียน') return <AdminStudentAffairs />;
      if (currentMenu === 'ระบบประกาศ') return <AdminAnnouncementSystem />;
      if (currentMenu === 'จัดการป็อปอัพ') return <AdminPopupManager />;
      if (currentMenu === 'แจ้งซ่อมแซม') return <AdminMaintenance />;
      if (currentMenu === 'ตั้งค่าระบบ') return <AdminSettings />;
      
      // Teacher routes
      if (currentMenu === 'ลงเวลาปฏิบัติงาน') return <TeacherAttendance user={activeUser} />;
      if (currentMenu === 'รายชื่อนักเรียน') return <TeacherStudentList user={activeUser} viewType="list" />;
      if (currentMenu === 'ข้อมูลนักเรียน') return <TeacherStudentList user={activeUser} viewType="info" />;
      if (currentMenu === 'ข้อมูลผู้ปกครอง') return <TeacherStudentList user={activeUser} viewType="parent" />;
      if (currentMenu === 'ตารางสอน' || currentMenu === 'ตารางเรียน') return <TeacherSchedule user={activeUser} />;
      if (currentMenu === 'บันทึกคะแนน') return <TeacherGrading user={activeUser} />;
      if (currentMenu === 'สแกนมาโรงเรียน') return <TeacherStudentAttendance user={activeUser} />;
      if (currentMenu === 'เช็คชื่อ' || currentMenu === 'เช็คชื่อรายวิชา') return <TeacherSubjectAttendance user={activeUser} />;
      if (currentMenu === 'เช็คชื่อละหมาด') return <TeacherPrayerAttendance user={activeUser} />;
      if (currentMenu === 'แชทกับผู้ปกครอง') return <TeacherChat user={activeUser} />;
      
      // Student routes
      if (currentMenu === 'ผลการเรียน' || currentMenu === 'คะแนน') return <StudentGrades user={activeUser} />;
      if (currentMenu === 'การบ้าน') return <StudentHomework user={activeUser} />;
      if (currentMenu === 'การเข้าเรียน' || currentMenu === 'การมาเรียน') return <StudentAttendance user={activeUser} />;
      if (currentMenu === 'ข้อมูลส่วนตัว') return <StudentProfile user={activeUser} />;
      if (currentMenu === 'ข่าวสาร') return <StudentNews user={activeUser} />;
      if (currentMenu === 'ปฏิทินกิจกรรม') return <StudentCalendar user={activeUser} />;
      if (currentMenu === 'เอกสาร') return <StudentDocuments user={activeUser} />;
      if (currentMenu === 'กิจกรรม/ผลงาน') return <StudentActivities user={activeUser} />;
      if (currentMenu === 'แจ้งเตือน') return <StudentNotifications user={activeUser} />;
      
      // Parent routes
      if (currentMenu === 'ข้อมูลบุตร') return <StudentProfile user={activeUser} />;
      if (currentMenu === 'แชทกับครูที่ปรึกษา') return <ParentChat user={activeUser} />;
      
      if (currentMenu === 'ตั้งค่าบัญชี') return <UserSettings user={activeUser} />;
      
      return <AdminDashboard />;
    }
`;

code = code.replace(/if \(user\.role === 'admin'\) \{[\s\S]*?return <AdminDashboard \/>;\n    \}/, newAdminRouting);

fs.writeFileSync('src/App.tsx', code);
