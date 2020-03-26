/* eslint-disable no-trailing-spaces */
//  _   _ _   _ _ 
// | | | | |_(_) |
// | | | | __| | |
// | |_| | |_| | |
//  \___/ \__|_|_|
//                

export function toDegrees(rad) {
  return rad * (180 / Math.PI);
}

export function toRadians(deg) {
  return deg * (Math.PI / 180.0);
}

export function square(x) {
  return x * x;
}

// Euclidian distance between vectors
export function vectorDistance(vec1, vec2) {
  const dist = square(vec1.x - vec2.x)
             + square(vec1.y - vec2.y)
             + square(vec1.z - vec2.z);
  
  return Math.sqrt(dist);
}
