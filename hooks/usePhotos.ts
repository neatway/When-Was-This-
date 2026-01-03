import { useState, useEffect } from 'react';
import { Photo } from '../types';
import { config } from '../constants/config';

// Import local data as fallback
import photosData from '../data/photos.json';

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      setError(null);

      let fetchedPhotos: Photo[];

      if (config.useLocalData) {
        // Use local data during development
        fetchedPhotos = photosData.photos;
      } else {
        // Fetch from GitHub in production
        const response = await fetch(config.githubPhotosJsonUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        const data = await response.json();
        fetchedPhotos = data.photos;
      }

      // Shuffle photos for random order
      const shuffled = shuffleArray([...fetchedPhotos]);
      setPhotos(shuffled);
    } catch (err) {
      console.error('Error loading photos:', err);
      setError('Failed to load photos');
      // Fallback to local data
      setPhotos(shuffleArray([...photosData.photos]));
    } finally {
      setLoading(false);
    }
  };

  const getImageUri = (filename: string): string => {
    if (config.useLocalData) {
      // For development, use placeholder images
      // You can replace this with actual local images or use a placeholder service
      return `https://picsum.photos/800/600?random=${filename}`;
    }
    return `${config.githubImagesBaseUrl}${filename}`;
  };

  return { photos, loading, error, getImageUri, reload: loadPhotos };
};

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
