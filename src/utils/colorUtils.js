/**
 * Generate a random color from a predefined palette
 * @returns {string} - Hex color code
 */
export const getRandomColor = () => {
  const colors = [
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
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code
 * @returns {object|null} - RGB object with r, g, b properties or null if invalid
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Apply grayscale to a hex color
 * @param {string} hexColor - The hex color to convert
 * @returns {string} - RGB color string in grayscale
 */
export const applyGrayscale = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor;

  const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
  return `rgb(${gray}, ${gray}, ${gray})`;
};

/**
 * Apply sepia to a hex color
 * @param {string} hexColor - The hex color to convert
 * @returns {string} - RGB color string with sepia effect
 */
export const applySepia = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor;

  const r = Math.min(
    255,
    Math.round(rgb.r * 0.393 + rgb.g * 0.769 + rgb.b * 0.189)
  );
  const g = Math.min(
    255,
    Math.round(rgb.r * 0.349 + rgb.g * 0.686 + rgb.b * 0.168)
  );
  const b = Math.min(
    255,
    Math.round(rgb.r * 0.272 + rgb.g * 0.534 + rgb.b * 0.131)
  );

  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Apply vibrant filter to a hex color
 * @param {string} hexColor - The hex color to convert
 * @returns {string} - RGB color string with vibrant effect
 */
export const applyVibrant = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor;

  const r = Math.min(255, Math.round(rgb.r * 1.2));
  const g = Math.min(255, Math.round(rgb.g * 1.2));
  const b = Math.min(255, Math.round(rgb.b * 1.2));

  return `rgb(${r}, ${g}, ${b})`;
};
