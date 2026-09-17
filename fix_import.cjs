const fs = require('fs');
const file = 'src/components/layout/AppLayout.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('MessageSquare,')) {
  code = code.replace(/import \{ /, "import { MessageSquare, ");
  fs.writeFileSync(file, code);
  console.log('Fixed import');
} else {
  console.log('Already imported');
}
