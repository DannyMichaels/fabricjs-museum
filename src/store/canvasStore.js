import { create } from 'zustand';

const useCanvasStore = create((set) => ({
  // Canvas reference - this won't be persisted as it's a complex object
  fabricCanvas: null,
  activeTab: 'shapes',
  selectedFilter: null,
  currentColor: '#3f51b5', // Default color for new shapes

  // Actions
  setFabricCanvas: (canvas) => set({ fabricCanvas: canvas }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedFilter: (filter) => set({ selectedFilter: filter }),

  setCurrentColor: (color) => set({ currentColor: color }),

  applyFilter: (filterType) =>
    set((state) => {
      if (state.fabricCanvas) {
        const canvas = state.fabricCanvas;

        // Reset any existing filters
        canvas.getObjects().forEach((obj) => {
          obj.filters = [];
          if (obj.applyFilters) {
            obj.applyFilters();
          }
        });

        // Apply selected filter logic here
        // This is a simplified version - the full implementation would be in a util file
        switch (filterType) {
          case 'vintage':
            canvas.backgroundColor = '#f5e8c0';
            canvas.getObjects().forEach((obj) => {
              obj.opacity = 0.9;
            });
            break;
          case 'blackAndWhite':
            canvas.backgroundColor = '#ffffff';
            // Grayscale logic would be here
            break;
          case 'sepia':
            canvas.backgroundColor = '#f0e6d8';
            // Sepia logic would be here
            break;
          case 'vibrant':
            canvas.backgroundColor = '#f0f8ff';
            // Vibrant logic would be here
            break;
          default:
            canvas.backgroundColor = '#f5f5f5';
            break;
        }

        canvas.renderAll();
        return { selectedFilter: filterType };
      }
      return {};
    }),

  clearCanvas: () =>
    set((state) => {
      if (state.fabricCanvas) {
        state.fabricCanvas.clear();
        state.fabricCanvas.backgroundColor = '#f5f5f5';
        state.fabricCanvas.renderAll();
        return { selectedFilter: null };
      }
      return {};
    }),

  // Object manipulation functions
  deleteSelectedObject: () =>
    set((state) => {
      if (state.fabricCanvas) {
        const activeObject = state.fabricCanvas.getActiveObject();
        if (activeObject) {
          // Handle both individual objects and multiple selections
          if (activeObject.type === 'activeSelection') {
            // Get all selected objects before removing them
            const selectedObjects = activeObject.getObjects();
            // Remove the active selection first to avoid fabric.js issues
            state.fabricCanvas.discardActiveObject();
            // Now remove each object that was in the selection
            selectedObjects.forEach((obj) => {
              state.fabricCanvas.remove(obj);
            });
          } else {
            // Single object deletion
            state.fabricCanvas.remove(activeObject);
          }
          state.fabricCanvas.renderAll();
          // Trigger history update
          state.fabricCanvas.fire('object:modified');
        }
      }
      return {};
    }),

  cloneSelectedObject: () =>
    set((state) => {
      if (state.fabricCanvas) {
        const activeObject = state.fabricCanvas.getActiveObject();
        if (activeObject) {
          activeObject.clone((cloned) => {
            cloned.set({
              left: activeObject.left + 20,
              top: activeObject.top + 20,
            });
            state.fabricCanvas.add(cloned);
            state.fabricCanvas.setActiveObject(cloned);
            state.fabricCanvas.renderAll();
          });
        }
      }
      return {};
    }),

  bringToFront: () =>
    set((state) => {
      if (state.fabricCanvas) {
        const activeObject = state.fabricCanvas.getActiveObject();
        if (activeObject) {
          state.fabricCanvas.bringToFront(activeObject);
          state.fabricCanvas.renderAll();
        }
      }
      return {};
    }),

  sendToBack: () =>
    set((state) => {
      if (state.fabricCanvas) {
        const activeObject = state.fabricCanvas.getActiveObject();
        if (activeObject) {
          state.fabricCanvas.sendToBack(activeObject);
          state.fabricCanvas.renderAll();
        }
      }
      return {};
    }),
}));

export default useCanvasStore;
