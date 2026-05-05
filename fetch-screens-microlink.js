const fs = require('fs');
const https = require('https');
const path = require('path');

const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
};

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      } else {
        reject(new Error(`Failed to download ${url}`));
      }
    }).on('error', reject);
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
    console.log(`Processing ${site.name}...`);
    try {
      const data = await fetchJson(`https://api.microlink.io/?url=${encodeURIComponent(site.url)}&screenshot=true&meta=false`);
      if (data && data.data && data.data.screenshot && data.data.screenshot.url) {
        await download(data.data.screenshot.url, path.join(dir, site.name));
        console.log(`Saved ${site.name}`);
      } else {
        console.error(`No screenshot url found for ${site.name}`, data);
      }
    } catch(e) {
      console.error(`Error for ${site.name}:`, e.message);
    }
  }
}
run();
