// Shared deformation keeps connected nodes and filaments in the same physical field.
export const fieldVertex = `
uniform float uTime;
uniform float uSignal;
uniform float uEnergy;
uniform vec2 uPointer;
uniform float uDpr;
uniform float uScroll;
attribute float aFamily;
attribute float aPhase;
varying float vLight;
varying float vPhase;
void main() {
  vec3 p = position;
  float signalMatch = 1.0 - step(0.4, abs(aFamily - uSignal));
  float distanceToPointer = length(p.xy - uPointer);
  float influence = exp(-distanceToPointer * distanceToPointer * 0.24);
  vec2 direction = p.xy - uPointer;
  p.xy += direction * influence * 0.13;
  p.z += influence * 0.35;
  p.y += sin(aPhase * 13.0 + uTime * 0.65 + aFamily) * (0.025 + signalMatch * uEnergy * 0.07);
  p.z += signalMatch * uEnergy * sin(aPhase * 9.0 - uTime * 1.4) * 0.23;
  p.y -= uScroll * (0.04 + aPhase * 0.025);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  float pulse = pow(max(0.0, sin(aPhase * 22.0 - uTime * 0.8 + aFamily)), 16.0);
  vLight = 0.28 + pulse * 0.62 + signalMatch * uEnergy * 1.5;
  vPhase = aPhase;
  gl_PointSize = clamp((2.2 + pulse * 3.0 + signalMatch * uEnergy * 4.0) * uDpr * (10.0 / -mvPosition.z), 1.0, 14.0);
}`;
export const pointFragment = `
varying float vLight;
void main() {
  float r = length(gl_PointCoord - vec2(0.5));
  if (r > 0.5) discard;
  float core = exp(-r * r * 60.0);
  float glow = exp(-r * r * 12.0) * 0.3;
  vec3 blue = mix(vec3(0.08, 0.28, 1.0), vec3(0.63, 0.8, 1.0), min(vLight * 0.55, 1.0));
  gl_FragColor = vec4(blue, (core + glow) * min(vLight, 1.0));
}`;
export const filamentFragment = `
uniform float uTime;
varying float vLight;
varying float vPhase;
void main() {
  float trail = pow(max(0.0, sin(vPhase * 12.0 - uTime * 0.9)), 12.0);
  gl_FragColor = vec4(0.12, 0.32, 1.0, min(0.7, vLight * 0.3 + trail * 0.18));
}`;
