/**
 * OFIR BOLOS & DOCES - ATELIER EM PRAIA DE PIPA
 * Real Three.js 3D WebGL Cake Engine (Mathematically Aligned Geometry & Warm Studio Lighting)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DATA DEFINITIONS ---
  const SIZES = [
    { id: 'aro-10', name: 'ARO 10', diameter: '10 cm', slices: '(6-8 fatias)', price: 70, scale: 0.78 },
    { id: 'aro-15', name: 'ARO 15', diameter: '15 cm', slices: '(12-15 fatias)', price: 135, scale: 0.88 },
    { id: 'aro-20', name: 'ARO 20', diameter: '20 cm', slices: '(20-25 fatias)', price: 195, scale: 1.00 },
    { id: 'aro-25', name: 'ARO 25', diameter: '25 cm', slices: '(30-35 fatias)', price: 285, scale: 1.12 },
    { id: 'aro-28', name: 'ARO 28', diameter: '28 cm', slices: '(40-45 fatias)', price: 365, scale: 1.20 },
    { id: 'aro-30', name: 'ARO 30', diameter: '30 cm', slices: '(50-55 fatias)', price: 410, scale: 1.28 }
  ];

  const MASSAS = {
    'branco': {
      name: 'Branco (ovos)',
      desc: 'Massa amanteigada fofa e delicada',
      color: 0xdfbf7a, // Warm golden sponge
      roughness: 0.75
    },
    'chocolate': {
      name: 'Chocolate',
      desc: 'Cacau nobre aveludado e intenso',
      color: 0x3b2215, // Deep rich dutch cocoa
      roughness: 0.78
    }
  };

  const RECHEIOS = {
    'morango': {
      name: 'Morango',
      desc: 'Geleia artesanal de morangos selecionados',
      color: 0xa81a32,
      roughness: 0.32,
      metalness: 0.08,
      eq: 93,
      comp: 82
    },
    'ninho': {
      name: 'Ninho',
      desc: 'Brigadeiro cremoso de puro Leite Ninho',
      color: 0xefe2c8,
      roughness: 0.42,
      metalness: 0.02,
      eq: 96,
      comp: 70
    },
    'chocolate': {
      name: 'Chocolate',
      desc: 'Ganache encorpada de chocolate meio amargo',
      color: 0x221209,
      roughness: 0.25,
      metalness: 0.15,
      eq: 89,
      comp: 89
    },
    'avela': {
      name: 'Avelã',
      desc: 'Creme gianduja com pedacinhos crocantes',
      color: 0x6e3d1c,
      roughness: 0.38,
      metalness: 0.10,
      eq: 97,
      comp: 86
    },
    'coco': {
      name: 'Côco',
      desc: 'Beijinho suave com lascas de coco fresco',
      color: 0xf2eee4,
      roughness: 0.55,
      metalness: 0.02,
      eq: 92,
      comp: 74
    },
    'maracuja': {
      name: 'Maracujá',
      desc: 'Creme aveludado com redução de maracujá',
      color: 0xd4850e,
      roughness: 0.28,
      metalness: 0.08,
      eq: 95,
      comp: 91
    },
    'abacaxi': {
      name: 'Abacaxi',
      desc: 'Compota dourada artesanal com toque cítrico',
      color: 0xc98e18,
      roughness: 0.30,
      metalness: 0.06,
      eq: 94,
      comp: 84
    }
  };

  const TOPPERS = {
    'simples': { name: 'Simples (Incluso)', extra: 0 },
    '3d': { name: 'Especial 3D (+ R$ 35,00)', extra: 35 }
  };

  // --- STATE ---
  let state = {
    sizeIndex: 2, // ARO 20 default
    massa: 'branco',
    recheio: 'avela',
    topper: 'simples',
    cutView: true,
    isRotating: false
  };

  // --- 3D ENGINE SETUP ---
  const container = document.getElementById('webgl-container');
  const canvas = document.getElementById('cake-3d-canvas');

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    36,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 2.5, 5.8);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 4.2;
  controls.maxDistance = 8.5;
  controls.minPolarAngle = Math.PI * 0.15;
  controls.maxPolarAngle = Math.PI * 0.48;
  controls.target.set(0, 0.45, 0);

  // --- WARM STUDIO LIGHTING (BALANCED CONTRAST, NOT OVEREXPOSED) ---
  // Warm subtle ambient fill (prevents pure black shadows without blowing highlights)
  const ambientLight = new THREE.AmbientLight(0x4a433a, 0.40);
  scene.add(ambientLight);

  // Main Key Light (Warm sunlight from top-left-front)
  const keyLight = new THREE.DirectionalLight(0xfff3e5, 0.92);
  keyLight.position.set(-3.2, 5.5, 4.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.bias = -0.0001;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 15;
  keyLight.shadow.camera.left = -3;
  keyLight.shadow.camera.right = 3;
  keyLight.shadow.camera.top = 3;
  keyLight.shadow.camera.bottom = -3;
  scene.add(keyLight);

  // Soft Bounce / Fill Light from right
  const fillLight = new THREE.DirectionalLight(0xdfd3c2, 0.35);
  fillLight.position.set(4.0, 3.0, 2.0);
  scene.add(fillLight);

  // Soft Rim Light from behind
  const rimLight = new THREE.DirectionalLight(0xf4e6d4, 0.45);
  rimLight.position.set(0, 4.0, -4.5);
  scene.add(rimLight);

  // Top Point Light for golden specular shine
  const glintLight = new THREE.PointLight(0xffeed6, 0.45, 5);
  glintLight.position.set(0, 2.8, 0.8);
  scene.add(glintLight);

  // Contact Shadow Plane under pedestal
  const shadowPlaneGeo = new THREE.PlaneGeometry(7, 7);
  const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.16 });
  const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -1.02;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  // --- PEDESTAL STAND (BRASS & CARRARA MARBLE) ---
  const standGroup = new THREE.Group();
  standGroup.position.y = -1.02;

  const brassMaterial = new THREE.MeshStandardMaterial({
    color: 0xba944d,
    metalness: 0.85,
    roughness: 0.26
  });

  // Procedural Carrara Marble Platter Texture
  function generateMarbleCanvas() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#f4f0e8';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(165, 155, 145, 0.18)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 512, 0);
      ctx.bezierCurveTo(
        Math.random() * 512, 170,
        Math.random() * 512, 340,
        Math.random() * 512, 512
      );
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xfaf6ef,
    map: generateMarbleCanvas(),
    roughness: 0.32,
    metalness: 0.04
  });

  // Base Foot
  const footGeo = new THREE.CylinderGeometry(0.82, 0.95, 0.12, 48);
  const footMesh = new THREE.Mesh(footGeo, brassMaterial);
  footMesh.position.y = 0.06;
  footMesh.castShadow = true;
  footMesh.receiveShadow = true;
  standGroup.add(footMesh);

  // Lathe Stem Column
  const stemPoints = [
    new THREE.Vector2(0.75, 0.12),
    new THREE.Vector2(0.38, 0.35),
    new THREE.Vector2(0.18, 0.75),
    new THREE.Vector2(0.17, 1.15),
    new THREE.Vector2(0.30, 1.45),
    new THREE.Vector2(0.68, 1.60)
  ];
  const stemGeo = new THREE.LatheGeometry(stemPoints, 48);
  const stemMesh = new THREE.Mesh(stemGeo, brassMaterial);
  stemMesh.castShadow = true;
  stemMesh.receiveShadow = true;
  standGroup.add(stemMesh);

  // Platter Plate
  const platterGeo = new THREE.CylinderGeometry(1.82, 1.80, 0.14, 64);
  const platter = new THREE.Mesh(platterGeo, marbleMat);
  platter.position.y = 1.67;
  platter.castShadow = true;
  platter.receiveShadow = true;
  standGroup.add(platter);

  // Platter Gold Rim
  const rimGeo = new THREE.TorusGeometry(1.81, 0.024, 16, 64);
  const rim = new THREE.Mesh(rimGeo, brassMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 1.67;
  standGroup.add(rim);

  scene.add(standGroup);

  // --- CAKE 3D MASTER RIG ---
  const cakeMasterGroup = new THREE.Group();
  cakeMasterGroup.position.y = 0.72; // Rests on top of the marble platter
  scene.add(cakeMasterGroup);

  // Shared Dynamic Materials
  // Mascarpone chantininho frosting (warm rich ivory, NOT washed out white)
  const frostingMat = new THREE.MeshStandardMaterial({
    color: 0xede6d8,
    roughness: 0.52,
    metalness: 0.02
  });

  const goldLeafMat = new THREE.MeshStandardMaterial({
    color: 0xdcb865,
    metalness: 0.92,
    roughness: 0.18,
    side: THREE.DoubleSide
  });

  const spongeMat = new THREE.MeshStandardMaterial({
    color: MASSAS[state.massa].color,
    roughness: MASSAS[state.massa].roughness,
    metalness: 0.02
  });

  const fillingMat = new THREE.MeshStandardMaterial({
    color: RECHEIOS[state.recheio].color,
    roughness: RECHEIOS[state.recheio].roughness,
    metalness: RECHEIOS[state.recheio].metalness
  });

  // Cake Dimensions
  const CAKE_RADIUS = 1.40;
  const CAKE_HEIGHT = 1.30;
  // Angles: Cut wedge spans from CUT_START to CUT_END
  const CUT_START = -0.32; // ~ -18 deg
  const CUT_END   =  0.62; // ~ +35 deg
  const SLICE_SPAN = CUT_END - CUT_START;
  const MAIN_SPAN  = Math.PI * 2 - SLICE_SPAN;

  const mainCakeGroup = new THREE.Group();
  cakeMasterGroup.add(mainCakeGroup);

  const sliceGroup = new THREE.Group();
  cakeMasterGroup.add(sliceGroup);

  // =========================================================================
  // MATHEMATICALLY EXACT SECTOR & LAYER BUILDERS (0% MISALIGNMENT / NO BUGS)
  // =========================================================================

  /**
   * Builds the curved outer wall mesh for a sector from startAng to endAng
   */
  function buildSectorOuterWall(radius, height, startAng, endAng, segments = 48) {
    const geo = new THREE.BufferGeometry();
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    const angleRange = endAng - startAng;

    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const a = startAng + u * angleRange;
      const x = radius * Math.sin(a);
      const z = radius * Math.cos(a);

      // Bottom vertex
      positions.push(x, 0, z);
      normals.push(Math.sin(a), 0, Math.cos(a));
      uvs.push(u, 0);

      // Top vertex
      positions.push(x, height, z);
      normals.push(Math.sin(a), 0, Math.cos(a));
      uvs.push(u, 1);
    }

    for (let i = 0; i < segments; i++) {
      const b0 = i * 2;
      const t0 = i * 2 + 1;
      const b1 = (i + 1) * 2;
      const t1 = (i + 1) * 2 + 1;

      // Standard counter-clockwise quad
      indices.push(b0, b1, t1);
      indices.push(b0, t1, t0);
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);

    return new THREE.Mesh(geo, frostingMat);
  }

  /**
   * Builds the top frosting surface sector disk
   */
  function buildSectorCap(radius, y, startAng, endAng, isTop = true, segments = 48) {
    const geo = new THREE.BufferGeometry();
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    const ny = isTop ? 1 : -1;
    // Center vertex (index 0)
    positions.push(0, y, 0);
    normals.push(0, ny, 0);
    uvs.push(0.5, 0.5);

    const angleRange = endAng - startAng;
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const a = startAng + u * angleRange;
      const x = radius * Math.sin(a);
      const z = radius * Math.cos(a);

      positions.push(x, y, z);
      normals.push(0, ny, 0);
      uvs.push(0.5 + 0.5 * Math.sin(a), 0.5 + 0.5 * Math.cos(a));
    }

    for (let i = 1; i <= segments; i++) {
      if (isTop) {
        // Counter-clockwise from above
        indices.push(0, i + 1, i);
      } else {
        indices.push(0, i, i + 1);
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);

    const mesh = new THREE.Mesh(geo, frostingMat);
    mesh.receiveShadow = true;
    return mesh;
  }

  /**
   * Builds the individual cake layers on a planar cut wall at angle `ang`.
   * Directly uses world coordinates (0, y, 0) -> (r*sin(ang), y, r*cos(ang)).
   * Zero rotation matrices means ZERO risk of misalignment or weird bugs!
   */
  function buildCutWallStripes(parentGroup, radius, ang, isStartWall) {
    // 3 Sponges + 2 Fillings + 1 Top Frosting Cap
    const layerSpecs = [
      { y0: 0.00, y1: 0.22, mat: spongeMat },   // Sponge Base
      { y0: 0.22, y1: 0.36, mat: fillingMat },  // Filling 1
      { y0: 0.36, y1: 0.58, mat: spongeMat },   // Sponge Mid
      { y0: 0.58, y1: 0.72, mat: fillingMat },  // Filling 2
      { y0: 0.72, y1: 0.94, mat: spongeMat },   // Sponge Top
      { y0: 0.94, y1: 1.30, mat: frostingMat }  // Top Frosting Coat
    ];

    const sinA = Math.sin(ang);
    const cosA = Math.cos(ang);

    // Wall Normal pointing OUT of the solid cake into the cut gap
    const nx = isStartWall ? -cosA : cosA;
    const nz = isStartWall ?  sinA : -sinA;

    layerSpecs.forEach(spec => {
      const geo = new THREE.BufferGeometry();
      const p = [];
      const n = [nx, 0, nz,  nx, 0, nz,  nx, 0, nz,  nx, 0, nz];
      const uv = [0, 0,  1, 0,  1, 1,  0, 1];

      // Vertices:
      // V0: (0, y0, 0)
      // V1: (r*sinA, y0, r*cosA)
      // V2: (r*sinA, y1, r*cosA)
      // V3: (0, y1, 0)
      p.push(0, spec.y0, 0);
      p.push(radius * sinA, spec.y0, radius * cosA);
      p.push(radius * sinA, spec.y1, radius * cosA);
      p.push(0, spec.y1, 0);

      const indices = isStartWall
        ? [0, 1, 2,  0, 2, 3]
        : [0, 2, 1,  0, 3, 2];

      geo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(n, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      geo.setIndex(indices);

      const stripeMesh = new THREE.Mesh(geo, spec.mat);
      stripeMesh.receiveShadow = true;
      stripeMesh.castShadow = true;
      parentGroup.add(stripeMesh);
    });
  }

  // --- ASSEMBLE 1. MAIN CAKE BODY ---
  // Outer wall: spans from CUT_END to CUT_END + MAIN_SPAN
  const mainOuter = buildSectorOuterWall(CAKE_RADIUS, CAKE_HEIGHT, CUT_END, CUT_END + MAIN_SPAN, 48);
  mainOuter.castShadow = true;
  mainOuter.receiveShadow = true;
  mainCakeGroup.add(mainOuter);

  // Top and bottom caps
  const mainTop = buildSectorCap(CAKE_RADIUS, CAKE_HEIGHT, CUT_END, CUT_END + MAIN_SPAN, true, 48);
  mainCakeGroup.add(mainTop);

  const mainBottom = buildSectorCap(CAKE_RADIUS, 0, CUT_END, CUT_END + MAIN_SPAN, false, 48);
  mainCakeGroup.add(mainBottom);

  // Cut Walls of Main Cake:
  // Wall at CUT_END (cut opening starts here, so normal points backwards)
  buildCutWallStripes(mainCakeGroup, CAKE_RADIUS, CUT_END, true);
  // Wall at CUT_START (cut opening ends here, so normal points forwards)
  buildCutWallStripes(mainCakeGroup, CAKE_RADIUS, CUT_START, false);

  // Gold rim on main cake top edge
  const mainRimPoints = [];
  for (let i = 0; i <= 36; i++) {
    const a = CUT_END + (MAIN_SPAN * i) / 36;
    mainRimPoints.push(new THREE.Vector3(CAKE_RADIUS * Math.sin(a), CAKE_HEIGHT + 0.015, CAKE_RADIUS * Math.cos(a)));
  }
  const mainRimCurve = new THREE.CatmullRomCurve3(mainRimPoints);
  const mainRimGeo = new THREE.TubeGeometry(mainRimCurve, 36, 0.022, 12, false);
  const mainRimMesh = new THREE.Mesh(mainRimGeo, brassMaterial);
  mainCakeGroup.add(mainRimMesh);

  // --- ASSEMBLE 2. THE PULL-OUT SLICE (FATIA) ---
  // Outer wall of slice: spans from CUT_START to CUT_END
  const sliceOuter = buildSectorOuterWall(CAKE_RADIUS, CAKE_HEIGHT, CUT_START, CUT_END, 20);
  sliceOuter.castShadow = true;
  sliceOuter.receiveShadow = true;
  sliceGroup.add(sliceOuter);

  const sliceTop = buildSectorCap(CAKE_RADIUS, CAKE_HEIGHT, CUT_START, CUT_END, true, 20);
  sliceGroup.add(sliceTop);

  const sliceBottom = buildSectorCap(CAKE_RADIUS, 0, CUT_START, CUT_END, false, 20);
  sliceGroup.add(sliceBottom);

  // Cut Walls of Slice (normals point away from slice into the gap):
  buildCutWallStripes(sliceGroup, CAKE_RADIUS, CUT_START, true);
  buildCutWallStripes(sliceGroup, CAKE_RADIUS, CUT_END, false);

  // Gold rim on slice top edge
  const sliceRimPoints = [];
  for (let i = 0; i <= 14; i++) {
    const a = CUT_START + (SLICE_SPAN * i) / 14;
    sliceRimPoints.push(new THREE.Vector3(CAKE_RADIUS * Math.sin(a), CAKE_HEIGHT + 0.015, CAKE_RADIUS * Math.cos(a)));
  }
  const sliceRimCurve = new THREE.CatmullRomCurve3(sliceRimPoints);
  const sliceRimGeo = new THREE.TubeGeometry(sliceRimCurve, 14, 0.022, 12, false);
  const sliceRimMesh = new THREE.Mesh(sliceRimGeo, brassMaterial);
  sliceGroup.add(sliceRimMesh);

  // --- 3D GARNISHES ON TOP (PHYSALIS, RASPBERRIES, HAZELNUTS, GOLD LEAF) ---
  const garnishesGroup = new THREE.Group();
  garnishesGroup.position.y = CAKE_HEIGHT;
  mainCakeGroup.add(garnishesGroup);

  // Physalis (Goldenberry)
  const physalisGroup = new THREE.Group();
  physalisGroup.position.set(-0.25, 0.08, 0.15);

  const berryGeo = new THREE.SphereGeometry(0.14, 24, 24);
  const berryMat = new THREE.MeshStandardMaterial({
    color: 0xeb9c16,
    roughness: 0.28,
    metalness: 0.12,
    emissive: 0x5a3400,
    emissiveIntensity: 0.18
  });
  const berryMesh = new THREE.Mesh(berryGeo, berryMat);
  berryMesh.castShadow = true;
  physalisGroup.add(berryMesh);

  // Delicate translucent husk petals
  const petalGeo = new THREE.CylinderGeometry(0.01, 0.18, 0.35, 12, 1, true);
  const petalMat = new THREE.MeshStandardMaterial({
    color: 0xd4a856,
    roughness: 0.55,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
  });
  for (let p = 0; p < 4; p++) {
    const petal = new THREE.Mesh(petalGeo, petalMat);
    petal.rotation.z = 0.5;
    petal.rotation.y = (p * Math.PI) / 2;
    petal.position.set(0.06, 0.14, 0);
    physalisGroup.add(petal);
  }
  garnishesGroup.add(physalisGroup);

  // Fresh Raspberries
  function createRaspberry(x, z, scale = 1) {
    const rGroup = new THREE.Group();
    rGroup.position.set(x, 0.07, z);
    rGroup.scale.set(scale, scale, scale);

    const rMat = new THREE.MeshStandardMaterial({
      color: 0xb51838,
      roughness: 0.32,
      metalness: 0.06
    });
    for (let i = 0; i < 16; i++) {
      const pGeo = new THREE.SphereGeometry(0.045, 12, 12);
      const pearl = new THREE.Mesh(pGeo, rMat);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.7;
      pearl.position.set(
        0.08 * Math.sin(phi) * Math.cos(theta),
        0.08 * Math.cos(phi),
        0.08 * Math.sin(phi) * Math.sin(theta)
      );
      rGroup.add(pearl);
    }
    return rGroup;
  }
  garnishesGroup.add(createRaspberry(0.35, 0.25, 1.05));
  garnishesGroup.add(createRaspberry(-0.65, -0.35, 0.9));

  // Roasted Hazelnuts
  function createHazelnut(x, z) {
    const nutGeo = new THREE.SphereGeometry(0.09, 16, 16);
    nutGeo.scale(1, 1.25, 0.9);
    const nutMat = new THREE.MeshStandardMaterial({
      color: 0x7a431c,
      roughness: 0.38,
      metalness: 0.08
    });
    const nut = new THREE.Mesh(nutGeo, nutMat);
    nut.position.set(x, 0.06, z);
    nut.rotation.z = 0.35;
    nut.castShadow = true;
    return nut;
  }
  garnishesGroup.add(createHazelnut(0.12, -0.45));
  garnishesGroup.add(createHazelnut(-0.48, 0.38));

  // Shimmering Gold Leaf Flakes
  for (let f = 0; f < 18; f++) {
    const fGeo = new THREE.PlaneGeometry(0.04 + Math.random() * 0.04, 0.03 + Math.random() * 0.03);
    const flake = new THREE.Mesh(fGeo, goldLeafMat);
    const ang = CUT_END + Math.random() * MAIN_SPAN;
    const rad = 0.35 + Math.random() * 0.85;
    flake.position.set(rad * Math.sin(ang), 0.012, rad * Math.cos(ang));
    flake.rotation.x = -Math.PI / 2;
    flake.rotation.z = Math.random() * Math.PI;
    garnishesGroup.add(flake);
  }

  // --- SLICE SLIDE / CUTAWAY ANIMATION ---
  const SLICE_MID_ANGLE = (CUT_START + CUT_END) / 2;
  const SLICE_PULL_VECTOR = new THREE.Vector3(
    Math.sin(SLICE_MID_ANGLE) * 0.88,
    0.04,
    Math.cos(SLICE_MID_ANGLE) * 0.88
  );

  let sliceCurrentPos = new THREE.Vector3(0, 0, 0);
  let sliceTargetPos = state.cutView ? SLICE_PULL_VECTOR.clone() : new THREE.Vector3(0, 0, 0);

  function triggerSliceAnimation(open) {
    sliceTargetPos = open ? SLICE_PULL_VECTOR.clone() : new THREE.Vector3(0, 0, 0);
  }
  // Initialize in open cut view
  sliceGroup.position.copy(SLICE_PULL_VECTOR);
  sliceCurrentPos.copy(SLICE_PULL_VECTOR);

  // --- RESIZE HANDLER ---
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // --- UI CONTROLS BINDING ---
  const dimRange = document.getElementById('dimensions-range');
  const dimPrevBtn = document.getElementById('dim-prev');
  const dimNextBtn = document.getElementById('dim-next');
  const dimLabelName = document.getElementById('dim-label-name');
  const dimServingsText = document.getElementById('dim-servings-text');
  const dimDiameterText = document.getElementById('dim-diameter-text');
  const sizePills = document.querySelectorAll('.size-pill');
  const sliderTicks = document.querySelectorAll('.tick');

  const massaCards = document.querySelectorAll('.massa-card');
  const recheioItems = document.querySelectorAll('.recheio-item');
  const topperSelect = document.getElementById('topper-select');

  const guideLabelMassa = document.getElementById('guide-label-massa');
  const guideLabelRecheio = document.getElementById('guide-label-recheio');

  const summaryAro = document.getElementById('summary-aro');
  const summaryMassa = document.getElementById('summary-massa');
  const summaryRecheio = document.getElementById('summary-recheio');
  const finalPriceValue = document.getElementById('final-price-value');
  const depositNoteText = document.getElementById('deposit-note-text');

  const metricEquilibrioVal = document.getElementById('metric-equilibrio-val');
  const metricEquilibrioFill = document.getElementById('metric-equilibrio-fill');
  const metricComplexVal = document.getElementById('metric-complex-val');
  const metricComplexFill = document.getElementById('metric-complex-fill');

  const btnRotate3d = document.getElementById('btn-rotate-3d');
  const btnToggleSlice = document.getElementById('btn-toggle-slice');
  const sliceToggleText = document.getElementById('slice-toggle-text');

  // Modals
  const checkoutModal = document.getElementById('checkout-modal');
  const policyModal = document.getElementById('policy-modal');
  const aboutModal = document.getElementById('about-modal');

  const btnConcluirCriacao = document.getElementById('btn-concluir-criacao');
  const closeCheckoutModal = document.getElementById('close-checkout-modal');
  const closePolicyModal = document.getElementById('close-policy-modal');
  const closeAboutModal = document.getElementById('close-about-modal');

  const openPoliciesBtn = document.getElementById('open-policies-btn');
  const openAboutBtn = document.getElementById('open-about-btn');
  const openPolicyModalInline = document.getElementById('open-policy-modal-inline');

  const modalSumSize = document.getElementById('modal-sum-size');
  const modalSumMassa = document.getElementById('modal-sum-massa');
  const modalSumRecheio = document.getElementById('modal-sum-recheio');
  const modalSumTopo = document.getElementById('modal-sum-topo');
  const modalSumTotal = document.getElementById('modal-sum-total');
  const modalSumDeposit = document.getElementById('modal-sum-deposit');
  const customerNameInput = document.getElementById('customer-name');
  const pickupDateInput = document.getElementById('pickup-date');
  const orderNotesInput = document.getElementById('order-notes');
  const btnSendWhatsapp = document.getElementById('btn-send-whatsapp');

  // --- MINIMUM PICKUP DATE (10 DAYS NOTICE RULE) ---
  function initPickupDateConstraint() {
    const today = new Date();
    today.setDate(today.getDate() + 10);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;
    pickupDateInput.min = minDateStr;
    pickupDateInput.value = minDateStr;
  }
  initPickupDateConstraint();

  // --- UPDATE APP & 3D MATERIALS ---
  function updateApp() {
    const currentSize = SIZES[state.sizeIndex];
    const currentMassa = MASSAS[state.massa];
    const currentRecheio = RECHEIOS[state.recheio];
    const currentTopper = TOPPERS[state.topper];

    // 1. Update 3D Materials
    spongeMat.color.setHex(currentMassa.color);
    spongeMat.roughness = currentMassa.roughness;

    fillingMat.color.setHex(currentRecheio.color);
    fillingMat.roughness = currentRecheio.roughness;
    fillingMat.metalness = currentRecheio.metalness;

    // Scale cake group smoothly
    const targetScale = currentSize.scale;
    cakeMasterGroup.scale.set(targetScale, targetScale, targetScale);

    // 2. Slider & Controls
    dimRange.value = state.sizeIndex;
    dimLabelName.textContent = currentSize.name;
    dimServingsText.textContent = currentSize.slices;
    dimDiameterText.textContent = currentSize.diameter;

    sliderTicks.forEach(tick => {
      const idx = parseInt(tick.dataset.index, 10);
      tick.classList.toggle('active', idx === state.sizeIndex);
    });

    sizePills.forEach(pill => {
      const idx = parseInt(pill.dataset.index, 10);
      pill.classList.toggle('active', idx === state.sizeIndex);
    });

    // 3. Massa Cards
    massaCards.forEach(card => {
      const isSel = (card.dataset.massa === state.massa);
      card.classList.toggle('active', isSel);
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = isSel;
    });

    // 4. Recheio Items
    recheioItems.forEach(item => {
      const radio = item.querySelector('input[type="radio"]');
      const isSel = (radio && radio.value === state.recheio);
      item.classList.toggle('active', isSel);
      if (radio) radio.checked = isSel;
    });

    // 5. Labels & Gauges
    if (guideLabelMassa) guideLabelMassa.textContent = `Massa: ${currentMassa.name}`;
    if (guideLabelRecheio) guideLabelRecheio.textContent = `Recheio: ${currentRecheio.name}`;

    summaryAro.textContent = `${currentSize.name} ${currentSize.slices}`;
    summaryMassa.textContent = currentMassa.name;
    summaryRecheio.textContent = currentRecheio.name;

    metricEquilibrioVal.textContent = `${currentRecheio.eq}%`;
    metricEquilibrioFill.style.width = `${currentRecheio.eq}%`;
    metricComplexVal.textContent = `${currentRecheio.comp}%`;
    metricComplexFill.style.width = `${currentRecheio.comp}%`;

    // 6. Pricing Calculation
    const totalPrice = currentSize.price + currentTopper.extra;
    const depositPrice = totalPrice / 2;

    finalPriceValue.textContent = totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    depositNoteText.innerHTML = `Sinal de 50%: <strong>R$ ${depositPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> (restante na entrega)`;

    // 7. Toggle Slice Button State
    btnToggleSlice.classList.toggle('active', state.cutView);
    sliceToggleText.textContent = state.cutView ? 'Ver Fatia' : 'Bolo Inteiro';
  }

  // --- EVENT LISTENERS ---
  dimRange.addEventListener('input', (e) => {
    state.sizeIndex = parseInt(e.target.value, 10);
    updateApp();
  });

  dimPrevBtn.addEventListener('click', () => {
    if (state.sizeIndex > 0) {
      state.sizeIndex--;
      updateApp();
    }
  });

  dimNextBtn.addEventListener('click', () => {
    if (state.sizeIndex < SIZES.length - 1) {
      state.sizeIndex++;
      updateApp();
    }
  });

  sizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      state.sizeIndex = parseInt(pill.dataset.index, 10);
      updateApp();
    });
  });

  massaCards.forEach(card => {
    card.addEventListener('click', () => {
      state.massa = card.dataset.massa;
      updateApp();
    });
  });

  recheioItems.forEach(item => {
    item.addEventListener('click', () => {
      const radio = item.querySelector('input[type="radio"]');
      if (radio) {
        state.recheio = radio.value;
        updateApp();
      }
    });
  });

  topperSelect.addEventListener('change', (e) => {
    state.topper = e.target.value;
    updateApp();
  });

  btnToggleSlice.addEventListener('click', () => {
    state.cutView = !state.cutView;
    triggerSliceAnimation(state.cutView);
    updateApp();
  });

  btnRotate3d.addEventListener('click', () => {
    state.isRotating = !state.isRotating;
    controls.autoRotate = state.isRotating;
    controls.autoRotateSpeed = 2.2;
    btnRotate3d.classList.toggle('active', state.isRotating);
  });

  // --- MODALS ---
  function openModal(modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  btnConcluirCriacao.addEventListener('click', () => {
    const currentSize = SIZES[state.sizeIndex];
    const currentMassa = MASSAS[state.massa];
    const currentRecheio = RECHEIOS[state.recheio];
    const currentTopper = TOPPERS[state.topper];
    const totalPrice = currentSize.price + currentTopper.extra;
    const depositPrice = totalPrice / 2;

    modalSumSize.textContent = `${currentSize.name} ${currentSize.slices}`;
    modalSumMassa.textContent = currentMassa.name;
    modalSumRecheio.textContent = currentRecheio.name;
    modalSumTopo.textContent = currentTopper.name;
    modalSumTotal.textContent = `R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    modalSumDeposit.textContent = `R$ ${depositPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    openModal(checkoutModal);
  });

  closeCheckoutModal.addEventListener('click', () => closeModal(checkoutModal));
  closePolicyModal.addEventListener('click', () => closeModal(policyModal));
  closeAboutModal.addEventListener('click', () => closeModal(aboutModal));

  openPoliciesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(policyModal);
  });

  if (openPolicyModalInline) {
    openPolicyModalInline.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(policyModal);
    });
  }

  openAboutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(aboutModal);
  });

  [checkoutModal, policyModal, aboutModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // WhatsApp Checkout
  btnSendWhatsapp.addEventListener('click', () => {
    const name = customerNameInput.value.trim() || 'Cliente';
    const pickupDate = pickupDateInput.value;
    const notes = orderNotesInput.value.trim();

    const currentSize = SIZES[state.sizeIndex];
    const currentMassa = MASSAS[state.massa];
    const currentRecheio = RECHEIOS[state.recheio];
    const currentTopper = TOPPERS[state.topper];
    const totalPrice = currentSize.price + currentTopper.extra;
    const depositPrice = totalPrice / 2;

    let formattedDate = pickupDate;
    if (pickupDate && pickupDate.includes('-')) {
      const parts = pickupDate.split('-');
      formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    const message = 
`🎂 *NOVO PEDIDO - OFIR BOLOS & DOCES*
---------------------------------------
Olá Lucieda! Montei meu bolo exclusivo pelo site e gostaria de confirmar a encomenda:

📋 *ESPECIFICAÇÕES:*
• *Tamanho:* ${currentSize.name} ${currentSize.slices} (${currentSize.diameter})
• *Massa:* ${currentMassa.name}
• *Recheio:* ${currentRecheio.name}
• *Topo de Bolo:* ${currentTopper.name}

💰 *VALORES:*
• *Valor Total:* R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• *Sinal de 50% (Confirmação):* R$ ${depositPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• *Restante na Entrega:* R$ ${depositPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

👤 *DADOS DO PEDIDO:*
• *Nome:* ${name}
• *Data Desejada de Retirada:* ${formattedDate}
• *Local de Retirada:* Praia de Pipa / RN
${notes ? `• *Observações/Tema:* ${notes}\n` : ''}
✅ _Estou ciente da antecedência de 10 dias e do pagamento do sinal via PIX/Mercado Pago para reserva na agenda._`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5584994114341?text=${encodedMessage}`, '_blank');
  });

  // --- RENDER LOOP ---
  function animate() {
    requestAnimationFrame(animate);

    // Smooth lerp for slice pull-out and in
    sliceCurrentPos.lerp(sliceTargetPos, 0.08);
    sliceGroup.position.copy(sliceCurrentPos);

    controls.update();
    renderer.render(scene, camera);
  }

  // Initial render
  updateApp();
  animate();
});
