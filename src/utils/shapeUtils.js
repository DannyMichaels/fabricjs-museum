/**
 * Generate polygon points for a regular polygon
 * @param {number} sides - Number of sides
 * @param {number} radius - Radius of the polygon
 * @returns {Array} - Array of point objects with x, y coordinates
 */
export const generatePolygonPoints = (sides, radius) => {
  const points = [];
  const angleStep = (2 * Math.PI) / sides;

  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep;
    points.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  }

  return points;
};

/**
 * Generate star points for a star shape
 * @param {number} points - Number of points
 * @param {number} outerRadius - Outer radius of the star
 * @param {number} innerRadius - Inner radius of the star
 * @returns {Array} - Array of point objects with x, y coordinates
 */
export const generateStarPoints = (points, outerRadius, innerRadius) => {
  const starPoints = [];
  const angleStep = Math.PI / points;

  for (let i = 0; i < points * 2; i++) {
    const angle = i * angleStep;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    starPoints.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  }

  return starPoints;
};
