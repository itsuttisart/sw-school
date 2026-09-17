import React, { useState } from 'react';
import { User } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';

export function Login({ onLogin }: { onLogin: (u: User) => void }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = mockUsers.find(u => {
      const matchIdentifier = 
        (u.role === 'admin' && u.username === identifier) ||
        (u.role === 'teacher' && u.phone === identifier) ||
        (u.role === 'parent' && u.phone === identifier) ||
        (u.role === 'student' && u.studentId === identifier);
        
      return matchIdentifier && u.password === password;
    });

    if (user) {
      Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        text: `ยินดีต้อนรับ ${user.name}`,
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        onLogin(user);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบล้มเหลว',
        text: 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง โปรดลองอีกครั้ง',
        confirmButtonColor: '#10b981'
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F1F5F9] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
          <span className="text-3xl font-bold text-white">S</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">SW-SCHOOL</h2>
        <p className="text-slate-500 text-sm font-medium mb-8 text-center">เข้าสู่ระบบด้วย Username, เบอร์โทรศัพท์, หรือรหัสนักเรียน</p>
        
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">บัญชีผู้ใช้งาน</label>
            <Input 
              placeholder="Username / เบอร์โทรศัพท์ / รหัสนักเรียน" 
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">รหัสผ่าน</label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="รหัสผ่าน" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="submit" className="w-full" size="lg">
              เข้าสู่ระบบ
            </Button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100 w-full text-xs text-slate-500 flex flex-col gap-2">
          <p className="font-bold text-slate-700 text-sm mb-1">ตัวอย่างข้อมูลทดสอบระบบ:</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <p className="font-bold text-slate-700">👑 Admin</p>
              <p>User: admin</p>
              <p>Pass: password123</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <p className="font-bold text-slate-700">👨‍🏫 ครู</p>
              <p>โทร: 0812345678</p>
              <p>Pass: password123</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <p className="font-bold text-slate-700">👨‍🎓 นักเรียน</p>
              <p>รหัส: 65001</p>
              <p>Pass: password123</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <p className="font-bold text-slate-700">👨‍👩‍👦 ผู้ปกครอง</p>
              <p>โทร: 0898765432</p>
              <p>Pass: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
