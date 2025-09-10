export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: { message: 'Method Not Allowed' } });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: { message: 'API key is not configured on the server.' } });
  }

  const model = "gemini-2.5-flash-preview-05-20";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body),
    });
    
    if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        console.error('Gemini API Error:', errorData);
        return response.status(geminiResponse.status).json(errorData);
    }

    const geminiData = await geminiResponse.json();

    return response.status(200).json(geminiData);

  } catch (error) {
    console.error('Internal Server Error in proxy:', error);
    return response.status(500).json({ error: { message: 'An internal server error occurred.' } });
  }
}

