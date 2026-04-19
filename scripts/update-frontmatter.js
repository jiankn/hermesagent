const fs = require('fs');
const path = require('path');

const locales = ['zh', 'en'];

locales.forEach(locale => {
  const dir = path.join('C:/antigravity/hermesagent/content/tutorials', locale, 'bootcamp');
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(/difficulty: ".*"/);
        if (match) {
          const dayMatch = file.match(/day-(\d+)\.mdx$/);
          const day = dayMatch ? dayMatch[1] : '1';
          
          if (!content.includes('category: "bootcamp"')) {
            const newContent = content.replace(
              match[0], 
              `${match[0]}\ncategory: "bootcamp"\nseriesOrder: ${day}`
            );
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated ${filePath}`);
          }
        }
      }
    });
  }
});
