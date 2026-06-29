import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../api/n8n';

export default function ChatBot({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', text: `👋 Hola ${user.user_name}! Soy Sammy.\nPuedo ayudarte con tus gastos, tickets y reservas.`, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewMessage(false);
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), text: userMessage, sender: 'user' }]);
    setIsLoading(true);

    try {
      // Usar timeout para fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await sendChatMessage({
        message: userMessage,
        session_id: user.session_id,
        user_name: user.user_name,
        unidad: user.unidad,
        email: user.email,
        residente_id: user.residente_id
      }).catch(err => {
        if (err.name === 'AbortError') throw new Error('timeout');
        throw err;
      });

      clearTimeout(timeoutId);

      if (response && response.ok === false && response.blocked) {
        throw new Error('blocked');
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: response.response || response.message || response.reply || response.output || 'No pude entender tu consulta.',
        sender: 'bot'
      }]);
      
      if (!isOpen) setHasNewMessage(true);

    } catch (error) {
      let errorMsg = 'Error de conexión. Verifica tu internet';
      if (error.message === 'timeout') errorMsg = 'CS-Bot está tardando, intenta de nuevo';
      if (error.message === 'blocked') errorMsg = 'Tu mensaje no pudo procesarse por seguridad';
      
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        text: `⚠️ ${errorMsg}`, 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón flotante cerrado */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-transform hover:scale-105"
        >
          {/* Pulso verde (activo) */}
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span>
          
          <MessageCircle className="w-8 h-8 text-white" />
          
          {hasNewMessage && (
            <span className="absolute -top-1 -left-1 flex items-center justify-center w-5 h-5 bg-accent text-white text-xs font-bold rounded-full border-2 border-background">
              !
            </span>
          )}
        </button>
      )}

      {/* Panel de Chat */}
      {isOpen && (
        <div className="w-[380px] h-[560px] max-h-[80vh] max-w-[calc(100vw-32px)] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-slide-up">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-sm">
                <img 
                  src="/bot.png" 
                  alt="Sammy" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://api.dicebear.com/9.x/bottts/svg?seed=Sammy&backgroundColor=ffffff'; }}
                />
              </div>
              <div>
                <h3 className="font-bold text-sm">Sammy</h3>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                  En línea
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background scrollbar-thin">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 bg-white shadow-sm self-end mb-1">
                    <img 
                      src="/bot.png" 
                      alt="Sammy" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://api.dicebear.com/9.x/bottts/svg?seed=Sammy&backgroundColor=ffffff'; }}
                    />
                  </div>
                )}
                <div 
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-br-sm' 
                      : 'bg-[#E2E8F0] text-primary rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#E2E8F0] text-primary rounded-2xl rounded-bl-sm px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              disabled={isLoading}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-accent hover:bg-accent/90 text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
