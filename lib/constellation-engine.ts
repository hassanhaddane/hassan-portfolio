import * as THREE from "three";
import { stagePoint } from "./constellation-shapes";
import { fieldVertex, pointFragment, filamentFragment } from "./field-shaders";
import { getFieldSignal, signalFamily } from "./field-signal";

export type SceneState = {
  stage: number;
  x: number;
  y: number;
  scrollSpeed: number;
  introProgress: number;
  workStage: number;
  contactStrength: number;
  contactX: number;
  contactY: number;
};

export type ConstellationQuality = "high" | "normal";

/** Two draw calls. No React updates, object creation or layout reads in the frame loop. */
export function createConstellation(
  canvas: HTMLCanvasElement,
  state: { current: SceneState },
  quality: ConstellationQuality = "normal",
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: quality === "high" ? "high-performance" : "low-power",
  });
  renderer.setClearColor(0x080a0e, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.z = 10;
  const group = new THREE.Group();
  scene.add(group);
  const count = quality === "high" ? 1120 : 720,
    strandLength = 40;
  const positions = new Float32Array(count * 3);
  const families = new Float32Array(count);
  const phases = new Float32Array(count);
  const targets = Array.from(
    { length: 7 },
    (_, stage) =>
      new Float32Array(
        Array.from({ length: count }, (_, i) =>
          stagePoint(i, count, stage),
        ).flat(),
      ),
  );
  positions.set(targets[0]);
  for (let i = 0; i < count; i++) {
    families[i] = Math.floor(i / strandLength) % 7;
    phases[i] = (i % strandLength) / (strandLength - 1);
  }
  const uniforms = {
    uTime: { value: 0 },
    uSignal: { value: -1 },
    uEnergy: { value: 0 },
    uPointer: { value: new THREE.Vector2(20, 20) },
    uDpr: { value: 1 },
    uScroll: { value: 0 },
  };
  const createGeometry = (
    coords: Float32Array,
    family: Float32Array,
    phase: Float32Array,
  ) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(coords, 3).setUsage(THREE.DynamicDrawUsage),
    );
    geometry.setAttribute("aFamily", new THREE.BufferAttribute(family, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    return geometry;
  };
  const createMaterial = (fragmentShader: string) =>
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: fieldVertex,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  const geometry = createGeometry(positions, families, phases);
  const pointMaterial = createMaterial(pointFragment);
  const points = new THREE.Points(geometry, pointMaterial);
  points.frustumCulled = false;
  group.add(points);
  const edges: number[][] = [];
  for (let i = 0; i < count; i++) {
    if (i % strandLength < strandLength - 1) edges.push([i, i + 1]);
    if (i % strandLength === 19 && i + strandLength < count)
      edges.push([i, i + strandLength]);
  }
  const linePositions = new Float32Array(edges.length * 6);
  const lineFamilies = new Float32Array(edges.length * 2);
  const linePhases = new Float32Array(edges.length * 2);
  edges.forEach(([a, b], i) => {
    lineFamilies[i * 2] = families[a];
    lineFamilies[i * 2 + 1] = families[b];
    linePhases[i * 2] = phases[a];
    linePhases[i * 2 + 1] = phases[b];
  });
  const lineGeometry = createGeometry(linePositions, lineFamilies, linePhases);
  const lineMaterial = createMaterial(filamentFragment);
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  lines.frustumCulled = false;
  group.add(lines);
  let running = true,
    raf = 0,
    last = 0,
    time = 0,
    averageFrame = 16.7,
    samples = 0,
    downgraded = false;
  renderer.debug.onShaderError = () => {
    canvas.dataset.failed = "true";
    running = false;
    cancelAnimationFrame(raf);
  };
  const resize = () => {
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, downgraded ? 1 : quality === "high" ? 1.5 : 1.25),
    );
    renderer.setSize(innerWidth, innerHeight, false);
    uniforms.uDpr.value = renderer.getPixelRatio();
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    group.scale.setScalar(Math.min(1.17, camera.aspect * 0.69));
    group.position.x = camera.aspect * 0.5;
    group.position.y = 0.28;
  };
  resize();
  const render = (now: number) => {
    if (!running || document.hidden) return;
    const delta = Math.min((now - (last || now)) / 1000, 0.04);
    if (last) {
      averageFrame = averageFrame * 0.97 + (now - last) * 0.03;
      samples++;
    }
    last = now;
    if (!downgraded && samples > 150 && averageFrame > 25) {
      downgraded = true;
      resize();
      geometry.setDrawRange(0, Math.min(520, count));
      lineGeometry.setDrawRange(0, Math.min(980, edges.length * 2));
    }
    time += delta;
    const data = state.current;
    const easing = 1 - Math.exp(-delta * 3);
    const stage = Math.min(6, Math.max(0, data.stage));
    const stageFrom = Math.floor(stage);
    const stageTo = Math.ceil(stage);
    const rawBlend = stage - stageFrom;
    const blend = rawBlend * rawBlend * (3 - rawBlend * 2);
    const fromTarget = targets[stageFrom === 1 ? data.workStage : stageFrom];
    const toTarget = targets[stageTo === 1 ? data.workStage : stageTo];
    for (let i = 0; i < positions.length; i++) {
      let destination = fromTarget[i] + (toTarget[i] - fromTarget[i]) * blend;
      if (stage > 5.35 && data.contactStrength > 0) {
        const axis = i % 3;
        const contactTarget = axis === 0
          ? data.contactX * camera.aspect * 3.3
          : axis === 1
            ? -data.contactY * 2.75
            : 0;
        destination += (contactTarget - destination) * data.contactStrength * 0.86;
      }
      positions[i] += (destination - positions[i]) * easing;
    }
    for (let i = 0; i < edges.length; i++) {
      const a = edges[i][0],
        b = edges[i][1];
      const offset = i * 6;
      for (let axis = 0; axis < 3; axis++) {
        linePositions[offset + axis] = positions[a * 3 + axis];
        linePositions[offset + 3 + axis] = positions[b * 3 + axis];
      }
    }
    geometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.position.needsUpdate = true;
    const signal = getFieldSignal();
    uniforms.uSignal.value = signalFamily(signal);
    uniforms.uEnergy.value +=
      ((signal ? 1 : 0) - uniforms.uEnergy.value) * easing * 2;
    uniforms.uTime.value = time;
    uniforms.uPointer.value.x +=
      (data.x * camera.aspect * 3.4 - uniforms.uPointer.value.x) * easing;
    uniforms.uPointer.value.y +=
      (-data.y * 3.4 - uniforms.uPointer.value.y) * easing;
    uniforms.uScroll.value +=
      (Math.max(-5, Math.min(5, data.scrollSpeed)) - uniforms.uScroll.value) *
      easing;
    data.scrollSpeed *= Math.exp(-delta * 5);
    group.rotation.y += (data.x * 0.045 - group.rotation.y) * easing;
    group.rotation.x += (data.y * 0.035 - group.rotation.x) * easing;
    renderer.render(scene, camera);
    if (samples > 0 && samples % 120 === 0) {
      canvas.dataset.frameMs = averageFrame.toFixed(1);
      canvas.dataset.quality = downgraded ? "reduced" : "full";
      canvas.dataset.drawCalls = String(renderer.info.render.calls);
    }
    raf = requestAnimationFrame(render);
  };
  const visibility = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden && running) {
      last = 0;
      raf = requestAnimationFrame(render);
    }
  };
  const lost = (event: Event) => {
    event.preventDefault();
    running = false;
    cancelAnimationFrame(raf);
    canvas.dataset.failed = "true";
  };
  addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  canvas.addEventListener("webglcontextlost", lost);
  raf = requestAnimationFrame(render);
  return () => {
    running = false;
    cancelAnimationFrame(raf);
    removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", visibility);
    canvas.removeEventListener("webglcontextlost", lost);
    geometry.dispose();
    lineGeometry.dispose();
    pointMaterial.dispose();
    lineMaterial.dispose();
    renderer.dispose();
  };
}
