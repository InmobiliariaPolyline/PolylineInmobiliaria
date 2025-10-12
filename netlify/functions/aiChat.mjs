// netlify/functions/iaChat.js

const fetch = require("node-fetch");  // para node-fetch v2

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod === "OPTIONS") {
      // Manejo de CORS preflight
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
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Only POST allowed" })
      };
    }

    const body = JSON.parse(event.body);
    const { message, history } = body;

    if (!message) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Message is required" })
      };
    }

    const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
    console.log("DEEPSEEK_KEY:", DEEPSEEK_KEY);
    if (!DEEPSEEK_KEY) {
      console.error("Missing DEEPSEEK_API_KEY");
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "API key not configured" })
      };
    }

    // URL base para DeepSeek — puedes usar /v1 para compatibilidad
    const apiUrl = "https://api.deepseek.com/chat/completions";
    // (también podría usarse "https://api.deepseek.com/v1/chat/completions") :contentReference[oaicite:1]{index=1}

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
      model: "deepseek-chat",  // modelo por defecto de DeepSeek :contentReference[oaicite:2]{index=2}
      messages,
      max_tokens: 500,
      temperature: 0.7
    };

    console.log("Payload to DeepSeek:", payload);

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log("DeepSeek response status:", resp.status);
    if (!resp.ok) {
      const errText = await resp.text();
      console.error("DeepSeek API error:", resp.status, errText);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Error calling DeepSeek API", details: errText })
      };
    }

    const data = await resp.json();
    console.log("DeepSeek response body:", data);

    const reply = data.choices?.[0]?.message?.content || "Lo siento, no entendí eso.";

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    console.error("iaChat error:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: err.message || "Internal error" })
    };
  }
};
