import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Save, X, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';
import { getPopups, savePopups, PopupData } from '@/lib/popupStore';

export function AdminPopupManager() {
  const [popups, setPopups] = useState<PopupData[]>([]);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingPopup, setEditingPopup] = useState<PopupData | null>(null);
  
  useEffect(() => {
    setPopups(getPopups());
  }, []);

  const handleAdd = () => {
    setEditingPopup({
      id: Date.now().toString(),
      title: '',
      content: '',
      imageUrl: '',
      targetRoles: { student: true, parent: true, teacher: true, admin: true },
      durationDays: 7,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString()
    });
    setView('form');
  };

  const handleEdit = (popup: PopupData) => {
    setEditingPopup(popup);
    setView('form');
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณต้องการลบป็อปอัพนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'ลบข้อมูล',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        const newPopups = popups.filter(p => p.id !== id);
        setPopups(newPopups);
        savePopups(newPopups);
        Swal.fire('ลบสำเร็จ!', 'ป็อปอัพถูกลบแล้ว', 'success');
      }
    });
  };

  const toggleActive = (id: string) => {
    const newPopups = popups.map(p => {
      if (p.id === id) return { ...p, isActive: !p.isActive };
      return p;
    });
    setPopups(newPopups);
    savePopups(newPopups);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPopup) return;
    
    if (editingPopup) {
      if (editingPopup.durationDays && editingPopup.durationDays > 0) {
        // Calculate expiresAt from NOW when saving, or you could base it on createdAt. Let's base it on current time when saved.
        editingPopup.expiresAt = new Date(Date.now() + editingPopup.durationDays * 24 * 60 * 60 * 1000).toISOString();
      } else {
        editingPopup.expiresAt = undefined;
      }
    }
    
    let newPopups;
    if (popups.find(p => p.id === editingPopup.id)) {
      newPopups = popups.map(p => p.id === editingPopup.id ? editingPopup : p);
    } else {
      newPopups = [...popups, editingPopup];
    }
    
    setPopups(newPopups);
    savePopups(newPopups);
    
    Swal.fire({
      title: 'บันทึกสำเร็จ',
      text: 'ข้อมูลป็อปอัพแจ้งเตือนถูกบันทึกแล้ว',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    }).then(() => setView('list'));
  };

  if (view === 'form' && editingPopup) {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Plus className="text-indigo-500" /> {popups.find(p => p.id === editingPopup.id) ? 'แก้ไขป็อปอัพแจ้งเตือน' : 'สร้างป็อปอัพแจ้งเตือนใหม่'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">ตั้งค่าเนื้อหา รูปภาพ และกลุ่มเป้าหมายที่จะเห็นป็อปอัพเมื่อเข้าระบบ</p>
          </div>
          <Button variant="ghost" onClick={() => setView('list')} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">หัวข้อป็อปอัพ</label>
            <Input 
              required 
              placeholder="เช่น ยินดีต้อนรับสู่ภาคเรียนใหม่, แจ้งเตือนการชำระเงิน" 
              value={editingPopup.title}
              onChange={e => setEditingPopup({...editingPopup, title: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">URL รูปภาพ (ตัวเลือก)</label>
            <Input 
              placeholder="https://example.com/image.jpg" 
              value={editingPopup.imageUrl || ''}
              onChange={e => setEditingPopup({...editingPopup, imageUrl: e.target.value})}
            />
            {editingPopup.imageUrl && (
              <div className="mt-3 w-full h-40 rounded-xl overflow-hidden border border-slate-200">
                <img src={editingPopup.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">เนื้อหา</label>
            <textarea 
              required
              className="w-full h-32 rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              placeholder="รายละเอียด..."
              value={editingPopup.content}
              onChange={e => setEditingPopup({...editingPopup, content: e.target.value})}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">กลุ่มผู้ใช้งานที่จะเห็นป็อปอัพนี้</label>
            <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editingPopup.targetRoles.student} 
                  onChange={(e) => setEditingPopup({
                    ...editingPopup, 
                    targetRoles: {...editingPopup.targetRoles, student: e.target.checked}
                  })}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-slate-700">นักเรียน</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editingPopup.targetRoles.parent} 
                  onChange={(e) => setEditingPopup({
                    ...editingPopup, 
                    targetRoles: {...editingPopup.targetRoles, parent: e.target.checked}
                  })}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-slate-700">ผู้ปกครอง</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editingPopup.targetRoles.teacher} 
                  onChange={(e) => setEditingPopup({
                    ...editingPopup, 
                    targetRoles: {...editingPopup.targetRoles, teacher: e.target.checked}
                  })}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-slate-700">ครู / บุคลากร</span>
              </label>
              
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">ระยะเวลาที่ต้องการให้แสดง (วัน)</label>
            <div className="flex items-center gap-3">
              <Input 
                type="number"
                min="0"
                className="w-32 bg-white"
                value={editingPopup.durationDays || ''}
                onChange={e => setEditingPopup({...editingPopup, durationDays: parseInt(e.target.value) || 0})}
              />
              <span className="text-sm text-slate-500">วัน (ระบุ 0 หากต้องการให้แสดงตลอดไปจนกว่าจะปิด)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <label className="text-sm font-bold text-slate-700">สถานะการแสดงผล:</label>
             <button 
                type="button"
                onClick={() => setEditingPopup({...editingPopup, isActive: !editingPopup.isActive})}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${editingPopup.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}
             >
                {editingPopup.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
             </button>
          </div>

          <div className="pt-6 flex gap-3 border-t border-slate-100">
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex-1 md:flex-none md:w-32">
              <Save size={18} className="mr-2" /> บันทึก
            </Button>
            <Button type="button" variant="outline" onClick={() => setView('list')} className="flex-1 md:flex-none md:w-32">
              ยกเลิก
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="text-indigo-500" /> จัดการป็อปอัพแจ้งเตือน
          </h2>
          <p className="text-slate-500 text-sm mt-1">ตั้งค่าหน้าต่างแจ้งเตือน (Popup) ที่จะแสดงเมื่อผู้ใช้เข้าสู่ระบบ</p>
        </div>
        <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700 shadow-md text-white w-full md:w-auto">
          <Plus size={18} className="mr-2" /> สร้างป็อปอัพใหม่
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {popups.map(popup => (
            <div key={popup.id} className={`border rounded-2xl overflow-hidden transition-all shadow-sm ${popup.isActive ? 'border-indigo-200 bg-white' : 'border-slate-200 bg-slate-50 opacity-80'}`}>
               {popup.imageUrl && (
                  <div className="h-32 w-full bg-slate-100">
                     <img src={popup.imageUrl} className="w-full h-full object-cover" alt={popup.title} />
                  </div>
               )}
               <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                     <h4 className="font-bold text-slate-800 line-clamp-1">{popup.title}</h4>
                     <button onClick={() => toggleActive(popup.id)} className={`text-xs px-2 py-0.5 rounded-md font-bold whitespace-nowrap ml-2 ${popup.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                        {popup.isActive ? 'ใช้งาน' : 'ปิด'}
                     </button>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">{popup.content}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                     <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md">
                       {popup.expiresAt && new Date(popup.expiresAt) > new Date() 
                          ? `แสดงถึง: ${new Date(popup.expiresAt).toLocaleDateString('th-TH')}`
                          : (popup.expiresAt ? <span className="text-rose-500">หมดเวลาแล้ว</span> : 'แสดงตลอด')}
                     </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-5">
                     {popup.targetRoles.student && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">นักเรียน</span>}
                     {popup.targetRoles.parent && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">ผู้ปกครอง</span>}
                     {popup.targetRoles.teacher && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">ครู</span>}
                     {popup.targetRoles.admin && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">แอดมิน</span>}
                     
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                     <Button variant="ghost" size="sm" onClick={() => handleEdit(popup)} className="text-blue-600 hover:bg-blue-50 h-8 px-3">
                        <Edit size={14} className="mr-1" /> แก้ไข
                     </Button>
                     <Button variant="ghost" size="sm" onClick={() => handleDelete(popup.id)} className="text-rose-600 hover:bg-rose-50 h-8 px-3">
                        <Trash2 size={14} className="mr-1" /> ลบ
                     </Button>
                  </div>
               </div>
            </div>
         ))}
         
         {popups.length === 0 && (
           <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
             <MessageSquare size={48} className="mx-auto mb-3 opacity-20" />
             <p>ยังไม่มีป็อปอัพแจ้งเตือน</p>
           </div>
         )}
      </div>
    </div>
  );
}
