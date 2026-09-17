const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminSettings.tsx', 'utf8');

// 1. Remove the tab buttons
code = code.replace("{renderTabButton('periods', <Calendar size={18} />, 'จัดการคาบเรียน')}\n", "");
code = code.replace("{renderTabButton('classrooms', <Layers size={18} />, 'ระดับชั้นและห้องเรียน')}\n", "");

// 2. Remove the periods tab content
const periodsRegex = /\{\/\* Tab: Periods \*\/\}\s*\{activeTab === 'periods' && \([\s\S]*?\}\s*\)\}/;
code = code.replace(periodsRegex, "");

// 3. Remove the classrooms tab content
const classroomsRegex = /\{\/\* Tab: Classrooms \*\/\}\s*\{activeTab === 'classrooms' && \([\s\S]*?\}\s*\)\}/;
code = code.replace(classroomsRegex, "");

fs.writeFileSync('src/pages/AdminSettings.tsx', code);
console.log("Patched AdminSettings.tsx");
