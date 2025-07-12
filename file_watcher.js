// iskra_core/file_watcher.js
const fs = require('fs');
const path = require('path');

const WATCH_FOLDER = path.join(__dirname, '../copilot_output');
const DEST_FOLDER  = path.join(__dirname, '../binomo_bot');

fs.watch(WATCH_FOLDER, (event, filename) => {
  if (event === 'rename' && filename.endsWith('.js')) {
    const src = path.join(WATCH_FOLDER, filename);
    const dest = path.join(DEST_FOLDER, filename);
    fs.copyFileSync(src, dest);
    console.log(`📁 Copilot файл перенесено: ${filename}`);
  }
});
