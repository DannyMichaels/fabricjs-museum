import { create } from 'zustand';
import useCanvasStore from './canvasStore';

const useHistoryStore = create((set, get) => ({
  artHistory: [],
  historyIndex: -1,

  // Initialize history
  initHistory: (initialState) =>
    set({
      artHistory: [initialState],
      historyIndex: 0,
    }),

  // Save current state to history
  saveToHistory: (currentState) =>
    set((state) => {
      // If we're not at the end of the history array, truncate
      if (state.historyIndex < state.artHistory.length - 1) {
        const newHistory = state.artHistory.slice(0, state.historyIndex + 1);
        return {
          artHistory: [...newHistory, currentState],
          historyIndex: state.historyIndex + 1,
        };
      } else {
        return {
          artHistory: [...state.artHistory, currentState],
          historyIndex: state.historyIndex + 1,
        };
      }
    }),

  // Undo function
  undo: () => {
    const state = get();
    const canvasState = useCanvasStore.getState();

    if (state.historyIndex > 0 && canvasState.fabricCanvas) {
      const newIndex = state.historyIndex - 1;
      const historyState = JSON.parse(state.artHistory[newIndex]);

      canvasState.fabricCanvas.loadFromJSON(historyState, () => {
        canvasState.fabricCanvas.renderAll();
      });

      set({ historyIndex: newIndex });
    }
  },

  // Redo function
  redo: () => {
    const state = get();
    const canvasState = useCanvasStore.getState();

    if (
      state.historyIndex < state.artHistory.length - 1 &&
      canvasState.fabricCanvas
    ) {
      const newIndex = state.historyIndex + 1;
      const historyState = JSON.parse(state.artHistory[newIndex]);

      canvasState.fabricCanvas.loadFromJSON(historyState, () => {
        canvasState.fabricCanvas.renderAll();
      });

      set({ historyIndex: newIndex });
    }
  },
}));

export default useHistoryStore;
