const fs = require('fs');
let code = fs.readFileSync('src/components/WelcomePopup.tsx', 'utf8');

// Replace the logic to ignore admin and check expiresAt
code = code.replace(/const popupToShow = popups.find\(p => \{/, `const popupToShow = popups.find(p => {
        // Do not show popup to admins
        if (user.role === 'admin') return false;

        // Check if expired
        if (p.expiresAt && new Date(p.expiresAt) < new Date()) {
          return false;
        }`);

fs.writeFileSync('src/components/WelcomePopup.tsx', code);
