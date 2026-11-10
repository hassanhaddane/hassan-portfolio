import * as THREE from "three";
import type { MotionFrame } from "./motion-runtime";
import { surfacePoint, fieldPoint } from "./signal-forms";
import { fieldVertex, pointFragment, lineFragment } from "./signal-shaders";

export type UniverseQuality = "full" | "mobile" | "low";
export type UniverseInput = {
  stage: number;
  progress: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  darkInk: boolean;
  project: number;
  intent: number;
  pulse: number;
  visible: boolean;
};
export type UniverseStatus = "webgl" | "lost" | "failed";
export type SignalUniverse = {
  update(frame: MotionFrame, input: UniverseInput): boolean;
  dispose(): void;
};
const mix = THREE.MathUtils.lerp;
const projectColors = [0x63a779, 0xf25229, 0x819eae, 0xc4ad84];
const cameraDepth = [8.2, 9.5, 8.8, 10, 8.4, 9.8];

/** A shared scene, five draw calls, immutable morph buffers; deliberately no RAF here. */
export function createSignalUniverse(
  canvas: HTMLCanvasElement,
  context: WebGL2RenderingContext,
  quality: UniverseQuality,
  status: (state: UniverseStatus) => void,
): SignalUniverse {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    alpha: true,
    antialias: false,
    powerPreference: quality === "full" ? "high-performance" : "low-power",
  });
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
  const actor = new THREE.Group();
  scene.add(actor);
  const key = new THREE.DirectionalLight(0xfff5df, 4.2);
  key.position.set(3, 5, 6);
  const rim = new THREE.DirectionalLight(0xff9b76, 3.3);
  rim.position.set(-4, 2, -2);
  const fill = new THREE.DirectionalLight(0xc5ded6, 1.9);
  fill.position.set(-3, -2, 5);
  scene.add(key, rim, fill, new THREE.HemisphereLight(0xffead3, 0x272e28, 2.4));
  const segments = quality === "full" ? 160 : quality === "mobile" ? 96 : 64;
  const rings = quality === "full" ? 24 : 16;
  const count = quality === "full" ? 1760 : quality === "mobile" ? 800 : 480;
  const uniforms = {
    uTime: { value: 0 },
    uEnergy: { value: 0 },
    uIntent: { value: 0 },
    uProject: { value: 0 },
    uStage: { value: 0 },
    uDpr: { value: 1 },
    uPointer: { value: new THREE.Vector2() },
  };
  const surface = new THREE.BufferGeometry();
  const vertexCount = (segments + 1) * (rings + 1);
  const indices = new Uint16Array(segments * rings * 6);
  const uv = new Float32Array(vertexCount * 2);
  let cursor = 0;
  for (let i = 0; i < segments; i++)
    for (let j = 0; j < rings; j++) {
      const a = i * (rings + 1) + j,
        b = a + rings + 1;
      indices.set([a, b, a + 1, b, b + 1, a + 1], cursor);
      cursor += 6;
    }
  surface.setIndex(new THREE.BufferAttribute(indices, 1));
  const morphPositions: THREE.BufferAttribute[] = [],
    morphNormals: THREE.BufferAttribute[] = [];
  for (let shape = 0; shape < 6; shape++) {
    const coords = new Float32Array(vertexCount * 3);
    for (let i = 0; i <= segments; i++)
      for (let j = 0; j <= rings; j++) {
        const index = i * (rings + 1) + j;
        surfacePoint(shape, i / segments, j / rings, coords, index * 3);
        if (shape === 0) {
          uv[index * 2] = i / segments;
          uv[index * 2 + 1] = j / rings;
        }
      }
    const attribute = new THREE.BufferAttribute(coords, 3);
    if (shape === 0) {
      surface.setAttribute("position", attribute);
      surface.computeVertexNormals();
    } else {
      const helper = new THREE.BufferGeometry();
      helper.setIndex(surface.index);
      helper.setAttribute("position", attribute);
      helper.computeVertexNormals();
      morphPositions.push(attribute);
      morphNormals.push(helper.getAttribute("normal") as THREE.BufferAttribute);
      // This CPU-only helper has never been uploaded; its attributes are owned by surface.
      helper.dispose();
    }
  }
  surface.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  surface.morphAttributes.position = morphPositions;
  surface.morphAttributes.normal = morphNormals;
  surface.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);
  const metal = new THREE.MeshStandardMaterial({
    color: 0xf25229,
    metalness: 0.64,
    roughness: 0.29,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x20221f,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
  });
  metal.forceSinglePass = true;
  const patch = (material: THREE.Material) => {
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader =
        `uniform float uTime; uniform float uEnergy; uniform float uIntent; uniform float uProject; uniform float uStage; varying vec2 vSignalUv;\n` +
        shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <morphtarget_vertex>",
        `#include <morphtarget_vertex>
        vSignalUv=uv;
        float alive=1.0-smoothstep(4.2,5.0,uStage);
        float ripple=sin(uv.x*37.7-uTime*(.65+uIntent*.12)+uProject*.7)*sin(uv.y*6.283);
        transformed+=normalize(transformed+vec3(.001))*ripple*(.028+uEnergy*.10)*alive;
        transformed.z+=sin(uv.x*18.85+uTime)*uIntent*.055*alive;
        float work=1.0-smoothstep(.15,.85,abs(uStage-1.0));
        transformed.y+=sin(uv.x*(12.56+uProject*3.14))*work*.18;
      `,
      );
      shader.fragmentShader =
        "varying vec2 vSignalUv;\n" + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        roughnessFactor=clamp(roughnessFactor+sin(vSignalUv.x*680.0)*.022,.12,1.0);
      `,
      );
    };
    material.customProgramCacheKey = () => "lowkyz-living-metal-v1";
  };
  patch(metal);
  patch(wireMaterial);
  const sculpture = new THREE.Mesh(surface, metal);
  const cage = new THREE.Mesh(surface, wireMaterial);
  cage.scale.setScalar(1.003);
  sculpture.frustumCulled = false;
  cage.frustumCulled = false;
  actor.add(sculpture, cage);
  const field = new THREE.BufferGeometry();
  const seeds = new Float32Array(count);
  const strokeIds = new Int16Array(count);
  for (let shape = 0; shape < 6; shape++) {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const stroke = fieldPoint(shape, i / (count - 1), coords, i * 3);
      if (shape === 5) strokeIds[i] = stroke;
      if (shape === 0) seeds[i] = i / count;
    }
    field.setAttribute(
      shape === 0 ? "position" : `aShape${shape}`,
      new THREE.BufferAttribute(coords, 3),
    );
  }
  field.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  field.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);
  const filaments = new THREE.BufferGeometry();
  for (const name in field.attributes)
    filaments.setAttribute(name, field.attributes[name]);
  const connections: number[] = [];
  for (let i = 0; i < count - 1; i++)
    if (strokeIds[i] === strokeIds[i + 1] && i % 40 < 39)
      connections.push(i, i + 1);
  filaments.setIndex(connections);
  const fieldColor = new THREE.Color(0x20221f);
  const pointOpacity = { value: 0.8 },
    lineOpacity = { value: 0.3 };
  const pointMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ...uniforms,
      uColor: { value: fieldColor },
      uOpacity: pointOpacity,
    },
    vertexShader: fieldVertex,
    fragmentShader: pointFragment,
    transparent: true,
    depthWrite: false,
  });
  const lineMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ...uniforms,
      uColor: { value: fieldColor },
      uOpacity: lineOpacity,
    },
    vertexShader: fieldVertex,
    fragmentShader: lineFragment,
    transparent: true,
    depthWrite: false,
  });
  const particles = new THREE.Points(field, pointMaterial);
  const lines = new THREE.LineSegments(filaments, lineMaterial);
  particles.frustumCulled = false;
  lines.frustumCulled = false;
  actor.add(particles, lines);
  // Small instanced shards occupy depth rather than adding separate scene graphs.
  const shardGeometry = new THREE.TetrahedronGeometry(0.065);
  const shardMaterial = new THREE.MeshStandardMaterial({
    color: 0x20221f,
    metalness: 0.72,
    roughness: 0.38,
    transparent: true,
  });
  const shardCount = quality === "full" ? 64 : 28;
  const shards = new THREE.InstancedMesh(
    shardGeometry,
    shardMaterial,
    shardCount,
  );
  shards.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  shards.frustumCulled = false;
  actor.add(shards);
  const dummy = new THREE.Object3D();
  const anchor = new THREE.Vector3(),
    ray = new THREE.Vector3(),
    origin = new THREE.Vector3();
  const baseColor = new THREE.Color(0xf25229),
    targetColor = new THREE.Color();
  const pointer = new THREE.Vector2();
  const scratch = new Float32Array(3);
  let width = 0,
    height = 0,
    dpr = 0,
    nativeDpr = 0,
    disposed = false,
    lost = false,
    failed = false,
    restores = 0;
  let seen = true,
    ready = false,
    elapsed = 0,
    renderElapsed = 100,
    averageFrame = 16.7,
    samples = 0,
    lastDrop = 0;
  let qualityLevel = quality === "low" ? 2 : quality === "mobile" ? 1 : 0;
  const report = () => {
    canvas.dataset.geometries = String(renderer.info.memory.geometries);
    canvas.dataset.textures = String(renderer.info.memory.textures);
    canvas.dataset.programs = String(renderer.info.programs?.length ?? 0);
    canvas.dataset.drawCalls = String(renderer.info.render.calls);
    canvas.dataset.dpr = renderer.getPixelRatio().toFixed(2);
    canvas.dataset.quality = ["full", "balanced", "low"][
      Math.max(qualityLevel, width > 0 && width <= 760 ? 1 : 0)
    ];
  };
  const resize = (w: number, h: number) => {
    width = w;
    height = h;
    const effectiveLevel = Math.max(qualityLevel, w <= 760 ? 1 : 0);
    const cap = effectiveLevel === 0 ? 1.6 : effectiveLevel === 1 ? 1.15 : 0.8;
    const budget =
      effectiveLevel === 0 ? 2600000 : effectiveLevel === 1 ? 1000000 : 520000;
    nativeDpr = devicePixelRatio || 1;
    const limit = Math.min(
      renderer.capabilities.maxTextureSize,
      context.getParameter(context.MAX_RENDERBUFFER_SIZE) as number,
    );
    dpr = Math.min(
      nativeDpr,
      cap,
      Math.sqrt(budget / (w * h)),
      limit / w,
      limit / h,
    );
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    uniforms.uDpr.value = dpr;
    report();
  };
  renderer.debug.onShaderError = () => {
    failed = true;
    status("failed");
  };
  const visibility = () => {
    if (document.hidden) canvas.dataset.running = "false";
  };
  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    ready = false;
    canvas.dataset.running = "false";
    status("lost");
  };
  const onRestored = () => {
    restores++;
    if (disposed || restores > 2) {
      failed = true;
      status("failed");
      return;
    }
    lost = false;
    width = 0;
    samples = 0;
    averageFrame = 16.7;
    renderElapsed = 100;
  };
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);
  document.addEventListener("visibilitychange", visibility);
  const observer = new IntersectionObserver((entries) => {
    seen = entries[0]?.isIntersecting ?? false;
    if (!seen) canvas.dataset.running = "false";
  });
  observer.observe(canvas);
  return {
    update(frame, input) {
      if (disposed || failed) return false;
      if (lost || !seen || document.hidden || !input.visible) {
        canvas.dataset.running = "false";
        if (!input.visible) canvas.style.visibility = "hidden";
        return true;
      }
      renderElapsed += frame.delta;
      const interval =
        qualityLevel === 0 && frame.width > 760 ? 1000 / 60 : 1000 / 30;
      if (renderElapsed + 0.5 < interval) return true;
      const delta = Math.min(renderElapsed, 80);
      renderElapsed = 0;
      elapsed += delta * 0.001;
      if (
        width !== frame.width ||
        height !== frame.height ||
        nativeDpr !== (devicePixelRatio || 1)
      )
        resize(frame.width, frame.height);
      averageFrame = averageFrame * 0.97 + frame.delta * 0.03;
      samples++;
      if (
        samples > 150 &&
        elapsed - lastDrop > 3 &&
        averageFrame > (qualityLevel === 0 ? 28 : 43)
      ) {
        if (qualityLevel < 2) {
          qualityLevel++;
          resize(width, height);
          lastDrop = elapsed;
          samples = 0;
        } else if (averageFrame > 58) {
          failed = true;
          status("failed");
          return false;
        }
      }
      const ease = 1 - Math.exp(-delta / 160);
      const targetX =
        frame.pointerInside && frame.pointerType !== "touch"
          ? (frame.pointerX / frame.width) * 2 - 1
          : 0;
      const targetY =
        frame.pointerInside && frame.pointerType !== "touch"
          ? 1 - (frame.pointerY / frame.height) * 2
          : 0;
      pointer.x = mix(pointer.x, targetX, ease);
      pointer.y = mix(pointer.y, targetY, ease);
      uniforms.uPointer.value.copy(pointer);
      uniforms.uEnergy.value = mix(
        uniforms.uEnergy.value,
        Math.min(1.3, Math.abs(frame.velocity) * 0.18 + input.pulse),
        ease,
      );
      uniforms.uIntent.value = mix(uniforms.uIntent.value, input.intent, ease);
      uniforms.uProject.value = mix(
        uniforms.uProject.value,
        input.project,
        ease,
      );
      uniforms.uStage.value = input.stage;
      uniforms.uTime.value = elapsed;
      const from = Math.min(5, Math.floor(input.stage)),
        to = Math.min(5, from + 1),
        blend = input.stage - from;
      for (let i = 0; i < 5; i++) {
        const influence =
          (from === i + 1 ? 1 - blend : 0) + (to === i + 1 ? blend : 0);
        sculpture.morphTargetInfluences![i] = influence;
        cage.morphTargetInfluences![i] = influence;
      }
      const final = THREE.MathUtils.smoothstep(input.stage, 4.15, 5);
      const baseAlpha =
        input.stage < 1 ? input.opacity : Math.min(0.32, input.opacity * 1.45);
      const fracture =
        1 - THREE.MathUtils.smoothstep(Math.abs(input.stage - 3), 0.05, 0.8);
      metal.opacity = baseAlpha * (1 - final) * (1 - fracture * 0.85);
      metal.depthWrite = metal.opacity > 0.65;
      metal.roughness = mix(0.31, 0.18, Math.min(1, uniforms.uEnergy.value));
      targetColor.set(
        input.stage > 0.65 && input.stage < 1.8
          ? projectColors[input.project]
          : 0xf25229,
      );
      baseColor.lerp(targetColor, ease);
      metal.color.copy(baseColor);
      fieldColor.set(input.darkInk ? 0x20221f : 0xeeece4);
      wireMaterial.color.copy(fieldColor);
      shardMaterial.color.copy(fieldColor);
      wireMaterial.opacity =
        baseAlpha *
        (0.035 + Math.sin((input.stage * Math.PI) / 5) * 0.35) *
        (1 - final);
      cage.visible = qualityLevel < 2 && input.stage < 4.98;
      sculpture.visible = input.stage < 4.999;
      pointOpacity.value = Math.min(
        0.8 - final * 0.32,
        baseAlpha * 1.3 + final * 0.22,
      );
      lineOpacity.value = Math.min(0.36, baseAlpha * 0.14 + final * 0.25);
      shardMaterial.opacity =
        baseAlpha * 0.65 * Math.sin((input.stage / 5) * Math.PI);
      shards.visible =
        qualityLevel < 2 && input.stage > 0.2 && input.stage < 4.85;
      const work =
        1 - THREE.MathUtils.smoothstep(Math.abs(input.stage - 1), 0.15, 0.85);
      key.intensity = mix(
        4.2,
        2.2 + Math.sin(input.stage) * 0.8,
        Math.min(1, input.stage),
      );
      rim.intensity = 2.5 + Math.sin(input.stage * 1.8) * 1.2;
      fill.color.set(input.darkInk ? 0xc5ded6 : 0xffbe90);
      metal.metalness = 0.5 + Math.cos(input.stage * 1.4) * 0.18;
      camera.position.set(
        pointer.x * 0.3 + Math.sin(uniforms.uProject.value * 1.4) * work * 0.28,
        pointer.y * 0.22,
        mix(cameraDepth[from], cameraDepth[to], blend) +
          uniforms.uEnergy.value * 0.18 +
          work * uniforms.uProject.value * 0.12,
      );
      camera.lookAt(origin);
      camera.rotation.z = pointer.x * 0.018;
      camera.updateMatrixWorld();
      const engineering =
        1 - THREE.MathUtils.smoothstep(Math.abs(input.stage - 2), 0.05, 0.8);
      const screenX = mix(
        mix(input.x, frame.width * (frame.width <= 760 ? 0.76 : 0.78), work),
        frame.width * (frame.width <= 760 ? 0.5 : 0.68),
        final,
      );
      const screenY = mix(
        mix(input.y, frame.height * 0.22, work),
        frame.height * 0.79,
        engineering,
      );
      const sceneScale =
        input.scale * mix(1, 0.67, work) * mix(1, 0.76, engineering);
      ray
        .set(
          (screenX / frame.width) * 2 - 1,
          1 - (screenY / frame.height) * 2,
          0.5,
        )
        .unproject(camera)
        .sub(camera.position)
        .normalize();
      anchor
        .copy(camera.position)
        .addScaledVector(ray, -camera.position.z / ray.z);
      actor.position.copy(anchor);
      const worldHeight =
        2 *
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
        camera.position.z;
      const signatureFit = Math.min(
        1,
        (frame.width * (frame.width <= 760 ? 0.82 : 0.56)) /
          ((600 * sceneScale * 5.4) / 4.7),
      );
      actor.scale.setScalar(
        (((worldHeight / frame.height) * 600 * sceneScale) / 4.7) *
          mix(1, signatureFit, final),
      );
      actor.rotation.set(
        0.32 + pointer.y * 0.22 + Math.sin(input.stage) * 0.25,
        pointer.x * 0.3 + Math.sin(elapsed * 0.16) * 0.14 * (1 - final),
        -0.52 * (1 - final) + Math.sin(input.stage * 1.4) * 0.32 * (1 - final),
      );
      if (shards.visible) {
        for (let i = 0; i < shardCount; i++) {
          fieldPoint(from, i / (shardCount - 1), scratch, 0);
          dummy.position.set(
            scratch[0] * 1.25,
            scratch[1] * 1.25,
            scratch[2] + Math.sin(i * 2.4 + elapsed * 0.25) * 0.6,
          );
          dummy.rotation.set(i * 0.3 + elapsed * 0.1, i * 1.7, i * 0.7);
          dummy.scale.setScalar(0.6 + (i % 5) * 0.18);
          dummy.updateMatrix();
          shards.setMatrixAt(i, dummy.matrix);
        }
        shards.instanceMatrix.needsUpdate = true;
      }
      renderer.render(scene, camera);
      if (failed) return false;
      canvas.style.visibility = "visible";
      canvas.dataset.running = "true";
      if (!ready) {
        ready = true;
        status("webgl");
        report();
      }
      if (samples % 30 === 0) {
        report();
        canvas.dataset.stage = input.stage.toFixed(3);
        canvas.dataset.project = String(input.project);
        canvas.dataset.intent = String(input.intent);
        canvas.dataset.pointer = `${pointer.x.toFixed(3)},${pointer.y.toFixed(3)}`;
        canvas.dataset.view = `${camera.position.x.toFixed(3)},${camera.position.y.toFixed(3)},${camera.position.z.toFixed(3)}`;
        canvas.dataset.frames = String(Number(canvas.dataset.frames || 0) + 30);
      }
      return true;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      document.removeEventListener("visibilitychange", visibility);
      surface.dispose();
      field.dispose();
      filaments.dispose();
      shardGeometry.dispose();
      shards.dispose();
      metal.dispose();
      wireMaterial.dispose();
      pointMaterial.dispose();
      lineMaterial.dispose();
      shardMaterial.dispose();
      scene.clear();
      renderer.renderLists.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.dataset.running = "false";
      canvas.dataset.disposed = "true";
      report();
      canvas.remove();
    },
  };
}
