import React, { useState } from 'react';
import { User } from '@/lib/types';
import { ClipboardCheck, Settings, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

const MOCK_STUDENTS = [
  { id: '65001', name: 'ด.ช. สมชาย รักเรียน', number: 1, scores: {} as Record<string, number> },
  { id: '65002', name: 'ด.ญ. สมหญิง จริงใจ', number: 2, scores: {} as Record<string, number> },
  { id: '65003', name: 'ด.ช. เก่งกาจ สามารถ', number: 3, scores: {} as Record<string, number> },
];

export function TeacherGrading({ user }: { user: User }) {
  const [columns, setColumns] = useState([
    { id: 'midterm', name: 'สอบกลางภาค', maxScore: 20 },
    { id: 'final', name: 'สอบปลายภาค', maxScore: 30 },
    { id: 'work1', name: 'ชิ้นงานที่ 1', maxScore: 10 },
    { id: 'behavior', name: 'จิตพิสัย', maxScore: 10 },
  ]);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [subject] = useState('ค21101 คณิตศาสตร์ (ม.1/1)');
  const [isConfigMode, setIsConfigMode] = useState(false);

  const calculateGrade = (totalScore: number) => {
    if (totalScore >= 80) return '4.0';
    if (totalScore >= 75) return '3.5';
    if (totalScore >= 70) return '3.0';
    if (totalScore >= 65) return '2.5';
    if (totalScore >= 60) return '2.0';
    if (totalScore >= 55) return '1.5';
    if (totalScore >= 50) return '1.0';
    return '0.0';
  };

  const handleScoreChange = (studentId: string, colId: string, value: string, maxScore: number) => {
    let numVal = parseFloat(value);
    if (isNaN(numVal)) numVal = 0;
    if (numVal > maxScore) numVal = maxScore;
    if (numVal < 0) numVal = 0;

    setStudents(students.map(s => {
      if (s.id === studentId) {
        return { ...s, scores: { ...s.scores, [colId]: numVal } };
      }
      return s;
    }));
  };

  const addColumn = () => {
    const newId = `col_${Date.now()}`;
    setColumns([...columns, { id: newId, name: 'ช่องคะแนนใหม่', maxScore: 10 }]);
  };

  const updateColumn = (id: string, field: 'name' | 'maxScore', value: string) => {
    setColumns(columns.map(c => {
      if (c.id === id) {
        if (field === 'maxScore') return { ...c, [field]: parseInt(value) || 0 };
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const removeColumn = (id: string) => {
    setColumns(columns.filter(c => c.id !== id));
  };

  const totalMaxScore = columns.reduce((sum, col) => sum + col.maxScore, 0);

  const handleSave = () => {
    if (totalMaxScore !== 100) {
      Swal.fire({
        icon: 'warning',
        title: 'คำเตือน: คะแนนรวมไม่เท่ากับ 100',
        text: `คะแนนรวมปัจจุบันคือ ${totalMaxScore} คะแนน คุณต้องการบันทึกหรือไม่?`,
        showCancelButton: true,
        confirmButtonText: 'ยืนยันบันทึก',
        cancelButtonText: 'กลับไปแก้ไข'
      }).then(res => {
        if (res.isConfirmed) showSuccess();
      });
    } else {
      showSuccess();
    }
  };

  const showSuccess = () => {
    Swal.fire({
      icon: 'success',
      title: 'บันทึกคะแนนสำเร็จ',
      timer: 1500,
      showConfirmButton: false
    });
  };

  if (isConfigMode) {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="text-blue-500" /> ตั้งค่าโครงสร้างคะแนน: {subject}
          </h2>
          <Button onClick={() => setIsConfigMode(false)} className="bg-slate-800 hover:bg-slate-900 text-white">
            กลับไปบันทึกคะแนน
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          {columns.map((col, idx) => (
            <div key={col.id} className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                {idx + 1}
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 mb-1 block">ชื่อช่องเก็บคะแนน</label>
                <Input value={col.name} onChange={(e) => updateColumn(col.id, 'name', e.target.value)} className="bg-white" />
              </div>
              <div className="w-32">
                <label className="text-xs font-bold text-slate-500 mb-1 block">คะแนนเต็ม</label>
                <Input type="number" value={col.maxScore} onChange={(e) => updateColumn(col.id, 'maxScore', e.target.value)} className="bg-white text-center font-bold" />
              </div>
              <div className="pt-5">
                <Button variant="ghost" size="icon" onClick={() => removeColumn(col.id)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <Button variant="outline" onClick={addColumn} className="text-blue-600 border-blue-200 hover:bg-blue-100 bg-white shadow-sm">
            <Plus size={16} className="mr-2" /> เพิ่มช่องเก็บคะแนน
          </Button>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-600">คะแนนรวมสูงสุด (Max Score)</p>
            <p className={`text-3xl font-bold ${totalMaxScore === 100 ? 'text-emerald-600' : 'text-amber-500'}`}>
              {totalMaxScore} <span className="text-lg">/ 100</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardCheck className="text-blue-500" /> บันทึกคะแนน
          </h2>
          <p className="text-slate-500 text-sm mt-1">{subject}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsConfigMode(true)} className="text-slate-600">
            <Settings size={18} className="mr-2" /> ตั้งค่าช่องคะแนน
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            <Save size={18} className="mr-2" /> บันทึกคะแนน
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-4 font-bold w-16 text-center">เลขที่</th>
              <th className="px-4 py-4 font-bold min-w-[200px]">ชื่อ-นามสกุล</th>
              {columns.map((col) => (
                <th key={col.id} className="px-2 py-4 font-bold text-center w-24">
                  <div className="truncate mb-1">{col.name}</div>
                  <div className="text-[10px] text-blue-500 bg-blue-50 py-0.5 rounded-full mx-2">เต็ม {col.maxScore}</div>
                </th>
              ))}
              <th className="px-4 py-4 font-bold text-center bg-slate-100 border-l border-slate-200 w-24">รวม<br/>(100)</th>
              <th className="px-4 py-4 font-bold text-center bg-slate-100 w-20">เกรด</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const total = columns.reduce((sum, col) => sum + (student.scores[col.id] || 0), 0);
              const grade = calculateGrade(total);
              
              return (
                <tr key={student.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-center font-bold text-slate-400">{student.number}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                  
                  {columns.map(col => (
                    <td key={col.id} className="px-2 py-3 text-center">
                      <input 
                        type="number"
                        min="0"
                        max={col.maxScore}
                        value={student.scores[col.id] === undefined ? '' : student.scores[col.id]}
                        onChange={(e) => handleScoreChange(student.id, col.id, e.target.value, col.maxScore)}
                        className="w-16 p-2 text-center text-sm border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </td>
                  ))}
                  
                  <td className="px-4 py-3 text-center font-bold text-blue-700 bg-slate-50 border-l border-slate-100">
                    {total}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-lg text-emerald-600 bg-slate-50">
                    {grade}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
