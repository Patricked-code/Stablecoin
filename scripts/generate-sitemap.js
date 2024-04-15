const { create } = require('xmlbuilder2');
const fs = require('fs');
const path = require('path');

const pages = [
  { url: '/', changefreq: 'daily', priority: 0.7 },
  // Ajoutez d'autres pages ici
];

const domain = 'https://stablecoin.chainsolutions.fr';

const sitemap = create({ version: '1.0', encoding: 'UTF-8' })
  .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

pages.forEach((page) => {
  // Création de l'élément 'url' correctement
  const urlElement = sitemap.ele('url');
  urlElement.ele('loc').txt(`${domain}${page.url}`); // Utilisation de txt pour définir le contenu textuel de l'élément
  urlElement.ele('changefreq').txt(page.changefreq);
  urlElement.ele('priority').txt(page.priority.toString());
});

const xml = sitemap.end({ prettyPrint: true });

fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), xml);

console.log('Sitemap generated!');

// Posible d'exécuter avec : node scripts/generate-sitemap.js ou placer dans script de package.json => "postbuild": "node scripts/generate-sitemap.js"