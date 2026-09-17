const fs = require('fs');
let code = fs.readFileSync('src/components/WelcomePopup.tsx', 'utf8');

// Replace sessionStorage.getItem('dismissedPopups') with sessionStorage.getItem(`dismissedPopups_${user.id}`)
code = code.replace(/sessionStorage\.getItem\('dismissedPopups'\)/g, "sessionStorage.getItem(`dismissedPopups_${user.id}`)");
code = code.replace(/sessionStorage\.setItem\('dismissedPopups',/g, "sessionStorage.setItem(`dismissedPopups_${user.id}`,");

fs.writeFileSync('src/components/WelcomePopup.tsx', code);
