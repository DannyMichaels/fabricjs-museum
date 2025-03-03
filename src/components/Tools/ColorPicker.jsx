import { useState, useEffect } from 'react';
import styled from 'styled-components';
import useCanvasStore from '../../store/canvasStore';
import { ToolOptions } from '../../styles/StyledComponents';

const ColorPickerContainer = styled(ToolOptions)`
  flex-direction: column;
  align-items: flex-start;
`;

const ColorControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  width: 100%;
`;

const ColorInput = styled.input`
  width: 50px;
  height: 50px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
`;

const ColorLabel = styled.label`
  margin-right: 10px;
  font-weight: 500;
`;

const ColorPresets = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const ColorPreset = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  cursor: pointer;
  transition: transform 0.1s ease;
  border: 2px solid ${(props) => (props.selected ? '#333' : 'transparent')};

  &:hover {
    transform: scale(1.1);
  }
`;

const SelectionInfo = styled.div`
  margin-top: 10px;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
`;

// Color presets
const colorPresets = [
  '#f44336', // Red
  '#e91e63', // Pink
  '#9c27b0', // Purple
  '#673ab7', // Deep Purple
  '#3f51b5', // Indigo
  '#2196f3', // Blue
  '#03a9f4', // Light Blue
  '#00bcd4', // Cyan
  '#009688', // Teal
  '#4caf50', // Green
  '#8bc34a', // Light Green
  '#cddc39', // Lime
  '#ffeb3b', // Yellow
  '#ffc107', // Amber
  '#ff9800', // Orange
  '#ff5722', // Deep Orange
  '#795548', // Brown
  '#607d8b', // Blue Grey
  '#000000', // Black
  '#ffffff', // White
];

const ColorPicker = () => {
  const { fabricCanvas, currentColor, setCurrentColor } = useCanvasStore();
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
    }
  };

  // Handle clicking on a preset color
  const handlePresetClick = (color) => {
    if (selectedObject) {
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
    } else {
      setCurrentColor(color);
    }
  };

  return (
    <ColorPickerContainer>
      <ColorControls>
        <ColorLabel>New Shape Color:</ColorLabel>
        <ColorInput
          type="color"
          value={currentColor}
          onChange={handleColorChange}
          title="Select color for new shapes"
        />
      </ColorControls>

      {selectedObject && (
        <ColorControls>
          <ColorLabel>Selected Object Color:</ColorLabel>
          <ColorInput
            type="color"
            value={objectColor}
            onChange={handleObjectColorChange}
            title="Change color of selected object"
          />
        </ColorControls>
      )}

      <h4>Color Presets</h4>
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

      {selectedObject && (
        <SelectionInfo>
          {selectedObject.type === 'activeSelection'
            ? `${selectedObject.getObjects().length} objects selected`
            : `Selected: ${selectedObject.type}`}
        </SelectionInfo>
      )}
    </ColorPickerContainer>
  );
};

export default ColorPicker;
