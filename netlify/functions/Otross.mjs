// netlify/functions/Otross.mjs
// Agregador mixto (IA, Cripto, Construcción) con anuncio “Construye tu app con nosotros”

import { XMLParser } from "fast-xml-parser";

const TIMEOUT_MS = 9000;
const PAGE_SIZE = 12; // cantidad que retornamos
const CLOUDINARY_FETCH_PREFIX = null; // opcional p/optimizar imágenes (ver README)

// --- Fuentes confiables (RSS/Atom o páginas con OG) ---
const FEEDS = {
  ai: [
    "https://www.xataka.com/tag/inteligencia-artificial/rss",        // Xataka IA (ES) :contentReference[oaicite:0]{index=0}
    "https://www.technologyreview.es/feed",                          // MIT Tech Review en español :contentReference[oaicite:1]{index=1}
    "https://es.wired.com/info/rss-feeds",                           // WIRED en Español (usaremos subfeed “Top Stories”) :contentReference[oaicite:2]{index=2}
    // Google AI Blog (Atom vía FeedBurner)
    "http://feeds.feedburner.com/blogspot/gJZg"                      // Google AI Blog feedburner (lista comunitaria) :contentReference[oaicite:3]{index=3}
  ],
  crypto: [
    "https://es.cointelegraph.com/rss-feeds",                         // Portal de feeds (Bitcoin, Blockchain, etc.) :contentReference[oaicite:4]{index=4}
    "https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml", // CoinDesk RSS (general) :contentReference[oaicite:5]{index=5}
    "https://www.eleconomista.com.mx/rss.html"                        // elEconomista MX (incluye “Cripto”) :contentReference[oaicite:6]{index=6}
  ],
  build: [
    // Para construcción/arquitectura: usaremos ArchDaily (scrape OG) + secciones RSS de prensa
    "https://www.archdaily.cl/cl",                                   // ArchDaily en Español (sin RSS claro; extraemos OG) :contentReference[oaicite:7]{index=7}
    "https://elpais.com/info/rss/",                                  // EL PAÍS (usar secciones Inmobiliario/Mercado) :contentReference[oaicite:8]{index=8}
    "https://expansion.mx/canales-rss"                               // Expansión MX (incluye Obras / Economía) :contentReference[oaicite:9]{index=9}
  ]
};

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
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
      );
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
    item.pubDate ||
    item.published ||
    item.updated ||
    tryGet(item, "dc:date") ||
    "";

  const rawDesc =
    item.description ||
    tryGet(item, "content:encoded") ||
    tryGet(item, "summary") ||
    "";
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

// Lee RSS/Atom o, si es página normal (p.ej. ArchDaily ES), extrae OG de portada
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

    for (const it of items.slice(0, 20)) {
      out.push(await normalizeItem(it, sourceName, categoryHint));
    }
    return out;
  }

  // Página HTML (ej.: portada ArchDaily ES): buscamos artículos básicos y Metas OG
  // Capturamos los primeros <article> o enlaces prominentes
  const domain = new URL(url).hostname;
  const candidates = [];
  const articleRe = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]{30,120})<\/a>/gi;
  let m;
  while ((m = articleRe.exec(text)) && candidates.length < 12) {
    const href = m[1];
    if (/^https?:\/\//.test(href) && href.includes(domain)) {
      const title = m[2].replace(/\s+/g, " ").trim();
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
      publishedAt: "", // la portada no siempre trae fechas
      summary: "",
      category: categoryHint
    });
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

// Anuncio promocional
const buildAdCard = () => ({
  title: "Construye tu app con nosotros",
  url: "/proyectos/Anuncios.html",
  image:
    "https://via.placeholder.com/1200x675?text=Construye+tu+app+con+nosotros",
  source: "Polyline",
  publishedAt: new Date().toISOString(),
  summary:
    "¿Tienes una idea? Te ayudamos a diseñar y lanzar tu aplicación web o móvil con IA.",
  category: "Anuncio"
});

export const handler = async () => {
  try {
    const jobs = [];

    for (const url of FEEDS.ai) jobs.push(parseFeedOrPage(url, "IA"));
    for (const url of FEEDS.crypto) jobs.push(parseFeedOrPage(url, "Cripto"));
    for (const url of FEEDS.build) jobs.push(parseFeedOrPage(url, "Construcción"));

    const settled = await Promise.allSettled(jobs);
    const all = settled
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value)
      .filter((n) => n && n.title && n.url);

    const clean = dedupe(all);

    clean.sort((a, b) => {
      const da = new Date(a.publishedAt || 0).getTime();
      const db = new Date(b.publishedAt || 0).getTime();
      return db - da;
    });

    // Mezclamos + insertamos el anuncio arriba del todo cada vez
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
