const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/PopupManager.tsx', 'utf8');

// Add admin to initial state
code = code.replace(/targetRoles: \{ student: true, parent: true, teacher: true \}/g, 'targetRoles: { student: true, parent: true, teacher: true, admin: true }');

// Add admin checkbox UI
const adminCheckbox = `
              <label className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={editingPopup.targetRoles.admin || false} 
                  onChange={(e) => setEditingPopup({
                    ...editingPopup, 
                    targetRoles: {...editingPopup.targetRoles, admin: e.target.checked}
                  })}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-slate-700">ผู้ดูแลระบบ</span>
              </label>
`;

code = code.replace(/(<label className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">[\s\S]*?<span className="font-medium text-slate-700">ครู \/ บุคลากร<\/span>\n\s*<\/label>)/, `$1\n${adminCheckbox}`);

// Add admin badge to card
code = code.replace(/(\{popup.targetRoles.teacher && <span className="text-\[10px\] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">ครู<\/span>\})/, `$1\n                     {popup.targetRoles.admin && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">แอดมิน</span>}`);

fs.writeFileSync('src/pages/admin/PopupManager.tsx', code);
