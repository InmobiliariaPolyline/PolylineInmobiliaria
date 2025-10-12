const fetch = require("node-fetch");  // usando node-fetch v2

// Función auxiliar: duerme por “ms” milisegundos
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Methods": "POST, OPTIONS"
        },
        body: ""
      };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Only POST allowed" })
      };
    }

    const body = JSON.parse(event.body);
    const { message, history } = body;

    if (!message) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Message is required" })
      };
    }

    const OPENROUTER_KEY = process.env.api_key;  // asegúrate de que esta variable de entorno esté bien nombrada
    console.log("OPENROUTER_KEY:", OPENROUTER_KEY);
    if (!OPENROUTER_KEY) {
      console.error("Missing OPENROUTER_API_KEY");
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
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
      model: "deepseek/deepseek-r1:free",
      messages: messages,
      max_tokens: 1,
      temperature: 0.5
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
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ reply })
          };
        } else {
          const errText = await resp.text();
          console.error(`OpenRouter API error on attempt ${attempt}:`, resp.status, errText);

          // Si es 429 (rate limit) o 502 (modelo caído), intentamos reintentar
          if (resp.status === 429 || resp.status === 502) {
            lastError = { status: resp.status, text: errText };
            // espera antes de reintentar
            await sleep(backoffMs);
            attempt++;
            backoffMs *= 2;  // duplicar el intervalo
            continue;  // intentar nuevamente
          } else {
            // otro tipo de error: no reintentar
            return {
              statusCode: 500,
              headers: { "Access-Control-Allow-Origin": "*" },
              body: JSON.stringify({ error: "Error calling OpenRouter API", details: errText })
            };
          }
        }
      } catch (innerErr) {
        console.error(`Fetch error on attempt ${attempt}:`, innerErr);
        lastError = innerErr;
        // esperar y reintentar
        await sleep(backoffMs);
        attempt++;
        backoffMs *= 2;
        continue;
      }
    }

    // Si llegamos aquí, todos los intentos fallaron
    console.error("All attempts failed. Last error:", lastError);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Unable to get a valid response after retries.", details: lastError })
    };

  } catch (err) {
    console.error("iaChat error:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message || "Internal error" })
    };
  }
};
