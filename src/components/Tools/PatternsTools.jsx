import { ToolOptions, OptionButton } from '../../styles/StyledComponents';
import useCanvasStore from '../../store/canvasStore';
import { createPatternWithShapes } from '../../utils/canvasUtils';
import EmbeddedColorPicker from './EmbeddedColorPicker';

const PatternsTools = () => {
  const { fabricCanvas, currentColor } = useCanvasStore();

  const handleAddPattern = (patternType) => {
    if (!fabricCanvas) return;

    switch (patternType) {
      case 'dots':
        createPatternWithShapes(fabricCanvas, 'circle', 10, 10, currentColor);
        break;
      case 'grid':
        createPatternWithShapes(fabricCanvas, 'rectangle', 8, 8, currentColor);
        break;
      case 'triangles':
        createPatternWithShapes(fabricCanvas, 'triangle', 6, 6, currentColor);
        break;
      case 'stars':
        createPatternWithShapes(fabricCanvas, 'star', 4, 4, currentColor);
        break;
      default:
        return;
    }
  };

  return (
    <>
      <ToolOptions>
        <OptionButton onClick={() => handleAddPattern('dots')}>
          Dots
        </OptionButton>
        <OptionButton onClick={() => handleAddPattern('grid')}>
          Grid
        </OptionButton>
        <OptionButton onClick={() => handleAddPattern('triangles')}>
          Triangles
        </OptionButton>
        <OptionButton onClick={() => handleAddPattern('stars')}>
          Stars
        </OptionButton>
      </ToolOptions>

      <EmbeddedColorPicker />
    </>
  );
};

export default PatternsTools;
