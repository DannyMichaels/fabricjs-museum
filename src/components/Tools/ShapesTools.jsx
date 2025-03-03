import { ToolOptions, OptionButton } from '../../styles/StyledComponents';
import useCanvasStore from '../../store/canvasStore';
import { addShape } from '../../utils/canvasUtils';

const ShapesTools = () => {
  const { fabricCanvas } = useCanvasStore();

  const handleAddShape = (shapeType) => {
    if (fabricCanvas) {
      addShape(fabricCanvas, shapeType);
    }
  };

  return (
    <ToolOptions>
      <OptionButton onClick={() => handleAddShape('circle')}>
        Circle
      </OptionButton>
      <OptionButton onClick={() => handleAddShape('rectangle')}>
        Rectangle
      </OptionButton>
      <OptionButton onClick={() => handleAddShape('triangle')}>
        Triangle
      </OptionButton>
      <OptionButton onClick={() => handleAddShape('polygon')}>
        Polygon
      </OptionButton>
      <OptionButton onClick={() => handleAddShape('star')}>Star</OptionButton>
    </ToolOptions>
  );
};

export default ShapesTools;
