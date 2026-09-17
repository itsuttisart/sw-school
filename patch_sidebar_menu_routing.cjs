const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The route in App.tsx needs to match the new label if it changed.
// "เช็คชื่อ" maps to what used to be "เช็คชื่อรายวิชา" component: <TeacherSubjectAttendance /> 
code = code.replace(/if \(currentMenu === 'เช็คชื่อ'\) return <TeacherAttendance \/>;/, "");
code = code.replace(/if \(currentMenu === 'เช็คชื่อรายวิชา'\) return <TeacherSubjectAttendance \/>;/, "if (currentMenu === 'เช็คชื่อ') return <TeacherSubjectAttendance />;\n      if (currentMenu === 'เช็คชื่อรายวิชา') return <TeacherSubjectAttendance />;");

fs.writeFileSync('src/App.tsx', code);
