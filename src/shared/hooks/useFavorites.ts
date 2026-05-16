import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Ошибка парсинга избранного', e);
      }
    }
  }, []);

  const addToFavorites = (id: number) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev;
      const newFavorites = [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFromFavorites = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((item) => item !== id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };
};