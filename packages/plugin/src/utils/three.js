// Export a single instance of Three.js to prevent multiple instances
import * as THREE from 'three';

// Export commonly used components
export const {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  Vector3
} = THREE;

// Export the main THREE object for other utilities
export default THREE; 