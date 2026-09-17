/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from '@/lib/types';
import { Login } from '@/pages/Login';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminSettings } from '@/pages/AdminSettings';
import { AdminManageStudents } from '@/pages/admin/ManageStudents';
import { AdminManageTeachers } from '@/pages/admin/ManageTeachers';
import { AdminManageParents } from '@/pages/admin/ManageParents';
import { AdminManageClasses } from '@/pages/admin/ManageClasses';
import { AdminCurriculumSystem } from '@/pages/admin/CurriculumSystem';
import { AdminRoleManagement } from '@/pages/admin/RoleManagement';
import { AdminManageAcademicYears } from '@/pages/admin/ManageAcademicYears';
import { AdminManageSchedules } from '@/pages/admin/ManageSchedules';
import { AdminManageDocuments } from '@/pages/admin/ManageDocuments';
import { AdminArchiveSystem } from '@/pages/admin/ArchiveSystem';
import { AdminFinanceSystem } from '@/pages/admin/FinanceSystem';
import { AdminInventorySystem } from '@/pages/admin/InventorySystem';
import { AdminStudentAffairs } from '@/pages/admin/StudentAffairs';
import { AdminAnnouncementSystem } from '@/pages/admin/AnnouncementSystem';
import { AdminPopupManager } from '@/pages/admin/PopupManager';
import { AdminMaintenance } from '@/pages/admin/MaintenanceSystem';
import { AdminManageEducationLevels } from '@/pages/admin/ManageEducationLevels';
import { AdminManagePeriods } from '@/pages/admin/ManagePeriods';
import { AdminManageSchoolInfo } from '@/pages/admin/ManageSchoolInfo';
import { AdminManageMasterData } from '@/pages/admin/ManageMasterData';
import { TeacherDashboard } from '@/pages/TeacherDashboard';
import { TeacherAttendance } from '@/pages/TeacherAttendance';
import { TeacherStudentAttendance } from '@/pages/teacher/TeacherStudentAttendance';
import { TeacherSubjectAttendance } from '@/pages/teacher/TeacherSubjectAttendance';
import { TeacherPrayerAttendance } from '@/pages/teacher/TeacherPrayerAttendance';
import { TeacherChat } from '@/pages/teacher/TeacherChat';
import { TeacherSchedule } from '@/pages/teacher/TeacherSchedule';
import { TeacherGrading } from '@/pages/teacher/TeacherGrading';
import { TeacherStudentList } from '@/pages/teacher/TeacherStudentList';
import { StudentDashboard } from '@/pages/StudentDashboard';
import { StudentGrades } from '@/pages/student/StudentGrades';
import { StudentSchedule, StudentHomework, StudentAttendance } from '@/pages/student/StudentAcademic';
import { StudentProfile, StudentNews, StudentCalendar, StudentDocuments, StudentActivities, StudentNotifications } from '@/pages/student/StudentExtras';
import { ParentDashboard } from '@/pages/ParentDashboard';
import { ParentChat } from '@/pages/parent/ParentChat';
import { UserSettings } from '@/pages/UserSettings';
import { usePWAInstall } from '@/lib/usePWAInstall';
import { useOnlineStatus } from '@/lib/useOnlineStatus';
import { Download } from 'lucide-react';

function PWAInstallPrompt() {
  const { isInstallable, install, isInstalled, isIOS } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button onClick={install} className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-emerald-600 shadow-md border border-emerald-100 hover:bg-emerald-50 transition-colors">
        <Download size={16} /> ติดตั้งแอป
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button onClick={() => setShowIOSGuide(true)} className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-emerald-600 shadow-md border border-emerald-100 hover:bg-emerald-50 transition-colors">
          <Download size={16} /> ติดตั้งแอป (iOS)
        </button>
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">ติดตั้งแอปบน iOS</h3>
              <p className="mt-3 text-sm text-slate-600">
                1. แตะไอคอน <strong>Share</strong> (แชร์) ด้านล่าง<br />
                2. เลือก <strong>Add to Home Screen</strong> (เพิ่มไปยังหน้าจอโฮม)
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-800 hover:bg-slate-200 transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
  return null;
}

