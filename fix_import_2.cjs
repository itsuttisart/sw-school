const fs = require('fs');
const file = 'src/components/layout/AppLayout.tsx';
let code = fs.readFileSync(file, 'utf8');

// Revert the wrong import
code = code.replace(/import \{ MessageSquare, User \} from '@\/lib\/types';/, "import { User } from '@/lib/types';");

// Add MessageSquare to lucide-react if not present
if (!code.includes('MessageSquare,') && !code.includes('MessageSquare } from \'lucide-react\'')) {
  code = code.replace(/import \{ /, "import { "); // this does nothing useful
  code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, (match, p1) => {
    return `import { MessageSquare, ${p1} } from 'lucide-react';`;
  });
}

fs.writeFileSync(file, code);
console.log('Fixed import again');
