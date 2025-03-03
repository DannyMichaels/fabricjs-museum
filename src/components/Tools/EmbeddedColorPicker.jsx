import { useState, useEffect } from 'react';
import styled from 'styled-components';
import useCanvasStore from '../../store/canvasStore';
import useHistoryStore from '../../store/historyStore';

const ColorPickerWrapper = styled.div`
  margin-top: 15px;
  border-top: 1px dashed #ccc;
  padding-top: 15px;
`;

const ColorSection = styled.div`
  margin-bottom: 12px;
`;

const SectionTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 5px;
  color: #555;
`;

const ColorControlsSimple = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const ColorInput = styled.input`
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
`;

const ColorLabel = styled.label`
  font-weight: 500;
  font-size: 0.9rem;
`;

const ColorPresets = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
`;

const ColorPreset = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  cursor: pointer;
  transition: transform 0.1s ease;
  border: 2px solid ${(props) => (props.selected ? '#333' : 'transparent')};

  &:hover {
    transform: scale(1.1);
  }
`;

const colorPresets = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
];

const EmbeddedColorPicker = () => {
  const { fabricCanvas, currentColor, setCurrentColor } = useCanvasStore();
  const { saveToHistory } = useHistoryStore();
  const [selectedObject, setSelectedObject] = useState(null);
  const [objectColor, setObjectColor] = useState('#000000');

  // Listen for object selection changes
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleSelectionChanged = () => {
      const selection = fabricCanvas.getActiveObject();
      setSelectedObject(selection);

      if (selection && selection.fill && typeof selection.fill === 'string') {
        setObjectColor(selection.fill);
      }
    };

    fabricCanvas.on('selection:created', handleSelectionChanged);
    fabricCanvas.on('selection:updated', handleSelectionChanged);
    fabricCanvas.on('selection:cleared', handleSelectionChanged);

    // Initial check for already selected objects
    handleSelectionChanged();

    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('selection:created', handleSelectionChanged);
        fabricCanvas.off('selection:updated', handleSelectionChanged);
        fabricCanvas.off('selection:cleared', handleSelectionChanged);
      }
    };
  }, [fabricCanvas]);

  // Handle changing the current color for new shapes
  const handleColorChange = (e) => {
    setCurrentColor(e.target.value);
  };

  // Handle changing the color of selected object
  const handleObjectColorChange = (e) => {
    const newColor = e.target.value;
    setObjectColor(newColor);

    if (selectedObject) {
      if (selectedObject.type === 'activeSelection') {
        // Apply to all objects in the selection
        selectedObject.getObjects().forEach((obj) => {
          obj.set('fill', newColor);
        });
      } else {
        selectedObject.set('fill', newColor);
      }

      fabricCanvas.renderAll();

      // Trigger object:modified for history
      fabricCanvas.fire('object:modified');
      saveToHistory(JSON.stringify(fabricCanvas.toJSON()));
    }
  };

  // Handle clicking on a preset color
  const handlePresetClick = (color) => {
    if (selectedObject) {
      // Apply to selected object(s)
      setObjectColor(color);

      if (selectedObject.type === 'activeSelection') {
        selectedObject.getObjects().forEach((obj) => {
          obj.set('fill', color);
        });
      } else {
        selectedObject.set('fill', color);
      }

      fabricCanvas.renderAll();
      fabricCanvas.fire('object:modified');
      saveToHistory(JSON.stringify(fabricCanvas.toJSON()));
    } else {
      // Set for new shapes
      setCurrentColor(color);
    }
  };

  return (
    <ColorPickerWrapper>
      {/* New shapes color section */}
      <ColorSection>
        <SectionTitle>New Shapes</SectionTitle>
        <ColorControlsSimple>
          <ColorInput
            type="color"
            value={currentColor}
            onChange={handleColorChange}
            title="Select color for new shapes"
          />
        </ColorControlsSimple>
      </ColorSection>

      {/* Selected object color section (only shows when object is selected) */}
      {selectedObject && (
        <ColorSection>
          <SectionTitle>
            {selectedObject.type === 'activeSelection'
              ? `${selectedObject.getObjects().length} objects selected`
              : 'Selected Object'}
          </SectionTitle>
          <ColorControlsSimple>
            <ColorInput
              type="color"
              value={objectColor}
              onChange={handleObjectColorChange}
              title="Change color of selected object"
            />
          </ColorControlsSimple>
        </ColorSection>
      )}

      {/* Color presets section */}
      <ColorSection>
        <SectionTitle>Color Presets</SectionTitle>
        <ColorPresets>
          {colorPresets.map((color, index) => (
            <ColorPreset
              key={index}
              color={color}
              selected={
                selectedObject ? color === objectColor : color === currentColor
              }
              onClick={() => handlePresetClick(color)}
              title={color}
            />
          ))}
        </ColorPresets>
      </ColorSection>
    </ColorPickerWrapper>
  );
};

export default EmbeddedColorPicker;
