const fs = require('fs');
const path = require('path');
const markdownpdf = require('markdown-to-pdf');

const input = path.join(__dirname, 'api_endpoints.md');
const output = path.join(__dirname, 'api_endpoints.pdf');

(async () => {
  try {
    const mdFile = fs.readFileSync(input, 'utf-8');
    await markdownpdf().from(mdFile).to(output);
    console.log('PDF generated successfully at:', output);
  } catch (err) {
    console.error('Markdown to PDF conversion failed:', err);
    process.exit(1);
  }
})();
