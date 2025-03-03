import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useGalleryStore = create(
  persist(
    (set) => ({
      artworks: [],
      currentArtworkName: 'Untitled Masterpiece',
      showGallery: false,
      showSaveModal: false,

      // Actions
      addArtwork: (artwork) =>
        set((state) => ({
          artworks: [...state.artworks, artwork],
        })),

      setCurrentArtworkName: (name) =>
        set({
          currentArtworkName: name,
        }),

      toggleGallery: (show) =>
        set({
          showGallery:
            show !== undefined ? show : (state) => !state.showGallery,
        }),

      toggleSaveModal: (show) =>
        set({
          showSaveModal:
            show !== undefined ? show : (state) => !state.showSaveModal,
        }),

      deleteArtwork: (id) =>
        set((state) => ({
          artworks: state.artworks.filter((artwork) => artwork.id !== id),
        })),
    }),
    {
      name: 'museum-gallery-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useGalleryStore;
