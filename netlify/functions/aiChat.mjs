const fetch = require("node-fetch");  // usando node-fetch v2

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

    const OPENROUTER_KEY = process.env.api_key;
    console.log("OPENROUTER_KEY:", OPENROUTER_KEY);
    if (!OPENROUTER_KEY) {
      console.error("Missing OPENROUTER_API_KEY");
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "API key not configured" })
      };
    }

    // Endpoint de OpenRouter (compatible con modelos tipo DeepSeek)
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
      model: "deepseek/deepseek-r1:free",  // modelo gratuito DeepSeek vía OpenRouter :contentReference[oaicite:0]{index=0}
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    };

    console.log("Payload to OpenRouter:", payload);

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log("OpenRouter / DeepSeek response status:", resp.status);
    if (!resp.ok) {
      const errText = await resp.text();
      console.error("OpenRouter API error:", resp.status, errText);
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Error calling OpenRouter API", details: errText })
      };
    }

    const data = await resp.json();
    console.log("OpenRouter response body:", data);

    // La respuesta estándar tiene estructura similar a OpenAI
    const reply = data.choices?.[0]?.message?.content || "Lo siento, no entendí eso.";

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ reply })
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
