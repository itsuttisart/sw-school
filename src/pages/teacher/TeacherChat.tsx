import React, { useState } from 'react';
import { User } from '@/lib/types';
import { MessageCircle, Phone, Send, Info, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const MOCK_CONTACTS = [
  { id: 1, name: 'นาง สมศรี สวยงาม', relation: 'ผู้ปกครอง ด.ญ. มาลี สวยงาม', unread: 0 },
  { id: 2, name: 'นาย วิชา สมาร์ท', relation: 'ผู้ปกครอง ด.ช. เก่งกาจ สมาร์ท', unread: 2 },
  { id: 3, name: 'นาง นงลักษณ์ ใจดี', relation: 'ผู้ปกครอง ด.ช. สมชาย ใจดี', unread: 0 },
];

export function TeacherChat({ user }: { user: User }) {
  const [activeContact, setActiveContact] = useState(MOCK_CONTACTS[0]);
  const [messages, setMessages] = useState([
    { id: 1, text: 'สวัสดีค่ะคุณแม่ น้องมาลีมีอาการปวดหัวนิดหน่อยตอนบ่าย ครูเลยให้ไปพักที่ห้องพยาบาลนะคะ', sender: 'teacher', time: '14:30' },
    { id: 2, text: 'รับทราบค่ะครู ตอนนี้น้องอาการดีขึ้นไหมคะ?', sender: 'parent', time: '14:35' },
    { id: 3, text: 'ดีขึ้นแล้วค่ะ ทานยาแล้วหลับไปพักนึง ตอนนี้ตื่นแล้วค่ะ เดี๋ยวตอนเย็นคุณแม่มารับตามปกติได้เลยค่ะ', sender: 'teacher', time: '14:40' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'teacher', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 h-[calc(100vh-8rem)] flex">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <MessageCircle className="text-emerald-500" /> แชทกับผู้ปกครอง
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              placeholder="ค้นหาชื่อนักเรียน / ผู้ปกครอง..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-emerald-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MOCK_CONTACTS.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setActiveContact(contact)}
              className={`w-full text-left p-4 flex items-center gap-3 border-b border-slate-100 transition-colors ${activeContact.id === contact.id ? 'bg-emerald-50' : 'hover:bg-slate-100'}`}
            >
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                {contact.name.substring(4, 5)}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{contact.name}</h4>
                  {contact.unread > 0 && (
                    <span className="w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{contact.relation}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
              {activeContact.name.substring(4, 5)}
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{activeContact.name}</h3>
              <p className="text-xs text-slate-500">{activeContact.relation}</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full shadow-sm text-emerald-600 border-emerald-200 hover:bg-emerald-50">
            <Phone size={16} className="mr-2" /> โทรหาผู้ปกครอง
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-slate-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${msg.sender === 'teacher' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                <p className="text-sm md:text-base">{msg.text}</p>
                <p className={`text-[10px] mt-1 text-right ${msg.sender === 'teacher' ? 'text-emerald-200' : 'text-slate-400'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 items-center p-4 bg-white border-t border-slate-100">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์ข้อความถึงผู้ปกครอง..." 
            className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500 rounded-full px-4 py-2.5 outline-none transition-all text-sm"
          />
          <Button type="submit" className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}
