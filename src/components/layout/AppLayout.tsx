import React, { useState } from 'react';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { WelcomePopup } from '@/components/WelcomePopup';
import { MessageSquare,  
  Menu, Home, BookOpen, Bell, User as UserIcon, LogOut, Settings, 
  Users, GraduationCap, Briefcase, School, Calendar, CalendarDays, 
  FileText, Archive, CreditCard, Package, Activity, Megaphone, PieChart,
  ClipboardList, UserCircle, Notebook, MonitorPlay, FileEdit, ClipboardCheck, 
  Award, BarChart, UserCheck, Heart, MapPin, FolderOpen, Download,
  Clock, Trophy, MessageCircle, X, ShieldCheck, Wrench, CheckSquare, Layers, Building2, Database
 } from 'lucide-react';
import Swal from 'sweetalert2';

interface AppLayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  currentMenu: string;
  onMenuChange: (menu: string) => void;
  simulatedUser?: User | null;
  onSimulateUser?: (u: User | null) => void;
}

type MenuItem = {
  label: string;
  icon?: any;
  isHeader?: boolean;
};

const getMenuItems = (role: string): MenuItem[] => {
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
};

export function AppLayout({ user, onLogout, children, currentMenu, onMenuChange, simulatedUser, onSimulateUser }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: 'ออกจากระบบ?',
      text: 'คุณต้องการออกจากระบบใช่หรือไม่',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#f43f5e',
      confirmButtonText: 'ใช่, ออกจากระบบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout();
      }
    });
  };

  const handleMenuClick = (label: string) => {
    onMenuChange(label);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const menuItems = getMenuItems(user.role);

  

  return (
    <div className="flex h-screen w-full bg-[#F1F5F9] flex-col md:flex-row overflow-hidden font-sans text-slate-800">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
          <span className="font-bold text-xl tracking-tight">SW-SCHOOL</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Menu - {user.role}</div>
          {menuItems.map((item, idx) => {
            if (item.isHeader) {
              return <div key={idx} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-6">{item.label}</div>;
            }
            const Icon = item.icon;
            return (
              <NavItem 
                key={item.label} 
                icon={<Icon size={20} />} 
                label={item.label} 
                active={currentMenu === item.label} 
                onClick={() => handleMenuClick(item.label)} 
              />
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 mb-3 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => onMenuChange('ตั้งค่าบัญชี')}>
            <div className="w-10 h-10 rounded-full bg-emerald-200 border-2 border-white overflow-hidden flex items-center justify-center text-emerald-800 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-center text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-100" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            ออกจากระบบ
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="md:hidden flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
             <h1 className="text-lg font-bold text-slate-800">SW-SCHOOL</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} className="text-slate-500" />
          </Button>
        </header>
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 px-8 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">🟢 {user.role} DASHBOARD</span>
            <h1 className="text-lg font-bold text-slate-800 ml-4">ภาพรวมการทำงาน</h1>
          </div>
          <div className="flex items-center gap-4">
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
             <Button variant="ghost" size="icon" className="text-slate-500 rounded-lg bg-slate-50 hover:bg-slate-100">
               <Bell size={20} />
             </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto w-full h-full">
            {children}
          </div>
        </div>
        <WelcomePopup user={simulatedUser || user} />

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 pb-safe px-2 z-40">
          <MobileNavItem icon={<Home size={24} />} label="หน้า" active={currentMenu === 'Dashboard'} onClick={() => handleMenuClick('Dashboard')} />
          <MobileNavItem icon={<Menu size={24} />} label="เมนูทั้งหมด" active={mobileMenuOpen} onClick={() => setMobileMenuOpen(true)} />
          <MobileNavItem icon={<Bell size={24} />} label="แจ้งเตือน" />
          <MobileNavItem icon={<UserIcon size={24} />} label="บัญชี" active={currentMenu === 'ตั้งค่าบัญชี'} onClick={() => handleMenuClick('ตั้งค่าบัญชี')} />
        </nav>
      </main>

      {/* Mobile Icon Grid Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-50 flex flex-col" onClick={() => setMobileMenuOpen(false)}>
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10" onClick={e => e.stopPropagation()}>
            <span className="font-bold text-lg text-slate-800">เมนูทั้งหมด</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 pb-24" onClick={e => e.stopPropagation()}>
            {(() => {
              const elements: React.ReactNode[] = [];
              let currentGroup: MenuItem[] = [];
              let currentHeader: string | null = null;

              const renderGroup = (items: MenuItem[], header: string | null) => {
                if (items.length === 0) return null;
                return (
                  <div key={header || 'main'} className="mb-6">
                    {header && <h4 className="text-xs font-bold text-slate-400 mb-3 ml-1 uppercase">{header}</h4>}
                    <div className="grid grid-cols-3 gap-3">
                      {items.map(item => {
                        const Icon = item.icon;
                        const isActive = currentMenu === item.label;
                        return (
                          <button 
                              key={item.label} 
                              onClick={() => { handleMenuClick(item.label); }}
                              className={`flex flex-col items-center justify-start p-3 bg-white rounded-2xl border transition-colors shadow-sm ${isActive ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-emerald-300'}`}
                          >
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-600'}`}>
                                <Icon size={24} />
                              </div>
                              <span className={`text-[10px] font-bold text-center leading-tight ${isActive ? 'text-emerald-700' : 'text-slate-700'}`}>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              menuItems.forEach((item) => {
                if (item.isHeader) {
                  if (currentGroup.length > 0) {
                    elements.push(renderGroup(currentGroup, currentHeader));
                    currentGroup = [];
                  }
                  currentHeader = item.label;
                } else {
                  currentGroup.push(item);
                }
              });

              if (currentGroup.length > 0) {
                elements.push(renderGroup(currentGroup, currentHeader));
              }

              return elements;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, key?: React.Key }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-emerald-50 text-emerald-700' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MobileNavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, key?: React.Key }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center space-y-1 w-full h-full ${active ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-800'}`}>
      {icon}
      <span className="text-[10px] font-bold tracking-wide">{label}</span>
    </button>
  );
}
