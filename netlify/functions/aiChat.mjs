// netlify/functions/iaChat.mjs

import fetch from "node-fetch";

// Función auxiliar: duerme por "ms" milisegundos
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Encabezados CORS reutilizables
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

export async function handler(event, context) {
  try {
    // Preflight CORS: responder a OPTIONS
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: ""  // puede estar vacío
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

    // Construir mensajes
    const messages = [
      {
        role: "system",
        content:
          "Eres un asistente virtual de una empresa inmobiliaria en Perú. Responde de forma clara, profesional, centrado en inmuebles, precios, ubicación, contacto, etc."
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
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    };

    console.log("Payload to OpenRouter:", payload);

    // Parámetros de reintento
    const maxRetries = 3;
    let attempt = 0;
    let backoffMs = 500;  // empezamos con medio segundo
    let lastError = null;

    while (attempt <= maxRetries) {
      try {
        const resp = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        console.log(`Attempt ${attempt} — status:`, resp.status);

        if (resp.ok) {
          const data = await resp.json();
          console.log("OpenRouter response body:", data);

          const reply = data.choices?.[0]?.message?.content || "Lo siento, no entendí eso.";

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
