// Charge et affiche les biens en vente à partir de content/ventes/index.json
// (régénéré automatiquement par build-index.js à chaque publication via le CMS)

document.addEventListener('DOMContentLoaded', () => {
  const catalogue = document.getElementById('ventes-catalogue');
  const emptyState = document.getElementById('ventes-empty');
  if (!catalogue) return;

  const TYPE_LABELS = {
    judiciaire: 'Vente judiciaire',
    volontaire: 'Vente volontaire',
  };

  const escapeHtml = (str) =>
    String(str ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));

  const formatPrice = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num)) return '';
    return `${num.toLocaleString('fr-FR').replace(/ | /g, ' ')} FCFA`;
  };

  const renderCard = (item) => {
    const typeLabel = TYPE_LABELS[item.type] || 'Vente';
    const photo = item.photo || 'assets/img/ventes/placeholder.svg';
    const titre = escapeHtml(item.titre);

    const card = document.createElement('div');
    card.className = 'sale-card reveal is-visible';
    card.innerHTML = `
      <div class="sale-card__media">
        <span class="sale-card__type">${escapeHtml(typeLabel)}</span>
        <img src="${escapeHtml(photo)}" alt="${titre}" loading="lazy">
      </div>
      <div class="sale-card__body">
        <h3>${titre}</h3>
        <p>${escapeHtml(item.description)}</p>
        <div class="sale-card__meta">
          <div><strong>Mise à prix</strong><span>${formatPrice(item.mise_a_prix)}</span></div>
          <div><strong>Lieu</strong><span>${escapeHtml(item.lieu)}</span></div>
        </div>
        <a href="contact.html" class="btn btn--outline" style="width:100%; justify-content:center;">Contacter pour ce bien</a>
      </div>
    `;
    return card;
  };

  fetch('content/ventes/index.json')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((items) => {
      const actifs = Array.isArray(items) ? items.filter((it) => it && it.actif === true) : [];

      if (actifs.length === 0) {
        if (emptyState) emptyState.hidden = false;
        return;
      }

      const fragment = document.createDocumentFragment();
      actifs.forEach((item) => fragment.appendChild(renderCard(item)));
      catalogue.appendChild(fragment);
    })
    .catch((err) => {
      console.error('Impossible de charger le catalogue des ventes :', err);
      if (emptyState) emptyState.hidden = false;
    });
});
