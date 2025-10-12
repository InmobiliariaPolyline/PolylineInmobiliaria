// netlify/functions/iaChat.js

const fetch = require("node-fetch");  // usar require para node-fetch v2

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod === "OPTIONS") {
      // Preflight CORS
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

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    console.log("OPENAI_KEY:", OPENAI_KEY);
    if (!OPENAI_KEY) {
      console.error("Missing OPENAI_API_KEY");
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "API key not configured" })
      };
    }

    const apiUrl = "https://api.openai.com/v1/chat/completions";

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
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 500,
      temperature: 0.7
    };

    console.log("Payload to OpenAI:", payload);

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log("OpenAI response status:", resp.status);
    if (!resp.ok) {
      const errText = await resp.text();
      console.error("OpenAI API error:", resp.status, errText);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Error calling OpenAI API", details: errText })
      };
    }

    const data = await resp.json();
    console.log("OpenAI response body:", data);

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
