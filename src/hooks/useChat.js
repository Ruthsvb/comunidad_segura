import { useState, useCallback, useRef } from 'react'
import { sendChatMessage } from '../api/n8n'

/**
 * Hook personalizado para gestionar el chat con el bot
 * @returns {Object} Estado y funciones del chat
 */
export default function useChat({ user } = {}) {
  // Generar session_id una sola vez
  const session_id = useRef(crypto.randomUUID())

  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: '👋 Hola, soy CS-Bot. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ])
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('Residente')
  const [error, setError] = useState(null)

  /**
   * Envía un mensaje al chatbot
   * @param {string} text - Texto del mensaje
   */
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return

    // Agregar mensaje del usuario
    const userMessage = {
      role: 'user',
      text: text.trim(),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    
    setLoading(true)
    setError(null)

    try {
      // Timeout de 15 segundos
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 55000)
      })

      const response = await Promise.race([
        sendChatMessage({
          message: text.trim(),
          session_id: session_id.current,
          user_name: user?.nombre || userName,
          unidad: user?.unidad || '',
          rol: user?.rol || 'residente',
          residente_id: user?.id || null,
          email: user?.email || null
        }),
        timeoutPromise
      ])

      // Verificar si el mensaje fue bloqueado
      if (response.ok === false && response.blocked === true) {
        throw new Error('Tu mensaje no pudo ser procesado por seguridad.')
      }

      if (response.ok === false) {
        throw new Error('No pudimos procesar tu mensaje. Intenta de nuevo.')
      }

      // Agregar respuesta del bot
      const botMessage = {
        role: 'bot',
        text: response.response,
        timestamp: new Date(response.timestamp)
      }
      setMessages(prev => [...prev, botMessage])

    } catch (err) {
      let errorMessage = 'No pudimos procesar tu mensaje. Intenta de nuevo.'
      
      if (err.message === 'timeout') {
        errorMessage = 'El asistente tardó demasiado, intenta de nuevo.'
      } else if (err.message.includes('seguridad')) {
        errorMessage = err.message
      }

      setError(errorMessage)
      
      // Agregar mensaje de error como mensaje del bot
      const errorMessageObj = {
        role: 'bot',
        text: errorMessage,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessageObj])
    } finally {
      setLoading(false)
    }
  }, [loading, userName])

  /**
   * Limpia el historial de mensajes
   */
  const clearMessages = useCallback(() => {
    setMessages([
      {
        role: 'bot',
        text: '👋 Hola, soy CS-Bot. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
      }
    ])
    setError(null)
  }, [])

  return {
    messages,
    loading,
    error,
    userName,
    setUserName,
    sendMessage,
    clearMessages,
    sessionId: session_id.current
  }
}
