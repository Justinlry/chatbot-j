export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { messages } = req.body;
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages, stream: true })
  });
  res.setHeader('Content-Type', 'text/event-stream');
  response.body.pipeTo(new WritableStream({
    write(chunk) { res.write(chunk); }
  })).then(() => res.end());
}
