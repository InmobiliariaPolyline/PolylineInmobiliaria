    import { XMLParser } from "fast-xml-parser";

const FEEDS = [
  "https://es.cointelegraph.com/rss",   // Cointelegraph en español
  "https://criptonoticias.com/feed/",   // Criptonoticias
  "https://www.diariobitcoin.com/feed/" // DiarioBitcoin
];

const parser = new XMLParser({ ignoreAttributes: false });

const parseFeed = async (url) => {
  const res = await fetch(url);
  const xml = await res.text();
  const json = parser.parse(xml);
  const channel = json.rss?.channel;
  let items = channel?.item || [];
  if (!Array.isArray(items)) items = [items];

  return items.slice(0, 10).map(it => ({
    title: it.title,
    url: it.link,
    publishedAt: it.pubDate,
    summary: (it.description || " ").replace(/<[^>]+>/g, "").slice(0, 180),
    image: null, // si quieres, puedes intentar extraer og:image como en aiNews
    source: new URL(url).hostname
  }));
};

export async function handler() {
  try {
    const all = (await Promise.all(FEEDS.map(parseFeed))).flat();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(all.slice(0, 12)),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
