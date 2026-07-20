// Charge et affiche les articles à partir de content/documentation/index.json
// (régénéré automatiquement par build-index.js à chaque publication via le CMS)

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('articles-container');
  const emptyState = document.getElementById('articles-empty');
  if (!container) return;

  const escapeHtml = (str) =>
    String(str ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));

  const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  };

  const renderArticle = (item) => {
    const paragraphs = String(item.contenu || '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join('\n');

    const article = document.createElement('article');
    article.className = 'doc-article reveal is-visible';
    article.innerHTML = `
      <span class="eyebrow">Article</span>
      <h2>${escapeHtml(item.titre)}</h2>
      ${item.date ? `<p class="doc-article__date">${escapeHtml(formatDate(item.date))}</p>` : ''}
      ${paragraphs}
    `;
    return article;
  };

  fetch('content/documentation/index.json')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((items) => {
      const list = Array.isArray(items) ? items.filter(Boolean) : [];
      list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

      if (list.length === 0) {
        if (emptyState) emptyState.hidden = false;
        return;
      }

      const fragment = document.createDocumentFragment();
      list.forEach((item) => fragment.appendChild(renderArticle(item)));
      container.appendChild(fragment);
    })
    .catch((err) => {
      console.error('Impossible de charger les articles :', err);
      if (emptyState) emptyState.hidden = false;
    });
});
