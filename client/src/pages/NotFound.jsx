import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 animate-gradient-x">
      <div className="text-center text-white p-8 rounded-lg backdrop-blur-sm bg-white/10">
        <h1 className="text-9xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-8">¡Oops! Página no encontrada</p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-white text-purple-600 rounded-full font-semibold
                     hover:bg-purple-100 transition-all duration-300
                     transform hover:scale-105"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}