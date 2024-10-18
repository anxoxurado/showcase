    'use client';

import { useState, useEffect } from 'react';

export default function CatGallery() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://api.thecatapi.com/v1/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setError('Error al cargar las categorías');
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const fetchCats = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = 'https://api.thecatapi.com/v1/images/search?limit=8';
      if (selectedCategory && selectedCategory !== "all") {
        url += `&category_ids=${selectedCategory}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setCats(data);
    } catch (error) {
      setError('Error al cargar las imágenes');
      console.error('Error fetching cats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Galería de Gatos</h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>

            <button 
              onClick={fetchCats}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 
                        transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Cargando...</span>
                </div>
              ) : (
                'Nuevos gatos'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cats.map((cat) => (
            <div 
              key={cat.id} 
              className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative pt-[100%]">
                <img
                  src={cat.url}
                  alt="Cat"
                  className="absolute top-0 left-0 w-full h-full object-cover transition-all duration-300 hover:opacity-90"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent shadow-md"></div>
          </div>
        )}

        {!loading && cats.length === 0 && !error && (
          <div className="text-center py-12 text-gray-600">
            No se encontraron imágenes para esta categoría
          </div>
        )}
      </div>
    </div>
  );
}