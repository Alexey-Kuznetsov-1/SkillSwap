// useFavorites.ts
import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'skillLikes';

interface SkillLike {
  id: number;
  skillId: number;
  userId: number;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const loadFavorites = () => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        const likes: SkillLike[] = JSON.parse(stored);
        const favoriteIds = likes.map(like => like.skillId);
        setFavorites(favoriteIds);
      } catch (e) {
        console.error('Ошибка парсинга избранного', e);
      }
    }
  };

  useEffect(() => {
    loadFavorites();
    
    const handleStorageChange = () => {
      loadFavorites();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, []);

  const addToFavorites = (id: number) => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    let existingLikes: SkillLike[] = [];
    if (stored) {
      try {
        existingLikes = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    if (existingLikes.some(like => like.skillId === id)) return;
    const newLike = { id: Date.now(), skillId: id, userId: 1 };
    const newLikes = [...existingLikes, newLike];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newLikes));
    loadFavorites();
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const removeFromFavorites = (id: number) => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    let existingLikes: SkillLike[] = [];
    if (stored) {
      try {
        existingLikes = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    const newLikes = existingLikes.filter(like => like.skillId !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newLikes));
    loadFavorites();
    window.dispatchEvent(new Event('favoritesUpdated'));
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