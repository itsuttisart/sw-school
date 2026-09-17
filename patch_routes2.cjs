const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// For Teacher
code = code.replace(/if \(currentMenu === 'เช็คชื่อรายวิชา'\) return <TeacherSubjectAttendance user=\{user\} \/>;/, 
    "if (currentMenu === 'เช็คชื่อ' || currentMenu === 'เช็คชื่อรายวิชา') return <TeacherSubjectAttendance user={user} />;");

fs.writeFileSync('src/App.tsx', code);
