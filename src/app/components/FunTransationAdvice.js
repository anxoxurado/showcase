'use client';

import { useState, useEffect } from 'react';

const TRANSLATION_TYPES = [
  { id: 'yoda', name: 'Yoda' },
  { id: 'pirate', name: 'Pirata' },
  { id: 'minion', name: 'Minion' },
  { id: 'dothraki', name: 'Dothraki' },
  { id: 'valyrian', name: 'Valyrian' },
];

export default function FunTranslationAdvice() {
  const [advice, setAdvice] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedTranslation, setSelectedTranslation] = useState('yoda');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [remainingCalls, setRemainingCalls] = useState(5);
  const [isAnimating, setIsAnimating] = useState(false);

  const translateText = async () => {
    if (remainingCalls <= 0) {
      setError('Has alcanzado el límite de traducciones por hora. ¡Inténtalo más tarde!');
      return;
    }
  
    setTranslating(true);
    setError(null);
  
    try {
      const response = await fetch(`https://api.funtranslations.com/translate/${selectedTranslation}.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: advice.trim() })
      });
  
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('API Response:', data);
  
      if (data.error) {
        throw new Error(data.error.message);
      }
  
      setTranslatedText(data.contents.translated);
      setRemainingCalls(prev => prev - 1);
    } catch (error) {
      console.error('Error durante la traducción:', error.message);
  
      if (error.message.includes('Too Many Requests')) {
        setError('Has alcanzado el límite de traducciones. ¡Inténtalo en una hora!');
        setRemainingCalls(0);
      } else if (error.message.includes('CORS')) {
        setError('Error de CORS. Revisa las políticas de acceso.');
      } else {
        setError(`Error al traducir el texto: ${error.message}`);
      }
    } finally {
      setTranslating(false);
    }
  };

  // Definir la función fetchAdvice para obtener un consejo de la Advice Slip API
  const fetchAdvice = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.adviceslip.com/advice');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Advice API Response:', data);
      
      setAdvice(data.slip.advice);
      setTranslatedText('');  // Resetea la traducción al obtener un nuevo consejo

    } catch (error) {
      console.error('Error al obtener el consejo:', error.message);
      setError('Error al obtener el consejo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();  // Llamar a la función fetchAdvice al cargar el componente
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Traductor de Consejos
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Traducciones restantes: {remainingCalls}/5 por hora
        </p>

        <div className="max-w-2xl mx-auto">
          <div className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 ${
            isAnimating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
          }`}>
            {error ? (
              <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
                <p>{error}</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">Consejo Original:</h2>
                  {loading ? (
                    <div className="flex justify-center items-center h-20">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
                    </div>
                  ) : (
                    <p className="text-gray-600 italic">"{advice}"</p>
                  )}
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">Traducción:</h2>
                  {translating ? (
                    <div className="flex justify-center items-center h-20">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
                    </div>
                  ) : translatedText ? (
                    <p className="text-gray-600 italic">"{translatedText}"</p>
                  ) : (
                    <p className="text-gray-400">Selecciona un estilo y traduce el consejo</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <select
                    value={selectedTranslation}
                    onChange={(e) => setSelectedTranslation(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             shadow-sm transition-all duration-200"
                  >
                    {TRANSLATION_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={translateText}
                    disabled={translating || loading || !advice || remainingCalls <= 0}
                    className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 
                             disabled:bg-teal-300 transition-all duration-200 
                             transform hover:scale-105 active:scale-95
                             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  >
                    {translating ? 'Traduciendo...' : 'Traducir'}
                  </button>
                </div>
              </>
            )}

            <div className="flex justify-center mt-6">
              <button
                onClick={fetchAdvice}
                disabled={loading}
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                         disabled:bg-emerald-300 transition-all duration-200 
                         transform hover:scale-105 active:scale-95
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 
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
              Powered by Advice Slip API & Fun Translations API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
