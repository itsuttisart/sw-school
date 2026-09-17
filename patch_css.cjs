const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');
if (!code.includes('overflow-x: hidden')) {
    code += '\n\nhtml, body {\n  width: 100%;\n  overflow-x: hidden;\n}\n';
    fs.writeFileSync('src/index.css', code);
}
