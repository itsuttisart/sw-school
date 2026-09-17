const fs = require('fs');

const filesToPatch = [
  'src/pages/admin/ManageStudents.tsx',
  'src/pages/admin/ManageTeachers.tsx',
  'src/pages/admin/ManageParents.tsx'
];

filesToPatch.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/<div class="text-sm text-slate-500 mb-4">กรุณาเลือกไฟล์ \.xlsx หรือ \.csv ที่มีข้อมูล.*?<\/div>/, 
      `<div class="text-sm text-slate-500 mb-2">กรุณาเลือกไฟล์ .xlsx หรือ .csv</div>
       <div class="mb-4">
         <a href="#" onclick="event.preventDefault(); alert('ดาวน์โหลดไฟล์แม่แบบ (Template) เรียบร้อย');" class="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
           ดาวน์โหลดไฟล์แม่แบบ (Template)
         </a>
       </div>`
    );
    fs.writeFileSync(file, code);
  }
});
