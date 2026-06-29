import React from 'react'

/**
 * Componente Card genérico para mostrar información
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido de la card
 * @param {string} props.className - Clases adicionales
 * @param {boolean} props.alert - Si tiene borde de alerta
 * @param {string} props.alertColor - Color de alerta (red, amber)
 */
export default function Card({ children, className = '', alert = false, alertColor = 'red', onClick }) {
  const alertBorder = alert ? `border-l-4 ${alertColor === 'red' ? 'border-danger' : 'border-warning'}` : ''

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${alertBorder} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}
