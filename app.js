/**
 * OFIR BOLOS & DOCES - ATELIER EM PRAIA DE PIPA
 * Real Three.js 3D WebGL Cake Engine & Interactive Customizer
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
      color: 0xf3e1ae,
      roughness: 0.82
    },
    'chocolate': {
      name: 'Chocolate',
      desc: 'Cacau nobre aveludado e intenso',
      color: 0x3d2112,
      roughness: 0.85
    }
  };

  const RECHEIOS = {
    'morango': {
      name: 'Morango',
      desc: 'Geleia artesanal de morangos selecionados',
      color: 0xbd243e,
      roughness: 0.35,
      metalness: 0.05,
      eq: 93,
      comp: 82
    },
    'ninho': {
      name: 'Ninho',
      desc: 'Brigadeiro cremoso de puro Leite Ninho',
      color: 0xf8eed6,
      roughness: 0.45,
      metalness: 0.02,
      eq: 96,
      comp: 70
    },
    'chocolate': {
      name: 'Chocolate',
      desc: 'Ganache encorpada de chocolate meio amargo',
      color: 0x241108,
      roughness: 0.28,
      metalness: 0.12,
      eq: 89,
      comp: 89
    },
    'avela': {
      name: 'Avelã',
      desc: 'Creme gianduja com pedacinhos crocantes',
      color: 0x7a4722,
      roughness: 0.40,
      metalness: 0.08,
      eq: 97,
      comp: 86
    },
    'coco': {
      name: 'Côco',
      desc: 'Beijinho suave com lascas de coco fresco',
      color: 0xfcf9f2,
      roughness: 0.60,
      metalness: 0.02,
      eq: 92,
      comp: 74
    },
    'maracuja': {
      name: 'Maracujá',
      desc: 'Creme aveludado com redução de maracujá',
      color: 0xe59c19,
      roughness: 0.30,
      metalness: 0.06,
      eq: 95,
      comp: 91
    },
    'abacaxi': {
      name: 'Abacaxi',
      desc: 'Compota dourada artesanal com toque cítrico',
      color: 0xd9a42b,
      roughness: 0.32,
      metalness: 0.05,
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

  // --- PROCEDURAL TEXTURE GENERATORS ---
  function createProceduralNoiseCanvas(width, height, baseHex, speckleHex, density = 0.15) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = speckleHex;
    const count = Math.floor(width * height * density);
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 1.8 + 0.4;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }

  function createMarbleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#faf7f2';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(180, 170, 160, 0.22)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 512, 0);
      ctx.bezierCurveTo(
        Math.random() * 512, 170,
        Math.random() * 512, 340,
        Math.random() * 512, 512
      );
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // --- 3D ENGINE SETUP ---
  const container = document.getElementById('webgl-container');
  const canvas = document.getElementById('cake-3d-canvas');

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    38,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 2.8, 6.2);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 4.2;
  controls.maxDistance = 8.5;
  controls.minPolarAngle = Math.PI * 0.15;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.target.set(0, 0.65, 0);

  // --- LIGHTING ---
  const ambientLight = new THREE.HemisphereLight(0xfffaf0, 0xd2c3b2, 0.75);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff6ea, 1.4);
  keyLight.position.set(4.5, 7.5, 5.0);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.bias = -0.0001;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 20;
  keyLight.shadow.camera.left = -3;
  keyLight.shadow.camera.right = 3;
  keyLight.shadow.camera.top = 3;
  keyLight.shadow.camera.bottom = -3;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xe5dcce, 0.55);
  fillLight.position.set(-4.5, 4.0, -3.5);
  scene.add(fillLight);

  const topGlint = new THREE.PointLight(0xffeedb, 0.8, 6);
  topGlint.position.set(0, 3.2, 0.5);
  scene.add(topGlint);

  // Soft Contact Shadow Plane
  const shadowPlaneGeo = new THREE.PlaneGeometry(8, 8);
  const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.14 });
  const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -0.95;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  // --- PEDESTAL (BRASS & MARBLE STAND) ---
  const standGroup = new THREE.Group();
  standGroup.position.y = -0.95;

  const brassMaterial = new THREE.MeshStandardMaterial({
    color: 0xc8a45e,
    metalness: 0.88,
    roughness: 0.22
  });

  const marbleTexture = createMarbleTexture();
  const marbleMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: marbleTexture,
    roughness: 0.35,
    metalness: 0.05
  });

  // Base Foot
  const baseFootGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.12, 48);
  const baseFoot = new THREE.Mesh(baseFootGeo, brassMaterial);
  baseFoot.position.y = 0.06;
  baseFoot.castShadow = true;
  baseFoot.receiveShadow = true;
  standGroup.add(baseFoot);

  // Fluted Stem
  const stemPoints = [
    new THREE.Vector2(0.80, 0.12),
    new THREE.Vector2(0.40, 0.35),
    new THREE.Vector2(0.20, 0.75),
    new THREE.Vector2(0.18, 1.15),
    new THREE.Vector2(0.32, 1.45),
    new THREE.Vector2(0.70, 1.60)
  ];
  const stemGeo = new THREE.LatheGeometry(stemPoints, 48);
  const stemMesh = new THREE.Mesh(stemGeo, brassMaterial);
  stemMesh.castShadow = true;
  stemMesh.receiveShadow = true;
  standGroup.add(stemMesh);

  // Marble Platter Disk
  const platterGeo = new THREE.CylinderGeometry(1.82, 1.80, 0.14, 64);
  const platter = new THREE.Mesh(platterGeo, marbleMaterial);
  platter.position.y = 1.67;
  platter.castShadow = true;
  platter.receiveShadow = true;
  standGroup.add(platter);

  // Platter Brass Rim
  const rimGeo = new THREE.TorusGeometry(1.81, 0.025, 16, 64);
  const rim = new THREE.Mesh(rimGeo, brassMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 1.67;
  standGroup.add(rim);

  scene.add(standGroup);

  // --- CAKE 3D PROCEDURAL BUILDER ---
  const cakeMasterGroup = new THREE.Group();
  cakeMasterGroup.position.y = 0.80; // Sits exactly on the marble platter
  scene.add(cakeMasterGroup);

  // Shared Dynamic Materials
  const frostingMat = new THREE.MeshStandardMaterial({
    color: 0xfdfaf4,
    roughness: 0.48,
    metalness: 0.02
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xdcb86e,
    metalness: 0.92,
    roughness: 0.18
  });

  // Dynamic sponge & filling materials (instantiated and updated dynamically)
  const spongeMat = new THREE.MeshStandardMaterial({
    color: MASSAS[state.massa].color,
    roughness: MASSAS[state.massa].roughness,
    metalness: 0.01
  });

  const fillingMat = new THREE.MeshStandardMaterial({
    color: RECHEIOS[state.recheio].color,
    roughness: RECHEIOS[state.recheio].roughness,
    metalness: RECHEIOS[state.recheio].metalness
  });

  // Cake Dimensions constants
  const CAKE_RADIUS = 1.42;
  const CAKE_HEIGHT = 1.40;
  const CUT_ANGLE_START = -0.32; // -18 deg
  const CUT_ANGLE_END = 0.65;    // +37 deg
  const SLICE_ANGLE = CUT_ANGLE_END - CUT_ANGLE_START; // ~55 deg
  const MAIN_ANGLE = Math.PI * 2 - SLICE_ANGLE;

  // Group 1: Main Cake Body
  const mainCakeGroup = new THREE.Group();
  cakeMasterGroup.add(mainCakeGroup);

  // Group 2: Pull-out Slice (Fatia)
  const sliceGroup = new THREE.Group();
  cakeMasterGroup.add(sliceGroup);

  // Helper to build a 2D sector shape on X-Z plane
  function createSectorShape(radius, startAng, endAng) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(radius * Math.cos(startAng), radius * Math.sin(startAng));
    shape.absarc(0, 0, radius, startAng, endAng, false);
    shape.lineTo(0, 0);
    return shape;
  }

  // --- 1. BUILD MAIN CAKE BODY ---
  // Outer curved frosting wall
  const mainOuterGeo = new THREE.CylinderGeometry(
    CAKE_RADIUS, CAKE_RADIUS, CAKE_HEIGHT, 54, 1, true, CUT_ANGLE_END, MAIN_ANGLE
  );
  const mainOuterWall = new THREE.Mesh(mainOuterGeo, frostingMat);
  mainOuterWall.position.y = CAKE_HEIGHT / 2;
  mainOuterWall.castShadow = true;
  mainOuterWall.receiveShadow = true;
  mainCakeGroup.add(mainOuterWall);

  // Top frosting surface
  const mainTopShape = createSectorShape(CAKE_RADIUS, CUT_ANGLE_END, CUT_ANGLE_END + MAIN_ANGLE);
  const mainTopGeo = new THREE.ShapeGeometry(mainTopShape);
  const mainTopMesh = new THREE.Mesh(mainTopGeo, frostingMat);
  mainTopMesh.rotation.x = -Math.PI / 2;
  mainTopMesh.position.y = CAKE_HEIGHT;
  mainTopMesh.receiveShadow = true;
  mainCakeGroup.add(mainTopMesh);

  // Bottom base plate
  const mainBottomMesh = new THREE.Mesh(mainTopGeo, frostingMat);
  mainBottomMesh.rotation.x = Math.PI / 2;
  mainCakeGroup.add(mainBottomMesh);

  // Decorative gold top rim for main cake
  const mainRimShape = new THREE.Curve();
  const mainRimPoints = [];
  const rimSteps = 40;
  for (let i = 0; i <= rimSteps; i++) {
    const a = CUT_ANGLE_END + (MAIN_ANGLE * i) / rimSteps;
    mainRimPoints.push(new THREE.Vector3(CAKE_RADIUS * Math.cos(a), CAKE_HEIGHT + 0.015, CAKE_RADIUS * Math.sin(a)));
  }
  const mainRimCurve = new THREE.CatmullRomCurve3(mainRimPoints);
  const mainRimGeo = new THREE.TubeGeometry(mainRimCurve, 40, 0.022, 12, false);
  const mainRimMesh = new THREE.Mesh(mainRimGeo, goldTrimMat);
  mainCakeGroup.add(mainRimMesh);

  // Helper to build internal cut layers on a planar cut wall
  function buildCutWallLayers(parentGroup, angle, isSlice = false) {
    const wallGroup = new THREE.Group();
    wallGroup.rotation.y = -angle;

    // Layer structure: 3 sponges + 2 fillings + top cream
    const layerDefs = [
      { h: 0.25, mat: spongeMat, y: 0.125 },      // Sponge 1 (base)
      { h: 0.15, mat: fillingMat, y: 0.325 },     // Filling 1
      { h: 0.25, mat: spongeMat, y: 0.525 },      // Sponge 2 (mid)
      { h: 0.15, mat: fillingMat, y: 0.725 },     // Filling 2
      { h: 0.25, mat: spongeMat, y: 0.925 },      // Sponge 3 (top)
      { h: 0.35, mat: frostingMat, y: 1.225 }     // Top frosting layer
    ];

    layerDefs.forEach(l => {
      const geo = new THREE.BoxGeometry(CAKE_RADIUS, l.h, 0.005);
      const mesh = new THREE.Mesh(geo, l.mat);
      mesh.position.set(CAKE_RADIUS / 2, l.y, 0);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      wallGroup.add(mesh);
    });

    parentGroup.add(wallGroup);
  }

  // Cut Wall A & B for Main Cake
  buildCutWallLayers(mainCakeGroup, CUT_ANGLE_END);
  buildCutWallLayers(mainCakeGroup, CUT_ANGLE_START);

  // --- 2. BUILD PULL-OUT SLICE (FATIA) ---
  // Outer curved wall of slice
  const sliceOuterGeo = new THREE.CylinderGeometry(
    CAKE_RADIUS, CAKE_RADIUS, CAKE_HEIGHT, 24, 1, true, CUT_ANGLE_START, SLICE_ANGLE
  );
  const sliceOuterWall = new THREE.Mesh(sliceOuterGeo, frostingMat);
  sliceOuterWall.position.y = CAKE_HEIGHT / 2;
  sliceOuterWall.castShadow = true;
  sliceOuterWall.receiveShadow = true;
  sliceGroup.add(sliceOuterWall);

  // Top frosting of slice
  const sliceTopShape = createSectorShape(CAKE_RADIUS, CUT_ANGLE_START, CUT_ANGLE_END);
  const sliceTopGeo = new THREE.ShapeGeometry(sliceTopShape);
  const sliceTopMesh = new THREE.Mesh(sliceTopGeo, frostingMat);
  sliceTopMesh.rotation.x = -Math.PI / 2;
  sliceTopMesh.position.y = CAKE_HEIGHT;
  sliceTopMesh.receiveShadow = true;
  sliceGroup.add(sliceTopMesh);

  // Cut walls for the slice
  buildCutWallLayers(sliceGroup, CUT_ANGLE_END, true);
  buildCutWallLayers(sliceGroup, CUT_ANGLE_START, true);

  // Slice gold rim
  const sliceRimPoints = [];
  for (let i = 0; i <= 16; i++) {
    const a = CUT_ANGLE_START + (SLICE_ANGLE * i) / 16;
    sliceRimPoints.push(new THREE.Vector3(CAKE_RADIUS * Math.cos(a), CAKE_HEIGHT + 0.015, CAKE_RADIUS * Math.sin(a)));
  }
  const sliceRimCurve = new THREE.CatmullRomCurve3(sliceRimPoints);
  const sliceRimGeo = new THREE.TubeGeometry(sliceRimCurve, 16, 0.022, 12, false);
  const sliceRimMesh = new THREE.Mesh(sliceRimGeo, goldTrimMat);
  sliceGroup.add(sliceRimMesh);

  // --- 3. 3D TOPPERS & GARNISHES (PHYSALIS, BERRIES, HAZELNUTS & GOLD FLAKES) ---
  const garnishesGroup = new THREE.Group();
  garnishesGroup.position.y = CAKE_HEIGHT;
  mainCakeGroup.add(garnishesGroup);

  // Physalis (Goldenberry)
  const physalisGroup = new THREE.Group();
  physalisGroup.position.set(-0.25, 0.08, 0.15);

  const berryGeo = new THREE.SphereGeometry(0.14, 24, 24);
  const berryMat = new THREE.MeshStandardMaterial({
    color: 0xf5a820,
    roughness: 0.25,
    metalness: 0.15,
    emissive: 0x6e4500,
    emissiveIntensity: 0.2
  });
  const berryMesh = new THREE.Mesh(berryGeo, berryMat);
  berryMesh.castShadow = true;
  physalisGroup.add(berryMesh);

  // Translucent lantern husk petals
  const petalGeo = new THREE.CylinderGeometry(0.01, 0.18, 0.35, 12, 1, true);
  const petalMat = new THREE.MeshStandardMaterial({
    color: 0xdcb266,
    roughness: 0.6,
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

  // Raspberries (Clusters of red pearls)
  function createRaspberry(x, z, scale = 1) {
    const rGroup = new THREE.Group();
    rGroup.position.set(x, 0.08, z);
    rGroup.scale.set(scale, scale, scale);

    const rMat = new THREE.MeshStandardMaterial({
      color: 0xc81e42,
      roughness: 0.35,
      metalness: 0.08
    });
    for (let i = 0; i < 18; i++) {
      const pGeo = new THREE.SphereGeometry(0.045, 12, 12);
      const pearl = new THREE.Mesh(pGeo, rMat);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.7;
      pearl.position.set(
        0.08 * Math.sin(phi) * Math.cos(theta),
        0.09 * Math.cos(phi),
        0.08 * Math.sin(phi) * Math.sin(theta)
      );
      rGroup.add(pearl);
    }
    return rGroup;
  }

  garnishesGroup.add(createRaspberry(0.35, 0.25, 1.1));
  garnishesGroup.add(createRaspberry(-0.65, -0.35, 0.9));

  // Hazelnuts
  function createHazelnut(x, z) {
    const nutGeo = new THREE.SphereGeometry(0.09, 16, 16);
    nutGeo.scale(1, 1.3, 0.9);
    const nutMat = new THREE.MeshStandardMaterial({
      color: 0x8a5528,
      roughness: 0.38,
      metalness: 0.12
    });
    const nut = new THREE.Mesh(nutGeo, nutMat);
    nut.position.set(x, 0.07, z);
    nut.rotation.z = 0.4;
    nut.castShadow = true;
    return nut;
  }
  garnishesGroup.add(createHazelnut(0.12, -0.45));
  garnishesGroup.add(createHazelnut(-0.48, 0.38));

  // Edible Gold Leaf Flakes
  const flakeMat = new THREE.MeshStandardMaterial({
    color: 0xf0c868,
    metalness: 0.95,
    roughness: 0.15,
    side: THREE.DoubleSide
  });
  for (let f = 0; f < 18; f++) {
    const fGeo = new THREE.PlaneGeometry(0.04 + Math.random() * 0.04, 0.03 + Math.random() * 0.03);
    const flake = new THREE.Mesh(fGeo, flakeMat);
    const ang = CUT_ANGLE_END + Math.random() * MAIN_ANGLE;
    const rad = 0.35 + Math.random() * 0.85;
    flake.position.set(rad * Math.cos(ang), 0.015, rad * Math.sin(ang));
    flake.rotation.x = -Math.PI / 2;
    flake.rotation.z = Math.random() * Math.PI;
    garnishesGroup.add(flake);
  }

  // --- SLICE SLIDE / EXPLODE ANIMATION ---
  const SLICE_MID_ANGLE = (CUT_ANGLE_START + CUT_ANGLE_END) / 2;
  const SLICE_PULL_VECTOR = new THREE.Vector3(
    Math.cos(SLICE_MID_ANGLE) * 0.95,
    0.06,
    Math.sin(SLICE_MID_ANGLE) * 0.95
  );

  let sliceCurrentPos = new THREE.Vector3(0, 0, 0);
  let sliceTargetPos = state.cutView ? SLICE_PULL_VECTOR.clone() : new THREE.Vector3(0, 0, 0);

  function triggerSliceAnimation(open) {
    sliceTargetPos = open ? SLICE_PULL_VECTOR.clone() : new THREE.Vector3(0, 0, 0);
  }
  // Initialize in open cut view
  sliceGroup.position.copy(SLICE_PULL_VECTOR);
  sliceCurrentPos.copy(SLICE_PULL_VECTOR);

  // --- WINDOW RESIZE LISTENER ---
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

  // --- INITIALIZE PICKUP DATE (10 DAYS NOTICE RULE) ---
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

    // 1. Update 3D Materials in Real-Time
    spongeMat.color.setHex(currentMassa.color);
    spongeMat.roughness = currentMassa.roughness;

    fillingMat.color.setHex(currentRecheio.color);
    fillingMat.roughness = currentRecheio.roughness;
    fillingMat.metalness = currentRecheio.metalness;

    // Smoothly scale cake group according to size
    const targetScale = currentSize.scale;
    cakeMasterGroup.scale.set(targetScale, targetScale, targetScale);

    // 2. Slider & Ticks
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

    // 5. Labels & Sensory Gauges
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

  // Toggle Slice Button
  btnToggleSlice.addEventListener('click', () => {
    state.cutView = !state.cutView;
    triggerSliceAnimation(state.cutView);
    updateApp();
  });

  // Toggle Continuous 3D Orbit Rotation
  btnRotate3d.addEventListener('click', () => {
    state.isRotating = !state.isRotating;
    controls.autoRotate = state.isRotating;
    controls.autoRotateSpeed = 2.4;
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

  // WhatsApp Order Submission
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

    // Smooth lerp animation for slice pull-out / in
    sliceCurrentPos.lerp(sliceTargetPos, 0.08);
    sliceGroup.position.copy(sliceCurrentPos);

    controls.update();
    renderer.render(scene, camera);
  }

  // Initial call
  updateApp();
  animate();
});
