const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');

(async () => {
  try {
    const folder = '../src/routes';
    const lst = await fs.readdirSync(folder);
    await Promise.map(lst, async (file) => {
      var stat = await fs.statSync(path.join(folder, file));
      if (stat.isDirectory(file))
        await rename_files(path.join(folder, file));
    })
  } catch (ex) {

  }
})();

async function rename_files(folder) {
  const lst = await fs.readdirSync(folder);
  await Promise.map(lst, async (file) => {
    console.log(path.join(folder, path.basename(file) + '.ts'));
    await fs.renameSync(path.join(folder, file), path.join(folder, path.basename(file) + '.ts'));
  })
}