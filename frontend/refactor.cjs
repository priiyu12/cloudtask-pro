const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replacements
  content = content.replace(/text-white\/30/g, 'text-muted-foreground');
  content = content.replace(/text-white\/40/g, 'text-muted-foreground');
  content = content.replace(/text-white\/50/g, 'text-muted-foreground');
  content = content.replace(/text-white\/60/g, 'text-muted-foreground');
  content = content.replace(/text-white\/70/g, 'text-muted-foreground');
  content = content.replace(/text-white/g, 'text-foreground');

  content = content.replace(/bg-white\/\[0\.02\]/g, 'bg-card');
  content = content.replace(/bg-white\/\[0\.04\]/g, 'bg-secondary');
  content = content.replace(/bg-white\/\[0\.05\]/g, 'bg-secondary');
  content = content.replace(/bg-\[\#111111\]/g, 'bg-card');
  content = content.replace(/bg-\[\#0a0a0a\]/g, 'bg-background');

  content = content.replace(/border-white\/\[0\.06\]/g, 'border-border');
  content = content.replace(/border-white\/\[0\.07\]/g, 'border-border');
  content = content.replace(/border-white\/\[0\.08\]/g, 'border-border');
  content = content.replace(/border-white\/20/g, 'border-border');
  content = content.replace(/border-white\/\[0\.14\]/g, 'border-border/80');

  content = content.replace(/text-black/g, 'text-primary-foreground');
  content = content.replace(/bg-white([^/a-zA-Z0-9])/g, 'bg-primary$1');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated: ' + filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(srcDir);