function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;
  return (
    <div className="fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-xs font-medium text-white shadow-lg border border-rose-600">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      ออฟไลน์ - กำลังใช้งานข้อมูลที่ถูกแคชไว้
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [simulatedUser, setSimulatedUser] = useState<User | null>(null);
  const [currentMenu, setCurrentMenu] = useState<string>('Dashboard');

  if (!user) {
    return (
      <>
        <PWAInstallPrompt />
        <OfflineIndicator />
        <Login onLogin={(u) => { setUser(u); setCurrentMenu('Dashboard'); }} />
      </>
    );
  }

  const renderContent = () => {
    
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

    if (user.role === 'teacher') {
      if (currentMenu === 'ลงเวลาปฏิบัติงาน') return <TeacherAttendance user={user} />;
      if (currentMenu === 'รายชื่อนักเรียน') return <TeacherStudentList user={user} viewType="list" />;
      if (currentMenu === 'ข้อมูลนักเรียน') return <TeacherStudentList user={user} viewType="info" />;
      if (currentMenu === 'ข้อมูลผู้ปกครอง') return <TeacherStudentList user={user} viewType="parent" />;
      if (currentMenu === 'ตารางสอน' || currentMenu === 'ตารางเรียน') return <TeacherSchedule user={user} />;
      if (currentMenu === 'บันทึกคะแนน') return <TeacherGrading user={user} />;
      if (currentMenu === 'สแกนมาโรงเรียน') return <TeacherStudentAttendance user={user} />;
      if (currentMenu === 'เช็คชื่อ' || currentMenu === 'เช็คชื่อรายวิชา') return <TeacherSubjectAttendance user={user} />;
      if (currentMenu === 'เช็คชื่อละหมาด') return <TeacherPrayerAttendance user={user} />;
      if (currentMenu === 'แชทกับผู้ปกครอง') return <TeacherChat user={user} />;
      if (currentMenu === 'ตั้งค่าบัญชี') return <UserSettings user={user} />;
      return <TeacherDashboard user={user} />;
    }
    if (user.role === 'student') {
      if (currentMenu === 'ผลการเรียน' || currentMenu === 'คะแนน') return <StudentGrades user={user} />;
      if (currentMenu === 'ตารางเรียน') return <StudentSchedule user={user} />;
      if (currentMenu === 'การบ้าน') return <StudentHomework user={user} />;
      if (currentMenu === 'การเข้าเรียน') return <StudentAttendance user={user} />;
      if (currentMenu === 'ข้อมูลส่วนตัว') return <StudentProfile user={user} />;
      if (currentMenu === 'ข่าวสาร') return <StudentNews user={user} />;
      if (currentMenu === 'ปฏิทินกิจกรรม') return <StudentCalendar user={user} />;
      if (currentMenu === 'เอกสาร') return <StudentDocuments user={user} />;
      if (currentMenu === 'กิจกรรม/ผลงาน') return <StudentActivities user={user} />;
      if (currentMenu === 'แจ้งเตือน') return <StudentNotifications user={user} />;
      if (currentMenu === 'ตั้งค่าบัญชี') return <UserSettings user={user} />;
      return <StudentDashboard user={user} />;
    }
    if (user.role === 'parent') {
      if (currentMenu === 'ข้อมูลบุตร' || currentMenu === 'ข้อมูลส่วนตัว' && user.role === 'parent') return <StudentProfile user={user} />;
      if (currentMenu === 'ข้อมูลส่วนตัว' && user.role === 'student') return <StudentProfile user={user} />;
      if (currentMenu === 'การมาเรียน') return <StudentAttendance user={user} />;
      if (currentMenu === 'คะแนน' || currentMenu === 'ผลการเรียน') return <StudentGrades user={user} />;
      if (currentMenu === 'ตารางเรียน') return <StudentSchedule user={user} />;
      if (currentMenu === 'การบ้าน') return <StudentHomework user={user} />;
      if (currentMenu === 'ข่าวสาร') return <StudentNews user={user} />;
      if (currentMenu === 'แชทกับครูที่ปรึกษา') return <ParentChat user={user} />;
      if (currentMenu === 'ตั้งค่าบัญชี') return <UserSettings user={user} />;
      return <ParentDashboard user={user} />;
    }
    return null;
  };

  return (
    <AppLayout user={user} onLogout={() => setUser(null)} currentMenu={currentMenu} onMenuChange={setCurrentMenu} simulatedUser={simulatedUser} onSimulateUser={setSimulatedUser}>
      <PWAInstallPrompt />
      <OfflineIndicator />
      {renderContent()}
    </AppLayout>
  );
}
