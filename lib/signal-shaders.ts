/** The same deformation drives dots and filaments; all morph buffers live on the GPU. */
export const fieldVertex = `
uniform float uStage;
uniform float uTime;
uniform float uEnergy;
uniform float uIntent;
uniform float uProject;
uniform float uDpr;
uniform vec2 uPointer;
attribute vec3 aShape1;
attribute vec3 aShape2;
attribute vec3 aShape3;
attribute vec3 aShape4;
attribute vec3 aShape5;
attribute float aSeed;
varying float vPulse;
varying float vDepth;
void main() {
  vec3 p = position;
  if(uStage < 1.0) p = mix(position,aShape1,uStage);
  else if(uStage < 2.0) p = mix(aShape1,aShape2,uStage-1.0);
  else if(uStage < 3.0) p = mix(aShape2,aShape3,uStage-2.0);
  else if(uStage < 4.0) p = mix(aShape3,aShape4,uStage-3.0);
  else p = mix(aShape4,aShape5,min(1.0,uStage-4.0));
  float alive = 1.0-smoothstep(4.3,5.0,uStage);
  float wave = sin(aSeed*36.0-uTime*(.7+uIntent*.15)+uProject*.7);
  p += normalize(p+vec3(.01)) * wave * (.025+uEnergy*.09) * alive;
  float influence = exp(-length(p.xy-uPointer*2.0)*1.3);
  p.z += influence*.24*alive;
  p.y += sin(aSeed*19.0+uTime)*uIntent*.045*alive;
  vec4 view = modelViewMatrix * vec4(p,1.0);
  gl_Position = projectionMatrix*view;
  vPulse = .55+.45*pow(max(0.0,sin(aSeed*43.0-uTime*1.1)),8.0);
  vDepth = clamp(1.4 + view.z*.06,.25,1.0);
  gl_PointSize = clamp((1.7+vPulse*1.3+uEnergy*1.5)*uDpr*(8.0/-view.z),1.0,8.0);
}`;
export const pointFragment = `
uniform vec3 uColor;
uniform float uOpacity;
varying float vPulse;
varying float vDepth;
void main(){
  float d=length(gl_PointCoord-.5);
  if(d>.5) discard;
  float edge=1.0-smoothstep(.18,.5,d);
  gl_FragColor=vec4(uColor,edge*vPulse*vDepth*uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
export const lineFragment = `
uniform vec3 uColor;
uniform float uOpacity;
varying float vPulse;
varying float vDepth;
void main(){
  gl_FragColor=vec4(uColor,(.4+vPulse*.6)*vDepth*uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
