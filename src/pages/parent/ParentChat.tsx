import React, { useState } from 'react';
import { User } from '@/lib/types';
import { MessageCircle, Phone, Send, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ParentChat({ user }: { user: User }) {
  const [messages, setMessages] = useState([
    { id: 1, text: 'สวัสดีค่ะคุณแม่ น้องมาลีมีอาการปวดหัวนิดหน่อยตอนบ่าย ครูเลยให้ไปพักที่ห้องพยาบาลนะคะ', sender: 'teacher', time: '14:30' },
    { id: 2, text: 'รับทราบค่ะครู ตอนนี้น้องอาการดีขึ้นไหมคะ?', sender: 'parent', time: '14:35' },
    { id: 3, text: 'ดีขึ้นแล้วค่ะ ทานยาแล้วหลับไปพักนึง ตอนนี้ตื่นแล้วค่ะ เดี๋ยวตอนเย็นคุณแม่มารับตามปกติได้เลยค่ะ', sender: 'teacher', time: '14:40' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'parent', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  };

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
            จต
          </div>
          <div>
            <h3 className="font-bold text-slate-800">ครูจิตตรา รักเรียน</h3>
            <p className="text-sm text-slate-500">ครูที่ปรึกษา ม.1/1</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full shadow-sm text-blue-600 border-blue-200 hover:bg-blue-50">
            <Phone size={18} className="mr-2" /> โทรหาครู
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-slate-400">
            <Info size={20} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-2 bg-slate-50 rounded-2xl mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${msg.sender === 'parent' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.sender === 'parent' ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 items-center">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์ข้อความ..." 
          className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 rounded-full px-4 py-3 outline-none transition-all"
        />
        <Button type="submit" className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-md">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}
