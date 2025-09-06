// netlify/functions/gnews.mjs

const GNEWS_KEY = process.env.GNEWS_KEY || '28e26406b365ba48c945913613c5975c'; // Usa variables de entorno en producción
const MAX = 12;
const PLACEHOLDER = 'https://via.placeholder.com/1200x675?text=Construccion';

const QUERY = '(construcción OR infraestructura OR obra OR vivienda OR inmobiliario OR arquitectura OR carretera OR puente)';

const plain = h => (h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const getCategory = (title, desc) => {
  const s = (String(title) + ' ' + String(desc || '')).toLowerCase();
  const cats = [
    ['Obra', ['obra', 'obras', 'licitación', 'contratista', 'contrata']],
    ['Infraestructura', ['infraestructura', 'puente', 'carretera', 'vía', 'autopista', 'ferrocarril', 'aeropuerto', 'puerto']],
    ['Vivienda', ['vivienda', 'departamento', 'inmueble', 'edificio residencial', 'hogar', 'condominio']],
    ['Inmobiliario', ['inmobiliario', 'alquiler', 'venta', 'hipoteca', 'metro cuadrado', 'tasación']],
    ['Arquitectura', ['arquitectura', 'diseño', 'urbanismo', 'paisajismo']],
    ['Materiales', ['cemento', 'acero', 'concreto', 'ladrillo', 'asfalto', 'yeso', 'hormigón']],
  ];
  for (const [label, terms] of cats) {
    if (terms.some(w => s.includes(w))) return label;
  }
  return 'Construcción';
};

const makeURL = page => {
  const url = new URL('https://gnews.io/api/v4/search');
  url.searchParams.set('q', QUERY);
  url.searchParams.set('lang', 'es');
  url.searchParams.set('country', 'pe');
  url.searchParams.set('max', '10');
  url.searchParams.set('page', String(page));
  url.searchParams.set('apikey', GNEWS_KEY);
  return url.toString();
};

const fetchGNews = async () => {
  if (!GNEWS_KEY) throw new Error('API key faltante');
  const collected = [];
  let page = 1;
  while (collected.length < MAX && page <= 3) {
    const resp = await fetch(makeURL(page), { cache: 'no-store' });
    if (!resp.ok) break;
    const json = await resp.json();
    const arts = Array.isArray(json.articles) ? json.articles : [];
    if (!arts.length) break;
    for (const a of arts) {
      if (collected.length >= MAX) break;
      collected.push({
        title: a.title,
        link: a.url,
        description: plain(a.description || a.content || ''),
        image: a.image || PLACEHOLDER,
        pubDate: a.publishedAt,
        category: getCategory(a.title, a.description || a.content)
      });
    }
    page++;
  }
  return collected;
};

export async function handler(event) {
  try {
    const items = await fetchGNews();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600'
      },
      body: JSON.stringify(items)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
}
