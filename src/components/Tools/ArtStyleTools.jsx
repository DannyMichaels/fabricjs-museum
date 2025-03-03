import { ToolOptions, OptionButton } from '../../styles/StyledComponents';
import useCanvasStore from '../../store/canvasStore';
import { applyArtStyle } from '../../utils/canvasUtils';
import useHistoryStore from '../../store/historyStore';

const ArtStyleTools = () => {
  const { fabricCanvas } = useCanvasStore();
  const { saveToHistory } = useHistoryStore();

  const handleApplyArtStyle = (style) => {
    if (!fabricCanvas) return;

    applyArtStyle(fabricCanvas, style);

    // Save to history after applying art style
    const currentState = JSON.stringify(fabricCanvas.toJSON());
    saveToHistory(currentState);
  };

  return (
    <ToolOptions>
      <OptionButton onClick={() => handleApplyArtStyle('impressionism')}>
        Impressionism
      </OptionButton>
      <OptionButton onClick={() => handleApplyArtStyle('cubism')}>
        Cubism
      </OptionButton>
      <OptionButton onClick={() => handleApplyArtStyle('popart')}>
        Pop Art
      </OptionButton>
      <OptionButton onClick={() => handleApplyArtStyle('expressionism')}>
        Expressionism
      </OptionButton>
    </ToolOptions>
  );
};

export default ArtStyleTools;
