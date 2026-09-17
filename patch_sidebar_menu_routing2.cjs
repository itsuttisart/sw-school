const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// For parent role, rename 'ข้อมูลบุตร' to 'ข้อมูลส่วนตัว' to map correctly or just ensure it maps.
// The parent menu uses 'ข้อมูลส่วนตัว', but the original code mapped 'ข้อมูลบุตร'.
// Let's check App.tsx for 'ข้อมูลบุตร'
code = code.replace(/if \(currentMenu === 'ข้อมูลบุตร'\) return <StudentProfile user=\{user\} \/>;/, 
`if (currentMenu === 'ข้อมูลบุตร' || currentMenu === 'ข้อมูลส่วนตัว' && user.role === 'parent') return <StudentProfile user={user} />;
      if (currentMenu === 'ข้อมูลส่วนตัว' && user.role === 'student') return <StudentProfile user={user} />;`);
      
// Fix parent chat map
code = code.replace(/if \(currentMenu === 'ติดต่อครู'\) return <ParentTeacherChat \/>;/, "if (currentMenu === 'ติดต่อครู' || currentMenu === 'แชทกับครูที่ปรึกษา') return <ParentTeacherChat />;");

fs.writeFileSync('src/App.tsx', code);
