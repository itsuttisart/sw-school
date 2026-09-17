const fs = require('fs');

const code = `import React, { useState } from 'react';
import { User } from '@/lib/types';
import { GraduationCap, AlertCircle, FileText, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const MOCK_GRADES = [
  {
    id: 'TH101',
    code: 'ท21101',
    name: 'ภาษาไทย 1',
    credit: 1.5,
    grade: '4.0',
    gradeColor: 'text-emerald-600',
    totalScore: 85,
    details: [
      { topic: 'สอบกลางภาค', max: 20, get: 18 },
      { topic: 'สอบปลายภาค', max: 30, get: 26 },
      { topic: 'ชิ้นงานที่ 1', max: 20, get: 18 },
      { topic: 'ชิ้นงานที่ 2', max: 20, get: 15 },
      { topic: 'จิตพิสัย', max: 10, get: 8 },
    ]
  },
  {
    id: 'MA101',
    code: 'ค21101',
    name: 'คณิตศาสตร์ 1',
    credit: 1.5,
    grade: '3.5',
    gradeColor: 'text-blue-600',
    totalScore: 78,
    details: [
      { topic: 'สอบกลางภาค', max: 20, get: 15 },
      { topic: 'สอบปลายภาค', max: 30, get: 22 },
      { topic: 'แบบฝึกหัด', max: 20, get: 20 },
      { topic: 'จิตพิสัย', max: 10, get: 10 },
      { topic: 'สอบเก็บคะแนนย่อย', max: 20, get: 11 },
    ]
  },
  {
    id: 'SC101',
    code: 'ว21101',
    name: 'วิทยาศาสตร์ 1',
    credit: 1.5,
    grade: '3.0',
    gradeColor: 'text-amber-500',
    totalScore: 72,
    details: [
      { topic: 'สอบกลางภาค', max: 20, get: 12 },
      { topic: 'สอบปลายภาค', max: 30, get: 20 },
      { topic: 'รายงานโครงงาน', max: 30, get: 25 },
      { topic: 'เข้าชั้นเรียน/ปฏิบัติการ', max: 20, get: 15 },
    ]
  },
  {
    id: 'EN101',
    code: 'อ21101',
    name: 'ภาษาอังกฤษ 1',
    credit: 1.5,
    grade: '-',
    gradeColor: 'text-slate-400',
    totalScore: 45,
    details: [
      { topic: 'สอบกลางภาค', max: 20, get: 15 },
      { topic: 'สอบปลายภาค', max: 30, get: null }, // missing score
      { topic: 'สมุดคำศัพท์', max: 20, get: 20 },
      { topic: 'จิตพิสัย', max: 10, get: 10 },
      { topic: 'ชิ้นงานวิดีโอ', max: 20, get: null }, // missing score
    ]
  }
];

export function StudentGrades({ user }: { user: User }) {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  
  // Set to true to allow viewing grades
  const hasPaidTuition = true;

  if (!hasPaidTuition) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-3xl p-8 shadow-sm border border-slate-200 h-[70vh]">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
          <Lock size={48} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">ไม่สามารถดูผลการเรียนได้</h2>
        <p className="text-slate-500 text-center max-w-md mb-8">
          กรุณาชำระค่าธรรมเนียมการศึกษาก่อน (ภาคเรียนที่ 1/2568) <br />
          เพื่อปลดล็อกการเข้าถึงผลการเรียน
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-700">ยอดค้างชำระ:</span>
            <span className="text-xl font-bold text-rose-600">2,500 บาท</span>
          </div>
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600 shadow-md text-white">
            แจ้งชำระเงิน / อัปโหลดสลิป
          </Button>
        </div>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedSubject(expandedSubject === id ? null : id);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[70vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="text-blue-500" /> ผลการเรียนและคะแนนเก็บ
          </h2>
          <p className="text-slate-500 text-sm mt-1">ภาคเรียนที่ 1/2567</p>
        </div>
        <Button variant="outline" className="shadow-sm border-slate-200 hover:bg-slate-50 text-slate-700">
          <FileText size={18} className="mr-2" /> พิมพ์ใบ ปพ.1
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 overflow-hidden mb-6 bg-slate-50">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
          <div className="col-span-2">รหัสวิชา</div>
          <div className="col-span-5">ชื่อวิชา</div>
          <div className="col-span-2 text-center">หน่วยกิต</div>
          <div className="col-span-3 text-center">เกรด/คะแนนรวม</div>
        </div>

        <div className="divide-y divide-slate-100">
          {MOCK_GRADES.map(subject => (
            <div key={subject.id} className="bg-white">
              <div 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleExpand(subject.id)}
              >
                <div className="col-span-2 font-bold text-slate-500 text-sm">{subject.code}</div>
                <div className="col-span-5 font-bold text-slate-800 flex items-center gap-2">
                  {subject.name}
                  {subject.details.some(d => d.get === null) && (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] rounded-full flex items-center gap-1 border border-rose-100">
                      <AlertCircle size={10} /> ขาดคะแนน
                    </span>
                  )}
                </div>
                <div className="col-span-2 md:text-center text-slate-600 text-sm">
                  <span className="md:hidden font-bold mr-2">หน่วยกิต:</span>{subject.credit}
                </div>
                <div className="col-span-2 md:text-center flex md:flex-col justify-between md:justify-center items-center">
                  <span className="md:hidden font-bold text-slate-500 text-sm">เกรด:</span>
                  <span className={\`text-lg font-bold \${subject.gradeColor}\`}>{subject.grade}</span>
                  <span className="text-[10px] text-slate-400 font-medium">รวม {subject.totalScore} คะแนน</span>
                </div>
                <div className="col-span-1 flex justify-end text-slate-400 hidden md:flex">
                  {expandedSubject === subject.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              
              {/* Expandable Details */}
              {expandedSubject === subject.id && (
                <div className="p-4 md:p-6 bg-slate-50/50 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-w-2xl mx-auto md:ml-0 md:mr-auto pl-0 md:pl-24">
                    <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                      รายละเอียดคะแนนเก็บ 
                      <span className="text-xs font-normal text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">ทั้งหมด {subject.details.reduce((sum, d) => sum + d.max, 0)} คะแนน</span>
                    </h4>
                    <div className="space-y-3">
                      {subject.details.map((detail, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                          <span className="text-sm font-medium text-slate-700">{detail.topic}</span>
                          <div className="flex items-center gap-3">
                            {detail.get === null ? (
                              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md">ยังไม่มีคะแนน</span>
                            ) : (
                              <div className="text-right">
                                <span className="text-sm font-bold text-slate-800">{detail.get}</span>
                                <span className="text-xs text-slate-400 font-medium"> / {detail.max}</span>
                              </div>
                            )}
                            
                            {/* Progress bar visual */}
                            <div className="w-20 md:w-32 h-2 bg-slate-100 rounded-full overflow-hidden hidden md:block">
                              <div 
                                className={\`h-full rounded-full \${detail.get === null ? 'bg-slate-200' : 'bg-emerald-500'}\`} 
                                style={{ width: \`\${detail.get === null ? 0 : (detail.get / detail.max) * 100}%\` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-end items-end gap-6 text-sm bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div className="text-right w-full md:w-auto flex justify-between md:block">
          <p className="text-slate-500 mb-1 font-medium">หน่วยกิตรวม</p>
          <p className="font-bold text-2xl text-slate-800">4.5</p>
        </div>
        <div className="hidden md:block w-px h-12 bg-slate-300"></div>
        <div className="text-right w-full md:w-auto flex justify-between md:block">
          <p className="text-slate-500 mb-1 font-medium">เกรดเฉลี่ยประจำภาค (GPA)</p>
          <p className="font-bold text-2xl text-emerald-600">3.50</p>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/student/StudentGrades.tsx', code);
console.log("Updated Student Grades");
