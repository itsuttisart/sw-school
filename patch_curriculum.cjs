const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/CurriculumSystem.tsx', 'utf8');

// Add handleImport function to CurriculumSystem
if (!code.includes('handleImport')) {
  code = code.replace(/const handleOpenSubject = \(\) => \{/, `const handleImport = () => {
    Swal.fire({
      title: 'นำเข้าข้อมูลหลักสูตร (Excel)',
      html: \`
        <div class="text-sm text-slate-500 mb-2">กรุณาเลือกไฟล์ .xlsx หรือ .csv</div>
        <div class="mb-4">
          <a href="#" onclick="event.preventDefault(); alert('ดาวน์โหลดไฟล์แม่แบบ (Template) เรียบร้อย');" class="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            ดาวน์โหลดไฟล์แม่แบบ (Template)
          </a>
        </div>
        <input type="file" id="excel-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
      \`,
      showCancelButton: true,
      confirmButtonText: 'นำเข้าข้อมูล',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#10b981',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'กำลังนำเข้าข้อมูล...',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); }
        });
        setTimeout(() => {
          Swal.fire('สำเร็จ', 'นำเข้าข้อมูลหลักสูตรเรียบร้อยแล้ว', 'success');
        }, 1500);
      }
    });
  };
  
  const handleOpenSubject = () => {`);
}

// Add Upload icon import
if (!code.includes('Upload,')) {
  code = code.replace(/import \{ /, "import { Upload, ");
}

// Add the button to the UI
code = code.replace(/<Button onClick=\{handleOpenSubject\}/, `<Button variant="outline" onClick={handleImport} className="text-slate-600 mr-2 border-slate-200">
          <Upload size={18} className="mr-2" /> นำเข้าข้อมูล
        </Button>
        <Button onClick={handleOpenSubject}`);

fs.writeFileSync('src/pages/admin/CurriculumSystem.tsx', code);
