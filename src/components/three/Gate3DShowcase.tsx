import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RotateCcw } from 'lucide-react';
import { buildGateModel, LEAF_HEIGHT, type GateModel } from './buildGateModel';
import { ResilientImage } from '../ResilientImage';
import { IMAGES } from '../../data/metalBridgesData';

gsap.registerPlugin(ScrollTrigger);

type CameraPreset = 'scroll' | 'isometric' | 'front' | 'closeup';

const PRESETS: { id: CameraPreset; label: string }[] = [
  { id: 'scroll', label: 'Scroll Cam' },
  { id: 'isometric', label: 'Isometric' },
  { id: 'front', label: 'Front' },
  { id: 'closeup', label: 'Closeup' },
];

const PHASES = [
  {
    index: '01',
    title: 'Welded Steel Frame',
    description:
      '50 × 50 mm box-section frame, jig-tacked square and checked diagonally before the full weld.',
    start: 0,
  },
  {
    index: '02',
    title: 'Ornamental Infill Array',
    description:
      'Nine vertical bars set out from a centre line, each levelled to the same datum for clean shadow lines.',
    start: 0.33,
  },
  {
    index: '03',
    title: 'Hinge, Latch & Finish',
    description:
      'Heavy-duty hinge barrels, multi-point latch and powder-coated finish fitted before handover.',
    start: 0.72,
  },
];

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'),
    );
  } catch {
    return false;
  }
}

function detectSoftwareWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) return true;
    const extension = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = extension
      ? String(gl.getParameter(extension.UNMASKED_RENDERER_WEBGL) ?? '')
      : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    return true;
  }
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

interface OrbitParams {
  yaw: number;
  pitch: number;
  distance: number;
  centerX: number;
  centerY: number;
}

function idealOrbit(
  preset: CameraPreset,
  progress: number,
  dragYaw: number,
  dragPitch: number,
): OrbitParams {
  switch (preset) {
    case 'isometric':
      return {
        yaw: 0.86 + dragYaw,
        pitch: 0.5 + dragPitch,
        distance: 11.6,
        centerX: 0,
        centerY: 1.35,
      };
    case 'front':
      return {
        yaw: 0 + dragYaw,
        pitch: 0.07 + dragPitch,
        distance: 10.6,
        centerX: 0,
        centerY: 1.5,
      };
    case 'closeup':
      return {
        yaw: 0.56 + dragYaw,
        pitch: 0.1 + dragPitch,
        distance: 6.5,
        centerX: 0.9,
        centerY: 1.5,
      };
    case 'scroll':
    default:
      return {
        yaw: -0.55 + progress * 1.75 + dragYaw,
        pitch: 0.17 + progress * 0.04 + dragPitch,
        distance: 10.4 - progress * 1.6,
        centerX: 0,
        centerY: 1.42,
      };
  }
}

