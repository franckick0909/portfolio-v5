const fs = require('fs');
const https = require('https');
const path = require('path');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
          download(response.headers.location, dest).then(resolve).catch(reject);
      } else {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

const sites = [
  { url: 'https://angel-tattoo.vercel.app/', name: 'tatoo1.jpg' },
  { url: 'https://harmonie-woad.vercel.app/', name: 'harmonie1.jpg' },
  { url: 'https://imo1.vercel.app/', name: 'imo1.jpg' }
];

async function run() {
  const dir = path.join(__dirname, 'public', 'projets');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const site of sites) {
    // using a free screenshot API
    const api = `https://image.thum.io/get/width/1400/crop/900/noanimate/${site.url}`;
    console.log(`Downloading ${site.name}...`);
    try {
      await download(api, path.join(dir, site.name));
      console.log(`Saved ${site.name}`);
    } catch(e) {
      console.error(`Error for ${site.name}:`, e.message);
    }
  }
}
run();
