const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// add import
code = code.replace(/import \{ AdminAnnouncementSystem \} from '@\/pages\/admin\/AnnouncementSystem';/, "import { AdminAnnouncementSystem } from '@/pages/admin/AnnouncementSystem';\nimport { AdminPopupManager } from '@/pages/admin/PopupManager';");

// add route
code = code.replace(/if \(currentMenu === 'ระบบประกาศ'\) return <AdminAnnouncementSystem \/>;/, "if (currentMenu === 'ระบบประกาศ') return <AdminAnnouncementSystem />;\n      if (currentMenu === 'จัดการป็อปอัพ') return <AdminPopupManager />;");

fs.writeFileSync('src/App.tsx', code);