export function Gate3DShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const modelRef = useRef<GateModel | null>(null);
  const overrideRef = useRef<number | null>(null);
  const requestRenderRef = useRef<() => void>(() => undefined);
  const jumpToRef = useRef<(progress: number) => void>(() => undefined);
  const phaseRef = useRef(0);

  const [fallback] = useState(() => prefersReducedMotion() || !supportsWebGL());
  const [dockOpen, setDockOpen] = useState(true);
  const [preset, setPreset] = useState<CameraPreset>('scroll');
  const [cutaway, setCutaway] = useState(0);
  const [manual, setManual] = useState(false);
  const [percent, setPercent] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const presetRef = useRef<CameraPreset>('scroll');
  const dragRef = useRef({ yaw: 0, pitch: 0 });

  const setCameraPreset = useCallback((next: CameraPreset) => {
    presetRef.current = next;
    setPreset(next);
    requestRenderRef.current();
  }, []);

  useEffect(() => {
    if (fallback) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!section || !stage || !canvas) return;

    const software = detectSoftwareWebGL();

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !software,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setPixelRatio(software ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !software;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.028);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120);
    camera.position.set(0, 3, 10);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envTexture = pmrem.fromScene(room, 0.04).texture;
    scene.environment = envTexture;
    room.dispose();
    pmrem.dispose();

    const model = buildGateModel();
    modelRef.current = model;
    scene.add(model.stage, model.root);

    const hemisphere = new THREE.HemisphereLight(0xbfd0e0, 0x0a0a0a, 0.55);
    scene.add(hemisphere);

    const key = new THREE.DirectionalLight(0xfff1cf, 2.1);
    key.position.set(6, 9, 7);
    if (!software) {
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = -6;
      key.shadow.camera.right = 6;
      key.shadow.camera.top = 7;
      key.shadow.camera.bottom = -1;
      key.shadow.camera.near = 1;
      key.shadow.camera.far = 26;
      key.shadow.bias = -0.0006;
    }
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x9fb6ff, 0.55);
    fill.position.set(-7, 4, -5);
    scene.add(fill);

    const rim = new THREE.PointLight(0xfff313, 14, 18, 1.6);
    rim.position.set(0, LEAF_HEIGHT + 0.4, 2.4);
    scene.add(rim);

    /* -------------------------------------------------------------- */
    /* Render state                                                    */
    /* -------------------------------------------------------------- */

    const state = {
      progress: 0,
      display: 0,
      yaw: -0.55,
      pitch: 0.17,
      distance: 10.4,
      centerX: 0,
      centerY: 1.42,
      dragging: false,
      pointerId: -1,
      lastX: 0,
      lastY: 0,
    };

    let raf = 0;
    let running = false;
    let lastTime = performance.now();
    let disposed = false;

    const resize = () => {
      const width = stage.clientWidth || 1;
      const height = stage.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      requestRender();
    };

    const effectiveProgress = () =>
      overrideRef.current === null
        ? state.progress
        : clamp01(overrideRef.current / 100);

    const applyPose = (progress: number) => {
      const open = clamp01(progress / 0.55);
      const easedOpen = open * open * (3 - 2 * open);
      model.left.pivot.rotation.y = -easedOpen * 1.62;
      model.right.pivot.rotation.y = easedOpen * 1.62;

      const barAmount = clamp01((progress - 0.24) / 0.52);
      model.left.bars.forEach((bar, index) => {
        const stagger = clamp01(barAmount * 1.6 - index * 0.05);
        bar.position.z = stagger * 0.38;
        bar.rotation.x = stagger * 0.06;
      });
      model.right.bars.forEach((bar, index) => {
        const stagger = clamp01(barAmount * 1.6 - index * 0.05);
        bar.position.z = stagger * 0.38;
        bar.rotation.x = stagger * 0.06;
      });

      const hardware = clamp01((progress - 0.62) / 0.38);
      model.headerPlate.position.y = 2.62 + hardware * 0.4;
      model.headerPlate.rotation.z = hardware * 0.12;
      model.conduit.position.x = 2.78 + hardware * 0.45;

      const showTop = Math.min(1, Math.max(0, progress));
      rim.position.set(
        -3.6 + showTop * 7.2,
        LEAF_HEIGHT + 0.6 + Math.sin(showTop * Math.PI) * 1.2,
        2.6 - showTop * 1.4,
      );
    };

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const target = effectiveProgress();
      state.display = THREE.MathUtils.damp(state.display, target, 7, dt);

      const ideal = idealOrbit(
        presetRef.current,
        state.display,
        dragRef.current.yaw,
        dragRef.current.pitch,
      );
      state.yaw = THREE.MathUtils.damp(state.yaw, ideal.yaw, 5, dt);
      state.pitch = THREE.MathUtils.damp(state.pitch, ideal.pitch, 5, dt);
      state.distance = THREE.MathUtils.damp(state.distance, ideal.distance, 5, dt);
      state.centerX = THREE.MathUtils.damp(state.centerX, ideal.centerX, 5, dt);
      state.centerY = THREE.MathUtils.damp(state.centerY, ideal.centerY, 5, dt);

      const horizontal = Math.cos(state.pitch) * state.distance;
      camera.position.set(
        state.centerX + Math.sin(state.yaw) * horizontal,
        state.centerY + Math.sin(state.pitch) * state.distance,
        Math.cos(state.yaw) * horizontal,
      );
      camera.lookAt(state.centerX, 1.45, 0);

      applyPose(state.display);
      model.root.rotation.y = state.yaw * 0.35;

      renderer.render(scene, camera);

      const settled =
        Math.abs(state.display - target) < 0.0012 &&
        Math.abs(state.yaw - ideal.yaw) < 0.0012 &&
        Math.abs(state.pitch - ideal.pitch) < 0.0012 &&
        Math.abs(state.distance - ideal.distance) < 0.004 &&
        Math.abs(state.centerX - ideal.centerX) < 0.004 &&
        Math.abs(state.centerY - ideal.centerY) < 0.004;

      if (settled && !state.dragging) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const requestRender = () => {
      if (disposed || running) return;
      running = true;
      lastTime = performance.now();
      raf = requestAnimationFrame(tick);
    };

    requestRenderRef.current = requestRender;

    /* -------------------------------------------------------------- */
    /* Scroll choreography                                             */
    /* -------------------------------------------------------------- */

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        state.progress = self.progress;
        setPercent(Math.round(self.progress * 100));
        if (overrideRef.current === null) {
          const index =
            self.progress >= 0.72 ? 2 : self.progress >= 0.33 ? 1 : 0;
          if (index !== phaseRef.current) {
            phaseRef.current = index;
            setPhaseIndex(index);
          }
        }
        requestRender();
      },
    });

    jumpToRef.current = (progress: number) => {
      const travel = section.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const top = section.offsetTop + travel * clamp01(progress);
      window.scrollTo({ top, behavior: 'smooth' });
    };

    /* -------------------------------------------------------------- */
    /* Pointer drag                                                    */
    /* -------------------------------------------------------------- */

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      state.dragging = true;
      state.pointerId = event.pointerId;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = 'grabbing';
      requestRender();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      dragRef.current.yaw += dx * 0.006;
      dragRef.current.pitch = THREE.MathUtils.clamp(
        dragRef.current.pitch - dy * 0.004,
        -0.32,
        0.55,
      );
      requestRender();
    };

    const endDrag = (event: PointerEvent) => {
      if (!state.dragging || (event && event.pointerId !== state.pointerId)) return;
      state.dragging = false;
      canvas.style.cursor = 'grab';
      if (canvas.hasPointerCapture(state.pointerId)) {
        canvas.releasePointerCapture(state.pointerId);
      }
      requestRender();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    canvas.style.cursor = 'grab';

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);

    resize();
    ScrollTrigger.refresh();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      scrollTrigger.kill();
      jumpToRef.current = () => undefined;
      requestRenderRef.current = () => undefined;
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', endDrag);
      canvas.removeEventListener('pointercancel', endDrag);
      model.dispose();
      modelRef.current = null;
      envTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [fallback]);

  const onCutaway = (value: number) => {
    setCutaway(value);
    setManual(true);
    overrideRef.current = value;
    const index = value >= 72 ? 2 : value >= 33 ? 1 : 0;
    phaseRef.current = index;
    setPhaseIndex(index);
    requestRenderRef.current();
  };

  const resetView = () => {
    setCutaway(0);
    setManual(false);
    overrideRef.current = null;
    dragRef.current.yaw = 0;
    dragRef.current.pitch = 0;
    setCameraPreset('scroll');
    requestRenderRef.current();
  };

  if (fallback) {
    return (
      <section id="structure" className="relative w-full bg-black px-6 py-24 md:px-10">
        <div className="mx-auto grid w-full max-w-[1360px] gap-10 md:grid-cols-2 md:items-center">
          <ResilientImage
            src={IMAGES.gates}
            alt="Modern steel sliding gate with geometric infill"
            className="aspect-[4/3] w-full rounded-[16px] border border-[#4b4b4b]"
            label="Gate visual unavailable"
          />
          <div>
            <span className="type-mono text-[#fff313]">Craft · Structural breakdown</span>
            <h2 className="type-heading-lg mt-4 text-[#eeeeee]">
              Every gate is built in layers.
            </h2>
            <p className="type-body mt-4 max-w-[440px] text-[#afafaf]">
              Frame first, infill second, hardware and finish last. The interactive
              cutaway is paused because reduced motion is enabled on this device.
            </p>
            <ol className="mt-8 space-y-4">
              {PHASES.map((phase) => (
                <li key={phase.index} className="flex gap-4 border-t border-[#4b4b4b] pt-4">
                  <span className="type-mono text-[#fff313]">{phase.index}</span>
                  <div>
                    <p className="type-body text-[#eeeeee]">{phase.title}</p>
                    <p className="type-body-sm mt-1 text-[#afafaf]">{phase.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  }

  const activePhase = PHASES[phaseIndex];

  return (
    <section
      id="structure"
      ref={sectionRef}
      className="relative h-[240vh] w-full bg-black md:h-[320vh]"
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-screen min-h-[640px] w-full overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full touch-pan-y"
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-6 top-24 max-w-[300px] md:left-10 md:top-28">
            <span className="type-mono text-[#fff313]">
              {activePhase.index} · Interactive cutaway
            </span>
            <h2 className="type-heading-lg mt-3 text-[#eeeeee]">{activePhase.title}</h2>
            <p className="type-body-sm mt-3 text-[#afafaf]">{activePhase.description}</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-px w-32 bg-[#4b4b4b]">
                <div
                  className="h-px bg-[#fff313] transition-[width] duration-150"
                  style={{ width: `${manual ? cutaway : percent}%` }}
                />
              </div>
              <span className="type-mono tabular-nums text-[#afafaf]">
                {String(manual ? cutaway : percent).padStart(3, '0')}%
              </span>
            </div>
          </div>

          <div className="absolute right-6 top-24 flex flex-col items-end gap-1 md:right-10 md:top-28">
            {PHASES.map((phase, index) => (
              <button
                key={phase.index}
                type="button"
                onClick={() => {
                  setManual(false);
                  setCutaway(Math.round(phase.start * 100));
                  overrideRef.current = null;
                  jumpToRef.current(phase.start + 0.02);
                }}
                className={`pointer-events-auto type-mono min-h-9 rounded-[6px] border px-3 text-left transition-colors duration-200 ${
                  index === phaseIndex
                    ? 'border-[#fff313]/60 bg-[#333333] text-[#fff313]'
                    : 'border-transparent bg-[#1a1a1a]/80 text-[#afafaf] hover:border-[#4b4b4b] hover:text-[#eeeeee]'
                }`}
              >
                {phase.index}
              </button>
            ))}
          </div>

          <div className="pointer-events-auto absolute inset-x-0 bottom-5 flex justify-center px-4">
            <div className="w-full max-w-[760px] rounded-[9px] border border-[#4b4b4b] bg-[#141414]/95">
              <button
                type="button"
                onClick={() => setDockOpen((value) => !value)}
                className="type-mono flex min-h-10 w-full items-center justify-between px-4 text-[#afafaf] transition-colors hover:text-[#eeeeee]"
                aria-expanded={dockOpen}
              >
                <span>{dockOpen ? 'Hide controls' : 'Show controls'}</span>
                <span className="tabular-nums">
                  {manual ? 'Manual' : 'Scroll locked'}
                </span>
              </button>

              {dockOpen && (
                <div className="flex flex-col gap-3 border-t border-[#4b4b4b] p-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-1">
                    {PRESETS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCameraPreset(item.id)}
                        className={`type-mono min-h-9 rounded-[6px] border px-3 transition-colors duration-200 ${
                          preset === item.id
                            ? 'border-[#fff313]/60 bg-[#333333] text-[#fff313]'
                            : 'border-[#4b4b4b] bg-[#1a1a1a] text-[#afafaf] hover:text-[#eeeeee]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="gate-cutaway"
                      className="type-mono whitespace-nowrap text-[#afafaf]"
                    >
                      Cutaway
                    </label>
                    <input
                      id="gate-cutaway"
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={cutaway}
                      onChange={(event) => onCutaway(Number(event.target.value))}
                      className="on-range w-28"
                      aria-label="Gate cutaway progress"
                    />
                    <span className="type-mono w-9 tabular-nums text-[#eeeeee]">
                      {cutaway}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={resetView}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#4b4b4b] text-[#eeeeee] transition-colors hover:border-[#fff313]"
                      aria-label="Reset view"
                    >
                      <RotateCcw size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
