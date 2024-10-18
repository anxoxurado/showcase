'use client';

import React, { useState, useEffect } from 'react';
import { Rocket, Calendar, Clock, MapPin } from 'lucide-react';

const SpaceXShowcase = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const response = await fetch('https://api.spacexdata.com/v4/launches/latest');
        const data = await response.json();
        setLaunches(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos de SpaceX');
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  const launchDate = new Date(launches.date_utc).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Lanzamiento de SpaceX
        </h1>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Rocket className="h-6 w-6" />
            Último Lanzamiento SpaceX
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Info Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {launches.name}
                  </h3>
                  <p className="text-gray-300 mt-2">
                    {launches.details || 'Sin detalles disponibles'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-gray-200">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  <span>{launchDate}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-200">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span>{launches.launchpad?.name || 'Localización no disponible'}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-200">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${launches.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {launches.success ? 'Lanzamiento exitoso' : 'Lanzamiento fallido'}
                  </span>
                </div>
              </div>

              {/* Image Section */}
              <div className="flex items-center justify-center">
                <div className="relative w-[200px] h-[200px] bg-slate-700 rounded-lg overflow-hidden">
                  <img 
                    src={launches.links?.patch?.large || '/api/placeholder/400/400'} 
                    alt="Parche de la misión"
                    className="object-contain w-full h-full p-4"
                  />
                </div>
              </div>
            </div>

            {/* Links Section */}
            {launches.links?.youtube_id && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Enlaces de la misión:</h4>
                <div className="flex gap-4">
                  <a 
                    href={`https://youtube.com/watch?v=${launches.links.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    Ver en YouTube
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceXShowcase;