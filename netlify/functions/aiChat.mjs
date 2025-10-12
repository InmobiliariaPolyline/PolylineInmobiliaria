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

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      console.error("Missing OPENAI_API_KEY");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key not configured" }),
      };
    }

    const apiUrl = "https://api.openai.com/v1/chat/completions";

    // Preparar mensajes para OpenAI
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
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    };

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("OpenAI API error:", resp.status, errText);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Error calling OpenAI API", details: errText })
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
