const fs = require('fs');
const file = 'src/components/layout/AppLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace NavLinks definition
content = content.replace(
  /const NavLinks = \(\) => \(\s*<>\s*\{menuItems\.map\(\(item, idx\) => \{[\s\S]*?\}\)\}\s*<\/>\s*\);/,
  ''
);

// Replace <NavLinks /> usage
const replacement = `{menuItems.map((item, idx) => {
            if (item.isHeader) {
              return <div key={idx} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-6">{item.label}</div>;
            }
            const Icon = item.icon;
            return (
              <NavItem 
                key={item.label} 
                icon={<Icon size={20} />} 
                label={item.label} 
                active={currentMenu === item.label} 
                onClick={() => handleMenuClick(item.label)} 
              />
            );
          })}`;

content = content.replace(/<NavLinks \/>/g, replacement);

fs.writeFileSync(file, content);
console.log('Fixed AppLayout.tsx');
