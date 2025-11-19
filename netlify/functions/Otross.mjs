// netlify/functions/Otross.mjs
// Agregador variado (IA, Cripto, Arquitectura, Construcción, Vivienda)
// con anuncio “Construye tu app con nosotros” (imagen real de Pexels)

import { XMLParser } from "fast-xml-parser";

const TIMEOUT_MS = 9000;
const PAGE_SIZE = 12; // total a devolver (incluye el anuncio)
const CLOUDINARY_FETCH_PREFIX = null; // e.g. "https://res.cloudinary.com/<tu>/image/fetch/f_auto,q_auto/"

// ----- Fuentes en ESPAÑOL -----
const FEEDS = {
  ai: [
    { url: "https://www.xataka.com/tag/inteligencia-artificial/rss", cat: "IA" },
    { url: "https://www.technologyreview.es/feed",                cat: "IA" },
    { url: "https://es.wired.com/rss",                            cat: "IA" },
  ],
  crypto: [
    { url: "https://www.xataka.com/tag/criptomonedas/rss",        cat: "Cripto" },
    { url: "https://es.cointelegraph.com/rss",                    cat: "Cripto" },
    { url: "https://www.criptonoticias.com/feed/",                cat: "Cripto" },
  ],
  build: [
    // Arquitectura
    { url: "https://www.plataformaarquitectura.cl/cl",            cat: "Arquitectura" }, // HTML → OG
    // Construcción sostenible (WP → RSS)
    { url: "https://www.construible.es/feed",                     cat: "Construcción" },
    // Vivienda/mercado (HTML)
    { url: "https://www.elmundo.es/economia/vivienda.html",       cat: "Vivienda" },
  ],
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

// ------------------ helpers ------------------
const decodeHtml = (s = "") =>
  String(s).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const tryGet = (obj, ...paths) => {
  for (const p of paths) {
    const v = p.split(".").reduce((a, k) => (a ? a[k] : undefined), obj);
    if (v) return v;
  }
  return null;
};

// preferimos dominios/paths en español
const isSpanishishUrl = (u = "") => {
  try {
    const { hostname, pathname } = new URL(u);
    return (
      /\.(es|mx|cl|ar|pe)$/i.test(hostname) ||
      hostname.startsWith("es.") ||
      /\/es(\/|$)/i.test(pathname) ||
      /plataformaarquitectura|archdaily/i.test(hostname)
    );
  } catch {
    return false;
  }
};

const fetchText = async (url) => {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      },
      cache: "no-store",
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
    item.link || item.guid || tryGet(item, "id", "url", "feedburner:origLink") || ""
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

  if (!image) {
    image = "/Resource/Logo/logo.png";
  }
  if (image && CLOUDINARY_FETCH_PREFIX) {
    image = CLOUDINARY_FETCH_PREFIX + encodeURIComponent(image);
  }

  return {
    title,
    url: link,
    image,
    source: decodeHtml(tryGet(item, "source.#text") || tryGet(item, "source") || sourceName),
    publishedAt,
    summary,
    category: categoryHint,
  };
};

// Lee RSS/Atom o, si es HTML (p. ej. portada), extrae anchors principales y luego OG por artículo
const parseFeedOrPage = async (url, categoryHint) => {
  const out = [];
  const text = await fetchText(url);

  const looksXml = /^\s*<\?xml/i.test(text) || /<rss|<feed|<rdf:RDF/i.test(text);
  if (looksXml) {
    const json = parser.parse(text);
    const channel = json.rss?.channel || json.feed || json["rdf:RDF"] || {};
    let items = channel.item || channel.entry || [];
    if (!Array.isArray(items)) items = [items];

    const sourceName = decodeHtml(channel?.title || channel?.["dc:title"] || new URL(url).hostname);

    for (const it of items.slice(0, 20)) {
      const n = await normalizeItem(it, sourceName, categoryHint);
      if (n.title && n.url) out.push(n);
    }
    return out;
  }

  // Página HTML (ej.: ArchDaily ES, Elmundo Vivienda)
  const domain = new URL(url).hostname;
  const anchors = [];
  const articleRe = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]{0,200}?)<\/a>/gi;
  let m;
  while ((m = articleRe.exec(text)) && anchors.length < 14) {
    const href = m[1];
    const txt = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!txt || txt.length < 30) continue;
    // solo artículos del mismo dominio
    if (/^https?:\/\//.test(href) && href.includes(domain)) {
      anchors.push({ title: txt, link: href });
    }
  }
  for (const a of anchors.slice(0, 12)) {
    const image = "/Resource/Logo/logo.png"; // Usar imagen de respaldo local
    out.push({
      title: a.title,
      url: a.link,
      image,
      source: domain,
      publishedAt: "",
      summary: "",
      category: categoryHint,
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

// Imagen real del anuncio (Pexels, libre de uso)
const AD_IMAGE =
  "https://images.pexels.com/photos/8000532/pexels-photo-8000532.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&dpr=1";

const buildAdCard = () => ({
  title: "Construye tu app con nosotros",
  url: "/proyectos/Anuncios.html",
  image: AD_IMAGE,
  source: "Polyline",
  publishedAt: new Date().toISOString(),
  summary:
    "¿Tienes una idea? Diseñamos y lanzamos tu aplicación web o móvil con IA.",
  category: "Anuncio",
});

// interleaving balanceado por categoría
const roundRobin = (buckets, limit) => {
  const out = [];
  const arrs = buckets.map((b) => [...b]); // copia
  let added = true;
  while (out.length < limit && added) {
    added = false;
    for (const a of arrs) {
      if (!a.length) continue;
      out.push(a.shift());
      added = true;
      if (out.length >= limit) break;
    }
  }
  return out;
};

export const handler = async () => {
  try {
    // 1) recolectar por categoría
    const jobs = [];
    for (const s of FEEDS.ai)    jobs.push(parseFeedOrPage(s.url, s.cat));
    for (const s of FEEDS.crypto) jobs.push(parseFeedOrPage(s.url, s.cat));
    for (const s of FEEDS.build)  jobs.push(parseFeedOrPage(s.url, s.cat));

    const settled = await Promise.allSettled(jobs);
    let all = settled
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value)
      .filter((n) => n && n.title && n.url);

    // 2) priorizar español por dominio
    all = all.filter((n) => isSpanishishUrl(n.url));

    // 3) ordenar cada bucket por fecha desc
    const bucketsByCat = {
      IA: [],
      Cripto: [],
      Arquitectura: [],
      Construcción: [],
      Vivienda: [],
    };
    for (const n of all) {
      const cat = bucketsByCat[n.category] ? n.category : "Construcción";
      bucketsByCat[cat].push(n);
    }
    for (const k of Object.keys(bucketsByCat)) {
      const arr = dedupe(bucketsByCat[k]).sort((a, b) => {
        const da = new Date(a.publishedAt || 0).getTime();
        const db = new Date(b.publishedAt || 0).getTime();
        return db - da;
      });
      bucketsByCat[k] = arr;
    }

    // 4) interleaving (balanceado) y recorte
    const INTERLEAVE_ORDER = [
      bucketsByCat.IA,
      bucketsByCat.Cripto,
      bucketsByCat.Arquitectura,
      bucketsByCat.Construcción,
      bucketsByCat.Vivienda,
    ];
    const slice = roundRobin(INTERLEAVE_ORDER, Math.max(0, PAGE_SIZE - 1)); // -1 por el anuncio

    // 5) anuncio primero
    const result = [buildAdCard(), ...slice];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=600", // 10 min
      },
      body: JSON.stringify(result),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
