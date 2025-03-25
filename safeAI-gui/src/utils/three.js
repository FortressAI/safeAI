// Centralized Three.js instance to prevent multiple imports
import * as THREE from 'three';

// Export commonly used components
export const {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  Vector3,
  Color,
  AmbientLight,
  DirectionalLight,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  Line,
  LineBasicMaterial,
  Group,
  Object3D,
  Matrix4,
  Quaternion,
  Euler
} = THREE;

// Export the main THREE object for other utilities
export default THREE; 