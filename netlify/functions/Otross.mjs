// netlify/functions/Otross.mjs
// Agregador en ESPAÑOL (IA, Cripto, Construcción) + anuncio “Construye tu app con nosotros”

import { XMLParser } from "fast-xml-parser";

const TIMEOUT_MS = 9000;
const PAGE_SIZE = 12; // cantidad final (incluye el anuncio)
const CLOUDINARY_FETCH_PREFIX = null; // opcional: "https://res.cloudinary.com/<tu_cloud>/image/fetch/f_auto,q_auto/"

// ---------- FUENTES (priorizamos español) ----------
const FEEDS = {
  ai: [
    "https://www.xataka.com/tag/inteligencia-artificial/rss",       // Xataka IA (ES)
    "https://www.technologyreview.es/feed",                         // MIT Tech Review (ES)
    "https://es.wired.com/rss",                                     // WIRED en español (feed general)
    "https://blog.google/intl/es-419/technology/ai/rss/"            // Blog de Google (IA) en es-419
  ],
  crypto: [
    "https://es.cointelegraph.com/rss",                             // Cointelegraph en Español
    "https://www.criptonoticias.com/feed/",                         // Criptonoticias (ES)
    "https://www.xataka.com/tag/criptomonedas/rss"                  // Xataka Criptomonedas (ES)
  ],
  build: [
    // Si el RSS no existe, parseamos portada HTML (OG + enlaces)
    "https://www.plataformaarquitectura.cl/cl",                     // ArchDaily / Plataforma Arquitectura (ES)
    "https://elpais.com/economia/mercado-inmobiliario/",            // EL PAÍS (Mercado Inmobiliario)
    "https://expansion.mx/inmobiliario"                             // Expansión MX (Inmobiliario)
  ]
};

// ---------- FALLBACKS Google News en español ----------
const GN = {
  ai: "https://news.google.com/rss/search?q=inteligencia+artificial+OR+IA+when:7d&hl=es-419&gl=PE&ceid=PE:es",
  crypto: "https://news.google.com/rss/search?q=bitcoin+OR+criptomonedas+OR+cripto+when:7d&hl=es-419&gl=PE&ceid=PE:es",
  build: "https://news.google.com/rss/search?q=construcci%C3%B3n+OR+infraestructura+OR+inmobiliario+when:7d&hl=es-419&gl=PE&ceid=PE:es"
};

// ---------- Parser / helpers ----------
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

const decodeHtml = (s = "") =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const tryGet = (obj, ...paths) => {
  for (const p of paths) {
    const v = p.split(".").reduce((a, k) => (a ? a[k] : undefined), obj);
    if (v) return v;
  }
  return null;
};

const fetchText = async (url) => {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
      },
      cache: "no-store"
    });
    return await res.text();
  } finally {
    clearTimeout(id);
  }
};

const getOgImage = async (url) => {
  try {
    const html = await fetchText(url);
    const m =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    return m ? m[1] : null;
  } catch {
    return null;
  }
};

const normalizeItem = async (item, sourceName, categoryHint) => {
  const title = decodeHtml(item.title || "");
  const link = decodeHtml(
    item.link ||
      item.guid ||
      tryGet(item, "id", "url", "feedburner:origLink") ||
      ""
  );

  const publishedAt =
    item.pubDate || item.published || item.updated || tryGet(item, "dc:date") || "";

  const rawDesc =
    item.description || tryGet(item, "content:encoded") || tryGet(item, "summary") || "";
  const summary = decodeHtml(String(rawDesc).replace(/<[^>]+>/g, "")).slice(0, 260);

  let image =
    tryGet(item, "media:content.@_url") ||
    tryGet(item, "media:thumbnail.@_url") ||
    tryGet(item, "enclosure.@_url") ||
    tryGet(item, "enclosure.url") ||
    tryGet(item, "image.@_href") ||
    tryGet(item, "image.url") ||
    null;

  if (!image && link) image = await getOgImage(link);
  if (image && CLOUDINARY_FETCH_PREFIX) {
    image = CLOUDINARY_FETCH_PREFIX + encodeURIComponent(image);
  }

  return {
    title,
    url: link,
    image,
    source: decodeHtml(
      tryGet(item, "source.#text") || tryGet(item, "source") || sourceName
    ),
    publishedAt,
    summary,
    category: categoryHint
  };
};

// Detección heurística de español
const SP_DOMAINS = /\.((es)|(mx)|(cl)|(ar)|(co)|(pe))$/i;
const SP_SUB = /(^|\.)es\./i;
const SP_WORDS = [
  " el ", " la ", " los ", " las ", " de ", " del ", " y ", " en ", " para ",
  " con ", " por ", " una ", " uno ", " un ", " sobre ", " más ", " según ",
  " año ", " años ", " frente ", " entre ", " desde ", " hasta "
];
const EN_WORDS = [" the ", " and ", " for ", " with ", " from ", " in ", " on ", " of ", " is ", " are "];

