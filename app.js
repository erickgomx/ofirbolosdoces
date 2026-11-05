/**
 * OFIR BOLOS & DOCES - ATELIER EM PRAIA DE PIPA
 * Real High-Resolution Photorealistic Multi-Layer Cake Engine & Interactive Customizer
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DATA DEFINITIONS ---
  const SIZES = [
    { id: 'aro-10', name: 'ARO 10', diameter: '10 cm', slices: '(6-8 fatias)', price: 70, scale: 0.52 },
    { id: 'aro-15', name: 'ARO 15', diameter: '15 cm', slices: '(12-15 fatias)', price: 135, scale: 0.63 },
    { id: 'aro-20', name: 'ARO 20', diameter: '20 cm', slices: '(20-25 fatias)', price: 195, scale: 0.74 },
    { id: 'aro-25', name: 'ARO 25', diameter: '25 cm', slices: '(30-35 fatias)', price: 285, scale: 0.84 },
    { id: 'aro-28', name: 'ARO 28', diameter: '28 cm', slices: '(40-45 fatias)', price: 365, scale: 0.93 },
    { id: 'aro-30', name: 'ARO 30', diameter: '30 cm', slices: '(50-55 fatias)', price: 410, scale: 1.00 }
  ];

  const MASSAS = {
    'branco': {
      name: 'Branco (ovos)',
      desc: 'Massa amanteigada fofa e delicada'
    },
    'chocolate': {
      name: 'Chocolate',
      desc: 'Cacau nobre aveludado e intenso'
    },
    'red_velvet': {
      name: 'Red Velvet',
      desc: 'Massa aveludada com toque sutil de cacau'
    }
  };

  const DEFAULT_COBERTURAS = [
    { id: 'chantily', name: 'Chantily', desc: 'Creme leve, delicado e batido em ponto perfeito', icon: '🧁' },
    { id: 'chantininho', name: 'Chantininho', desc: 'Chantilly cremoso com puro leite Ninho', icon: '🥛' },
    { id: 'glace', name: 'Glacê', desc: 'Cobertura clássica e aveludada de toque açucarado', icon: '✨' },
    { id: 'brigadeiro', name: 'Brigadeiro', desc: 'Brigadeiro gourmet cremoso em ponto de bico', icon: '🍫' },
    { id: 'ganache_branco', name: 'Ganache branco', desc: 'Emulsão nobre de chocolate branco e creme fresco', icon: '🤍' },
    { id: 'ganache_chocolate', name: 'Ganache de chocolate', desc: 'Ganache aveludada de chocolate meio amargo puro', icon: '🤎' },
    { id: 'sem_cobertura', name: 'Sem cobertura ( com acetato)', desc: 'Estilo Naked Cake artesanal protegido com acetato', icon: '🎂' }
  ];

  let coberturasList = [...DEFAULT_COBERTURAS];

  function getCoberturaItem(id) {
    return coberturasList.find(c => c.id === id) || coberturasList[0] || { name: 'Chantininho', desc: '', icon: '🥛' };
  }

  const DEFAULT_RECHEIOS = [
    { id: 'morango', name: 'Morango', desc: 'Geleia artesanal de morangos selecionados', icon: '🍓', eq: 93, comp: 82, color: { r: 214, g: 40, b: 57 } },
    { id: 'ninho', name: 'Ninho', desc: 'Brigadeiro cremoso de puro Leite Ninho', icon: '🥛', eq: 96, comp: 70, color: { r: 255, g: 246, b: 229 } },
    { id: 'chocolate', name: 'Chocolate', desc: 'Ganache encorpada de chocolate meio amargo', icon: '🍫', eq: 89, comp: 89, color: { r: 64, g: 34, b: 24 } },
    { id: 'avela', name: 'Avelã', desc: 'Creme gianduja com pedacinhos crocantes', icon: '🌰', eq: 97, comp: 86, color: { r: 140, g: 89, b: 53 } },
    { id: 'coco', name: 'Côco', desc: 'Beijinho suave com lascas de coco fresco', icon: '🥥', eq: 92, comp: 74, color: { r: 250, g: 248, b: 245 } },
    { id: 'maracuja', name: 'Maracujá', desc: 'Creme aveludado com redução de maracujá', icon: '🌟', eq: 95, comp: 91, color: { r: 255, g: 184, b: 0 } },
    { id: 'abacaxi', name: 'Abacaxi', desc: 'Compota dourada artesanal com toque cítrico', icon: '🍍', eq: 94, comp: 84, color: { r: 255, g: 174, b: 25 } }
  ];

  let recheiosList = [...DEFAULT_RECHEIOS];

  function getRecheioItem(id) {
    return recheiosList.find(r => r.id === id) || recheiosList[0] || { name: 'Artesanal', desc: '', icon: '🍰', eq: 95, comp: 85 };
  }

  const TOPPERS = {
    'simples': { name: 'Simples (Incluso)', extra: 0 },
    '3d': { name: 'Especial 3D (+ R$ 35,00)', extra: 35 }
  };

  // --- STATE ---
  let state = {
    sizeIndex: 2, // ARO 20 default
    massa: 'branco',
    cobertura: 'chantininho',
    recheio: 'avela',
    topper: 'simples',
    viewMode: 'inteiro' // 'inteiro' or 'cortado'
  };

  // --- DOM ELEMENTS ---
  const cakeInteractiveBox = document.getElementById('cake-interactive-box');
  const cakeShowcaseWrapper = document.getElementById('cake-showcase-wrapper');
  const mainCakeImage = document.getElementById('main-cake-image');
  const btnToggleView = document.getElementById('btn-toggle-view');
  const toggleViewText = document.getElementById('toggle-view-text');

  const dimRange = document.getElementById('dimensions-range');
  const dimPrevBtn = document.getElementById('dim-prev');
  const dimNextBtn = document.getElementById('dim-next');
  const dimLabelName = document.getElementById('dim-label-name');
  const dimServingsText = document.getElementById('dim-servings-text');
  const dimDiameterText = document.getElementById('dim-diameter-text');
  const sizePills = document.querySelectorAll('.size-pills-row .size-pill');
  const sliderTicks = document.querySelectorAll('.tick');

  const massaCards = document.querySelectorAll('.massa-card');
  const coberturaListContainer = document.getElementById('cobertura-list-container');
  const coberturasCountBadge = document.getElementById('coberturas-count-badge');
  const recheioListContainer = document.getElementById('recheio-list-container');
  const recheiosCountBadge = document.getElementById('recheios-count-badge');
  const topperSelect = document.getElementById('topper-select');

  const summaryAro = document.getElementById('summary-aro');
  const summaryMassa = document.getElementById('summary-massa');
  const summaryCobertura = document.getElementById('summary-cobertura');
  const summaryRecheio = document.getElementById('summary-recheio');
  const finalPriceValue = document.getElementById('final-price-value');
  const depositNoteText = document.getElementById('deposit-note-text');

  const metricEquilibrioVal = document.getElementById('metric-equilibrio-val');
  const metricEquilibrioFill = document.getElementById('metric-equilibrio-fill');
  const metricComplexVal = document.getElementById('metric-complex-val');
  const metricComplexFill = document.getElementById('metric-complex-fill');

  // Modals
  const checkoutModal = document.getElementById('checkout-modal');
  const policyModal = document.getElementById('policy-modal');
  const aboutModal = document.getElementById('about-modal');
  const customCakeModal = document.getElementById('custom-cake-modal');
  const galeriaLightboxModal = document.getElementById('galeria-lightbox-modal');
  const adminLoginModal = document.getElementById('admin-login-modal');
  const adminPanelModal = document.getElementById('admin-panel-modal');

  const btnConcluirCriacao = document.getElementById('btn-concluir-criacao');
  const closeCheckoutModal = document.getElementById('close-checkout-modal');
  const closePolicyModal = document.getElementById('close-policy-modal');
  const closeAboutModal = document.getElementById('close-about-modal');
  const closeCustomCakeModal = document.getElementById('close-custom-cake-modal');
  const closeLightboxModal = document.getElementById('close-lightbox-modal');
  const closeAdminLoginModal = document.getElementById('close-admin-login-modal');
  const closeAdminPanelModal = document.getElementById('close-admin-panel-modal');

  const openPoliciesBtn = document.getElementById('open-policies-btn');
  const openAboutBtn = document.getElementById('open-about-btn');
  const openPolicyModalInline = document.getElementById('open-policy-modal-inline');
  const btnCustomEventCake = document.getElementById('btn-custom-event-cake');
  const openCustomCakeNav = document.getElementById('open-custom-cake-nav');

  const modalSumSize = document.getElementById('modal-sum-size');
  const modalSumMassa = document.getElementById('modal-sum-massa');
  const modalSumCobertura = document.getElementById('modal-sum-cobertura');
  const modalSumRecheio = document.getElementById('modal-sum-recheio');
  const modalSumTopo = document.getElementById('modal-sum-topo');
  const modalSumTotal = document.getElementById('modal-sum-total');
  const modalSumDeposit = document.getElementById('modal-sum-deposit');
  const customerNameInput = document.getElementById('customer-name');
  const pickupDateInput = document.getElementById('pickup-date');
  const orderNotesInput = document.getElementById('order-notes');
  const btnSendWhatsapp = document.getElementById('btn-send-whatsapp');

  // Custom Cake Elements
  const btnSendCustomWhatsapp = document.getElementById('btn-send-custom-whatsapp');
  const customDateInput = document.getElementById('custom-date');
  const customGuestsInput = document.getElementById('custom-guests');
  const customAndaresSelect = document.getElementById('custom-andares');
  const customClientNameInput = document.getElementById('custom-client-name');
  const customNotesInput = document.getElementById('custom-notes');

  // --- INITIALIZE MINIMUM PICKUP DATE (10 DAYS NOTICE RULE) ---
  function initPickupDateConstraint() {
    const today = new Date();
    today.setDate(today.getDate() + 10);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;
    pickupDateInput.min = minDateStr;
    pickupDateInput.value = minDateStr;

    // Custom Wedding Date: default to 15 days ahead for larger events
    if (customDateInput) {
      const weddingDefault = new Date();
      weddingDefault.setDate(weddingDefault.getDate() + 15);
      const wYyyy = weddingDefault.getFullYear();
      const wMm = String(weddingDefault.getMonth() + 1).padStart(2, '0');
      const wDd = String(weddingDefault.getDate()).padStart(2, '0');
      customDateInput.min = minDateStr;
      customDateInput.value = `${wYyyy}-${wMm}-${wDd}`;
    }
  }
  initPickupDateConstraint();

  // --- PRELOAD ALL 24 NATIVE HIGH-RES CAKE RENDERS ---
  const CAKE_ASSETS = [
    'assets/bolo_inteiro_aro10.png', 'assets/bolo_inteiro_aro15.png', 'assets/bolo_inteiro_aro20.png',
    'assets/bolo_inteiro_aro25.png', 'assets/bolo_inteiro_aro28.png', 'assets/bolo_inteiro_aro30.png',
    'assets/bolo_cortado_branco_aro10.png', 'assets/bolo_cortado_branco_aro15.png', 'assets/bolo_cortado_branco_aro20.png',
    'assets/bolo_cortado_branco_aro25.png', 'assets/bolo_cortado_branco_aro28.png', 'assets/bolo_cortado_branco_aro30.png',
    'assets/bolo_cortado_chocolate_aro10.png', 'assets/bolo_cortado_chocolate_aro15.png', 'assets/bolo_cortado_chocolate_aro20.png',
    'assets/bolo_cortado_chocolate_aro25.png', 'assets/bolo_cortado_chocolate_aro28.png', 'assets/bolo_cortado_chocolate_aro30.png',
    'assets/bolo_cortado_red_velvet_aro10.png', 'assets/bolo_cortado_red_velvet_aro15.png', 'assets/bolo_cortado_red_velvet_aro20.png',
    'assets/bolo_cortado_red_velvet_aro25.png', 'assets/bolo_cortado_red_velvet_aro28.png', 'assets/bolo_cortado_red_velvet_aro30.png'
  ];
  CAKE_ASSETS.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  function getCakeImagePath() {
    const currentSize = SIZES[state.sizeIndex];
    const aroNum = currentSize.id.replace('aro-', '');
    if (state.viewMode === 'cortado') {
      let massaType = 'branco';
      if (state.massa === 'chocolate') massaType = 'chocolate';
      else if (state.massa === 'red_velvet') massaType = 'red_velvet';
      return `assets/bolo_cortado_${massaType}_aro${aroNum}.png`;
    }
    return `assets/bolo_inteiro_aro${aroNum}.png`;
  }

  // --- UPDATE APP UI & CAKE LAYERS ---
  function updateApp() {
    if (isNaN(state.sizeIndex) || state.sizeIndex < 0 || state.sizeIndex >= SIZES.length) {
      state.sizeIndex = 2;
    }
    const currentSize = SIZES[state.sizeIndex] || SIZES[2] || SIZES[0];
    const currentMassa = MASSAS[state.massa] || MASSAS['branco'];
    const currentCobertura = getCoberturaItem(state.cobertura);
    const currentRecheio = getRecheioItem(state.recheio);
    const currentTopper = TOPPERS[state.topper] || TOPPERS['simples'];

    // 1. Slider & Controls (imagem em exibicao fotografica fixa nesta fase)
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

    // 4. Massa Cards
    massaCards.forEach(card => {
      const isSel = (card.dataset.massa === state.massa);
      card.classList.toggle('active', isSel);
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = isSel;
    });

    // Cobertura Items
    if (coberturaListContainer) {
      coberturaListContainer.querySelectorAll('.cobertura-item').forEach(item => {
        const val = item.getAttribute('data-cobertura');
        const isSel = (val === state.cobertura);
        item.classList.toggle('active', isSel);
        const radio = item.querySelector('input[type="radio"]');
        if (radio) radio.checked = isSel;
      });
    }

    // 5. Recheio Items
    if (recheioListContainer) {
      recheioListContainer.querySelectorAll('.recheio-item').forEach(item => {
        const val = item.getAttribute('data-recheio');
        const isSel = (val === state.recheio);
        item.classList.toggle('active', isSel);
        const radio = item.querySelector('input[type="radio"]');
        if (radio) radio.checked = isSel;
      });
    }

    // 6. Summary & Sensory Metrics
    summaryAro.textContent = `${currentSize.name} ${currentSize.slices}`;
    summaryMassa.textContent = currentMassa.name;
    if (summaryCobertura) summaryCobertura.textContent = currentCobertura.name;
    summaryRecheio.textContent = currentRecheio.name;

    metricEquilibrioVal.textContent = `${currentRecheio.eq || 95}%`;
    metricEquilibrioFill.style.width = `${currentRecheio.eq || 95}%`;
    metricComplexVal.textContent = `${currentRecheio.comp || 85}%`;
    metricComplexFill.style.width = `${currentRecheio.comp || 85}%`;

    // 7. Pricing Calculation
    const totalPrice = currentSize.price + currentTopper.extra;
    const depositPrice = totalPrice / 2;

    finalPriceValue.textContent = totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    depositNoteText.innerHTML = `Sinal de 50%: <strong>R$ ${depositPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> (restante na entrega)`;

    // 8. Photorealistic Cake Showcase (Bolo Inteiro vs Cortado por Massa e Aro)
    const targetSrc = getCakeImagePath();
    if (mainCakeImage && mainCakeImage.getAttribute('src') !== targetSrc) {
      mainCakeImage.src = targetSrc;
    }

    // 9. View Mode Button State
    const isCut = (state.viewMode === 'cortado');
    if (btnToggleView) {
      btnToggleView.classList.toggle('active', isCut);
      if (toggleViewText) {
        toggleViewText.textContent = isCut ? 'Ver Bolo Inteiro' : 'Ver Bolo Cortado';
      }
    }
  }

  // --- SUBTLE 3D PARALLAX TILT ON MOUSE MOVE ---
  let targetTiltX = 0;
  let targetTiltY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;

  if (cakeInteractiveBox) {
    cakeInteractiveBox.addEventListener('mousemove', (e) => {
      const rect = cakeInteractiveBox.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const normX = (x / rect.width) * 2 - 1; // -1 to 1
      const normY = (y / rect.height) * 2 - 1; // -1 to 1

      targetTiltX = -normY * 6.5; // deg
      targetTiltY = normX * 8.0;  // deg
    });

    cakeInteractiveBox.addEventListener('mouseleave', () => {
      targetTiltX = 0;
      targetTiltY = 0;
    });
  }

  // Smooth Parallax Lerp Loop
  function tiltLoop() {
    currentTiltX += (targetTiltX - currentTiltX) * 0.1;
    currentTiltY += (targetTiltY - currentTiltY) * 0.1;
    if (cakeShowcaseWrapper) {
      cakeShowcaseWrapper.style.transform = `rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
    }
    requestAnimationFrame(tiltLoop);
  }
  requestAnimationFrame(tiltLoop);

  // --- VIEW TOGGLE: BOLO INTEIRO vs BOLO CORTADO ---
  if (btnToggleView) {
    btnToggleView.addEventListener('click', () => {
      state.viewMode = (state.viewMode === 'inteiro') ? 'cortado' : 'inteiro';
      updateApp();
    });
  }

  // --- EVENT LISTENERS: CONTROLS ---
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
      const idx = parseInt(pill.dataset.index, 10);
      if (!isNaN(idx)) {
        state.sizeIndex = idx;
        updateApp();
      }
    });
  });

  massaCards.forEach(card => {
    card.addEventListener('click', () => {
      state.massa = card.dataset.massa;
      updateApp();
    });
  });

  topperSelect.addEventListener('change', (e) => {
    state.topper = e.target.value;
    updateApp();
  });

  

  // --- MODALS ---
  function openModal(modal) {
    if (!modal) return;
    modal.dataset.openedAt = String(Date.now());
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (btnConcluirCriacao) {
    const handleConcluirClick = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (isNaN(state.sizeIndex) || state.sizeIndex < 0 || state.sizeIndex >= SIZES.length) {
        state.sizeIndex = 2;
      }
      if (!MASSAS[state.massa]) {
        state.massa = 'branco';
      }
      if (!TOPPERS[state.topper]) {
        state.topper = 'simples';
      }

      try {
        const currentSize = (SIZES && SIZES[state.sizeIndex]) || SIZES[2] || SIZES[0];
        const currentMassa = (MASSAS && MASSAS[state.massa]) || { name: 'Branco (ovos)' };
        const currentCobertura = getCoberturaItem(state.cobertura);
        const currentRecheio = getRecheioItem(state.recheio);
        const currentTopper = (TOPPERS && TOPPERS[state.topper]) || { name: 'Simples (Incluso)', extra: 0 };
        const totalPrice = (Number(currentSize.price) || 195) + (Number(currentTopper.extra) || 0);
        const depositPrice = totalPrice / 2;

        if (modalSumSize && currentSize) modalSumSize.textContent = `${currentSize.name} ${currentSize.slices || ''}`;
        if (modalSumMassa && currentMassa) modalSumMassa.textContent = currentMassa.name;
        if (modalSumCobertura && currentCobertura) modalSumCobertura.textContent = currentCobertura.name;
        if (modalSumRecheio && currentRecheio) modalSumRecheio.textContent = currentRecheio.name;
        if (modalSumTopo && currentTopper) modalSumTopo.textContent = currentTopper.name;
        if (modalSumTotal) modalSumTotal.textContent = `R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        if (modalSumDeposit) modalSumDeposit.textContent = `R$ ${depositPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      } catch (err) {
        console.error('[Checkout] Erro seguro ao preencher modal:', err);
      }

      openModal(checkoutModal);
    };

    btnConcluirCriacao.addEventListener('click', handleConcluirClick);
  }

  closeCheckoutModal.addEventListener('click', () => closeModal(checkoutModal));
  closePolicyModal.addEventListener('click', () => closeModal(policyModal));
  closeAboutModal.addEventListener('click', () => closeModal(aboutModal));
  if (closeCustomCakeModal) {
    closeCustomCakeModal.addEventListener('click', () => closeModal(customCakeModal));
  }

  // Open Custom Cake Modal triggers
  if (btnCustomEventCake) {
    btnCustomEventCake.addEventListener('click', () => {
      openModal(customCakeModal);
    });
  }

  if (openCustomCakeNav) {
    openCustomCakeNav.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(customCakeModal);
    });
  }



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

  if (closeLightboxModal) {
    closeLightboxModal.addEventListener('click', () => closeModal(galeriaLightboxModal));
  }
  if (closeAdminLoginModal) {
    closeAdminLoginModal.addEventListener('click', () => closeModal(adminLoginModal));
  }
  if (closeAdminPanelModal) {
    closeAdminPanelModal.addEventListener('click', () => closeModal(adminPanelModal));
  }

  [checkoutModal, policyModal, aboutModal, customCakeModal, galeriaLightboxModal, adminLoginModal, adminPanelModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          const openedAt = Number(modal.dataset.openedAt || 0);
          // Previne fechamento imediato por synthetic click de toque no celular (< 450ms)
          if (Date.now() - openedAt < 450) {
            return;
          }
          closeModal(modal);
        }
      });
    }
  });

  // --- WHATSAPP CUSTOM CAKE GENERATOR ---
  if (btnSendCustomWhatsapp) {
    btnSendCustomWhatsapp.addEventListener('click', () => {
      const clientName = (customClientNameInput && customClientNameInput.value.trim()) || 'Cliente';
      const eventDate = (customDateInput && customDateInput.value) || '';
      const guests = (customGuestsInput && customGuestsInput.value.trim()) || 'A definir';
      const andares = (customAndaresSelect && customAndaresSelect.value) || '2 andares';
      const notes = (customNotesInput && customNotesInput.value.trim()) || '';

      let formattedDate = eventDate;
      if (eventDate && eventDate.includes('-')) {
        const parts = eventDate.split('-');
        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }

      const customMessage = 
`🎂 *SOLICITAÇÃO DE PROJETO: BOLO PERSONALIZADO*
*Ofir Bolos & Doces — Praia de Pipa / RN*
---------------------------------------------
Olá Lucieda! Gostaria de solicitar um orçamento para um bolo personalizado sob medida:

👥 *Quantidade de Pessoas:* ${guests}
🏛️ *Quantidade de Andares:* ${andares}
📅 *Data Prevista:* ${formattedDate || 'A definir'}
👤 *Nome do Cliente:* ${clientName}
${notes ? `📝 *Observações / Ideias:*\n"${notes}"\n` : ''}
Gostaria de consultar sua disponibilidade para realizarmos esse projeto em Praia de Pipa! ✨`;

      const encoded = encodeURIComponent(customMessage);
      window.open(`https://wa.me/5584987723897?text=${encoded}`, '_blank');
    });
  }

  // --- WHATSAPP ORDER GENERATOR ---
  btnSendWhatsapp.addEventListener('click', () => {
    const name = customerNameInput.value.trim() || 'Cliente';
    const pickupDate = pickupDateInput.value;
    const notes = orderNotesInput.value.trim();

    const currentSize = SIZES[state.sizeIndex];
    const currentMassa = MASSAS[state.massa];
    const currentCobertura = getCoberturaItem(state.cobertura);
    const currentRecheio = getRecheioItem(state.recheio);
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
• *Cobertura:* ${currentCobertura.name}
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
    window.open(`https://wa.me/5584987723897?text=${encodedMessage}`, '_blank');
  });

  // --- DYNAMIC SIZE PILLS LABEL UPDATE ---
  function updateSizePillsLabels() {
    sizePills.forEach((pill, idx) => {
      if (SIZES[idx]) {
        pill.innerHTML = `${SIZES[idx].name} <small>R$${SIZES[idx].price}</small>`;
      }
    });
  }

  // --- MOBILE DRAWER NAVIGATION (HAMBURGER MENU) ---
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileDrawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerCustomCakeBtn = document.getElementById('drawer-custom-cake-btn');
  const drawerPoliciesBtn = document.getElementById('drawer-policies-btn');
  const drawerAboutBtn = document.getElementById('drawer-about-btn');
  const drawerAdminBtn = document.getElementById('drawer-admin-btn');

  function openMobileDrawer() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.add('active');
    if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.add('active');
    if (mobileMenuToggle) {
      mobileMenuToggle.classList.add('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.remove('active');
    if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.remove('active');
    if (mobileMenuToggle) {
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileNavDrawer.classList.contains('active')) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  if (mobileDrawerBackdrop) mobileDrawerBackdrop.addEventListener('click', closeMobileDrawer);

  document.querySelectorAll('.mobile-nav-drawer .drawer-item[data-action="close"]').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  if (drawerCustomCakeBtn) {
    drawerCustomCakeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileDrawer();
      openModal(customCakeModal);
    });
  }

  if (drawerPoliciesBtn) {
    drawerPoliciesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileDrawer();
      openModal(policyModal);
    });
  }

  if (drawerAboutBtn) {
    drawerAboutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileDrawer();
      openModal(aboutModal);
    });
  }

  // --- GALERIA DO ATELIER ---
  const galeriaGrid = document.getElementById('galeria-grid');
  const galeriaFilters = document.getElementById('galeria-filters');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxWhatsappOrderBtn = document.getElementById('lightbox-whatsapp-order-btn');

  const INITIAL_CURATED_PHOTOS = [
    {
      id: 'foto-1',
      titulo: 'Bolo Casamento Clássico Floral',
      categoria: 'Casamento',
      imagem_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
      descricao: 'Cobertura acetinada com flores naturais e recheio refinado de ninho e morangos frescos.'
    },
    {
      id: 'foto-2',
      titulo: 'Bolo Rústico Boho Chic 15 Anos',
      categoria: '15 Anos',
      imagem_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
      descricao: 'Massa cacau nobre aveludada com ganache meio amargo e flores desidratadas.'
    },
    {
      id: 'foto-3',
      titulo: 'Bolo Redução de Maracujá Pipa',
      categoria: 'Aniversário',
      imagem_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      descricao: 'Textura acetinada em anéis artesanais com redução pura de maracujá e equilíbrio cítrico.'
    },
    {
      id: 'foto-4',
      titulo: 'Semi Naked Cake Pipa Beach',
      categoria: 'Especiais',
      imagem_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
      descricao: 'Visual rústico refinado ideal para eventos e mini-weddings à beira-mar em Praia de Pipa.'
    }
  ];

  let galeriaList = [...INITIAL_CURATED_PHOTOS];
  let activeGaleriaFilter = 'all';

  // --- SEGURANÇA: SANITIZAÇÃO DE ENTRADAS & PREVENÇÃO DE XSS (OWASP A03 / CWE-79) ---
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function sanitizeImageUrl(url) {
    if (!url) return 'assets/favicon.png';
    const cleanUrl = String(url).trim();
    // Permite apenas esquemas seguros contra ataques javascript: e data: maliciosos
    if (/^(https?:\/\/|\/|assets\/|data:image\/(png|jpe?g|webp);base64,)/i.test(cleanUrl)) {
      return cleanUrl;
    }
    return 'assets/favicon.png';
  }

  function renderGaleriaGrid() {
    if (!galeriaGrid) return;

    const filtered = activeGaleriaFilter === 'all'
      ? galeriaList
      : galeriaList.filter(item => item.categoria === activeGaleriaFilter);

    if (filtered.length === 0) {
      galeriaGrid.innerHTML = `
        <div class="galeria-empty-state">
          <p>Nenhuma criação cadastrada nesta categoria no momento.</p>
        </div>
      `;
      return;
    }

    galeriaGrid.innerHTML = filtered.map(item => `
      <article class="galeria-card" data-id="${escapeHTML(item.id)}">
        <div class="galeria-img-container">
          <img src="${sanitizeImageUrl(item.imagem_url)}" alt="${escapeHTML(item.titulo)}" class="galeria-card-img" loading="lazy">
          <span class="galeria-category-tag">${escapeHTML(item.categoria || 'Especial')}</span>
        </div>
        <div class="galeria-card-body">
          <h3 class="galeria-card-title">${escapeHTML(item.titulo)}</h3>
          <p class="galeria-card-desc">${escapeHTML(item.descricao || '')}</p>
          <div class="galeria-card-action">
            <span>Ver detalhes</span>
            <span>&rarr;</span>
          </div>
        </div>
      </article>
    `).join('');

    galeriaGrid.querySelectorAll('.galeria-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const item = galeriaList.find(x => String(x.id) === String(id));
        if (item) openGaleriaLightbox(item);
      });
    });
  }

  function openGaleriaLightbox(item) {
    if (!galeriaLightboxModal) return;
    lightboxImg.src = sanitizeImageUrl(item.imagem_url);
    lightboxCategory.textContent = item.categoria || 'Atelier';
    lightboxTitle.textContent = item.titulo;
    lightboxDesc.textContent = item.descricao || 'Criação artesanal exclusiva da Ofir Doceria sob encomenda em Praia de Pipa / RN.';

    if (lightboxWhatsappOrderBtn) {
      lightboxWhatsappOrderBtn.onclick = () => {
        const msg = `Olá Lucieda! Vi a foto do bolo "*${item.titulo}*" na galeria do site e gostaria de saber sobre valores e disponibilidade para o meu evento em Praia de Pipa! ✨`;
        window.open(`https://wa.me/5584987723897?text=${encodeURIComponent(msg)}`, '_blank');
      };
    }

    openModal(galeriaLightboxModal);
  }

  if (galeriaFilters) {
    galeriaFilters.querySelectorAll('.galeria-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        galeriaFilters.querySelectorAll('.galeria-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeGaleriaFilter = pill.getAttribute('data-filter') || 'all';
        renderGaleriaGrid();
      });
    });
  }

  async function loadGaleria() {
    if (window.OfirSupabase) {
      try {
        const dbItems = await window.OfirSupabase.fetchGallery();
        if (dbItems && Array.isArray(dbItems) && dbItems.length > 0) {
          galeriaList = dbItems;
        }
      } catch (e) {
        console.warn('[Galeria] Usando itens iniciais:', e);
      }
    }
    renderGaleriaGrid();
  }

  // --- VIEW SWITCHING: MONTE SEU BOLO vs GALERIA ---
  const viewMonteSeuBolo = document.getElementById('monte-seu-bolo');
  const viewGaleria = document.getElementById('galeria');
  const navMonteSeuBoloLinks = document.querySelectorAll('a[href="#monte-seu-bolo"]');
  const navGaleriaLinks = document.querySelectorAll('a[href="#galeria"]');
  const brandLogos = document.querySelectorAll('.brand-logo');

  function switchView(viewName, updateHistory = true) {
    const isGaleria = (viewName === 'galeria');

    if (isGaleria) {
      if (viewMonteSeuBolo) viewMonteSeuBolo.classList.add('view-hidden');
      if (viewGaleria) {
        viewGaleria.classList.remove('view-hidden');
        renderGaleriaGrid();
      }

      navMonteSeuBoloLinks.forEach(el => el.classList.remove('active'));
      navGaleriaLinks.forEach(el => el.classList.add('active'));

      if (updateHistory) {
        try {
          history.pushState({ view: 'galeria' }, '', '#galeria');
        } catch (_) {}
      }
    } else {
      if (viewGaleria) viewGaleria.classList.add('view-hidden');
      if (viewMonteSeuBolo) viewMonteSeuBolo.classList.remove('view-hidden');

      navMonteSeuBoloLinks.forEach(el => el.classList.add('active'));
      navGaleriaLinks.forEach(el => el.classList.remove('active'));

      if (updateHistory) {
        try {
          history.pushState({ view: 'monte-seu-bolo' }, '', '#monte-seu-bolo');
        } catch (_) {}
      }
    }

    // Smooth scroll to top of page when changing view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Bind click events on all Monte Seu Bolo & Galeria links (Header, Mobile Drawer, CTA banner)
  navGaleriaLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileDrawer();
      switchView('galeria');
    });
  });

  navMonteSeuBoloLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileDrawer();
      switchView('monte-seu-bolo');
    });
  });

  brandLogos.forEach(logo => {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileDrawer();
      switchView('monte-seu-bolo');
    });
  });

  // Handle browser back/forward buttons or hash change
  window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash === '#galeria') {
      switchView('galeria', false);
    } else {
      switchView('monte-seu-bolo', false);
    }
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash === '#galeria') {
      switchView('galeria', false);
    } else {
      switchView('monte-seu-bolo', false);
    }
  });

  // Check initial hash on load
  if (window.location.hash === '#galeria') {
    switchView('galeria', false);
  }

  // --- ADMIN SYSTEM & SUPABASE MODALS ---
  const headerAdminBtn = document.getElementById('header-admin-btn');
  const footerAdminBtn = document.getElementById('footer-admin-btn');
  const adminTopBanner = document.getElementById('admin-top-banner');
  const btnOpenAdminDashboard = document.getElementById('btn-open-admin-dashboard');
  const btnAdminLogout = document.getElementById('btn-admin-logout');
  const btnPanelLogout = document.getElementById('btn-panel-logout');

  // Login
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminLoginEmail = document.getElementById('admin-login-email');
  const adminLoginPassword = document.getElementById('admin-login-password');
  const adminLoginMsg = document.getElementById('admin-login-msg');
  const btnAdminSubmitLogin = document.getElementById('btn-admin-submit-login');

  // Tabs
  const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
  const adminTabContents = document.querySelectorAll('.admin-tab-content');

  // Preços
  const pricesEditorGrid = document.getElementById('prices-editor-grid');
  const adminPriceTopper = document.getElementById('admin-price-topper');
  const btnSavePrices = document.getElementById('btn-save-prices');
  const pricesSaveStatus = document.getElementById('prices-save-status');

  // Upload Galeria
  const uploadDropzone = document.getElementById('upload-dropzone');
  const galeriaFileInput = document.getElementById('galeria-file-input');
  const dropzoneEmpty = document.getElementById('dropzone-empty');
  const dropzonePreview = document.getElementById('dropzone-preview');
  const previewImg = document.getElementById('preview-img');
  const previewFilename = document.getElementById('preview-filename');
  const previewSizeBadge = document.getElementById('preview-size-badge');
  const btnRemovePreview = document.getElementById('btn-remove-preview');
  const uploadFotoTitulo = document.getElementById('upload-foto-titulo');
  const uploadFotoCategoria = document.getElementById('upload-foto-categoria');
  const uploadFotoDesc = document.getElementById('upload-foto-desc');
  const btnSubmitUploadFoto = document.getElementById('btn-submit-upload-foto');
  const uploadSaveStatus = document.getElementById('upload-save-status');
  const adminGaleriaItems = document.getElementById('admin-galeria-items');

  // Coberturas Admin
  const newCoberturaName = document.getElementById('new-cobertura-name');
  const newCoberturaDesc = document.getElementById('new-cobertura-desc');
  const newCoberturaIcon = document.getElementById('new-cobertura-icon');
  const btnAddCobertura = document.getElementById('btn-add-cobertura');
  const coberturasSaveStatus = document.getElementById('coberturas-save-status');
  const adminCoberturasItems = document.getElementById('admin-coberturas-items');

  // Recheios Admin
  const newRecheioName = document.getElementById('new-recheio-name');
  const newRecheioDesc = document.getElementById('new-recheio-desc');
  const newRecheioIcon = document.getElementById('new-recheio-icon');
  const btnAddRecheio = document.getElementById('btn-add-recheio');
  const recheiosSaveStatus = document.getElementById('recheios-save-status');
  const adminRecheiosItems = document.getElementById('admin-recheios-items');

  let currentAdminSession = null;
  let stagedUploadFile = null;

  function setAdminAuthState(session) {
    currentAdminSession = session;
    if (session) {
      if (adminTopBanner) adminTopBanner.style.display = 'block';
    } else {
      if (adminTopBanner) adminTopBanner.style.display = 'none';
    }
  }

  function handleAdminAccessClick() {
    closeMobileDrawer();
    if (currentAdminSession) {
      openAdminPanel();
    } else {
      openModal(adminLoginModal);
    }
  }

  if (headerAdminBtn) headerAdminBtn.addEventListener('click', handleAdminAccessClick);
  if (drawerAdminBtn) {
    drawerAdminBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleAdminAccessClick();
    });
  }
  if (footerAdminBtn) footerAdminBtn.addEventListener('click', handleAdminAccessClick);
  if (btnOpenAdminDashboard) btnOpenAdminDashboard.addEventListener('click', openAdminPanel);

  function openAdminPanel() {
    renderPricesEditor();
    renderAdminCoberturasList();
    renderAdminRecheiosList();
    renderAdminGaleriaList();
    openModal(adminPanelModal);
  }

  // Admin Login Handler
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = adminLoginEmail.value.trim();
      const password = adminLoginPassword.value;

      btnAdminSubmitLogin.disabled = true;
      btnAdminSubmitLogin.querySelector('span').textContent = 'Validando acesso...';
      adminLoginMsg.style.display = 'none';
      adminLoginMsg.className = 'admin-auth-msg';

      try {
        if (!window.OfirSupabase) throw new Error('Cliente Supabase não carregado.');
        const res = await window.OfirSupabase.signInAdmin(email, password);
        setAdminAuthState(res.session);

        adminLoginMsg.textContent = '✓ Login efetuado com sucesso!';
        adminLoginMsg.className = 'admin-auth-msg success';
        adminLoginMsg.style.display = 'block';

        setTimeout(() => {
          closeModal(adminLoginModal);
          openAdminPanel();
        }, 600);
      } catch (err) {
        adminLoginMsg.textContent = err.message === 'Invalid login credentials' 
          ? 'E-mail ou senha incorretos. Verifique suas credenciais no Supabase.'
          : `Erro de login: ${err.message || 'Falha na autenticação'}`;
        adminLoginMsg.className = 'admin-auth-msg error';
        adminLoginMsg.style.display = 'block';
      } finally {
        btnAdminSubmitLogin.disabled = false;
        btnAdminSubmitLogin.querySelector('span').textContent = 'Entrar no Painel';
      }
    });
  }

  async function handleAdminLogout() {
    if (window.OfirSupabase) {
      try {
        await window.OfirSupabase.signOutAdmin();
      } catch (e) {
        console.warn('Erro ao sair:', e);
      }
    }
    setAdminAuthState(null);
    closeModal(adminPanelModal);
  }

  if (btnAdminLogout) btnAdminLogout.addEventListener('click', handleAdminLogout);
  if (btnPanelLogout) btnPanelLogout.addEventListener('click', handleAdminLogout);

  // Tab switching
  adminTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      adminTabBtns.forEach(b => b.classList.remove('active'));
      adminTabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(tabId);
      if (targetContent) targetContent.classList.add('active');

      if (tabId === 'tab-galeria') {
        renderAdminGaleriaList();
      } else if (tabId === 'tab-coberturas') {
        renderAdminCoberturasList();
      } else if (tabId === 'tab-recheios') {
        renderAdminRecheiosList();
      }
    });
  });

  // Render Prices Editor
  function renderPricesEditor() {
    if (!pricesEditorGrid) return;
    pricesEditorGrid.innerHTML = SIZES.map(size => `
      <div class="price-edit-item">
        <div class="price-edit-item-header">
          <strong>${escapeHTML(size.name)}</strong>
          <span>${escapeHTML(size.slices)} (${escapeHTML(size.diameter)})</span>
        </div>
        <div class="input-currency-wrap">
          <span>R$</span>
          <input type="number" min="10" step="1" id="input-price-${escapeHTML(size.id)}" value="${escapeHTML(size.price)}">
        </div>
      </div>
    `).join('');

    if (adminPriceTopper && TOPPERS['3d']) {
      adminPriceTopper.value = TOPPERS['3d'].extra;
    }
  }

  // Save Prices
  if (btnSavePrices) {
    btnSavePrices.addEventListener('click', async () => {
      btnSavePrices.disabled = true;
      btnSavePrices.querySelector('span').textContent = 'Salvando preços...';
      pricesSaveStatus.textContent = '';
      pricesSaveStatus.className = 'admin-save-status';

      try {
        SIZES.forEach(size => {
          const inp = document.getElementById(`input-price-${size.id}`);
          if (inp && inp.value) {
            size.price = Number(inp.value);
          }
        });

        if (adminPriceTopper && adminPriceTopper.value) {
          TOPPERS['3d'].extra = Number(adminPriceTopper.value);
          TOPPERS['3d'].name = `Especial 3D (+ R$ ${TOPPERS['3d'].extra.toFixed(2).replace('.', ',')})`;
        }

        if (window.OfirSupabase) {
          await window.OfirSupabase.savePrices(SIZES);
        }

        updateSizePillsLabels();
        updateApp();

        pricesSaveStatus.textContent = '✓ Preços atualizados no site e no Supabase!';
        pricesSaveStatus.className = 'admin-save-status success';
      } catch (err) {
        pricesSaveStatus.textContent = `Erro ao salvar: ${err.message || 'Falha na conexão'}`;
        pricesSaveStatus.className = 'admin-save-status error';
      } finally {
        btnSavePrices.disabled = false;
        btnSavePrices.querySelector('span').textContent = 'Salvar Alterações de Preço';
      }
    });
  }

  // --- COBERTURAS: DYNAMIC RENDERER IN CUSTOMIZER ---
  function renderCustomizerCoberturas() {
    if (!coberturaListContainer) return;

    if (coberturasCountBadge) {
      coberturasCountBadge.textContent = `${coberturasList.length} Opções`;
    }

    // Verify if state.cobertura exists in coberturasList; if not, fallback to first
    if (!coberturasList.some(c => c.id === state.cobertura)) {
      if (coberturasList.length > 0) {
        state.cobertura = coberturasList[0].id;
      }
    }

    coberturaListContainer.innerHTML = coberturasList.map(cobertura => {
      const isChecked = state.cobertura === cobertura.id;
      const iconDisplay = cobertura.icon || '🧁';
      return `
        <label class="cobertura-item recheio-item ${isChecked ? 'active' : ''}" data-cobertura="${escapeHTML(cobertura.id)}">
          <input type="radio" name="cake-cobertura" value="${escapeHTML(cobertura.id)}" ${isChecked ? 'checked' : ''}>
          <div class="recheio-indicator"></div>
          <div class="recheio-content">
            <div class="recheio-name">
              <span class="recheio-emoji" aria-hidden="true">${escapeHTML(iconDisplay)}</span>
              <strong>${escapeHTML(cobertura.name)}</strong>
            </div>
            <div class="recheio-desc">${escapeHTML(cobertura.desc || '')}</div>
          </div>
        </label>
      `;
    }).join('');

    coberturaListContainer.querySelectorAll('.cobertura-item').forEach(item => {
      item.addEventListener('click', () => {
        const val = item.getAttribute('data-cobertura');
        if (val && state.cobertura !== val) {
          state.cobertura = val;
          updateApp();
        }
      });
    });
  }

  // --- COBERTURAS: ADMIN MANAGEMENT ---
  function renderAdminCoberturasList() {
    if (!adminCoberturasItems) return;

    if (coberturasList.length === 0) {
      adminCoberturasItems.innerHTML = '<p class="tab-subtext">Nenhuma cobertura cadastrada no momento.</p>';
      return;
    }

    adminCoberturasItems.innerHTML = coberturasList.map(item => `
      <div class="admin-recheio-item admin-cobertura-item" data-id="${escapeHTML(item.id)}">
        <span class="admin-recheio-icon">${escapeHTML(item.icon || '🧁')}</span>
        <div class="admin-recheio-details">
          <strong>${escapeHTML(item.name)}</strong>
          <span>${escapeHTML(item.desc || 'Sem descrição')}</span>
        </div>
        <button class="admin-cobertura-delete-btn" data-id="${escapeHTML(item.id)}" title="Excluir cobertura" ${coberturasList.length <= 1 ? 'disabled title="Mínimo de 1 cobertura necessária"' : ''}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </div>
    `).join('');

    adminCoberturasItems.querySelectorAll('.admin-cobertura-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const cobertura = coberturasList.find(c => c.id === id);
        const name = cobertura ? cobertura.name : id;

        if (coberturasList.length <= 1) {
          alert('É necessário manter pelo menos 1 cobertura cadastrada para o simulador.');
          return;
        }

        if (confirm(`Tem certeza que deseja remover a cobertura "${name}"?`)) {
          btn.disabled = true;
          coberturasList = coberturasList.filter(c => c.id !== id);
          if (state.cobertura === id && coberturasList.length > 0) {
            state.cobertura = coberturasList[0].id;
          }

          renderCustomizerCoberturas();
          renderAdminCoberturasList();
          updateApp();

          if (coberturasSaveStatus) {
            coberturasSaveStatus.textContent = 'Salvando alterações...';
            coberturasSaveStatus.className = 'admin-save-status';
          }

          if (window.OfirSupabase && window.OfirSupabase.saveCoberturas) {
            try {
              await window.OfirSupabase.saveCoberturas(coberturasList);
              if (coberturasSaveStatus) {
                coberturasSaveStatus.textContent = '✓ Cobertura removida com sucesso!';
                coberturasSaveStatus.className = 'admin-save-status success';
              }
            } catch (err) {
              if (coberturasSaveStatus) {
                coberturasSaveStatus.textContent = `Aviso: salvo localmente (${err.message || 'offline'})`;
                coberturasSaveStatus.className = 'admin-save-status error';
              }
            }
          }
        }
      });
    });
  }

  function setupAdminCoberturas() {
    if (!btnAddCobertura) return;

    btnAddCobertura.addEventListener('click', async () => {
      const name = (newCoberturaName && newCoberturaName.value.trim()) || '';
      const desc = (newCoberturaDesc && newCoberturaDesc.value.trim()) || '';
      const icon = (newCoberturaIcon && newCoberturaIcon.value) || '🧁';

      if (!name) {
        alert('Por favor, informe o nome da cobertura.');
        if (newCoberturaName) newCoberturaName.focus();
        return;
      }

      // Generate a slug ID
      const baseSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');

      let id = baseSlug || 'cobertura';
      let counter = 1;
      while (coberturasList.some(c => c.id === id)) {
        id = `${baseSlug}_${counter++}`;
      }

      const newCobertura = {
        id: id,
        name: name,
        desc: desc,
        icon: icon
      };

      btnAddCobertura.disabled = true;
      btnAddCobertura.querySelector('span').textContent = 'Cadastrando...';
      if (coberturasSaveStatus) {
        coberturasSaveStatus.textContent = '';
        coberturasSaveStatus.className = 'admin-save-status';
      }

      try {
        coberturasList.push(newCobertura);

        renderCustomizerCoberturas();
        renderAdminCoberturasList();
        updateApp();

        if (window.OfirSupabase && window.OfirSupabase.saveCoberturas) {
          await window.OfirSupabase.saveCoberturas(coberturasList);
        }

        // Clear input form
        if (newCoberturaName) newCoberturaName.value = '';
        if (newCoberturaDesc) newCoberturaDesc.value = '';
        if (newCoberturaIcon) newCoberturaIcon.value = '🧁';

        if (coberturasSaveStatus) {
          coberturasSaveStatus.textContent = '✓ Nova cobertura cadastrada com sucesso!';
          coberturasSaveStatus.className = 'admin-save-status success';
        }
      } catch (err) {
        if (coberturasSaveStatus) {
          coberturasSaveStatus.textContent = `Aviso: salvo localmente (${err.message || 'offline'})`;
          coberturasSaveStatus.className = 'admin-save-status error';
        }
      } finally {
        btnAddCobertura.disabled = false;
        btnAddCobertura.querySelector('span').textContent = 'Cadastrar Nova Cobertura';
      }
    });
  }

  async function loadInitialCoberturas() {
    if (window.OfirSupabase && window.OfirSupabase.fetchCoberturas) {
      try {
        const dbCoberturas = await window.OfirSupabase.fetchCoberturas();
        if (dbCoberturas && Array.isArray(dbCoberturas) && dbCoberturas.length > 0) {
          coberturasList = dbCoberturas;
        }
      } catch (err) {
        console.warn('Usando lista padrão de coberturas:', err);
      }
    }
    renderCustomizerCoberturas();
    updateApp();
  }

  // --- RECHEIOS: DYNAMIC RENDERER IN CUSTOMIZER ---
  function renderCustomizerRecheios() {
    if (!recheioListContainer) return;

    if (recheiosCountBadge) {
      recheiosCountBadge.textContent = `${recheiosList.length} Opções`;
    }

    // Verify if state.recheio exists in recheiosList; if not, fallback to first
    if (!recheiosList.some(r => r.id === state.recheio)) {
      if (recheiosList.length > 0) {
        state.recheio = recheiosList[0].id;
      }
    }

    recheioListContainer.innerHTML = recheiosList.map(recheio => {
      const isChecked = state.recheio === recheio.id;
      const iconDisplay = recheio.icon || '🍰';
      return `
        <label class="recheio-item ${isChecked ? 'active' : ''}" data-recheio="${escapeHTML(recheio.id)}">
          <input type="radio" name="recheio" value="${escapeHTML(recheio.id)}" ${isChecked ? 'checked' : ''}>
          <div class="recheio-custom-radio"></div>
          <div class="recheio-content">
            <div class="recheio-name">
              <span class="recheio-emoji" aria-hidden="true">${escapeHTML(iconDisplay)}</span>
              <strong>${escapeHTML(recheio.name)}</strong>
            </div>
            <div class="recheio-desc">${escapeHTML(recheio.desc || '')}</div>
          </div>
        </label>
      `;
    }).join('');

    recheioListContainer.querySelectorAll('.recheio-item').forEach(item => {
      item.addEventListener('click', () => {
        const val = item.getAttribute('data-recheio');
        if (val && state.recheio !== val) {
          state.recheio = val;
          updateApp();
        }
      });
    });
  }

  // --- RECHEIOS: ADMIN MANAGEMENT ---
  function renderAdminRecheiosList() {
    if (!adminRecheiosItems) return;

    if (recheiosList.length === 0) {
      adminRecheiosItems.innerHTML = '<p class="tab-subtext">Nenhum recheio cadastrado no momento.</p>';
      return;
    }

    adminRecheiosItems.innerHTML = recheiosList.map(item => `
      <div class="admin-recheio-item" data-id="${escapeHTML(item.id)}">
        <span class="admin-recheio-icon">${escapeHTML(item.icon || '🍰')}</span>
        <div class="admin-recheio-details">
          <strong>${escapeHTML(item.name)}</strong>
          <span>${escapeHTML(item.desc || 'Sem descrição')}</span>
        </div>
        <button class="admin-recheio-delete-btn" data-id="${escapeHTML(item.id)}" title="Excluir recheio" ${recheiosList.length <= 1 ? 'disabled title="Mínimo de 1 recheio necessário"' : ''}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </div>
    `).join('');

    adminRecheiosItems.querySelectorAll('.admin-recheio-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const recheio = recheiosList.find(r => r.id === id);
        const name = recheio ? recheio.name : id;

        if (recheiosList.length <= 1) {
          alert('É necessário manter pelo menos 1 recheio cadastrado para o simulador.');
          return;
        }

        if (confirm(`Tem certeza que deseja remover o recheio "${name}"?`)) {
          btn.disabled = true;
          recheiosList = recheiosList.filter(r => r.id !== id);
          if (state.recheio === id && recheiosList.length > 0) {
            state.recheio = recheiosList[0].id;
          }

          renderCustomizerRecheios();
          renderAdminRecheiosList();
          updateApp();

          if (recheiosSaveStatus) {
            recheiosSaveStatus.textContent = 'Salvando alterações...';
            recheiosSaveStatus.className = 'admin-save-status';
          }

          if (window.OfirSupabase && window.OfirSupabase.saveRecheios) {
            try {
              await window.OfirSupabase.saveRecheios(recheiosList);
              if (recheiosSaveStatus) {
                recheiosSaveStatus.textContent = '✓ Recheio removido com sucesso!';
                recheiosSaveStatus.className = 'admin-save-status success';
              }
            } catch (err) {
              if (recheiosSaveStatus) {
                recheiosSaveStatus.textContent = `Aviso: salvo localmente (${err.message || 'offline'})`;
                recheiosSaveStatus.className = 'admin-save-status error';
              }
            }
          }
        }
      });
    });
  }

  function setupAdminRecheios() {
    if (!btnAddRecheio) return;

    btnAddRecheio.addEventListener('click', async () => {
      const name = (newRecheioName && newRecheioName.value.trim()) || '';
      const desc = (newRecheioDesc && newRecheioDesc.value.trim()) || '';
      const icon = (newRecheioIcon && newRecheioIcon.value) || '🍰';

      if (!name) {
        alert('Por favor, informe o nome do recheio.');
        if (newRecheioName) newRecheioName.focus();
        return;
      }

      // Generate a slug ID
      const baseSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');

      let id = baseSlug || 'recheio';
      let counter = 1;
      while (recheiosList.some(r => r.id === id)) {
        id = `${baseSlug}_${counter++}`;
      }

      const newRecheio = {
        id: id,
        name: name,
        desc: desc,
        icon: icon,
        eq: Math.floor(Math.random() * 8) + 90, // 90-97
        comp: Math.floor(Math.random() * 15) + 75 // 75-90
      };

      btnAddRecheio.disabled = true;
      btnAddRecheio.querySelector('span').textContent = 'Cadastrando...';
      if (recheiosSaveStatus) {
        recheiosSaveStatus.textContent = '';
        recheiosSaveStatus.className = 'admin-save-status';
      }

      try {
        recheiosList.push(newRecheio);

        renderCustomizerRecheios();
        renderAdminRecheiosList();
        updateApp();

        if (window.OfirSupabase && window.OfirSupabase.saveRecheios) {
          await window.OfirSupabase.saveRecheios(recheiosList);
        }

        // Clear input form
        if (newRecheioName) newRecheioName.value = '';
        if (newRecheioDesc) newRecheioDesc.value = '';
        if (newRecheioIcon) newRecheioIcon.value = '🍰';

        if (recheiosSaveStatus) {
          recheiosSaveStatus.textContent = '✓ Novo recheio cadastrado com sucesso!';
          recheiosSaveStatus.className = 'admin-save-status success';
        }
      } catch (err) {
        if (recheiosSaveStatus) {
          recheiosSaveStatus.textContent = `Aviso: salvo localmente (${err.message || 'offline'})`;
          recheiosSaveStatus.className = 'admin-save-status error';
        }
      } finally {
        btnAddRecheio.disabled = false;
        btnAddRecheio.querySelector('span').textContent = 'Cadastrar Novo Recheio';
      }
    });
  }

  async function loadInitialRecheios() {
    if (window.OfirSupabase && window.OfirSupabase.fetchRecheios) {
      try {
        const dbRecheios = await window.OfirSupabase.fetchRecheios();
        if (dbRecheios && Array.isArray(dbRecheios) && dbRecheios.length > 0) {
          recheiosList = dbRecheios;
        }
      } catch (err) {
        console.warn('Usando lista padrão de recheios:', err);
      }
    }
    renderCustomizerRecheios();
    updateApp();
  }

  // Upload Dropzone & Automatic Client-side Compression
  function setupUploadDropzone() {
    if (!uploadDropzone || !galeriaFileInput) return;

    uploadDropzone.addEventListener('click', () => {
      galeriaFileInput.click();
    });

    uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropzone.classList.add('dragover');
    });

    uploadDropzone.addEventListener('dragleave', () => {
      uploadDropzone.classList.remove('dragover');
    });

    uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processSelectedPhoto(e.dataTransfer.files[0]);
      }
    });

    galeriaFileInput.addEventListener('change', () => {
      if (galeriaFileInput.files && galeriaFileInput.files[0]) {
        processSelectedPhoto(galeriaFileInput.files[0]);
      }
    });

    if (btnRemovePreview) {
      btnRemovePreview.addEventListener('click', (e) => {
        e.stopPropagation();
        resetUploadDropzone();
      });
    }
  }

  async function processSelectedPhoto(file) {
    if (!file.type.startsWith('image/')) {
      alert('Selecione um arquivo de foto (JPEG, PNG ou WEBP).');
      return;
    }

    dropzoneEmpty.style.display = 'none';
    dropzonePreview.style.display = 'flex';
    previewFilename.textContent = file.name;
    previewSizeBadge.textContent = 'Otimizando...';

    // Show preview thumbnail
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
    };
    reader.readAsDataURL(file);

    // Auto-compress in background
    if (window.OfirSupabase && window.OfirSupabase.compressImage) {
      try {
        const compressed = await window.OfirSupabase.compressImage(file);
        stagedUploadFile = compressed;
        const origKb = (file.size / 1024).toFixed(0);
        const optKb = (compressed.size / 1024).toFixed(0);
        previewSizeBadge.textContent = `${origKb}KB ➔ ${optKb}KB (Otimizado)`;
      } catch (err) {
        stagedUploadFile = file;
        previewSizeBadge.textContent = `${(file.size / 1024).toFixed(0)}KB`;
      }
    } else {
      stagedUploadFile = file;
      previewSizeBadge.textContent = `${(file.size / 1024).toFixed(0)}KB`;
    }
  }

  function resetUploadDropzone() {
    stagedUploadFile = null;
    galeriaFileInput.value = '';
    dropzoneEmpty.style.display = 'flex';
    dropzonePreview.style.display = 'none';
    previewImg.src = '';
  }

  // Upload Photo to Supabase
  if (btnSubmitUploadFoto) {
    btnSubmitUploadFoto.addEventListener('click', async () => {
      if (!stagedUploadFile) {
        alert('Por favor, selecione uma imagem para a foto do bolo.');
        return;
      }
      const title = uploadFotoTitulo.value.trim();
      if (!title) {
        alert('Por favor, informe o título do bolo.');
        uploadFotoTitulo.focus();
        return;
      }

      btnSubmitUploadFoto.disabled = true;
      btnSubmitUploadFoto.querySelector('span').textContent = 'Otimizando e enviando foto...';
      uploadSaveStatus.textContent = '';
      uploadSaveStatus.className = 'admin-save-status';

      try {
        if (!window.OfirSupabase) throw new Error('Cliente Supabase não carregado.');

        await window.OfirSupabase.uploadGalleryPhoto(stagedUploadFile, {
          title: title,
          category: uploadFotoCategoria.value,
          description: uploadFotoDesc.value
        });

        uploadSaveStatus.textContent = '✓ Foto publicada com sucesso no portfólio!';
        uploadSaveStatus.className = 'admin-save-status success';

        resetUploadDropzone();
        uploadFotoTitulo.value = '';
        uploadFotoDesc.value = '';

        await loadGaleria();
        renderAdminGaleriaList();
      } catch (err) {
        uploadSaveStatus.textContent = `Erro ao publicar foto: ${err.message || 'Falha no envio'}`;
        uploadSaveStatus.className = 'admin-save-status error';
      } finally {
        btnSubmitUploadFoto.disabled = false;
        btnSubmitUploadFoto.querySelector('span').textContent = 'Publicar Foto na Galeria';
      }
    });
  }

  // Render Admin Gallery List (with deletion)
  function renderAdminGaleriaList() {
    if (!adminGaleriaItems) return;
    if (galeriaList.length === 0) {
      adminGaleriaItems.innerHTML = '<p class="tab-subtext">Nenhuma foto no portfólio ainda.</p>';
      return;
    }

    adminGaleriaItems.innerHTML = galeriaList.map(item => `
      <div class="admin-photo-item" data-id="${escapeHTML(item.id)}">
        <img src="${sanitizeImageUrl(item.imagem_url)}" alt="${escapeHTML(item.titulo)}" class="admin-photo-thumb" loading="lazy">
        <div class="admin-photo-details">
          <strong>${escapeHTML(item.titulo)}</strong>
          <span>${escapeHTML(item.categoria || 'Especial')}</span>
        </div>
        <button class="admin-photo-delete-btn" data-id="${escapeHTML(item.id)}" data-url="${escapeHTML(item.imagem_url)}" title="Excluir foto">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </div>
    `).join('');

    adminGaleriaItems.querySelectorAll('.admin-photo-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const url = btn.getAttribute('data-url');
        if (confirm('Tem certeza que deseja remover esta foto da galeria?')) {
          try {
            btn.disabled = true;
            if (window.OfirSupabase) {
              await window.OfirSupabase.deleteGalleryPhoto(id, url);
            }
            await loadGaleria();
            renderAdminGaleriaList();
          } catch (err) {
            alert(`Erro ao excluir: ${err.message}`);
          }
        }
      });
    });
  }

  // Initial Load of Prices from Supabase
  async function loadInitialPrices() {
    if (window.OfirSupabase) {
      try {
        const dbPrices = await window.OfirSupabase.fetchPrices();
        if (dbPrices && Array.isArray(dbPrices) && dbPrices.length > 0) {
          dbPrices.forEach(item => {
            const sizeObj = SIZES.find(s => s.id === item.id);
            if (sizeObj) {
              sizeObj.price = Number(item.price);
            }
          });
          updateSizePillsLabels();
          updateApp();
        }
      } catch (err) {
        console.warn('Usando tabela padrão de preços:', err);
      }
    }
  }

  // Check Existing Admin Session
  async function checkAdminSessionOnBoot() {
    if (window.OfirSupabase) {
      try {
        const session = await window.OfirSupabase.getAdminSession();
        setAdminAuthState(session);

        window.OfirSupabase.onAuthStateChange((event, session) => {
          setAdminAuthState(session);
        });
      } catch (err) {
        console.warn('Erro ao verificar sessão admin:', err);
      }
    }
  }

  // Initialize Modules
  async function initAppIntegrations() {
    setupUploadDropzone();
    setupAdminCoberturas();
    setupAdminRecheios();
    if (window.OfirSupabase && window.OfirSupabase.autoDetectVercelConfig) {
      await window.OfirSupabase.autoDetectVercelConfig();
    }
    await loadInitialPrices();
    await loadInitialCoberturas();
    await loadInitialRecheios();
    await loadGaleria();
    await checkAdminSessionOnBoot();
  }
  initAppIntegrations();

  // Initial render
  renderCustomizerCoberturas();
  renderCustomizerRecheios();
  updateApp();
});
