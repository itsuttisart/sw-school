const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/RoleManagement.tsx', 'utf8');

code = code.replace(/<div className="space-y-4">/, '<div className="overflow-x-auto"><div className="space-y-4 min-w-[600px]">');
code = code.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<div className="p-6 border-t border-slate-200/, '</div></div></div></div><div className="p-6 border-t border-slate-200');

fs.writeFileSync('src/pages/admin/RoleManagement.tsx', code);
