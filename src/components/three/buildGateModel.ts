import * as THREE from 'three';

export interface GateLeaf {
  /** Group sitting at the hinge post; rotating it swings the leaf. */
  pivot: THREE.Group;
  /** Leaf contents, already offset inward toward the centre of the opening. */
  inner: THREE.Group;
  /** One group per vertical infill bar, animated during the cutaway. */
  bars: THREE.Group[];
  side: 1 | -1;
}

export interface GateModel {
  /** The fabricated gate itself — this is what turntables. */
  root: THREE.Group;
  /** Ground plane, contact shadow and survey grid — stays put. */
  stage: THREE.Group;
  left: GateLeaf;
  right: GateLeaf;
  headerPlate: THREE.Object3D;
  conduit: THREE.Object3D;
  dispose: () => void;
}

export const LEAF_WIDTH = 2.42;
export const LEAF_HEIGHT = 2.3;

function makeBrushedTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i += 1) {
      const y = Math.random() * 256;
      const alpha = Math.random() * 0.22;
      const shade = Math.random() > 0.5 ? 255 : 0;
      ctx.strokeStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
      ctx.lineWidth = Math.random() * 1.2 + 0.2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  texture.anisotropy = 4;
  return texture;
}

function makeShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 8, 128, 128, 126);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
    gradient.addColorStop(0.55, 'rgba(0, 0, 0, 0.45)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedurally builds the steel driveway gate:
 * two fabricated leaves on hinge posts, ornamental infill bars, a caution-yellow
 * header plate, service conduit and a survey grid floor.
 */
export function buildGateModel(): GateModel {
  const root = new THREE.Group();
  const stage = new THREE.Group();

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  const brushed = track(makeBrushedTexture());
  const shadowTexture = track(makeShadowTexture());

  const material = (options: THREE.MeshStandardMaterialParameters) =>
    track(new THREE.MeshStandardMaterial(options));

  const steelDark = material({ color: 0x151515, metalness: 0.85, roughness: 0.42 });
  const steelMid = material({ color: 0x3a3a3a, metalness: 0.9, roughness: 0.3 });
  const steelLight = material({
    color: 0x8b8b8b,
    metalness: 1,
    roughness: 0.32,
    roughnessMap: brushed,
  });
  const steelBright = material({ color: 0xb8b8b8, metalness: 1, roughness: 0.22 });
  const caution = material({
    color: 0xfff313,
    metalness: 0,
    roughness: 0.9,
    emissive: 0xfff313,
    emissiveIntensity: 0.32,
  });

  const box = (
    width: number,
    height: number,
    depth: number,
    meshMaterial: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => {
    const geometry = track(new THREE.BoxGeometry(width, height, depth));
    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  const cylinder = (
    radius: number,
    height: number,
    meshMaterial: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => {
    const geometry = track(new THREE.CylinderGeometry(radius, radius, height, 14));
    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  /* ---------------------------------------------------------------- */
  /* Stage: ground plane, contact shadow, survey grid                  */
  /* ---------------------------------------------------------------- */

  const groundGeometry = track(new THREE.PlaneGeometry(48, 48));
  const groundMaterial = material({ color: 0x040404, roughness: 1, metalness: 0 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  stage.add(ground);

  const shadowGeometry = track(new THREE.PlaneGeometry(9.4, 5.4));
  const shadowMaterial = track(
    new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    }),
  );
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.012;
  stage.add(shadow);

  const grid = new THREE.GridHelper(18, 36, 0x2c2c2c, 0x141414);
  grid.position.y = 0.02;
  const gridMaterial = Array.isArray(grid.material) ? grid.material[0] : grid.material;
  gridMaterial.transparent = true;
  gridMaterial.opacity = 0.55;
  gridMaterial.depthWrite = false;
  gridMaterial.polygonOffset = true;
  gridMaterial.polygonOffsetFactor = -1;
  stage.add(grid);

  /* ---------------------------------------------------------------- */
  /* Fixed structure: posts, footings, header, conduit                 */
  /* ---------------------------------------------------------------- */

  root.add(box(0.2, 2.9, 0.2, steelDark, -2.62, 1.45, 0));
  root.add(box(0.2, 2.9, 0.2, steelDark, 2.62, 1.45, 0));

  root.add(box(0.44, 0.07, 0.44, steelMid, -2.62, 0.035, 0));
  root.add(box(0.44, 0.07, 0.44, steelMid, 2.62, 0.035, 0));
  root.add(box(0.3, 0.045, 0.3, caution, -2.62, 0.09, 0));
  root.add(box(0.3, 0.045, 0.3, caution, 2.62, 0.09, 0));

  const headerPlate = box(1.4, 0.14, 0.06, caution, 0, 2.62, 0.14);
  root.add(box(5.55, 0.1, 0.12, steelMid, 0, 2.74, 0));
  root.add(box(2.6, 0.045, 0.02, caution, 0, 2.685, 0.07));
  root.add(headerPlate);

  /* Continuous bottom track the leaves run above. */
  root.add(box(5.5, 0.035, 0.07, steelDark, 0, 0.03, 0.04));

  /* Right-side service conduit with caution couplings. */
  const conduit = new THREE.Group();
  conduit.add(box(0.07, 2.35, 0.07, steelMid, 0, 1.2, 0));
  for (let i = 0; i < 4; i += 1) {
    conduit.add(cylinder(0.055, 0.05, caution, 0, 0.35 + i * 0.55, 0));
  }
  conduit.position.set(2.78, 0, 0.16);
  root.add(conduit);

  /* ---------------------------------------------------------------- */
  /* Leaves                                                            */
  /* ---------------------------------------------------------------- */

  const buildLeaf = (side: 1 | -1): GateLeaf => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 2.5, 0.06, 0);
    root.add(pivot);

    const inner = new THREE.Group();
    // Hinge is at the outer post, so the leaf extends toward the centre.
    inner.position.x = -side * (LEAF_WIDTH / 2);
    pivot.add(inner);

    const topRail = box(LEAF_WIDTH, 0.09, 0.11, steelMid, 0, LEAF_HEIGHT, 0);
    const bottomRail = box(LEAF_WIDTH, 0.08, 0.11, steelMid, 0, 0.04, 0);
    const midRail = box(LEAF_WIDTH, 0.055, 0.08, steelDark, 0, LEAF_HEIGHT * 0.63, 0);
    inner.add(topRail, bottomRail, midRail);

    // Stiles: outer (hinge side) and inner (meeting) verticals.
    inner.add(
      box(0.07, LEAF_HEIGHT, 0.11, steelMid, LEAF_WIDTH / 2 - 0.035, LEAF_HEIGHT / 2, 0),
    );
    inner.add(
      box(0.07, LEAF_HEIGHT, 0.11, steelMid, -LEAF_WIDTH / 2 + 0.035, LEAF_HEIGHT / 2, 0),
    );

    const bars: THREE.Group[] = [];
    const barCount = 9;
    const span = LEAF_WIDTH - 0.46;
    for (let i = 0; i < barCount; i += 1) {
      const bar = new THREE.Group();
      const x = -span / 2 + (i / (barCount - 1)) * span;
      bar.position.set(x, 0, 0);
      bar.add(box(0.032, LEAF_HEIGHT - 0.18, 0.032, steelLight, 0, LEAF_HEIGHT / 2, 0));
      bar.add(box(0.075, 0.075, 0.075, caution, 0, LEAF_HEIGHT - 0.075, 0));
      bar.add(box(0.06, 0.05, 0.06, steelBright, 0, 0.13, 0));
      bars.push(bar);
      inner.add(bar);
    }

    for (const ringY of [LEAF_HEIGHT * 0.36, LEAF_HEIGHT * 0.78]) {
      for (const ringX of [-0.46, 0.46]) {
        const ringGeometry = track(new THREE.TorusGeometry(0.14, 0.011, 8, 22));
        const ring = new THREE.Mesh(ringGeometry, steelBright);
        ring.position.set(ringX, ringY, 0);
        ring.castShadow = true;
        inner.add(ring);
      }
    }

    /* Hinge barrels on the post edge. */
    pivot.add(cylinder(0.048, 0.26, steelBright, 0, 0.58, 0.09));
    pivot.add(cylinder(0.048, 0.26, steelBright, 0, 1.72, 0.09));
    pivot.add(cylinder(0.06, 0.05, caution, 0, 0.44, 0.09));
    pivot.add(cylinder(0.06, 0.05, caution, 0, 1.86, 0.09));

    /* Free edge is the meeting stile in the middle of the opening. */
    const freeEdge = -side * (LEAF_WIDTH / 2);

    if (side === -1) {
      // Latch and handle live on the left leaf, which closes second.
      inner.add(box(0.1, 0.26, 0.1, caution, freeEdge + 0.05, 1.12, 0.12));
      inner.add(cylinder(0.025, 0.42, steelBright, freeEdge + 0.05, 0.92, 0.16));
    } else {
      inner.add(box(0.08, 0.3, 0.08, steelMid, freeEdge + 0.04, 1.12, 0.08));
    }

    return { pivot, inner, bars, side };
  };

  const left = buildLeaf(-1);
  const right = buildLeaf(1);

  const dispose = () => {
    disposables.forEach((item) => item.dispose());
    disposables.length = 0;
  };

  return { root, stage, left, right, headerPlate, conduit, dispose };
}
