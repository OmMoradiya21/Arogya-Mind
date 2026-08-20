const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.chat = async (req, res) => {
  try {
    const { mood, message, history = [] } = req.body;
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `You are 'Arogya AI', an empathetic mental wellness companion. The user currently feels '${mood}'. Converse naturally, smoothly, and warmly.\n\nIMPORTANT: Always format your responses using HTML.\n- Use <b> for bold, <i> for italics, <u> for underline.\n- Prefer compact formatting with short paragraphs.\n- Use <br> for line breaks when possible instead of creating many separate paragraphs.\n- Do not add empty paragraphs or blank lines between paragraphs.\n- For headings, use <h1> to <h4> as appropriate.\n- For numbered lists, use <ol> and <li> tags.\n- For bullet lists, use <ul> and <li> tags.\n- For blockquotes, use <blockquote>.\n- For code, use <code> or <pre>.\n- For tables, use <table>, <tr>, <th>, and <td>.\n- Never use Markdown.\n- Only return HTML-formatted text.\n- Do not include any CSS, style, or script tags.\n- Make sure numbered lists use <ol> so numbers appear in the UI.\n- Keep HTML simple, semantic, and compact for best compatibility.`
    });
    
    // Map existing conversation so AI remembers the context
    const formattedHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    // Gemini strictly requires the very first history message to be from the 'user'
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.unshift({ role: 'user', parts: [{ text: `Hi! I am currently feeling ${mood}. Let's chat.` }] });
    }
    
    const chat = model.startChat({
      history: formattedHistory,
    });
    
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini response:', text);
    res.json({ reply: text });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
};
