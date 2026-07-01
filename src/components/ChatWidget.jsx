import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User } from 'lucide-react'
import useChat from '../hooks/useChat'

/**
 * Componente ChatWidget con burbuja flotante y panel de chat
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const { messages, loading, userName, setUserName, sendMessage } = useChat({ user })

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus en el input cuando se abre el chat
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText)
      setInputText('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const unreadCount = messages.filter(m => m.role === 'bot' && !m.isError).length - 1 // -1 para el mensaje inicial

  return (
    <>
      {/* Burbuja flotante (estado cerrado) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
        >
          <div className="absolute inset-0 bg-success rounded-full animate-pulse-slow opacity-20" />
          <MessageSquare size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Panel de chat (estado abierto) */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-primary" />
              </div>
              <div>
                <h3 className="font-semibold">CS-Bot</h3>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  En línea
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 animate-slide-up ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-success text-white'
                }`}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Mensaje */}
                <div className={`max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-primary text-white' 
                    : message.isError 
                      ? 'bg-danger/10 text-danger border border-danger/20'
                      : 'bg-white text-gray-900 border border-gray-200'
                } rounded-2xl px-4 py-2`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' 
                      ? 'text-white/70' 
                      : 'text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('es-CL', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Indicador escribiendo */}
            {loading && (
              <div className="flex gap-3 animate-slide-up">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            {/* Nombre de usuario editable */}
            <div className="mb-3">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="text-xs text-gray-500 bg-transparent border-b border-gray-200 focus:border-primary focus:outline-none w-full pb-1"
                placeholder="Tu nombre"
              />
            </div>
            
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !inputText.trim()}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
