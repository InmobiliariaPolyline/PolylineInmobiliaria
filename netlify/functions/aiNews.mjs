        // netlify/functions/aiNews.mjs
import { XMLParser } from "fast-xml-parser";

// ——— FUENTES ———
// Google AI Blog (RSS real)
const FEEDS = [
  "https://blog.google/technology/ai/rss/",

  // Google News RSS filtrado por dominio (últimos 7 días), español LatAm (es-419), Perú (PE):
  "https://news.google.com/rss/search?q=site:es.wired.com+inteligencia+artificial+when:7d&hl=es-419&gl=PE&ceid=PE:es",
  "https://news.google.com/rss/search?q=site:revistabyte.es+inteligencia+artificial+when:7d&hl=es-419&gl=PE&ceid=PE:es",
];

// Si quieres optimizar imágenes vía Cloudinary (sin subirlas), pon tu cloud name aquí:
const CLOUDINARY_FETCH_PREFIX =
  "https://res.cloudinary.com/<TU_CLOUD_NAME>/image/fetch/f_auto,q_auto/";

// Parser XML → JSON
const parser = new XMLParser({ ignoreAttributes: false });

// Intenta obtener og:image de la página del artículo (fallback cuando el RSS no trae imagen)
const getOgImage = async (url) => {
  try {
    const html = await fetch(url, { timeout: 8000 }).then((r) => r.text());
    const m = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );
    return m ? m[1] : null;
  } catch {
    return null;
  }
};

// Normaliza cada item del feed a un formato común
const normalizeItem = async (item, sourceName) => {
  const title = item.title || "";
  const link = item.link || item.guid || "";
  const publishedAt = item.pubDate || item.published || item.updated || "";
  const summary = (item.description || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);

  // Imagen desde <media:content> o <enclosure>
  const media =
    item["media:content"]?.["@_url"] ||
    item.enclosure?.["@_url"] ||
    item.enclosure?.url;
  let image = media || null;

  // Si no vino imagen, intenta con og:image del artículo
  if (!image && link) {
    image = await getOgImage(link);
  }

  // Si configuraste Cloudinary, sirve la imagen vía fetch-URL optimizada
  if (image && CLOUDINARY_FETCH_PREFIX.includes("<TU_CLOUD_NAME>") === false) {
    image = CLOUDINARY_FETCH_PREFIX + encodeURIComponent(image);
  }

  return { title, url: link, image, source: sourceName, publishedAt, summary };
};

const parseFeed = async (url) => {
  const res = await fetch(url);
  const xml = await res.text();
  const json = parser.parse(xml);

  // soporta RSS (“rss.channel.item”) y Atom (“feed.entry”)
  const channel = json.rss?.channel || json.feed;
  let items = channel?.item || channel?.entry || [];
  if (!Array.isArray(items)) items = [items];

  const sourceName = channel?.title || new URL(url).hostname;

  const out = [];
  for (const it of items.slice(0, 12)) {
    out.push(await normalizeItem(it, sourceName));
  }
  return out;
};

export async function handler() {
  try {
    const all = (await Promise.all(FEEDS.map(parseFeed))).flat();

    // Ordena por fecha si existe
    all.sort(
      (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
    );

    // Devuelve hasta 12 tarjetas
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=600", // 10 min
      },
      body: JSON.stringify(all.slice(0, 12)),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
