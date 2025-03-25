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
  Vector3,
  Group,
  Object3D,
  TextureLoader,
  Clock,
  AnimationMixer,
  SkeletonHelper,
  AmbientLight,
  DirectionalLight,
  PointLight,
  SpotLight,
  LoadingManager,
  BufferGeometry,
  BufferAttribute,
  Material,
  Color,
  Fog,
  FogExp2,
  Raycaster,
  Matrix4,
  Quaternion,
  Euler,
  Box3,
  Sphere,
  Plane,
  Line3,
  Triangle,
  MathUtils,
} = THREE;

// Export the main THREE object for other utilities
export default THREE; 