// netlify/functions/construccion.mjs
export const handler = async (event) => {
  // CORS básico
  const baseHeaders = {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'cache-control': 'public, max-age=300' // 5 min
  };

  // RSS fuentes en español
const FEEDS = [
  {
    source: 'Google News — Construcción (PE)',
    url:
      'https://news.google.com/rss/search?q=construcci%C3%B3n%20OR%20obras%20OR%20infraestructura&hl=es-419&gl=PE&ceid=PE:es-419'
  },
  {
    source: 'Google News — Ingeniería Civil (PE)',
    url:
      'https://news.google.com/rss/search?q=ingenier%C3%ADa%20civil%20OR%20edificaciones&hl=es-419&gl=PE&ceid=PE:es-419'
  },
  {
    source: 'Europa Press — Construcción (ES)',
    url: 'https://www.europapress.es/rss/rss.aspx?ch=279'
  }
];


  try {
    const results = await Promise.allSettled(
      FEEDS.map(async ({ source, url }) => {
        const res = await fetch(url, { headers: { 'user-agent': 'PolylineBot/1.0' } });
        if (!res.ok) throw new Error(`${source} HTTP ${res.status}`);
        const xml = await res.text();
        return parseRSS(xml, source);
      })
    );

    // Aplanar, filtrar rechazos y juntar
    const items = results
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r) => r.value)
      .map(sanitizeItem);

    // Quitar duplicados por URL o título
    const uniq = dedupe(items, (i) => i.url || i.title);

    // Ordenar por fecha desc
    uniq.sort((a, b) => {
      const ad = Date.parse(a.publishedAt || 0) || 0;
      const bd = Date.parse(b.publishedAt || 0) || 0;
      return bd - ad;
    });

    // Limitar
    const limited = uniq.slice(0, 24);

    return {
      statusCode: 200,
      headers: baseHeaders,
      body: JSON.stringify(limited)
    };
  } catch (err) {
    console.error('Construcción feed error:', err);
    return {
      statusCode: 500,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'No se pudo obtener noticias de construcción', detail: String(err) })
    };
  }
};

/* ---------- Helpers ---------- */

// RSS parser muy simple para <item> y <entry>
function parseRSS(xml, source) {
  // items RSS 2.0
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  // Atom
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;

  const items = [];
  let m;

  const pushItem = (block) => {
    const get = (tag) => getTag(block, tag);
    const title = decodeHTML(get('title'));
    const link = decodeHTML(get('link')) || getHref(block, 'link');
    const pubDate = get('pubDate') || get('published') || get('updated') || '';
    const description = stripTags(get('description') || get('summary') || '');
    const image =
      getMediaContent(block) ||
      getEnclosureUrl(block) ||
      extractFirstImgSrc(block) ||
      null;

    items.push({
      source,
      title,
      url: link,
      publishedAt: toISODate(pubDate),
      summary: truncate(description, 220),
      image
    });
  };

  while ((m = itemRegex.exec(xml))) pushItem(m[1]);
  while ((m = entryRegex.exec(xml))) pushItem(m[1]);

  return items;
}

function getTag(block, tag) {
  const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = r.exec(block);
  return m ? m[1].trim() : '';
}
function getHref(block, tag) {
  const r = new RegExp(`<${tag}[^>]*href="([^"]+)"[^>]*\\/?>`, 'i');
  const m = r.exec(block);
  return m ? m[1].trim() : '';
}
function getEnclosureUrl(block) {
  const r = /<enclosure[^>]*url="([^"]+)"[^>]*>/i;
  const m = r.exec(block);
  return m ? m[1] : null;
}
function getMediaContent(block) {
  const r = /<(?:media:content|media:thumbnail)[^>]*url="([^"]+)"[^>]*>/i;
  const m = r.exec(block);
  return m ? m[1] : null;
}
function extractFirstImgSrc(block) {
  const r = /<img[^>]*src="([^"]+)"[^>]*>/i;
  const m = r.exec(block);
  return m ? m[1] : null;
}

function decodeHTML(str = '') {
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
function stripTags(str = '') {
  return decodeHTML(str).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
function toISODate(s = '') {
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.toISOString();
}
function truncate(s = '', n = 200) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
function sanitizeItem(x) {
  // Normalizaciones simples
  if (x.image && x.image.startsWith('//')) x.image = 'https:' + x.image;
  return x;
}
function dedupe(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    const k = keyFn(it);
    if (!k) {
      out.push(it);
      continue;
    }
    if (!seen.has(k)) {
      seen.add(k);
      out.push(it);
    }
  }
  return out;
}
