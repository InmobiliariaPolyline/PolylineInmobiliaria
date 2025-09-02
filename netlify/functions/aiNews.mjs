  // netlify/functions/aiNews.js
import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";

const FEEDS = [
  // Fuentes DIRECTAS (mejoran imágenes y enlaces)
  "https://es.wired.com/rss",                           // WIRED (ES)
  "https://revistabyte.es/feed/",                      // Revista Byte TI
  "https://www.xataka.com/tag/inteligencia-artificial/rss", // Xataka IA
  "https://www.technologyreview.es/feed",              // MIT Tech Review (ES)
  "https://blog.google/technology/ai/rss/"             // Google AI Blog
  // Como respaldo, podrías dejar Google News:
  // "https://news.google.com/rss/search?q=inteligencia+artificial+when:7d&hl=es-419&gl=PE&ceid=PE:es"
];

// Opcional: servir imágenes vía Cloudinary fetch (optimiza y da HTTPS estable)
const CLOUDINARY_FETCH_PREFIX = null;
// Ejemplo: const CLOUDINARY_FETCH_PREFIX = "https://res.cloudinary.com/<tu_cloud>/image/fetch/f_auto,q_auto/";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_"
});

// -------- helpers ----------
const decodeHtml = (s = "") =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const tryGet = (obj, ...paths) => {
  for (const p of paths) {
    const v = p.split(".").reduce((a, k) => (a ? a[k] : undefined), obj);
    if (v) return v;
  }
  return null;
};

const getOgImage = async (url) => {
  try {
    const html = await fetch(url, {
      timeout: 8000,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
      }
    }).then((r) => r.text());

    let m =
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
      );
    return m ? m[1] : null;
  } catch (e) {
    return null;
  }
};

const normalizeItem = async (item, sourceName) => {
  const title = decodeHtml(item.title || "");
  const link =
    decodeHtml(item.link || item.guid || tryGet(item, "id", "url") || "");

  const publishedAt =
    item.pubDate ||
    item.published ||
    item.updated ||
    tryGet(item, "dc:date") ||
    "";

  // limpia summary
  const rawDesc =
    item.description ||
    tryGet(item, "content:encoded") ||
    tryGet(item, "summary") ||
    "";
  const summary = decodeHtml(rawDesc.replace(/<[^>]+>/g, "")).slice(0, 240);

  // Imagen por RSS
  let image =
    tryGet(item, "media:content.@_url") ||
    tryGet(item, "media:thumbnail.@_url") ||
    tryGet(item, "enclosure.@_url") ||
    tryGet(item, "enclosure.url") ||
    tryGet(item, "image.@_href") ||
    tryGet(item, "image.url") ||
    null;

  if (!image && link) {
    image = await getOgImage(link);
  }

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
    summary
  };
};

const parseFeed = async (url) => {
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
    }
  });
  const xml = await res.text();
  const json = parser.parse(xml);

  // rss/channel/item   ó   feed/entry
  const channel = json.rss?.channel || json.feed || json["rdf:RDF"];
  let items =
    channel?.item ||
    channel?.entry ||
    (Array.isArray(json.item) ? json.item : []) ||
    [];
  if (!Array.isArray(items)) items = [items];

  const sourceName =
    decodeHtml(channel?.title || channel?.["dc:title"] || new URL(url).hostname);

  const out = [];
  for (const it of items.slice(0, 12)) {
    out.push(await normalizeItem(it, sourceName));
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

// -------- handler ----------
export async function handler() {
  try {
    const lists = await Promise.allSettled(FEEDS.map(parseFeed));
    const all = lists
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value);

    const clean = dedupe(
      all.filter((n) => n.title && n.url) // descartamos vacíos
    );

    clean.sort((a, b) => {
      const da = new Date(a.publishedAt || 0).getTime();
      const db = new Date(b.publishedAt || 0).getTime();
      return db - da;
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=600" // 10 min
      },
      body: JSON.stringify(clean.slice(0, 12))
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
}
