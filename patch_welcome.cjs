const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');

// import WelcomePopup
code = code.replace(/import \{ Button \} from '@\/components\/ui\/Button';/, "import { Button } from '@/components/ui/Button';\nimport { WelcomePopup } from '@/components/WelcomePopup';");

// inject WelcomePopup
code = code.replace(/\{children\}\n\s*<\/div>\n\s*<\/div>/, "{children}\n          </div>\n        </div>\n        <WelcomePopup user={user} />");

fs.writeFileSync('src/components/layout/AppLayout.tsx', code);
