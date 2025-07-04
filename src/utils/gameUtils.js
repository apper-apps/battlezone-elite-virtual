// Game utility functions
export const calculateDistance = (pos1, pos2) => {
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + 
    Math.pow(pos1.y - pos2.y, 2)
  );
};

export const calculateAngle = (from, to) => {
  return Math.atan2(to.y - from.y, to.x - from.x);
};

export const isPointInCircle = (point, center, radius) => {
  const distance = calculateDistance(point, center);
  return distance <= radius;
};

export const clampPosition = (position, bounds) => {
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX, position.x)),
    y: Math.max(bounds.minY, Math.min(bounds.maxY, position.y))
  };
};

export const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const calculateKDR = (kills, deaths) => {
  if (deaths === 0) return kills.toFixed(2);
  return (kills / deaths).toFixed(2);
};

export const getWeaponDamageColor = (damage) => {
  if (damage >= 100) return 'text-red-500';
  if (damage >= 70) return 'text-orange-500';
  if (damage >= 40) return 'text-yellow-500';
  return 'text-green-500';
};

export const getHealthColor = (health, maxHealth) => {
  const percentage = (health / maxHealth) * 100;
  if (percentage <= 25) return 'text-red-500';
  if (percentage <= 50) return 'text-orange-500';
  if (percentage <= 75) return 'text-yellow-500';
  return 'text-green-500';
};

export const generateRandomPosition = (bounds) => {
  return {
    x: Math.random() * (bounds.maxX - bounds.minX) + bounds.minX,
    y: Math.random() * (bounds.maxY - bounds.minY) + bounds.minY
  };
};

export const interpolatePosition = (start, end, progress) => {
  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress
  };
};

export const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

export const degreeToRadian = (degrees) => {
  return degrees * (Math.PI / 180);
};

export const radianToDegree = (radians) => {
  return radians * (180 / Math.PI);
};