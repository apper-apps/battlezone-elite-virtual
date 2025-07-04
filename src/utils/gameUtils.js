// Game utility functions - Enhanced for 3D

// 3D Vector utilities
export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  add(vector) {
    return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  subtract(vector) {
    return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  multiply(scalar) {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vector3();
    return new Vector3(this.x / mag, this.y / mag, this.z / mag);
  }

  distanceTo(vector) {
    return this.subtract(vector).magnitude();
  }
}

// 2D compatibility functions
export const calculateDistance = (pos1, pos2) => {
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + 
    Math.pow(pos1.y - pos2.y, 2)
  );
};

// 3D distance calculation
export const calculateDistance3D = (pos1, pos2) => {
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + 
    Math.pow(pos1.y - pos2.y, 2) +
    Math.pow((pos1.z || 0) - (pos2.z || 0), 2)
  );
};

export const calculateAngle = (from, to) => {
  return Math.atan2(to.y - from.y, to.x - from.x);
};

// 3D angle calculations
export const calculatePitch = (from, to) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  const horizontalDistance = Math.sqrt(dx * dx + dy * dy);
  return Math.atan2(dz, horizontalDistance);
};

export const calculateYaw = (from, to) => {
  return Math.atan2(to.y - from.y, to.x - from.x);
};

export const isPointInCircle = (point, center, radius) => {
  const distance = calculateDistance(point, center);
  return distance <= radius;
};

// 3D sphere collision
export const isPointInSphere = (point, center, radius) => {
  const distance = calculateDistance3D(point, center);
  return distance <= radius;
};

export const clampPosition = (position, bounds) => {
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX, position.x)),
    y: Math.max(bounds.minY, Math.min(bounds.maxY, position.y)),
    z: bounds.minZ !== undefined ? Math.max(bounds.minZ, Math.min(bounds.maxZ, position.z || 0)) : (position.z || 0)
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
    y: Math.random() * (bounds.maxY - bounds.minY) + bounds.minY,
    z: bounds.minZ !== undefined ? Math.random() * (bounds.maxZ - bounds.minZ) + bounds.minZ : 0
  };
};

export const interpolatePosition = (start, end, progress) => {
  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress,
    z: (start.z || 0) + ((end.z || 0) - (start.z || 0)) * progress
  };
};

// 3D interpolation
export const lerp3D = (start, end, progress) => {
  return new Vector3(
    start.x + (end.x - start.x) * progress,
    start.y + (end.y - start.y) * progress,
    start.z + (end.z - start.z) * progress
  );
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

// 3D to 2D projection for minimap
export const project3DTo2D = (position3D, camera, canvasWidth = 800, canvasHeight = 600) => {
  // Simple top-down projection for minimap
  return {
    x: position3D.x,
    y: position3D.y
  };
};

// Camera utilities
export const createCameraLookAt = (position, target, up = new Vector3(0, 0, 1)) => {
  const forward = target.subtract(position).normalize();
  const right = forward.cross ? forward.cross(up).normalize() : new Vector3(1, 0, 0);
  const actualUp = right.cross ? right.cross(forward).normalize() : new Vector3(0, 0, 1);
  
  return {
    position,
    forward,
    right,
    up: actualUp
  };
};

// 3D collision detection
export const checkRayBoxIntersection = (rayOrigin, rayDirection, boxMin, boxMax) => {
  const invDir = new Vector3(
    1 / rayDirection.x,
    1 / rayDirection.y,
    1 / rayDirection.z
  );

  const t1 = (boxMin.x - rayOrigin.x) * invDir.x;
  const t2 = (boxMax.x - rayOrigin.x) * invDir.x;
  const t3 = (boxMin.y - rayOrigin.y) * invDir.y;
  const t4 = (boxMax.y - rayOrigin.y) * invDir.y;
  const t5 = (boxMin.z - rayOrigin.z) * invDir.z;
  const t6 = (boxMax.z - rayOrigin.z) * invDir.z;

  const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
  const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));

  if (tmax < 0 || tmin > tmax) {
    return null;
  }

  return tmin > 0 ? tmin : tmax;
};

// Audio distance calculation
export const calculateAudioDistance = (listenerPos, sourcePos) => {
  return calculateDistance3D(listenerPos, sourcePos);
};

// Movement sound detection
export const shouldPlayMovementSound = (oldPos, newPos, threshold = 0.1) => {
  const distance = calculateDistance3D(oldPos, newPos);
  return distance > threshold;
};