// Régénère content/ventes/index.json et content/documentation/index.json
// à partir des fichiers individuels créés ou modifiés via le CMS.
// Exécuté automatiquement par .github/workflows/build-index.yml à chaque
// push sur main touchant le dossier content/, et peut aussi être lancé
// manuellement avec `node build-index.js`.

const fs = require('fs');
const path = require('path');

function buildIndex(dir, { sortByDateDesc = false } = {}) {
  const fullDir = path.join(__dirname, dir);
  if (!fs.existsSync(fullDir)) {
    console.warn(`Dossier introuvable, ignoré : ${dir}`);
    return;
  }

  const files = fs
    .readdirSync(fullDir)
    .filter((f) => f.endsWith('.json') && f !== 'index.json');

  const items = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(fullDir, file), 'utf8');
      try {
        return JSON.parse(raw);
      } catch (err) {
        console.error(`Fichier JSON invalide ignoré : ${dir}/${file} — ${err.message}`);
        return null;
      }
    })
    .filter(Boolean);

  if (sortByDateDesc) {
    items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }

  const outPath = path.join(fullDir, 'index.json');
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2) + '\n');
  console.log(`${dir}/index.json régénéré (${items.length} entrée${items.length > 1 ? 's' : ''})`);
}

buildIndex('content/ventes');
buildIndex('content/documentation', { sortByDateDesc: true });
