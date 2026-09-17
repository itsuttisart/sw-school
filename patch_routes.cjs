const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// For Teacher Subject Attendance
// Check if currentMenu === 'เช็คชื่อ' exists
if (!code.includes("currentMenu === 'เช็คชื่อ'")) {
    code = code.replace(/if \(currentMenu === 'เช็คชื่อรายวิชา'\) return <TeacherSubjectAttendance user=\{user\} \/>;/, 
        "if (currentMenu === 'เช็คชื่อรายวิชา' || currentMenu === 'เช็คชื่อ') return <TeacherSubjectAttendance user={user} />;\n      if (currentMenu === 'เช็คชื่อละหมาด') return <TeacherPrayerAttendance user={user} />;"); // Just to be safe, I replaced something bigger, but wait, replace could match loosely or mess up.
}

// Ensure safe replacement by just directly searching and replacing the exact line from `App.tsx` we saw before.
