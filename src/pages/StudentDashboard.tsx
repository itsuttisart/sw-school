import React from 'react';
import { User } from '@/lib/types';
import { BookOpen, Calendar, Clock, Trophy } from 'lucide-react';

export function StudentDashboard({ user }: { user: User }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full md:grid-rows-6">
      
      {/* Welcome Banner */}
      <div className="md:col-span-12 md:row-span-2 bg-emerald-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500 rounded-full opacity-50 blur-2xl pointer-events-none"></div>
        <div className="absolute right-20 -bottom-10 w-32 h-32 bg-emerald-400 rounded-full opacity-30 blur-xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">👋 สวัสดี {user.name}</h2>
          <p className="text-emerald-100 font-medium text-lg">ชั้น {user.class} | เลขที่ 15</p>
        </div>
      </div>

      {/* Stats */}
      <div className="md:col-span-3 md:row-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 w-fit mb-4">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <p className="text-3xl font-bold text-slate-800">3.21</p>
          <h4 className="text-slate-500 text-sm font-medium mt-1">GPA</h4>
        </div>
      </div>
      
      <div className="md:col-span-3 md:row-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 w-fit mb-4">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-3xl font-bold text-slate-800">96%</p>
          <h4 className="text-slate-500 text-sm font-medium mt-1">การเข้าเรียน</h4>
        </div>
      </div>
      
      <div className="md:col-span-3 md:row-span-2 bg-rose-50 rounded-3xl p-6 shadow-sm border border-rose-100 flex flex-col justify-between">
        <div className="p-3 bg-rose-100 rounded-2xl text-rose-600 w-fit mb-4">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <p className="text-3xl font-bold text-rose-700">3</p>
          <h4 className="text-rose-600/80 text-sm font-medium mt-1">งานที่ต้องส่ง</h4>
        </div>
      </div>

      <div className="md:col-span-3 md:row-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 w-fit mb-4">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <p className="text-3xl font-bold text-slate-800">2</p>
          <h4 className="text-slate-500 text-sm font-medium mt-1">กิจกรรมเร็วๆนี้</h4>
        </div>
      </div>

      {/* Schedule */}
      <div className="md:col-span-12 md:row-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
        <h3 className="font-bold text-slate-800 mb-4">📅 ตารางเรียนวันนี้</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <ClassItem time="08:30 - 09:20" subject="คณิตศาสตร์" room="ห้อง 302" active />
          <ClassItem time="10:30 - 11:20" subject="ภาษาไทย" room="ห้อง 305" />
          <ClassItem time="13:00 - 13:50" subject="วิทยาศาสตร์" room="ห้อง Lab 1" />
        </div>
      </div>

    </div>
  );
}

function ClassItem({ time, subject, room, active }: any) {
  return (
    <div className={`flex flex-col p-5 rounded-2xl border ${active ? 'border-emerald-200 bg-emerald-50 shadow-sm' : 'border-slate-100 bg-slate-50'}`}>
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-500 border border-slate-200'}`}>
          {time}
        </span>
        {active && <span className="flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
      </div>
      <h4 className={`text-lg font-bold ${active ? 'text-emerald-900' : 'text-slate-800'}`}>{subject}</h4>
      <p className={`text-sm mt-1 ${active ? 'text-emerald-700/80' : 'text-slate-500'}`}>{room}</p>
    </div>
  );
}
