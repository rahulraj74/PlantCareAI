import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import api from '../../services/api';

export const ChatWidget = ({ initialContext = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am your PlantCare Agricultural Assistant. Ask me anything about tomato plant symptoms, prevention practices, or organic management solutions grounded in our agricultural knowledge base.",
      sources: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const queryText = input.trim();
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(queryText, initialContext);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: res.reply || 'Here is the recommended guidance from our agricultural knowledge base.',
          sources: res.sources || [],
          isConfigured: res.llm_available !== false,
        },
      ]);
    } catch {
      // Offline fallback grounded answers
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "I am running in offline knowledge-base mode. Based on standard extension recommendations for tomatoes: maintain good foliage aeration, water exclusively at the base with drip lines to reduce leaf wetness, and rogue infected plant tissues immediately to prevent pathogen transmission.",
          sources: ["Vetted Knowledge Base (Offline Mode)"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg shadow-brand-600/30 hover:scale-105 transition-all text-sm font-semibold"
          aria-label="Open Crop Assistant Chat"
        >
          <Bot className="w-5 h-5" />
          <span className="hidden sm:inline">Ask Crop Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slideUp">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-brand-700 to-brand-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Crop Advisor AI</h4>
                <p className="text-[11px] text-brand-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Grounded Agronomy Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                      isBot ? 'bg-brand-100 text-brand-800' : 'bg-slate-800 text-white'
                    }`}
                  >
                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isBot
                        ? 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs'
                        : 'bg-brand-600 text-white shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                        <span className="font-medium">Sources:</span> {msg.sources.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-500 shadow-2xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200" />
                  <span className="ml-1 text-[11px]">Searching knowledge base...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-slate-100/70 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => { setInput('How to prevent early blight?'); }}
              className="text-[10px] whitespace-nowrap bg-white border border-slate-200 px-2.5 py-1 rounded-full text-slate-600 hover:text-brand-700 hover:border-brand-400"
            >
              Early blight prevention?
            </button>
            <button
              onClick={() => { setInput('What are symptoms of bacterial spot?'); }}
              className="text-[10px] whitespace-nowrap bg-white border border-slate-200 px-2.5 py-1 rounded-full text-slate-600 hover:text-brand-700 hover:border-brand-400"
            >
              Bacterial spot symptoms?
            </button>
          </div>

          {/* Footer Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about tomato diseases or care..."
              className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-xl transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

export default ChatWidget;
