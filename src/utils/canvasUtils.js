import { fabric } from 'fabric';
import { getRandomColor } from './colorUtils';
import { generatePolygonPoints, generateStarPoints } from './shapeUtils';
import useHistoryStore from '../store/historyStore';
import _ from 'lodash';

/**
 * Add a shape to the canvas
 * @param {object} canvas - Fabric.js canvas instance
 * @param {string} shapeType - Type of shape to add
 * @param {string} color - Color to apply to the shape (defaults to random if not provided)
 */
export const addShape = (canvas, shapeType, color) => {
  let shape;
  const fillColor = color || getRandomColor();

  switch (shapeType) {
    case 'circle':
      shape = new fabric.Circle({
        radius: 50,
        fill: fillColor,
        left: 100,
        top: 100,
      });
      break;
    case 'rectangle':
      shape = new fabric.Rect({
        width: 100,
        height: 80,
        fill: fillColor,
        left: 100,
        top: 100,
      });
      break;
    case 'triangle':
      shape = new fabric.Triangle({
        width: 100,
        height: 100,
        fill: fillColor,
        left: 100,
        top: 100,
      });
      break;
    case 'polygon':
      const points = generatePolygonPoints(6, 50);
      shape = new fabric.Polygon(points, {
        fill: fillColor,
        left: 100,
        top: 100,
      });
      break;
    case 'star':
      const starPoints = generateStarPoints(5, 50, 25);
      shape = new fabric.Polygon(starPoints, {
        fill: fillColor,
        left: 100,
        top: 100,
      });
      break;
    default:
      return;
  }

  canvas.add(shape);
  canvas.setActiveObject(shape);
};

/**
 * Create a pattern with multiple shapes
 * @param {object} canvas - Fabric.js canvas instance
 * @param {string} shapeType - Type of shape to use in pattern
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @param {string} baseColor - Base color for the pattern (if provided, variations will be created)
 */
export const createPatternWithShapes = (
  canvas,
  shapeType,
  rows,
  cols,
  baseColor
) => {
  const group = [];
  const shapeSize = 20;
  const spacing = 40;

  // Function to create a slight variation of the base color if provided
  const getPatternColor = () => {
    if (baseColor) {
      // Create slight variations of the base color
      const rgb = hexToRgb(baseColor);
      if (rgb) {
        const variation = 30; // Max variation amount
        const r = Math.max(
          0,
          Math.min(255, rgb.r + (Math.random() * variation * 2 - variation))
        );
        const g = Math.max(
          0,
          Math.min(255, rgb.g + (Math.random() * variation * 2 - variation))
        );
        const b = Math.max(
          0,
          Math.min(255, rgb.b + (Math.random() * variation * 2 - variation))
        );
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
      }
    }
    return getRandomColor();
  };

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let shape;
      const x = j * spacing;
      const y = i * spacing;
      const fillColor = getPatternColor();

      switch (shapeType) {
        case 'circle':
          shape = new fabric.Circle({
            radius: shapeSize / 2,
            fill: fillColor,
            left: x,
            top: y,
          });
          break;
        case 'rectangle':
          shape = new fabric.Rect({
            width: shapeSize,
            height: shapeSize,
            fill: fillColor,
            left: x,
            top: y,
          });
          break;
        case 'triangle':
          shape = new fabric.Triangle({
            width: shapeSize,
            height: shapeSize,
            fill: fillColor,
            left: x,
            top: y,
          });
          break;
        case 'star':
          const starPoints = generateStarPoints(
            5,
            shapeSize / 2,
            shapeSize / 4
          );
          shape = new fabric.Polygon(starPoints, {
            fill: fillColor,
            left: x,
            top: y,
          });
          break;
        default:
          continue;
      }

      group.push(shape);
    }
  }

  const patternGroup = new fabric.Group(group, {
    left: 100,
    top: 100,
  });

  canvas.add(patternGroup);
  canvas.setActiveObject(patternGroup);
};

/**
 * Apply art style to the canvas
 * @param {object} canvas - Fabric.js canvas instance
 * @param {string} style - The art style to apply
 */
export const applyArtStyle = (canvas, style) => {
  const objects = canvas.getObjects();

  switch (style) {
    case 'impressionism':
      objects.forEach((obj) => {
        obj.set({
          opacity: 0.8,
          stroke: '#ffffff',
          strokeWidth: 2,
        });
      });
      canvas.backgroundColor = '#e6f7ff';
      break;
    case 'cubism':
      objects.forEach((obj) => {
        if (obj.type !== 'group') {
          obj.set({
            skewX: Math.random() * 20 - 10,
            skewY: Math.random() * 20 - 10,
            stroke: '#000000',
            strokeWidth: 2,
          });
        }
      });
      canvas.backgroundColor = '#f0e68c';
      break;
    case 'popart':
      objects.forEach((obj) => {
        obj.set({
          fill: getRandomColor(),
          stroke: '#000000',
          strokeWidth: 3,
        });
      });
      canvas.backgroundColor = '#ffffff';
      break;
    case 'expressionism':
      objects.forEach((obj) => {
        obj.set({
          angle: Math.random() * 20 - 10,
          scaleX: obj.scaleX * (1 + Math.random() * 0.4 - 0.2),
          scaleY: obj.scaleY * (1 + Math.random() * 0.4 - 0.2),
          stroke: '#000000',
          strokeWidth: 4,
        });
      });
      canvas.backgroundColor = '#ffcccc';
      break;
  }

  canvas.renderAll();
};

/**
 * Debounced function to save canvas state to history
 */
export const debouncedSaveToHistory = _.debounce((canvas) => {
  if (!canvas) return;

  const currentState = JSON.stringify(canvas.toJSON());
  useHistoryStore.getState().saveToHistory(currentState);
}, 500);

/**
 * Initialize canvas event listeners
 * @param {object} canvas - Fabric.js canvas instance
 */
export const initCanvasListeners = (canvas) => {
  canvas.on('object:modified', () => debouncedSaveToHistory(canvas));
  canvas.on('object:added', () => debouncedSaveToHistory(canvas));
};
