import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { CanvasWrapper } from '../../styles/StyledComponents';
import useCanvasStore from '../../store/canvasStore';
import useHistoryStore from '../../store/historyStore';
import { initCanvasListeners } from '../../utils/canvasUtils';

const CanvasContainer = () => {
  const canvasRef = useRef(null);
  const { setFabricCanvas } = useCanvasStore();
  const { initHistory } = useHistoryStore();

  useEffect(() => {
    // Initialize Fabric canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f5f5f5',
      preserveObjectStacking: true,
    });

    // Save canvas to store
    setFabricCanvas(fabricCanvas);

    // Add event listeners
    initCanvasListeners(fabricCanvas);

    // Initialize canvas history
    const initialState = JSON.stringify(fabricCanvas.toJSON());
    initHistory(initialState);

    // Cleanup on unmount
    return () => {
      fabricCanvas.dispose();
    };
  }, [setFabricCanvas, initHistory]);

  return (
    <CanvasWrapper>
      <canvas ref={canvasRef} />
    </CanvasWrapper>
  );
};

export default CanvasContainer;
