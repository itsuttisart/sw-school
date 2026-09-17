import React from 'react';
import { User } from '@/lib/types';
import { UserCircle, Megaphone, Calendar, FileText, Trophy, Bell, Download, MapPin, Phone, Mail, Award, CheckCircle, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// ---------------------------------------------------------
// 1. ข้อมูลส่วนตัว (Student Profile)
// ---------------------------------------------------------
export function StudentProfile({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <UserCircle className="text-blue-500 w-8 h-8" />
        <h2 className="text-2xl font-bold text-slate-800">ข้อมูลส่วนตัว</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner text-slate-300">
            👤
          </div>
          <h3 className="text-2xl font-bold text-slate-800 text-center">ด.ช. สมชาย รักเรียน</h3>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mt-2">
            รหัสนักเรียน: 65001
          </span>
          <p className="text-slate-500 font-medium mt-2">ชั้น ม.1/1 | เลขที่ 1</p>
        </div>
        
        <div className="w-full md:w-2/3 space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2">ข้อมูลการติดต่อ</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1 flex items-center gap-1"><Phone size={14}/> เบอร์โทรศัพท์</p>
                <p className="text-sm font-medium text-slate-800">081-111-1111</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1 flex items-center gap-1"><Mail size={14}/> อีเมล</p>
                <p className="text-sm font-medium text-slate-800">somchai@school.ac.th</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-500 font-bold mb-1 flex items-center gap-1"><MapPin size={14}/> ที่อยู่ปัจจุบัน</p>
                <p className="text-sm font-medium text-slate-800">123 ถ.สุขุมวิท เขตวัฒนา กรุงเทพมหานคร 10110</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2">ข้อมูลผู้ปกครอง</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">ชื่อ-นามสกุล บิดา/มารดา</p>
                <p className="text-sm font-medium text-slate-800">นาย สมศักดิ์ รักเรียน</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">เบอร์โทรศัพท์ผู้ปกครอง</p>
                <p className="text-sm font-medium text-slate-800">081-999-9999</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 2. ข่าวสาร (Student News)
// ---------------------------------------------------------
export function StudentNews({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <Megaphone className="text-amber-500 w-8 h-8" />
        <h2 className="text-2xl font-bold text-slate-800">ประกาศข่าวสาร</h2>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-6 border border-slate-200 rounded-2xl hover:border-amber-300 hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">ประกาศทั่วไป</span>
              <span className="text-xs text-slate-400">11 ก.ย. 2569</span>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">แจ้งเปลี่ยนแปลงกำหนดการสอบกลางภาคเรียนที่ 1/2569</h3>
            <p className="text-sm text-slate-600 line-clamp-2">เนื่องด้วยมีวันหยุดราชการเพิ่มเติม ทางโรงเรียนจึงขอเลื่อนกำหนดการสอบกลางภาค จากเดิมวันที่ 20-22 ก.ย. เป็นวันที่ 25-27 ก.ย. แทนนรบกวนนักเรียนเตรียมความพร้อม...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 3. ปฏิทินกิจกรรม (Student Calendar)
// ---------------------------------------------------------
export function StudentCalendar({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <Calendar className="text-purple-500 w-8 h-8" />
        <h2 className="text-2xl font-bold text-slate-800">ปฏิทินกิจกรรมโรงเรียน</h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mock Calendar visual */}
        <div className="w-full md:w-1/2 bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 text-center mb-6">กันยายน 2569</h3>
          <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
            <div className="font-bold text-rose-500">อา</div>
            <div className="font-bold text-slate-500">จ</div>
            <div className="font-bold text-slate-500">อ</div>
            <div className="font-bold text-slate-500">พ</div>
            <div className="font-bold text-slate-500">พฤ</div>
            <div className="font-bold text-slate-500">ศ</div>
            <div className="font-bold text-blue-500">ส</div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {/* simple mock grid */}
            {Array.from({length: 30}).map((_, i) => (
              <div key={i} className={`aspect-square flex items-center justify-center rounded-full ${i === 10 ? 'bg-purple-500 text-white font-bold' : i === 24 ? 'bg-amber-500 text-white font-bold' : 'text-slate-700 hover:bg-slate-200 cursor-pointer'}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full md:w-1/2 space-y-4">
          <h3 className="font-bold text-lg text-slate-800">กิจกรรมที่กำลังจะถึง</h3>
          <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-xl">
            <p className="text-xs font-bold text-purple-600 mb-1">11 กันยายน 2569</p>
            <p className="font-bold text-slate-800">วันคล้ายวันสถาปนาโรงเรียน</p>
          </div>
          <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r-xl">
            <p className="text-xs font-bold text-amber-600 mb-1">25 - 27 กันยายน 2569</p>
            <p className="font-bold text-slate-800">สอบกลางภาค ภาคเรียนที่ 1/2569</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 4. เอกสาร (Student Documents)
// ---------------------------------------------------------
export function StudentDocuments({ user }: { user: User }) {
  const docs = [
    { name: 'ใบรับรองผลการเรียน (ปพ.1)', type: 'PDF' },
    { name: 'คู่มือนักเรียน ปีการศึกษา 2569', type: 'PDF' },
    { name: 'แบบฟอร์มขออนุญาตลากิจ/ลาป่วย', type: 'DOCX' },
  ];
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <FileText className="text-teal-500 w-8 h-8" />
        <h2 className="text-2xl font-bold text-slate-800">เอกสารสำหรับนักเรียน</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((doc, idx) => (
          <div key={idx} className="p-5 border border-slate-200 rounded-2xl flex items-center justify-between hover:border-teal-300 hover:shadow-md transition-all group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center font-bold text-xs">
                {doc.type}
              </div>
              <span className="font-bold text-slate-700 text-sm">{doc.name}</span>
            </div>
            <Download size={18} className="text-slate-400 group-hover:text-teal-600" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 5. กิจกรรม/ผลงาน (Student Activities)
// ---------------------------------------------------------
export function StudentActivities({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <Trophy className="text-rose-500 w-8 h-8" />
          <h2 className="text-2xl font-bold text-slate-800">กิจกรรมและผลงาน</h2>
        </div>
        <Button className="bg-rose-600 hover:bg-rose-700 text-white shadow-md">บันทึกผลงานใหม่</Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-6 p-6 border border-slate-200 rounded-2xl bg-slate-50 items-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
            <Award size={32} />
          </div>
          <div>
            <span className="text-xs font-bold bg-rose-200 text-rose-800 px-2 py-1 rounded-full mb-2 inline-block">วิชาการ</span>
            <h3 className="font-bold text-lg text-slate-800">รางวัลชนะเลิศ การแข่งขันตอบปัญหาคณิตศาสตร์</h3>
            <p className="text-sm text-slate-500">ระดับเขตพื้นที่การศึกษา ปีการศึกษา 2568</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 6. แจ้งเตือน (Student Notifications)
// ---------------------------------------------------------
export function StudentNotifications({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <Bell className="text-indigo-500 w-8 h-8" />
        <h2 className="text-2xl font-bold text-slate-800">การแจ้งเตือน</h2>
      </div>
      
      <div className="space-y-1">
        <div className="flex gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors bg-indigo-50/30">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <FileEdit size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">การบ้านใหม่: คณิตศาสตร์</h3>
            <p className="text-sm text-slate-600 mt-1">ครูจิตตรา รักเรียน มอบหมายแบบฝึกหัดเรื่องสมการเชิงเส้น</p>
            <p className="text-xs text-indigo-500 font-medium mt-2">เพิ่งผ่านไป 2 ชั่วโมง</p>
          </div>
        </div>
        
        <div className="flex gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">อัปเดตผลการเรียน</h3>
            <p className="text-sm text-slate-600 mt-1">ผลการเรียนภาคเรียนที่ 1/2568 ได้รับการอนุมัติแล้ว</p>
            <p className="text-xs text-slate-400 font-medium mt-2">เมื่อวานนี้</p>
          </div>
        </div>
      </div>
    </div>
  );
}
