// netlify/functions/iaChat.js

import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Only POST allowed" }),
      };
    }

    const body = JSON.parse(event.body);
    const { message, history } = body;

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    // Usar la variable de entorno que configuraste en Netlify
    const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_KEY) {
      console.error("Missing DEEPSEEK_API_KEY");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key not configured" }),
      };
    }

    // Endpoint de DeepSeek para chat completions
    const apiUrl = "https://api.deepseek.com/chat/completions";

    // Preparar los mensajes que enviarás al modelo
    const messages = [
      {
        role: "system",
        content:
          "Eres un asistente virtual de una empresa inmobiliaria en Perú. Responde de forma clara, profesional, centrado en inmuebles, precios, ubicación, contacto, etc."
      }
    ];

    if (Array.isArray(history)) {
      for (const msg of history) {
        // Asegura que tengan esa estructura
        messages.push(msg);
      }
    }
    messages.push({ role: "user", content: message });

    const payload = {
      model: "deepseek-chat",  // modelo estándar de chat de DeepSeek
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    };

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("DeepSeek API error:", resp.status, errText);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Error calling DeepSeek API", details: errText })
      };
    }

    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content || "Lo siento, no entendí eso.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    console.error("iaChat error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Internal error" })
    };
  }
}
