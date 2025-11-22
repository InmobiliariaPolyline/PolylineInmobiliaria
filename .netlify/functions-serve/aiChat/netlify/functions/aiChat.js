var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/aiChat.mjs
var aiChat_exports = {};
__export(aiChat_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(aiChat_exports);
var import_node_fetch = __toESM(require("node-fetch"), 1);
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
console.log("ENV api_key early:", process.env.api_key);
async function handler(event, context) {
  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: ""
        // puede estar vacío
      };
    }
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Only POST allowed" })
      };
    }
    const body = JSON.parse(event.body);
    const { message, history } = body;
    if (!message) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Message is required" })
      };
    }
    console.log("VALOR DE API AQUI (early):", process.env.api_key);
    const OPENROUTER_KEY = process.env.api_key;
    console.log("OPENROUTER_KEY:", OPENROUTER_KEY);
    if (!OPENROUTER_KEY) {
      console.error("Missing OPENROUTER_API_KEY");
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "API key not configured" })
      };
    }
    const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
    const messages = [
      {
        role: "system",
        content: "Eres un asistente virtual de una empresa inmobiliaria en Per\xFA. Responde de forma clara, profesional, centrado en inmuebles, precios, ubicaci\xF3n, contacto, etc."
      }
    ];
    if (Array.isArray(history)) {
      for (const msg of history) {
        messages.push(msg);
      }
    }
    messages.push({ role: "user", content: message });
    const payload = {
      model: "microsoft/wizardlm-2-8x22b",
      messages,
      max_tokens: 500,
      temperature: 0.7
    };
    console.log("Payload to OpenRouter:", payload);
    const maxRetries = 3;
    let attempt = 0;
    let backoffMs = 500;
    let lastError = null;
    while (attempt <= maxRetries) {
      try {
        const resp = await (0, import_node_fetch.default)(apiUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        console.log(`Attempt ${attempt} \u2014 status:`, resp.status);
        if (resp.ok) {
          const data = await resp.json();
          console.log("OpenRouter response body:", data);
          const reply = data.choices?.[0]?.message?.content || "Lo siento, no entend\xED eso.";
          return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ reply })
          };
        } else {
          const errText = await resp.text();
          console.error(`OpenRouter API error on attempt ${attempt}:`, resp.status, errText);
          if (resp.status === 429 || resp.status === 502) {
            lastError = { status: resp.status, text: errText };
            await sleep(backoffMs);
            attempt++;
            backoffMs *= 2;
            continue;
          } else {
            return {
              statusCode: 500,
              headers: CORS_HEADERS,
              body: JSON.stringify({ error: "Error calling OpenRouter API", details: errText })
            };
          }
        }
      } catch (innerErr) {
        console.error(`Fetch error on attempt ${attempt}:`, innerErr);
        lastError = innerErr;
        await sleep(backoffMs);
        attempt++;
        backoffMs *= 2;
        continue;
      }
    }
    console.error("All attempts failed. Last error:", lastError);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Unable to get a valid response after retries.", details: lastError })
    };
  } catch (err) {
    console.error("iaChat error:", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message || "Internal error" })
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=aiChat.js.map
