import { ToolOptions, OptionButton } from '../../styles/StyledComponents';
import useCanvasStore from '../../store/canvasStore';
import {
  hexToRgb,
  applyGrayscale,
  applySepia,
  applyVibrant,
} from '../../utils/colorUtils';
import useHistoryStore from '../../store/historyStore';

const FiltersTools = () => {
  const { fabricCanvas, selectedFilter, setSelectedFilter } = useCanvasStore();
  const { saveToHistory } = useHistoryStore();

  const applyFilter = (filterType) => {
    if (!fabricCanvas) return;

    setSelectedFilter(filterType);
    const canvas = fabricCanvas;

    // Reset any existing filters
    canvas.getObjects().forEach((obj) => {
      obj.filters = [];
      if (obj.applyFilters) {
        obj.applyFilters();
      }
    });

    switch (filterType) {
      case 'vintage':
        canvas.backgroundColor = '#f5e8c0';
        canvas.getObjects().forEach((obj) => {
          obj.opacity = 0.9;
        });
        break;
      case 'blackAndWhite':
        canvas.backgroundColor = '#ffffff';
        // Apply grayscale to objects with image source
        canvas.getObjects().forEach((obj) => {
          if (obj.type === 'image' && obj.applyFilters) {
            obj.filters.push(new fabric.Image.filters.Grayscale());
            obj.applyFilters();
          } else {
            // For shapes, convert fill to grayscale
            if (
              obj.fill &&
              typeof obj.fill === 'string' &&
              obj.fill.indexOf('#') === 0
            ) {
              obj.set('fill', applyGrayscale(obj.fill));
            }
          }
        });
        break;
      case 'sepia':
        canvas.backgroundColor = '#f0e6d8';
        // Apply sepia to objects with image source
        canvas.getObjects().forEach((obj) => {
          if (obj.type === 'image' && obj.applyFilters) {
            obj.filters.push(new fabric.Image.filters.Sepia());
            obj.applyFilters();
          } else {
            // For shapes, convert fill to sepia-like colors
            if (
              obj.fill &&
              typeof obj.fill === 'string' &&
              obj.fill.indexOf('#') === 0
            ) {
              obj.set('fill', applySepia(obj.fill));
            }
          }
        });
        break;
      case 'vibrant':
        canvas.backgroundColor = '#f0f8ff';
        canvas.getObjects().forEach((obj) => {
          if (
            obj.fill &&
            typeof obj.fill === 'string' &&
            obj.fill.indexOf('#') === 0
          ) {
            obj.set('fill', applyVibrant(obj.fill));
          }
        });
        break;
      default:
        canvas.backgroundColor = '#f5f5f5';
        break;
    }

    canvas.renderAll();

    // Save to history after applying filter
    const currentState = JSON.stringify(canvas.toJSON());
    saveToHistory(currentState);
  };

  return (
    <ToolOptions>
      <OptionButton
        active={selectedFilter === 'none'}
        onClick={() => applyFilter('none')}>
        None
      </OptionButton>
      <OptionButton
        active={selectedFilter === 'vintage'}
        onClick={() => applyFilter('vintage')}>
        Vintage
      </OptionButton>
      <OptionButton
        active={selectedFilter === 'blackAndWhite'}
        onClick={() => applyFilter('blackAndWhite')}>
        Black & White
      </OptionButton>
      <OptionButton
        active={selectedFilter === 'sepia'}
        onClick={() => applyFilter('sepia')}>
        Sepia
      </OptionButton>
      <OptionButton
        active={selectedFilter === 'vibrant'}
        onClick={() => applyFilter('vibrant')}>
        Vibrant
      </OptionButton>
    </ToolOptions>
  );
};

export default FiltersTools;
