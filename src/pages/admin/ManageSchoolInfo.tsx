import React, { useState } from 'react';
import { Building2, Save, Upload, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

export function AdminManageSchoolInfo() {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: 'บันทึกข้อมูล?',
      text: "คุณต้องการบันทึกข้อมูลโรงเรียนใช่หรือไม่",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsEditing(false);
        Swal.fire('บันทึกสำเร็จ!', 'อัปเดตข้อมูลโรงเรียนเรียบร้อยแล้ว', 'success');
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="text-emerald-500" /> ข้อมูลโรงเรียน
          </h2>
          <p className="text-slate-500 text-sm mt-1">จัดการข้อมูลพื้นฐานและสถานที่ตั้งของสถานศึกษา</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            แก้ไขข้อมูล
          </Button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Logos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <h3 className="font-bold text-slate-700 mb-4">ตราสัญลักษณ์</h3>
            <div className="w-32 h-32 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <Building2 size={48} className="text-slate-300" />
            </div>
            {isEditing && (
              <Button type="button" variant="outline" size="sm" className="w-full max-w-[200px]">
                <Upload size={16} className="mr-2" /> อัปโหลดตราสัญลักษณ์
              </Button>
            )}
          </div>

          <div className="flex flex-col items-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <h3 className="font-bold text-slate-700 mb-4">ตราสัญลักษณ์สำหรับพิมพ์</h3>
            <div className="w-32 h-32 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-4 shadow-sm grayscale opacity-70">
              <Building2 size={48} className="text-slate-300" />
            </div>
            {isEditing && (
              <Button type="button" variant="outline" size="sm" className="w-full max-w-[200px]">
                <Upload size={16} className="mr-2" /> อัปโหลดโลโก้สำหรับพิมพ์
              </Button>
            )}
          </div>
        </div>

        {/* General Info */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">ข้อมูลทั่วไป</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">รหัสสถานศึกษา</label>
              <Input defaultValue="1010010001" readOnly={!isEditing} className={!isEditing ? "bg-slate-50 text-slate-500" : ""} />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อโรงเรียน</label>
              <Input defaultValue="โรงเรียนตัวอย่างวิทยา" readOnly={!isEditing} className={!isEditing ? "bg-slate-50 text-slate-500" : ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อย่อ</label>
              <Input defaultValue="ต.ย.ว." readOnly={!isEditing} className={!isEditing ? "bg-slate-50 text-slate-500" : ""} />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อโรงเรียน (ENG)</label>
              <Input defaultValue="Sample Wittaya School" readOnly={!isEditing} className={!isEditing ? "bg-slate-50 text-slate-500" : ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อย่อ (ENG)</label>
              <Input defaultValue="S.W.S." readOnly={!isEditing} className={!isEditing ? "bg-slate-50 text-slate-500" : ""} />
            </div>
          </div>
        </section>

        {/* Contact & Address */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">ข้อมูลการติดต่อและที่อยู่</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์หลัก</label>
              <Input defaultValue="02-123-4567" readOnly={!isEditing} className={!isEditing ? "bg-slate-50 text-slate-500" : ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
              <Input defaultValue="info@school.ac.th" readOnly={!isEditing} className={!isEditing ? "bg-slate-50 text-slate-500" : ""} />
            </div>
            <div className="hidden lg:block"></div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ที่อยู่บ้านเลขที่</label>
              <Input defaultValue="123" readOnly={!isEditing} className={!isEditing ? "bg-slate-50 text-slate-500" : ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">หมู่</label>
              <Input defaultValue="1" readOnly={!isEditing} className={!isEditing ? "bg-slate-50 text-slate-500" : ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">แขวง/ตำบล</label>
              <Input defaultValue="บางรัก" readOnly={!isEditing} className={!isEditing ? "bg-slate-50 text-slate-500" : ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">เขต/อำเภอ</label>
              <Input defaultValue="บางรัก" readOnly={!isEditing} className={!isEditing ? "bg-slate-50 text-slate-500" : ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">จังหวัด</label>
              <select disabled={!isEditing} className={`w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 ${!isEditing ? "bg-slate-50 text-slate-500" : "bg-white"}`}>
                <option value="กทม.">กรุงเทพมหานคร</option>
                <option value="สมุทรปราการ">สมุทรปราการ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">รหัสไปรษณีย์</label>
              <Input defaultValue="10500" readOnly={!isEditing} className={!isEditing ? "bg-slate-50 text-slate-500" : ""} />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">ที่ตั้ง (ลิงก์ Google Maps หรือ พิกัด)</label>
              <div className="flex gap-2">
                <div className={`flex items-center justify-center px-3 border border-slate-200 rounded-md ${!isEditing ? "bg-slate-100 text-slate-400" : "bg-white text-slate-500"}`}>
                  <MapPin size={18} />
                </div>
                <Input defaultValue="13.730248, 100.523450" readOnly={!isEditing} className={`flex-1 ${!isEditing ? "bg-slate-50 text-slate-500" : ""}`} />
              </div>
            </div>
          </div>
        </section>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button type="button" onClick={() => setIsEditing(false)} variant="outline" className="min-w-[120px]">
              ยกเลิก
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]">
              <Save size={18} className="mr-2" /> บันทึกข้อมูล
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
