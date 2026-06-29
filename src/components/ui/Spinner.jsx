import React from 'react'

/**
 * Componente Spinner de carga
 * @param {Object} props
 * @param {string} props.size - Tamaño: sm, md, lg
 * @param {string} props.className - Clases adicionales
 */
export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-primary ${sizes[size]} ${className}`} />
  )
}
