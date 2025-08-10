import fs from 'fs';
import path from 'path';

// List of UI component files to fix
const files = [
  'src/components/ui/button.tsx',
  'src/components/ui/badge.tsx',
  'src/components/ui/label.tsx',
  'src/components/ui/dialog.tsx',
  'src/components/ui/form.tsx',
  'src/components/ui/checkbox.tsx',
  'src/components/ui/collapsible.tsx',
  'src/components/ui/sidebar.tsx',
  'src/components/ui/toggle.tsx',
  'src/components/ui/dropdown-menu.tsx',
  'src/components/ui/select.tsx',
  'src/components/ui/separator.tsx',
  'src/components/ui/context-menu.tsx',
  'src/components/ui/breadcrumb.tsx',
  'src/components/ui/menubar.tsx',
  'src/components/ui/avatar.tsx',
  'src/components/ui/radio-group.tsx',
  'src/components/ui/accordion.tsx',
  'src/components/ui/toggle-group.tsx',
  'src/components/ui/navigation-menu.tsx',
  'src/components/ui/switch.tsx',
  'src/components/ui/scroll-area.tsx',
  'src/components/ui/sheet.tsx',
  'src/components/ui/hover-card.tsx',
  'src/components/ui/tooltip.tsx',
  'src/components/ui/aspect-ratio.tsx',
  'src/components/ui/radio-group.tsx',
  'src/components/ui/progress.tsx',
  'src/components/ui/slider.tsx',
  'src/components/ui/tabs.tsx',
  'src/components/ui/alert-dialog.tsx',
  'src/components/ui/popover.tsx'
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`Processing: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix import statements by removing version numbers
    // This regex matches @package-name@version and replaces it with @package-name
    content = content.replace(/@([^@]+)@\d+\.\d+\.\d+/g, '@$1');
    
    // Also fix react-hook-form version numbers
    content = content.replace(/react-hook-form@\d+\.\d+\.\d+/g, 'react-hook-form');
    
    // Also fix class-variance-authority version numbers
    content = content.replace(/class-variance-authority@\d+\.\d+\.\d+/g, 'class-variance-authority');
    
    // Also fix lucide-react version numbers
    content = content.replace(/lucide-react@\d+\.\d+\.\d+/g, 'lucide-react');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('All files processed!'); 