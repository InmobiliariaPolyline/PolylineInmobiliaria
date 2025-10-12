// netlify/functions/llama.mjs
export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    // Replicate API call for Llama 3.1
    const response = await fetch('https://api.replicate.com/v1/models/meta/meta-llama-3.1-8b-instruct/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: {
          prompt: `Eres un asistente virtual amigable para POLYLINE, una empresa constructora en Perú. Responde de manera útil y profesional en español. Si no sabes algo, sugiere contactar a la empresa.

Pregunta del usuario: ${prompt}

Respuesta:`,
          max_tokens: 500,
          temperature: 0.7,
          system_prompt: "Eres un asistente virtual para POLYLINE, empresa constructora. Proporciona información sobre proyectos inmobiliarios, construcción, remodelación, etc. Sé amable y profesional."
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.status}`);
    }

    const result = await response.json();

    // Wait for completion (simplified - in production, handle async properly)
    const predictionId = result.id;
    let output = '';

    // Poll for result
    for (let i = 0; i < 30; i++) { // Max 30 attempts
      await new Promise(resolve => setTimeout(resolve, 1000));

      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      });

      const status = await statusResponse.json();

      if (status.status === 'succeeded') {
        output = status.output.join('');
        break;
      } else if (status.status === 'failed') {
        throw new Error('Prediction failed');
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ response: output })
    };

  } catch (error) {
    console.error('Llama API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error processing request',
        response: 'Lo siento, hubo un problema. Por favor, contacta directamente a POLYLINE.'
      })
    };
  }
};