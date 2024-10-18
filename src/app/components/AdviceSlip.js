'use client';

import { useState, useEffect } from 'react';

export default function AdviceSlip() {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    setError(null);
    setIsAnimating(true);
    
    try {
      // Añadimos un timestamp para evitar el caché de la API
      const response = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`);
      const data = await response.json();
      setAdvice(data.slip.advice);
    } catch (error) {
      setError('Error al cargar el consejo. ¡Inténtalo de nuevo!');
      console.error('Error fetching advice:', error);
    } finally {
      setLoading(false);
      // Reseteamos la animación después de un breve momento
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Generador de Consejos
        </h1>

        <div className="max-w-2xl mx-auto">
          <div className={`bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 ${
            isAnimating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
          }`}>
            {error ? (
              <div className="text-red-500 text-center">
                <p>{error}</p>
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="text-center">
                <svg 
                  className="w-8 h-8 mx-auto mb-4 text-purple-500" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <p className="text-xl text-gray-700 font-medium italic mb-6">
                  "{advice}"
                </p>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent my-6"></div>
              </div>
            )}

            <div className="flex justify-center mt-4">
              <button
                onClick={fetchAdvice}
                disabled={loading}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                         disabled:bg-purple-300 transition-all duration-200 ease-in-out 
                         transform hover:scale-105 active:scale-95 
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                         shadow-md flex items-center gap-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Cargando...</span>
                  </div>
                ) : (
                  <>
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Nuevo Consejo</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-600">
            <p className="text-sm">
              Powered by Advice Slip API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}