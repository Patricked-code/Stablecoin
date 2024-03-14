// scripts/generate-sitemap.js

import { create } from 'xmlbuilder2';
import fs from 'fs';
import path from 'path';

const pages = [
  { url: '/', changefreq: 'daily', priority: 0.7 },
  // Ajoutez d'autres pages ici
  // { url: '/about', changefreq: 'monthly', priority: 0.5 },
];

const domain = 'https://www.votre-domaine.com';

const sitemap = create({ version: '1.0', encoding: 'UTF-8' })
  .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

pages.forEach((page) => {
  const url = sitemap.ele('url');
  url.ele('loc', `${domain}${page.url}`);
  url.ele('changefreq', page.changefreq);
  url.ele('priority', page.priority.toString());
});

const xml = sitemap.end({ prettyPrint: true });

fs.writeFileSync(path.resolve(__dirname, './../publi/sitemap.xml'), xml);

console.log('Sitemap generated!');
// Posible d'exécuter avec : node scripts/generate-sitemap.js ou placer dans script de package.json => "postbuild": "node scripts/generate-sitemap.js"

