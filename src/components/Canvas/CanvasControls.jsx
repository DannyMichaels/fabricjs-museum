import { ObjectActions } from '../../styles/StyledComponents';
import useCanvasStore from '../../store/canvasStore';
import useHistoryStore from '../../store/historyStore';

const CanvasControls = () => {
  const {
    deleteSelectedObject,
    cloneSelectedObject,
    bringToFront,
    sendToBack,
    clearCanvas,
  } = useCanvasStore();

  const { undo, redo } = useHistoryStore();

  const handleClearCanvas = () => {
    if (
      window.confirm(
        'Are you sure you want to clear the canvas? This cannot be undone.'
      )
    ) {
      clearCanvas();
    }
  };

  return (
    <ObjectActions>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
      <button onClick={deleteSelectedObject}>Delete</button>
      <button onClick={cloneSelectedObject}>Clone</button>
      <button onClick={bringToFront}>Bring to Front</button>
      <button onClick={sendToBack}>Send to Back</button>
      <button onClick={handleClearCanvas}>Clear Canvas</button>
    </ObjectActions>
  );
};

export default CanvasControls;
