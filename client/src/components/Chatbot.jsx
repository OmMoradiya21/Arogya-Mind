import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import api from '../services/api';

const htmlToPlainText = (html = '') => {
  if (!html) return '';

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
      .replace(/<\/?[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+\n/g, '\n')
      .trim();
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blockTags = new Set(['P', 'DIV', 'LI', 'BLOCKQUOTE', 'PRE', 'H1', 'H2', 'H3', 'H4']);

  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const tag = node.tagName;

    if (tag === 'BR') {
      return '\n';
    }

    const content = Array.from(node.childNodes).map(walk).join('');

    return blockTags.has(tag) ? `${content}\n` : content;
  };

  return walk(doc.body)
    .replace(/\u00A0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .trim();
};

const Chatbot = ({ mood }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mood) {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      setTypingMessageId(null);
      setMessages([
        {
          sender: 'bot',
          text: `I noticed you logged that you're feeling ${mood}. I'm here for you. Would you like to talk about it?`
        }
      ]);
    }
  }, [mood]);

  const typeBotReply = (replyText) => {
    const messageId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const fullText = replyText || '';
    const plainText = htmlToPlainText(fullText);

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    if (!plainText.length) {
      setTypingMessageId(null);
      setMessages(prev => [...prev, { id: messageId, sender: 'bot', text: '', html: fullText, isTyping: false }]);
      return;
    }

    let index = 0;
    setTypingMessageId(messageId);
    setMessages(prev => [...prev, { id: messageId, sender: 'bot', text: '', html: fullText, isTyping: true }]);

    typingIntervalRef.current = setInterval(() => {
      index += 1;

      setMessages(prev =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                text: plainText.slice(0, index),
                isTyping: index < plainText.length
              }
            : msg
        )
      );

      if (index >= plainText.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setTypingMessageId(null);
      }
    }, 22);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const nextMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { mood, message: userMessage, history: nextMessages });
      typeBotReply(res.data.reply);
    } catch (err) {
      typeBotReply("Sorry, I'm having trouble connecting to AI services right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-800 shadow-xl overflow-hidden">

      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-white/40 dark:bg-slate-800/40 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100">Arogya AI</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Your Wellness Companion</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 opacity-50">
            <Bot size={48} className="mb-4" />
            <p>Select a mood above to start chatting</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-700 rounded-tl-sm'
                }`}
            >
              {msg.sender === 'bot' ? (
                <div className={`break-words leading-relaxed [&_p]:m-0 [&_p+p]:mt-2 [&_p]:leading-relaxed [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0 [&_blockquote]:my-1 [&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0 [&_h4]:m-0 ${msg.isTyping ? 'whitespace-pre-wrap' : ''}`}>
                  {msg.isTyping ? (
                    <span>{msg.text}</span>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: msg.html ?? msg.text }} />
                  )}
                  {msg.isTyping && (
                    <span className="ml-1 inline-block h-[1em] w-px animate-pulse bg-current relative -top-px align-baseline" />
                  )}
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start" aria-live="polite" aria-atomic="true">
            <div className="max-w-[80%] p-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-tl-sm flex items-center gap-3 text-gray-500 dark:text-gray-300 shadow-sm">
              <div className="flex gap-1.5 items-center">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Answer is generating
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Arogya AI is preparing a response...
                </p>
              </div>
              <Loader2 size={16} className="animate-spin text-emerald-500 ml-1" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white/40 dark:bg-slate-800/40 border-t border-gray-100 dark:border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!mood || loading || typingMessageId !== null}
            placeholder={mood ? "Type your message here..." : "Select a mood first"}
            className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-800 dark:text-gray-100 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!mood || loading || typingMessageId !== null || !input.trim()}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </form>

    </div>
  );
};

export default Chatbot;
