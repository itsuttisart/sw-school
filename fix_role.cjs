const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/RoleManagement.tsx', 'utf8');
code = code.replace(/              <\/div>\n            <\/div>\n            <div className="p-6 border-t border-slate-200/, '              </div>\n            </div></div>\n            <div className="p-6 border-t border-slate-200');
fs.writeFileSync('src/pages/admin/RoleManagement.tsx', code);