const looksSpanish = (url, text) => {
  try {
    const host = new URL(url).hostname;
    if (SP_DOMAINS.test(host) || SP_SUB.test(host)) return true;
  } catch {}
  const s = ` ${String(text || "").toLowerCase()} `;
  let score = 0;
  if (/[áéíóúñü]/i.test(s)) score += 2;
  for (const w of SP_WORDS) if (s.includes(w)) score += 1;
  for (const w of EN_WORDS) if (s.includes(w)) score -= 1;
  return score >= 1;
};

// Lee RSS/Atom o, si es página HTML, extrae enlaces/OG
const parseFeedOrPage = async (url, categoryHint) => {
  const out = [];
  const text = await fetchText(url);
  const looksXml = /^\s*<\?xml/i.test(text) || /<rss|<feed|<rdf:RDF/i.test(text);

  if (looksXml) {
    const json = parser.parse(text);
    const channel = json.rss?.channel || json.feed || json["rdf:RDF"] || {};
    let items = channel.item || channel.entry || [];
    if (!Array.isArray(items)) items = [items];

    const sourceName =
      decodeHtml(channel?.title || channel?.["dc:title"] || new URL(url).hostname);

    for (const it of items.slice(0, 24)) {
      const n = await normalizeItem(it, sourceName, categoryHint);
      if (n.title && n.url && looksSpanish(n.url, `${n.title} ${n.summary}`)) out.push(n);
    }
    return out;
  }

  // Página HTML: tomamos enlaces internos prominentes y les buscamos OG:image
  const domain = new URL(url).hostname;
  const candidates = [];
  const articleRe = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]{30,140})<\/a>/gi;
  let m;
  while ((m = articleRe.exec(text)) && candidates.length < 14) {
    const href = m[1];
    const title = m[2].replace(/\s+/g, " ").trim();
    if (/^https?:\/\//.test(href) && href.includes(domain) && looksSpanish(href, title)) {
      candidates.push({ title, link: href });
    }
  }

  for (const c of candidates) {
    const image = await getOgImage(c.link);
    out.push({
      title: c.title,
      url: c.link,
      image,
      source: domain,
      publishedAt: "",
      summary: "",
      category: categoryHint
    });
  }
  return out;
};

const parseGoogleNews = async (url, categoryHint) => {
  const text = await fetchText(url);
  const json = parser.parse(text);
  const channel = json.rss?.channel || {};
  let items = channel.item || [];
  if (!Array.isArray(items)) items = [items];
  const sourceName = "Google News";

  const out = [];
  for (const it of items.slice(0, 20)) {
    const n = await normalizeItem(it, sourceName, categoryHint);
    if (n.title && n.url && looksSpanish(n.url, `${n.title} ${n.summary}`)) out.push(n);
  }
  return out;
};

const dedupe = (arr) => {
  const seen = new Set();
  return arr.filter((x) => {
    const k = (x.url || "") + "|" + (x.title || "");
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

// Anuncio promocional fijo
const buildAdCard = () => ({
  title: "Construye tu app con nosotros",
  url: "/proyectos/Anuncios.html",
  image: "https://via.placeholder.com/1200x675?text=Construye+tu+app+con+nosotros",
  source: "Polyline",
  publishedAt: new Date().toISOString(),
  summary: "¿Tienes una idea? Te ayudamos a diseñar y lanzar tu aplicación web o móvil con IA.",
  category: "Anuncio"
});

// ---------- Handler ----------
export const handler = async () => {
  try {
    const jobs = [];
    for (const url of FEEDS.ai) jobs.push(parseFeedOrPage(url, "IA"));
    for (const url of FEEDS.crypto) jobs.push(parseFeedOrPage(url, "Cripto"));
    for (const url of FEEDS.build) jobs.push(parseFeedOrPage(url, "Construcción"));

    let settled = await Promise.allSettled(jobs);
    let all = settled
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value)
      .filter((n) => n && n.title && n.url);

    // Si quedó muy poco (p.ej. 0–3), rellenamos con Google News ES
    if (all.length < 6) {
      const gnJobs = [
        parseGoogleNews(GN.ai, "IA"),
        parseGoogleNews(GN.crypto, "Cripto"),
        parseGoogleNews(GN.build, "Construcción")
      ];
      const gn = await Promise.allSettled(gnJobs);
      all = all.concat(
        gn.filter((r) => r.status === "fulfilled").flatMap((r) => r.value)
      );
    }

    const clean = dedupe(all);

    clean.sort((a, b) => {
      const da = new Date(a.publishedAt || 0).getTime();
      const db = new Date(b.publishedAt || 0).getTime();
      return db - da;
    });

    const slice = clean.slice(0, PAGE_SIZE - 1);
    const result = [buildAdCard(), ...slice];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=600" // 10 minutos
      },
      body: JSON.stringify(result)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
