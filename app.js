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

  let lastRecordedQuoteSig = '';
  let lastRecordedQuoteAt = 0;

  function recordOrcamentoSilently(payload) {
    if (!window.OfirSupabase || !window.OfirSupabase.saveOrcamento) return;
    try {
      const sig = JSON.stringify(payload);
      const now = Date.now();
      if (sig === lastRecordedQuoteSig && now - lastRecordedQuoteAt < 2500) {
        return;
      }
      lastRecordedQuoteSig = sig;
      lastRecordedQuoteAt = now;
      window.OfirSupabase.saveOrcamento(payload).catch(err => {
        console.warn('[Orçamento] Falha silenciosa ao registrar:', err);
      });
    } catch (err) {
      console.warn('[Orçamento] Erro ao preparar registro:', err);
    }
  }

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

      recordOrcamentoSilently({
        tipo: 'Personalizado',
        cliente_nome: clientName,
        data_retirada: eventDate || null,
        tamanho: `${andares} • ${guests}`,
        massa: 'Sob medida',
        cobertura: 'Sob medida',
        recheio: 'Sob medida',
        topo: 'Personalizado',
        valor_total: null,
        sinal: null,
        observacoes: notes,
        escolhas: {
          guests,
          andares,
          notes
        }
      });

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

    recordOrcamentoSilently({
      tipo: 'Monte seu Bolo',
      cliente_nome: name,
      data_retirada: pickupDate || null,
      tamanho: `${currentSize.name} ${currentSize.slices} (${currentSize.diameter})`,
      massa: currentMassa.name,
      cobertura: currentCobertura.name,
      recheio: currentRecheio.name,
      topo: currentTopper.name,
      valor_total: totalPrice,
      sinal: depositPrice,
      observacoes: notes,
      escolhas: {
        size_id: currentSize.id,
        size_name: currentSize.name,
        slices: currentSize.slices,
        diameter: currentSize.diameter,
        massa_id: state.massa,
        massa_name: currentMassa.name,
        cobertura_id: state.cobertura,
        cobertura_name: currentCobertura.name,
        recheio_id: state.recheio,
        recheio_name: currentRecheio.name,
        topper_id: state.topper,
        topper_name: currentTopper.name,
        valor_total: totalPrice,
        sinal: depositPrice
      }
    });

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

  // Orçamentos Admin
  const adminOrcamentosList = document.getElementById('admin-orcamentos-list');
  const orcamentosSearchInput = document.getElementById('orcamentos-search-input');
  const orcamentosFilterStatus = document.getElementById('orcamentos-filter-status');
  const btnRefreshOrcamentos = document.getElementById('btn-refresh-orcamentos');
  const orcamentosCountLabel = document.getElementById('orcamentos-count-label');
  const orcamentosStatusMsg = document.getElementById('orcamentos-status-msg');
  const orcamentosTabBadge = document.getElementById('orcamentos-tab-badge');

  let currentAdminSession = null;
  let stagedUploadFile = null;
  let adminOrcamentosCache = [];
  let orcamentosTableMissing = false;

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
    loadAdminOrcamentos();
    renderPricesEditor();
    renderAdminCoberturasList();
    renderAdminRecheiosList();
    renderAdminGaleriaList();
    loadEstoqueData();
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

      if (tabId === 'tab-orcamentos') {
        loadAdminOrcamentos();
      } else if (tabId === 'tab-galeria') {
        renderAdminGaleriaList();
      } else if (tabId === 'tab-coberturas') {
        renderAdminCoberturasList();
      } else if (tabId === 'tab-recheios') {
        renderAdminRecheiosList();
      } else if (tabId === 'tab-estoque') {
        loadEstoqueData();
      }
    });
  });

  // --- ORÇAMENTOS: ADMIN MANAGEMENT ---
  function formatDatePtBr(dateStr) {
    if (!dateStr) return 'A definir';
    const str = String(dateStr).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      const [y, m, d] = str.slice(0, 10).split('-');
      return `${d}/${m}/${y}`;
    }
    return str;
  }

  function formatDateTimePtBr(isoStr) {
    if (!isoStr) return 'Data indisponível';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return String(isoStr);
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (_) {
      return String(isoStr);
    }
  }

  function formatMoneyPtBr(val) {
    if (val === null || val === undefined || val === '') return 'Sob consulta';
    const num = Number(val);
    if (isNaN(num)) return 'Sob consulta';
    return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function getOrcamentoStatusClass(status) {
    const s = String(status || 'Pendente').toLowerCase();
    if (s.includes('confirm')) return 'status-confirmado';
    if (s.includes('conclu')) return 'status-concluido';
    if (s.includes('cancel')) return 'status-cancelado';
    return 'status-pendente';
  }

  async function loadAdminOrcamentos() {
    if (!adminOrcamentosList) return;
    adminOrcamentosList.innerHTML = '<div class="orcamentos-empty-box"><p>Carregando orçamentos salvos...</p></div>';
    if (orcamentosCountLabel) orcamentosCountLabel.textContent = 'Buscando registros...';

    try {
      if (window.OfirSupabase && window.OfirSupabase.fetchOrcamentos) {
        const res = await window.OfirSupabase.fetchOrcamentos();
        adminOrcamentosCache = res.items || [];
        orcamentosTableMissing = Boolean(res.tableMissing);
      } else {
        adminOrcamentosCache = [];
        orcamentosTableMissing = false;
      }
    } catch (err) {
      console.warn('[Admin Orçamentos] Falha ao carregar:', err);
      adminOrcamentosCache = [];
    }

    renderAdminOrcamentosList();
  }

  function renderAdminOrcamentosList() {
    if (!adminOrcamentosList) return;

    const totalAll = adminOrcamentosCache.length;
    if (orcamentosTabBadge) {
      if (totalAll > 0) {
        orcamentosTabBadge.textContent = String(totalAll);
        orcamentosTabBadge.style.display = 'inline-flex';
      } else {
        orcamentosTabBadge.style.display = 'none';
      }
    }

    const query = (orcamentosSearchInput && orcamentosSearchInput.value.trim().toLowerCase()) || '';
    const statusFilter = (orcamentosFilterStatus && orcamentosFilterStatus.value) || 'all';

    const filtered = adminOrcamentosCache.filter(item => {
      const itemStatus = item.status || 'Pendente';
      if (statusFilter !== 'all' && itemStatus !== statusFilter) {
        return false;
      }
      if (!query) return true;

      const searchable = [
        item.cliente_nome,
        item.tipo,
        item.tamanho,
        item.massa,
        item.cobertura,
        item.recheio,
        item.topo,
        item.observacoes,
        formatDatePtBr(item.data_retirada),
        formatDateTimePtBr(item.created_at)
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });

    if (orcamentosCountLabel) {
      if (totalAll === 0) {
        orcamentosCountLabel.textContent = 'Nenhum orçamento registrado ainda';
      } else if (filtered.length === totalAll) {
        orcamentosCountLabel.textContent = `${totalAll} ${totalAll === 1 ? 'orçamento solicitado' : 'orçamentos solicitados'}`;
      } else {
        orcamentosCountLabel.textContent = `Exibindo ${filtered.length} de ${totalAll} orçamentos`;
      }
    }

    if (orcamentosTableMissing && filtered.length === 0) {
      adminOrcamentosList.innerHTML = `
        <div class="orcamentos-empty-box orcamentos-setup-alert">
          <strong>Tabela de Orçamentos ainda não criada no Supabase</strong>
          <p>Para consultar orçamentos na nuvem entre dispositivos, execute o script atualizado <code>supabase_schema.sql</code> no SQL Editor do seu Supabase.</p>
        </div>
      `;
      return;
    }

    if (filtered.length === 0) {
      adminOrcamentosList.innerHTML = `
        <div class="orcamentos-empty-box">
          <p>${totalAll === 0 ? 'Nenhum orçamento foi solicitado até o momento.' : 'Nenhum orçamento corresponde aos filtros aplicados.'}</p>
        </div>
      `;
      return;
    }

    adminOrcamentosList.innerHTML = filtered.map(item => {
      const status = item.status || 'Pendente';
      const statusClass = getOrcamentoStatusClass(status);
      const tipoLabel = item.tipo || 'Monte seu Bolo';
      const isPersonalizado = tipoLabel.toLowerCase().includes('personalizado');
      const requestedAt = formatDateTimePtBr(item.created_at);
      const pickupFormatted = formatDatePtBr(item.data_retirada);
      const totalFormatted = formatMoneyPtBr(item.valor_total);
      const sinalFormatted = item.sinal !== null && item.sinal !== undefined ? formatMoneyPtBr(item.sinal) : null;
      const isBaixado = orcamentosBaixadosIds && orcamentosBaixadosIds.has(String(item.id));

      return `
        <article class="admin-orcamento-card" data-id="${escapeHTML(item.id)}">
          <div class="orcamento-card-header">
            <div class="orcamento-client-info">
              <strong class="orcamento-client-name">${escapeHTML(item.cliente_nome || 'Cliente')}</strong>
              <div class="orcamento-badges-row">
                <span class="orcamento-type-badge ${isPersonalizado ? 'type-custom' : 'type-builder'}">${escapeHTML(tipoLabel)}</span>
                <span class="orcamento-status-pill ${statusClass}">${escapeHTML(status)}</span>
              </div>
            </div>
            <div class="orcamento-date-meta">
              <span class="orcamento-requested-at">Solicitado em <strong>${escapeHTML(requestedAt)}</strong></span>
              <span class="orcamento-pickup-at">Retirada/Evento: <strong>${escapeHTML(pickupFormatted)}</strong></span>
            </div>
          </div>

          <div class="orcamento-choices-grid">
            <div class="orcamento-choice-item">
              <span>Tamanho</span>
              <strong>${escapeHTML(item.tamanho || 'Não informado')}</strong>
            </div>
            <div class="orcamento-choice-item">
              <span>Massa</span>
              <strong>${escapeHTML(item.massa || 'Não informado')}</strong>
            </div>
            <div class="orcamento-choice-item">
              <span>Cobertura</span>
              <strong>${escapeHTML(item.cobertura || 'Não informado')}</strong>
            </div>
            <div class="orcamento-choice-item">
              <span>Recheio</span>
              <strong>${escapeHTML(item.recheio || 'Não informado')}</strong>
            </div>
            <div class="orcamento-choice-item">
              <span>Topo</span>
              <strong>${escapeHTML(item.topo || 'Simples')}</strong>
            </div>
            <div class="orcamento-choice-item orcamento-price-item">
              <span>Valor Estimado</span>
              <strong>${escapeHTML(totalFormatted)}${sinalFormatted ? ` <small>(Sinal: ${escapeHTML(sinalFormatted)})</small>` : ''}</strong>
            </div>
          </div>

          ${item.observacoes ? `
            <div class="orcamento-notes-box">
              <span>Observações:</span>
              <p>${escapeHTML(item.observacoes)}</p>
            </div>
          ` : ''}

          <div class="orcamento-card-actions">
            <div class="orcamento-status-control">
              <label>Situação:</label>
              <select class="orcamento-status-select" data-id="${escapeHTML(item.id)}">
                <option value="Pendente" ${status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                <option value="Confirmado" ${status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                <option value="Concluído" ${status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                <option value="Cancelado" ${status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
              </select>
            </div>

            <div class="orcamento-estoque-actions">
              ${isBaixado ? `
                <span class="badge-orcamento-baixado" title="Insumos e embalagens debitados do estoque">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Insumos Baixados</span>
                </span>
              ` : `
                <button type="button" class="btn-orcamento-baixa" data-id="${escapeHTML(item.id)}" title="Dar baixa dos insumos deste bolo no estoque">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span>Baixar Insumos</span>
                </button>
              `}
            </div>

            <button type="button" class="admin-orcamento-delete-btn" data-id="${escapeHTML(item.id)}" title="Excluir registro">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              <span>Excluir</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Listener para Baixa de Insumos direta do Orçamento
    adminOrcamentosList.querySelectorAll('.btn-orcamento-baixa').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const orc = adminOrcamentosCache.find(o => String(o.id) === String(id));
        if (!orc) return;
        await darBaixaInsumosDeOrcamento(orc, btn);
      });
    });

    adminOrcamentosList.querySelectorAll('.orcamento-status-select').forEach(selectEl => {
      selectEl.addEventListener('change', async () => {
        const id = selectEl.getAttribute('data-id');
        const newStatus = selectEl.value;
        selectEl.disabled = true;
        try {
          if (window.OfirSupabase && window.OfirSupabase.updateOrcamentoStatus) {
            await window.OfirSupabase.updateOrcamentoStatus(id, newStatus);
          }
          const found = adminOrcamentosCache.find(o => String(o.id) === String(id));
          if (found) found.status = newStatus;
          renderAdminOrcamentosList();
          if (orcamentosStatusMsg) {
            orcamentosStatusMsg.textContent = '✓ Status atualizado!';
            orcamentosStatusMsg.className = 'admin-save-status success';
            setTimeout(() => { orcamentosStatusMsg.textContent = ''; }, 2500);
          }
        } catch (err) {
          alert(`Erro ao atualizar status: ${err.message || 'Falha na conexão'}`);
          renderAdminOrcamentosList();
        }
      });
    });

    adminOrcamentosList.querySelectorAll('.admin-orcamento-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('Deseja excluir este orçamento do histórico?')) return;
        btn.disabled = true;
        try {
          if (window.OfirSupabase && window.OfirSupabase.deleteOrcamento) {
            await window.OfirSupabase.deleteOrcamento(id);
          }
          adminOrcamentosCache = adminOrcamentosCache.filter(o => String(o.id) !== String(id));
          renderAdminOrcamentosList();
        } catch (err) {
          alert(`Erro ao excluir orçamento: ${err.message || 'Falha na conexão'}`);
          btn.disabled = false;
        }
      });
    });
  }

  function setupAdminOrcamentos() {
    if (orcamentosSearchInput) {
      orcamentosSearchInput.addEventListener('input', renderAdminOrcamentosList);
    }
    if (orcamentosFilterStatus) {
      orcamentosFilterStatus.addEventListener('change', renderAdminOrcamentosList);
    }
    if (btnRefreshOrcamentos) {
      btnRefreshOrcamentos.addEventListener('click', loadAdminOrcamentos);
    }
  }

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
    setupAdminOrcamentos();
    setupEstoqueModule();
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

  // ==============================================================================
  // MÓDULO: CALCULADORA DE ESTOQUE, RENDIMENTO & CUSTOS (OFIR DOCERIA)
  // ==============================================================================

  let adminInsumosCache = [];
  let adminReceitasCache = [];
  let adminMovimentacoesCache = [];
  let orcamentosBaixadosIds = new Set();
  try {
    const rawBaixados = localStorage.getItem('ofir_orcamentos_baixados');
    if (rawBaixados) orcamentosBaixadosIds = new Set(JSON.parse(rawBaixados));
  } catch (_) {}

  const CONSUMO_POR_ARO = {
    'aro-10': {
      nome: 'ARO 10',
      fatiasMedias: 7,
      massaG: 320,
      recheioG: 450,
      coberturaG: 280,
      cakeboardId: 'cakeboard_aro10',
      caixaId: 'caixa_transporte_p',
      fitaId: 'fita_cetim_luxo',
      sacolaId: 'sacola_kraft_luxo'
    },
    'aro-15': {
      nome: 'ARO 15',
      fatiasMedias: 13.5,
      massaG: 550,
      recheioG: 750,
      coberturaG: 450,
      cakeboardId: 'cakeboard_aro15',
      caixaId: 'caixa_transporte_p',
      fitaId: 'fita_cetim_luxo',
      sacolaId: 'sacola_kraft_luxo'
    },
    'aro-20': {
      nome: 'ARO 20',
      fatiasMedias: 22.5,
      massaG: 900,
      recheioG: 1250,
      coberturaG: 700,
      cakeboardId: 'cakeboard_aro20',
      caixaId: 'caixa_transporte_g',
      fitaId: 'fita_cetim_luxo',
      sacolaId: 'sacola_kraft_luxo'
    },
    'aro-25': {
      nome: 'ARO 25',
      fatiasMedias: 32.5,
      massaG: 1400,
      recheioG: 1900,
      coberturaG: 1050,
      cakeboardId: 'cakeboard_aro25',
      caixaId: 'caixa_transporte_g',
      fitaId: 'fita_cetim_luxo',
      sacolaId: 'sacola_kraft_luxo'
    },
    'aro-28': {
      nome: 'ARO 28',
      fatiasMedias: 42.5,
      massaG: 1900,
      recheioG: 2500,
      coberturaG: 1400,
      cakeboardId: 'cakeboard_aro28',
      caixaId: 'caixa_transporte_g',
      fitaId: 'fita_cetim_luxo',
      sacolaId: 'sacola_kraft_luxo'
    },
    'aro-30': {
      nome: 'ARO 30',
      fatiasMedias: 52.5,
      massaG: 2400,
      recheioG: 3200,
      coberturaG: 1800,
      cakeboardId: 'cakeboard_aro30',
      caixaId: 'caixa_transporte_g',
      fitaId: 'fita_cetim_luxo',
      sacolaId: 'sacola_kraft_luxo'
    }
  };

  function getInsumoCustoUnitario(insumo) {
    if (!insumo) return 0;
    const peso = Number(insumo.peso_embalagem || 1);
    const preco = Number(insumo.preco_pago || 0);
    if (peso <= 0) return 0;
    return preco / peso;
  }

  function getReceitaMetrics(receita) {
    if (!receita) return { rawCost: 0, rawWeight: 0, readyWeight: 1000, yieldPct: 100, costPerReadyGram: 0 };
    const readyWeight = Number(receita.rendimento_final_g || 1000);
    const ingredientes = Array.isArray(receita.ingredientes) ? receita.ingredientes : [];
    
    let rawCost = 0;
    let rawWeight = 0;

    ingredientes.forEach(item => {
      const insumo = adminInsumosCache.find(i => String(i.id) === String(item.insumo_id));
      const costPerG = getInsumoCustoUnitario(insumo);
      const qtdG = Number(item.quantidade_g || 0);
      rawCost += qtdG * costPerG;
      rawWeight += qtdG;
    });

    const yieldPct = rawWeight > 0 ? (readyWeight / rawWeight) * 100 : 100;
    const costPerReadyGram = readyWeight > 0 ? (rawCost / readyWeight) : 0;

    return {
      rawCost,
      rawWeight,
      readyWeight,
      yieldPct,
      costPerReadyGram
    };
  }

  function calculateBoloCostAndYield(aroId, massaId, recheioId, coberturaId, topoId, packs = {}) {
    const consumo = CONSUMO_POR_ARO[aroId] || CONSUMO_POR_ARO['aro-20'];
    const sizeObj = SIZES.find(s => s.id === aroId) || SIZES[2];
    
    const massaReceita = adminReceitasCache.find(r => r.id === massaId);
    const recheioReceita = adminReceitasCache.find(r => r.id === recheioId);
    const coberturaReceita = adminReceitasCache.find(r => r.id === coberturaId);

    const massaMet = getReceitaMetrics(massaReceita);
    const recheioMet = getReceitaMetrics(recheioReceita);
    const coberturaMet = getReceitaMetrics(coberturaReceita);

    const rows = [];
    const itensParaBaixa = [];

    // 1. Massa
    const custoMassa = consumo.massaG * massaMet.costPerReadyGram;
    rows.push({
      nome: (massaReceita && massaReceita.nome) || 'Massa Amanteigada',
      tipo: 'Massa Artesanal',
      qtd: `${consumo.massaG}g`,
      unit: `R$ ${massaMet.costPerReadyGram.toFixed(4)}/g`,
      subtotal: custoMassa,
      yieldPct: massaMet.yieldPct
    });
    if (massaReceita && Array.isArray(massaReceita.ingredientes)) {
      const factor = consumo.massaG / (massaMet.readyWeight || 1000);
      massaReceita.ingredientes.forEach(ing => {
        itensParaBaixa.push({
          insumo_id: ing.insumo_id,
          nome: ing.nome,
          quantidade: Math.round(Number(ing.quantidade_g || 0) * factor * 10) / 10
        });
      });
    }

    // 2. Recheio
    const custoRecheio = consumo.recheioG * recheioMet.costPerReadyGram;
    rows.push({
      nome: (recheioReceita && recheioReceita.nome) || 'Recheio Gourmet',
      tipo: 'Recheio Gourmet',
      qtd: `${consumo.recheioG}g`,
      unit: `R$ ${recheioMet.costPerReadyGram.toFixed(4)}/g`,
      subtotal: custoRecheio,
      yieldPct: recheioMet.yieldPct
    });
    if (recheioReceita && Array.isArray(recheioReceita.ingredientes)) {
      const factor = consumo.recheioG / (recheioMet.readyWeight || 1000);
      recheioReceita.ingredientes.forEach(ing => {
        itensParaBaixa.push({
          insumo_id: ing.insumo_id,
          nome: ing.nome,
          quantidade: Math.round(Number(ing.quantidade_g || 0) * factor * 10) / 10
        });
      });
    }

    // 3. Cobertura
    const custoCobertura = consumo.coberturaG * coberturaMet.costPerReadyGram;
    rows.push({
      nome: (coberturaReceita && coberturaReceita.nome) || 'Cobertura',
      tipo: 'Cobertura',
      qtd: `${consumo.coberturaG}g`,
      unit: `R$ ${coberturaMet.costPerReadyGram.toFixed(4)}/g`,
      subtotal: custoCobertura,
      yieldPct: coberturaMet.yieldPct
    });
    if (coberturaReceita && Array.isArray(coberturaReceita.ingredientes)) {
      const factor = consumo.coberturaG / (coberturaMet.readyWeight || 1000);
      coberturaReceita.ingredientes.forEach(ing => {
        itensParaBaixa.push({
          insumo_id: ing.insumo_id,
          nome: ing.nome,
          quantidade: Math.round(Number(ing.quantidade_g || 0) * factor * 10) / 10
        });
      });
    }

    let custoIngredientes = custoMassa + custoRecheio + custoCobertura;
    let custoEmbalagens = 0;

    // 4. Insumos Especiais & Embalagens
    if (packs.cakeboard !== false) {
      const cakeboardInsumo = adminInsumosCache.find(i => i.id === consumo.cakeboardId);
      const cUnit = getInsumoCustoUnitario(cakeboardInsumo);
      custoEmbalagens += cUnit;
      rows.push({
        nome: (cakeboardInsumo && cakeboardInsumo.nome) || 'Cakeboard Rígido Mármore',
        tipo: 'Embalagem Especial',
        qtd: '1 un',
        unit: `R$ ${cUnit.toFixed(2)}/un`,
        subtotal: cUnit
      });
      if (cakeboardInsumo) itensParaBaixa.push({ insumo_id: cakeboardInsumo.id, nome: cakeboardInsumo.nome, quantidade: 1 });
    }

    if (packs.caixa !== false) {
      const caixaInsumo = adminInsumosCache.find(i => i.id === consumo.caixaId);
      const cUnit = getInsumoCustoUnitario(caixaInsumo);
      custoEmbalagens += cUnit;
      rows.push({
        nome: (caixaInsumo && caixaInsumo.nome) || 'Caixa Alta com Visor Panorâmico',
        tipo: 'Embalagem Especial',
        qtd: '1 un',
        unit: `R$ ${cUnit.toFixed(2)}/un`,
        subtotal: cUnit
      });
      if (caixaInsumo) itensParaBaixa.push({ insumo_id: caixaInsumo.id, nome: caixaInsumo.nome, quantidade: 1 });
    }

    if (packs.fita !== false) {
      const fitaInsumo = adminInsumosCache.find(i => i.id === consumo.fitaId);
      const cUnit = getInsumoCustoUnitario(fitaInsumo);
      custoEmbalagens += cUnit;
      rows.push({
        nome: (fitaInsumo && fitaInsumo.nome) || 'Fita de Cetim Personalizada Ouro',
        tipo: 'Embalagem Especial',
        qtd: '1 un',
        unit: `R$ ${cUnit.toFixed(2)}/un`,
        subtotal: cUnit
      });
      if (fitaInsumo) itensParaBaixa.push({ insumo_id: fitaInsumo.id, nome: fitaInsumo.nome, quantidade: 1 });
    }

    if (packs.sacola !== false) {
      const sacolaInsumo = adminInsumosCache.find(i => i.id === consumo.sacolaId);
      const cUnit = getInsumoCustoUnitario(sacolaInsumo);
      custoEmbalagens += cUnit;
      rows.push({
        nome: (sacolaInsumo && sacolaInsumo.nome) || 'Sacola Kraft de Luxo Reforçada',
        tipo: 'Embalagem Especial',
        qtd: '1 un',
        unit: `R$ ${cUnit.toFixed(2)}/un`,
        subtotal: cUnit
      });
      if (sacolaInsumo) itensParaBaixa.push({ insumo_id: sacolaInsumo.id, nome: sacolaInsumo.nome, quantidade: 1 });
    }

    // Topo de Bolo
    const topoInsumo = adminInsumosCache.find(i => i.id === topoId);
    const topoUnit = getInsumoCustoUnitario(topoInsumo);
    custoEmbalagens += topoUnit;
    rows.push({
      nome: (topoInsumo && topoInsumo.nome) || (topoId === 'topo_especial_3d' ? 'Topo Especial 3D Acrílico' : 'Topo Simples Incluso'),
      tipo: 'Insumo Especial',
      qtd: '1 un',
      unit: `R$ ${topoUnit.toFixed(2)}/un`,
      subtotal: topoUnit
    });
    if (topoInsumo) itensParaBaixa.push({ insumo_id: topoInsumo.id, nome: topoInsumo.nome, quantidade: 1 });

    const custoTotal = custoIngredientes + custoEmbalagens;
    const isTopo3D = topoId === 'topo_especial_3d';
    const precoVenda = (sizeObj ? sizeObj.price : 195) + (isTopo3D ? topperExtraPrice : 0);
    const lucroBruto = Math.max(0, precoVenda - custoTotal);
    const margemPct = precoVenda > 0 ? (lucroBruto / precoVenda) * 100 : 0;
    const pesoTotalBolo = consumo.massaG + consumo.recheioG + consumo.coberturaG;
    const custoPorFatia = consumo.fatiasMedias > 0 ? (custoTotal / consumo.fatiasMedias) : 0;
    const custoPorGramaBolo = pesoTotalBolo > 0 ? (custoTotal / pesoTotalBolo) : 0;

    return {
      rows,
      custoTotal,
      custoIngredientes,
      custoEmbalagens,
      precoVenda,
      lucroBruto,
      margemPct,
      pesoTotalBolo,
      custoPorFatia,
      custoPorGramaBolo,
      itensParaBaixa,
      consumo
    };
  }

  // Mapeamento Inteligente de Escolhas de Orçamento para Receitas
  function mapearEscolhasParaReceitas(item) {
    const txtTamanho = String(item.tamanho || '').toUpperCase();
    let aroId = 'aro-20';
    if (txtTamanho.includes('10')) aroId = 'aro-10';
    else if (txtTamanho.includes('15')) aroId = 'aro-15';
    else if (txtTamanho.includes('25')) aroId = 'aro-25';
    else if (txtTamanho.includes('28')) aroId = 'aro-28';
    else if (txtTamanho.includes('30')) aroId = 'aro-30';

    const txtMassa = String(item.massa || '').toLowerCase();
    const massaId = txtMassa.includes('cacau') ? 'massa_cacau' : 'massa_branca';

    const txtRecheio = String(item.recheio || '').toLowerCase();
    let recheioId = 'recheio_ninho';
    if (txtRecheio.includes('avel') || txtRecheio.includes('nutella')) recheioId = 'recheio_avela';
    else if (txtRecheio.includes('morang')) recheioId = 'recheio_morango';
    else if (txtRecheio.includes('choc')) recheioId = 'recheio_chocolate';
    else if (txtRecheio.includes('maracuj')) recheioId = 'recheio_maracuja';
    else if (txtRecheio.includes('côco') || txtRecheio.includes('coco')) recheioId = 'recheio_coco';
    else if (txtRecheio.includes('abacax')) recheioId = 'recheio_abacaxi';

    const txtCobertura = String(item.cobertura || '').toLowerCase();
    let coberturaId = 'cobertura_chantininho';
    if (txtCobertura.includes('sem') || txtCobertura.includes('acetato')) coberturaId = 'cobertura_sem_cobertura';
    else if (txtCobertura.includes('branco')) coberturaId = 'cobertura_ganache_branco';
    else if (txtCobertura.includes('ganache')) coberturaId = 'cobertura_ganache_chocolate';
    else if (txtCobertura.includes('brigadeiro')) coberturaId = 'cobertura_brigadeiro';

    const txtTopo = String(item.topo || '').toLowerCase();
    const topoId = (txtTopo.includes('3d') || txtTopo.includes('especial')) ? 'topo_especial_3d' : 'topo_simples';

    return { aroId, massaId, recheioId, coberturaId, topoId };
  }

  async function darBaixaInsumosDeOrcamento(orc, btnEl) {
    if (btnEl) btnEl.disabled = true;
    try {
      const escolhas = mapearEscolhasParaReceitas(orc);
      const res = calculateBoloCostAndYield(escolhas.aroId, escolhas.massaId, escolhas.recheioId, escolhas.coberturaId, escolhas.topoId);

      const confirmMsg = `Confirmar baixa de insumos para o pedido de ${orc.cliente_nome}?\n\n• Tamanho: ${res.consumo.nome}\n• Peso Estimado: ~${(res.pesoTotalBolo / 1000).toFixed(2)}kg\n• Custo CMV: R$ ${res.custoTotal.toFixed(2)}\n• Serão debitados os insumos e embalagens correspondentes no estoque.`;
      if (!confirm(confirmMsg)) {
        if (btnEl) btnEl.disabled = false;
        return;
      }

      if (window.OfirSupabase && window.OfirSupabase.registrarBaixaEstoque) {
        await window.OfirSupabase.registrarBaixaEstoque({
          descricao: `Bolo ${res.consumo.nome} (${orc.cliente_nome})`,
          orcamento_id: String(orc.id),
          custo_total: res.custoTotal,
          detalhes: {
            aro: res.consumo.nome,
            cliente: orc.cliente_nome,
            massa: orc.massa,
            recheio: orc.recheio,
            cobertura: orc.cobertura,
            topo: orc.topo
          },
          itensBaixados: res.itensParaBaixa
        });
      }

      orcamentosBaixadosIds.add(String(orc.id));
      localStorage.setItem('ofir_orcamentos_baixados', JSON.stringify([...orcamentosBaixadosIds]));

      await loadEstoqueData();
      renderAdminOrcamentosList();

      if (orcamentosStatusMsg) {
        orcamentosStatusMsg.textContent = `✓ Insumos de ${orc.cliente_nome} baixados com sucesso!`;
        orcamentosStatusMsg.className = 'admin-save-status success';
        setTimeout(() => { orcamentosStatusMsg.textContent = ''; }, 3000);
      }
    } catch (err) {
      alert(`Erro ao registrar baixa de estoque: ${err.message || 'Falha de operação'}`);
      if (btnEl) btnEl.disabled = false;
    }
  }

  // --- CARREGAMENTO PRINCIPAL DE DADOS DE ESTOQUE ---
  async function loadEstoqueData() {
    try {
      if (window.OfirSupabase) {
        const [resInsumos, resReceitas, resMovs] = await Promise.all([
          window.OfirSupabase.fetchEstoqueInsumos ? window.OfirSupabase.fetchEstoqueInsumos() : { items: [] },
          window.OfirSupabase.fetchReceitas ? window.OfirSupabase.fetchReceitas() : { items: [] },
          window.OfirSupabase.fetchEstoqueMovimentacoes ? window.OfirSupabase.fetchEstoqueMovimentacoes() : { items: [] }
        ]);

        adminInsumosCache = resInsumos.items || [];
        adminReceitasCache = resReceitas.items || [];
        adminMovimentacoesCache = resMovs.items || [];
      }
    } catch (err) {
      console.warn('[Estoque] Falha ao carregar dados:', err);
    }

    renderEstoqueKPIs();
    renderEstoqueCalculadora();
    renderEstoqueInsumosTable();
    renderEstoqueFichasTecnicas();
    renderEstoqueHistorico();
  }

  // Render KPIs
  function renderEstoqueKPIs() {
    const kpiTotal = document.getElementById('kpi-estoque-total');
    const kpiCount = document.getElementById('kpi-estoque-itens-count');
    const kpiCritico = document.getElementById('kpi-estoque-critico');
    const kpiCriticoSub = document.getElementById('kpi-estoque-critico-sub');
    const kpiLucro = document.getElementById('kpi-lucro-medio');
    const kpiFatia = document.getElementById('kpi-fatia-media');
    const estoqueTabBadge = document.getElementById('estoque-tab-badge');

    let totalVal = 0;
    let criticalCount = 0;

    adminInsumosCache.forEach(item => {
      const costPerUnit = getInsumoCustoUnitario(item);
      const saldo = Number(item.quantidade_atual || 0);
      totalVal += saldo * costPerUnit;

      const min = Number(item.quantidade_minima || 0);
      if (min > 0 && saldo <= min) {
        criticalCount++;
      }
    });

    if (kpiTotal) kpiTotal.textContent = `R$ ${totalVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (kpiCount) kpiCount.textContent = `${adminInsumosCache.length} insumos e embalagens`;

    if (kpiCritico) {
      kpiCritico.textContent = String(criticalCount);
      kpiCritico.className = criticalCount > 0 ? 'estoque-kpi-val highlight-alert' : 'estoque-kpi-val';
    }
    if (kpiCriticoSub) {
      kpiCriticoSub.textContent = criticalCount === 0 ? 'Estoque abastecido' : `${criticalCount} item(ns) abaixo do mínimo`;
    }

    if (estoqueTabBadge) {
      if (criticalCount > 0) {
        estoqueTabBadge.textContent = String(criticalCount);
        estoqueTabBadge.style.display = 'inline-flex';
      } else {
        estoqueTabBadge.style.display = 'none';
      }
    }

    // Calcula margem média sobre os 6 Aros
    let sumMargem = 0;
    let sumFatia = 0;
    SIZES.forEach(s => {
      const calc = calculateBoloCostAndYield(s.id, 'massa_branca', 'recheio_ninho', 'cobertura_chantininho', 'topo_simples');
      sumMargem += calc.margemPct;
      sumFatia += calc.custoPorFatia;
    });
    const avgMargem = sumMargem / SIZES.length;
    const avgFatia = sumFatia / SIZES.length;

    if (kpiLucro) kpiLucro.textContent = `${avgMargem.toFixed(1)}%`;
    if (kpiFatia) kpiFatia.textContent = `R$ ${avgFatia.toFixed(2)}`;
  }

  // Render Calculadora por Aro
  function renderEstoqueCalculadora() {
    const selAro = document.getElementById('calc-aro-select');
    const selMassa = document.getElementById('calc-massa-select');
    const selRecheio = document.getElementById('calc-recheio-select');
    const selCobertura = document.getElementById('calc-cobertura-select');
    const selTopo = document.getElementById('calc-topo-select');

    const checkCakeboard = document.getElementById('calc-check-cakeboard');
    const checkCaixa = document.getElementById('calc-check-caixa');
    const checkFita = document.getElementById('calc-check-fita');
    const checkSacola = document.getElementById('calc-check-sacola');

    if (!selAro) return;

    // Popula dropdown de aros se estiver vazio
    if (selAro.options.length === 0) {
      SIZES.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.name} ${s.slices} — Venda: R$ ${s.price.toFixed(2)}`;
        selAro.appendChild(opt);
      });
      selAro.value = 'aro-20';
    }

    // Popula recheios se estiver vazio
    if (selRecheio && selRecheio.options.length === 0) {
      const recheios = adminReceitasCache.filter(r => r.tipo === 'recheio');
      recheios.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = r.nome;
        selRecheio.appendChild(opt);
      });
      if (selRecheio.options.length > 0) selRecheio.value = recheios[0].id;
    }

    // Popula coberturas se estiver vazio
    if (selCobertura && selCobertura.options.length === 0) {
      const coberturas = adminReceitasCache.filter(r => r.tipo === 'cobertura');
      coberturas.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.nome;
        selCobertura.appendChild(opt);
      });
      if (selCobertura.options.length > 0) selCobertura.value = coberturas[0].id;
    }

    const aroId = selAro.value || 'aro-20';
    const massaId = (selMassa && selMassa.value) || 'massa_branca';
    const recheioId = (selRecheio && selRecheio.value) || 'recheio_ninho';
    const coberturaId = (selCobertura && selCobertura.value) || 'cobertura_chantininho';
    const topoId = (selTopo && selTopo.value) || 'topo_simples';

    const packs = {
      cakeboard: checkCakeboard ? checkCakeboard.checked : true,
      caixa: checkCaixa ? checkCaixa.checked : true,
      fita: checkFita ? checkFita.checked : true,
      sacola: checkSacola ? checkSacola.checked : true
    };

    const res = calculateBoloCostAndYield(aroId, massaId, recheioId, coberturaId, topoId, packs);

    // Atualiza Placar Financeiro
    const elPrecoVenda = document.getElementById('calc-res-preco-venda');
    const elCustoTotal = document.getElementById('calc-res-custo-total');
    const elLucroBruto = document.getElementById('calc-res-lucro-bruto');
    const elMargemPct = document.getElementById('calc-res-margem-pct');
    const elMargemBar = document.getElementById('calc-res-margem-bar');
    const elPesoTotal = document.getElementById('calc-res-peso-total');
    const elCustoFatia = document.getElementById('calc-res-custo-fatia');
    const elCustoGrama = document.getElementById('calc-res-custo-grama');
    const tbody = document.getElementById('calc-breakdown-tbody');

    if (elPrecoVenda) elPrecoVenda.textContent = `R$ ${res.precoVenda.toFixed(2)}`;
    if (elCustoTotal) elCustoTotal.textContent = `R$ ${res.custoTotal.toFixed(2)}`;
    if (elLucroBruto) elLucroBruto.textContent = `R$ ${res.lucroBruto.toFixed(2)}`;
    if (elMargemPct) elMargemPct.textContent = `${res.margemPct.toFixed(1)}%`;
    if (elMargemBar) elMargemBar.style.width = `${Math.min(100, Math.max(5, res.margemPct))}%`;
    if (elPesoTotal) elPesoTotal.textContent = `~${(res.pesoTotalBolo / 1000).toFixed(2)} kg (${res.pesoTotalBolo}g)`;
    if (elCustoFatia) elCustoFatia.textContent = `R$ ${res.custoPorFatia.toFixed(2)}`;
    if (elCustoGrama) elCustoGrama.textContent = `R$ ${res.custoPorGramaBolo.toFixed(4)} / g`;

    if (tbody) {
      tbody.innerHTML = res.rows.map(r => `
        <tr>
          <td>
            <strong>${escapeHTML(r.nome)}</strong>
            <small style="display:block; color: var(--text-muted);">${escapeHTML(r.tipo)}</small>
          </td>
          <td>${escapeHTML(r.qtd)}</td>
          <td>${escapeHTML(r.unit)}</td>
          <td><strong style="color: var(--gold-dark);">R$ ${r.subtotal.toFixed(2)}</strong></td>
        </tr>
      `).join('');
    }
  }

  // Render Tabela de Insumos
  function renderEstoqueInsumosTable() {
    const tbody = document.getElementById('insumos-table-tbody');
    if (!tbody) return;

    const query = (document.getElementById('insumos-search-input')?.value || '').trim().toLowerCase();
    const filterCat = document.getElementById('insumos-filter-cat')?.value || 'all';

    const filtered = adminInsumosCache.filter(item => {
      if (filterCat !== 'all' && item.categoria !== filterCat) return false;
      if (!query) return true;
      return (item.nome || '').toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 2rem; color: var(--text-muted);">Nenhum insumo encontrado.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(item => {
      const isEmb = item.categoria === 'embalagem';
      const unit = item.unidade || (isEmb ? 'un' : 'g');
      const costPerUnit = getInsumoCustoUnitario(item);
      const saldo = Number(item.quantidade_atual || 0);
      const min = Number(item.quantidade_minima || 0);
      const isCritico = min > 0 && saldo <= min;

      const formatSaldo = unit === 'g' && saldo >= 1000 ? `${(saldo / 1000).toFixed(2)} kg (${saldo}g)` : `${saldo} ${unit}`;

      return `
        <tr data-id="${escapeHTML(item.id)}">
          <td>
            <strong>${escapeHTML(item.nome)}</strong>
          </td>
          <td>
            <span class="badge-cat ${isEmb ? 'badge-cat-embalagem' : 'badge-cat-ingrediente'}">
              ${isEmb ? 'Embalagem' : 'Ingrediente'}
            </span>
          </td>
          <td>${item.peso_embalagem} ${unit}</td>
          <td>R$ ${Number(item.preco_pago || 0).toFixed(2)}</td>
          <td><strong style="color: var(--gold-dark);">R$ ${costPerUnit.toFixed(4)} / ${unit}</strong></td>
          <td><strong>${formatSaldo}</strong></td>
          <td>${min} ${unit}</td>
          <td>
            ${isCritico 
              ? `<span class="badge-status-alert">⚠️ Baixo</span>`
              : `<span class="badge-status-ok">✓ Ok</span>`
            }
          </td>
          <td>
            <div class="insumo-action-btns">
              <button type="button" class="insumo-action-btn btn-quick-add" data-id="${escapeHTML(item.id)}" title="Adicionar saldo (+1 pacote)">+</button>
              <button type="button" class="insumo-action-btn btn-edit-insumo" data-id="${escapeHTML(item.id)}" title="Editar insumo">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button type="button" class="insumo-action-btn btn-delete btn-delete-insumo" data-id="${escapeHTML(item.id)}" title="Excluir insumo">✕</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Listeners da tabela de insumos
    tbody.querySelectorAll('.btn-quick-add').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const item = adminInsumosCache.find(i => String(i.id) === String(id));
        if (!item) return;
        const addAmount = Number(item.peso_embalagem || (item.categoria === 'embalagem' ? 1 : 1000));
        await window.OfirSupabase.adjustEstoqueSaldo(id, addAmount, true);
        await loadEstoqueData();
      });
    });

    tbody.querySelectorAll('.btn-edit-insumo').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = adminInsumosCache.find(i => String(i.id) === String(id));
        if (item) openInsumoModal(item);
      });
    });

    tbody.querySelectorAll('.btn-delete-insumo').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const item = adminInsumosCache.find(i => String(i.id) === String(id));
        if (!item) return;
        if (!confirm(`Deseja remover "${item.nome}" do catálogo de insumos?`)) return;
        await window.OfirSupabase.deleteEstoqueInsumo(id);
        await loadEstoqueData();
      });
    });
  }

  // Render Fichas Técnicas & Rendimento
  function renderEstoqueFichasTecnicas() {
    const container = document.getElementById('fichas-cards-grid');
    if (!container) return;

    if (adminReceitasCache.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted);">Carregando fichas técnicas...</p>';
      return;
    }

    container.innerHTML = adminReceitasCache.map(r => {
      const met = getReceitaMetrics(r);
      const isSemCobertura = r.id === 'cobertura_sem_cobertura';

      return `
        <div class="ficha-card">
          <div class="ficha-header">
            <h5 class="ficha-title">${escapeHTML(r.nome)}</h5>
            <span class="ficha-tipo-tag">${escapeHTML(r.tipo)}</span>
          </div>

          <div class="ficha-metrics-row">
            <div class="ficha-metric-col">
              <span>Peso Cru Total</span>
              <strong>${met.rawWeight}g</strong>
            </div>
            <div class="ficha-metric-col">
              <span>Rendimento Final</span>
              <strong>${met.readyWeight}g</strong>
            </div>
            <div class="ficha-metric-col">
              <span>Fator de Rendimento</span>
              <strong class="highlight-gold">${met.yieldPct.toFixed(1)}%</strong>
            </div>
          </div>

          <div style="background: #FAF7F2; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 0.65rem; margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; color: var(--text-muted);">Custo da Receita Pronta:</span>
            <strong style="color: var(--gold-dark); font-size: 0.95rem;">R$ ${met.costPerReadyGram.toFixed(4)} / g</strong>
          </div>

          <div class="ficha-ingredientes-list">
            ${isSemCobertura ? '<p style="margin: 0; font-size: 0.72rem; color: var(--text-muted);">Estilo Naked Cake artesanal sem cobertura adicional.</p>' : ''}
            ${(r.ingredientes || []).map(ing => {
              const ins = adminInsumosCache.find(i => String(i.id) === String(ing.insumo_id));
              const costG = getInsumoCustoUnitario(ins);
              const part = Number(ing.quantidade_g || 0) * costG;
              return `
                <div class="ficha-ingrediente-row">
                  <span>${escapeHTML(ing.nome || ing.insumo_id)}: ${ing.quantidade_g}g</span>
                  <strong style="color: var(--text-main);">R$ ${part.toFixed(2)}</strong>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Histórico de Movimentações
  function renderEstoqueHistorico() {
    const listEl = document.getElementById('historico-items-list');
    const countLbl = document.getElementById('historico-count-lbl');
    if (!listEl) return;

    if (countLbl) {
      countLbl.textContent = `${adminMovimentacoesCache.length} registro(s) de movimentação`;
    }

    if (adminMovimentacoesCache.length === 0) {
      listEl.innerHTML = `<div class="orcamentos-empty-box"><p>Nenhuma baixa de estoque registrada ainda.</p></div>`;
      return;
    }

    listEl.innerHTML = adminMovimentacoesCache.map(mov => {
      const dataFmt = formatDateTimePtBr(mov.created_at);
      return `
        <div class="historico-card">
          <div class="historico-main-info">
            <strong>${escapeHTML(mov.descricao)}</strong>
            <span>Data da Baixa: ${escapeHTML(dataFmt)}</span>
          </div>
          <div class="historico-cost-info">
            <strong class="historico-cost-val">R$ ${Number(mov.custo_total || 0).toFixed(2)}</strong>
            <span class="historico-cost-lbl">Custo de Insumos</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Modal: Criar / Editar Insumo
  const insumoModal = document.getElementById('insumo-modal');
  const closeInsumoModal = document.getElementById('close-insumo-modal');
  const formInsumoId = document.getElementById('insumo-form-id');
  const formInsumoNome = document.getElementById('insumo-form-nome');
  const formInsumoCategoria = document.getElementById('insumo-form-categoria');
  const formInsumoUnidade = document.getElementById('insumo-form-unidade');
  const formInsumoPeso = document.getElementById('insumo-form-peso');
  const formInsumoPreco = document.getElementById('insumo-form-preco');
  const formInsumoSaldo = document.getElementById('insumo-form-saldo');
  const formInsumoMinimo = document.getElementById('insumo-form-minimo');
  const insumoPreviewCost = document.getElementById('insumo-preview-cost');
  const btnSaveInsumoModal = document.getElementById('btn-save-insumo-modal');
  const insumoModalStatus = document.getElementById('insumo-modal-status');
  const insumoModalTitle = document.getElementById('insumo-modal-title');

  function updateInsumoModalCostPreview() {
    const peso = Number(formInsumoPeso.value || 0);
    const preco = Number(formInsumoPreco.value || 0);
    const unit = formInsumoUnidade.value || 'g';
    if (peso > 0 && preco >= 0) {
      const cost = preco / peso;
      insumoPreviewCost.textContent = `R$ ${cost.toFixed(4)} / ${unit}`;
    } else {
      insumoPreviewCost.textContent = `R$ 0,000 / ${unit}`;
    }
  }

  if (formInsumoPeso) formInsumoPeso.addEventListener('input', updateInsumoModalCostPreview);
  if (formInsumoPreco) formInsumoPreco.addEventListener('input', updateInsumoModalCostPreview);
  if (formInsumoUnidade) formInsumoUnidade.addEventListener('change', updateInsumoModalCostPreview);

  function openInsumoModal(itemToEdit = null, isScanned = false) {
    if (insumoModalStatus) insumoModalStatus.textContent = '';
    const scannedBanner = document.getElementById('scanned-data-banner');
    if (scannedBanner) {
      scannedBanner.style.display = isScanned ? 'flex' : 'none';
    }

    if (itemToEdit) {
      insumoModalTitle.textContent = isScanned ? 'Confirmar Dados do Insumo (Lido pela Câmera)' : 'Editar Insumo / Embalagem';
      formInsumoId.value = itemToEdit.id;
      formInsumoNome.value = itemToEdit.nome || '';
      formInsumoCategoria.value = itemToEdit.categoria || 'ingrediente';
      formInsumoUnidade.value = itemToEdit.unidade || 'g';
      formInsumoPeso.value = itemToEdit.peso_embalagem || 1000;
      formInsumoPreco.value = itemToEdit.preco_pago || '';
      formInsumoSaldo.value = itemToEdit.quantidade_atual || itemToEdit.peso_embalagem || 0;
      formInsumoMinimo.value = itemToEdit.quantidade_minima || 0;
    } else {
      insumoModalTitle.textContent = 'Cadastrar Novo Insumo / Embalagem';
      formInsumoId.value = '';
      formInsumoNome.value = '';
      formInsumoCategoria.value = 'ingrediente';
      formInsumoUnidade.value = 'g';
      formInsumoPeso.value = 1000;
      formInsumoPreco.value = '';
      formInsumoSaldo.value = 0;
      formInsumoMinimo.value = 0;
    }
    updateInsumoModalCostPreview();
    openModal(insumoModal);

    if (isScanned && formInsumoPreco) {
      setTimeout(() => {
        formInsumoPreco.focus();
        formInsumoPreco.select();
      }, 180);
    }
  }

  if (closeInsumoModal) closeInsumoModal.addEventListener('click', () => closeModal(insumoModal));

  if (btnSaveInsumoModal) {
    btnSaveInsumoModal.addEventListener('click', async () => {
      const nome = formInsumoNome.value.trim();
      if (!nome) {
        alert('Informe o nome do insumo.');
        return;
      }
      const peso = Number(formInsumoPeso.value || 1);
      const preco = Number(formInsumoPreco.value || 0);
      const saldo = Number(formInsumoSaldo.value || 0);
      const minimo = Number(formInsumoMinimo.value || 0);

      const id = formInsumoId.value || 'insumo_' + Date.now();
      const payload = {
        id,
        nome,
        categoria: formInsumoCategoria.value,
        unidade: formInsumoUnidade.value,
        peso_embalagem: peso,
        preco_pago: preco,
        quantidade_atual: saldo,
        quantidade_minima: minimo
      };

      btnSaveInsumoModal.disabled = true;
      try {
        await window.OfirSupabase.saveEstoqueInsumo(payload);
        await loadEstoqueData();
        insumoModalStatus.textContent = '✓ Insumo salvo com sucesso!';
        insumoModalStatus.className = 'admin-save-status success';
        setTimeout(() => {
          closeModal(insumoModal);
          btnSaveInsumoModal.disabled = false;
        }, 800);
      } catch (err) {
        insumoModalStatus.textContent = `Erro: ${err.message}`;
        insumoModalStatus.className = 'admin-save-status error';
        btnSaveInsumoModal.disabled = false;
      }
    });
  }

  // Modal: Entrada de Compras
  const entradaModal = document.getElementById('entrada-compras-modal');
  const closeEntradaModal = document.getElementById('close-entrada-modal');
  const selEntradaInsumo = document.getElementById('entrada-insumo-select');
  const inputEntradaQtd = document.getElementById('entrada-qtd-embalagens');
  const inputEntradaPreco = document.getElementById('entrada-preco-novo');
  const previewEntradaTotal = document.getElementById('entrada-preview-total');
  const btnConfirmEntrada = document.getElementById('btn-confirm-entrada-compras');
  const entradaModalStatus = document.getElementById('entrada-modal-status');

  function updateEntradaPreview() {
    if (!selEntradaInsumo || !previewEntradaTotal) return;
    const insumoId = selEntradaInsumo.value;
    const insumo = adminInsumosCache.find(i => String(i.id) === String(insumoId));
    if (!insumo) return;
    const qtdPacotes = Number(inputEntradaQtd.value || 1);
    const somar = qtdPacotes * Number(insumo.peso_embalagem || 1);
    const unit = insumo.unidade || 'g';
    previewEntradaTotal.textContent = `+${somar} ${unit} (ao saldo atual de ${insumo.quantidade_atual} ${unit})`;
  }

  if (selEntradaInsumo) selEntradaInsumo.addEventListener('change', updateEntradaPreview);
  if (inputEntradaQtd) inputEntradaQtd.addEventListener('input', updateEntradaPreview);

  function openEntradaComprasModal() {
    if (!selEntradaInsumo) return;
    selEntradaInsumo.innerHTML = adminInsumosCache.map(i => `
      <option value="${escapeHTML(i.id)}">${escapeHTML(i.nome)} (Embalagem: ${i.peso_embalagem}${i.unidade})</option>
    `).join('');
    inputEntradaQtd.value = 1;
    inputEntradaPreco.value = '';
    if (entradaModalStatus) entradaModalStatus.textContent = '';
    updateEntradaPreview();
    openModal(entradaModal);
  }

  if (closeEntradaModal) closeEntradaModal.addEventListener('click', () => closeModal(entradaModal));

  if (btnConfirmEntrada) {
    btnConfirmEntrada.addEventListener('click', async () => {
      const insumoId = selEntradaInsumo.value;
      const insumo = adminInsumosCache.find(i => String(i.id) === String(insumoId));
      if (!insumo) return;

      const qtdPacotes = Number(inputEntradaQtd.value || 1);
      const precoNovo = inputEntradaPreco.value !== '' ? Number(inputEntradaPreco.value) : null;
      const addAmount = qtdPacotes * Number(insumo.peso_embalagem || 1);

      btnConfirmEntrada.disabled = true;
      try {
        if (precoNovo !== null && precoNovo > 0) {
          insumo.preco_pago = precoNovo;
          await window.OfirSupabase.saveEstoqueInsumo(insumo);
        }
        await window.OfirSupabase.adjustEstoqueSaldo(insumoId, addAmount, true);

        // Registra movimentação de entrada
        if (window.OfirSupabase.registrarBaixaEstoque) {
          const valorEntrada = precoNovo ? precoNovo * qtdPacotes : Number(insumo.preco_pago || 0) * qtdPacotes;
          await window.OfirSupabase.registrarBaixaEstoque({
            descricao: `Entrada de Compras: +${qtdPacotes}x ${insumo.nome}`,
            custo_total: valorEntrada,
            detalhes: { tipo: 'entrada_compra', insumo: insumo.nome, qtd: qtdPacotes }
          });
        }

        await loadEstoqueData();
        entradaModalStatus.textContent = '✓ Entrada no estoque registrada!';
        entradaModalStatus.className = 'admin-save-status success';
        setTimeout(() => {
          closeModal(entradaModal);
          btnConfirmEntrada.disabled = false;
        }, 800);
      } catch (err) {
        entradaModalStatus.textContent = `Erro: ${err.message}`;
        entradaModalStatus.className = 'admin-save-status error';
        btnConfirmEntrada.disabled = false;
      }
    });
  }

  // Configuração Global de Eventos do Módulo de Estoque
  function setupEstoqueModule() {
    // Sub-abas internas
    const subtabBtns = document.querySelectorAll('.estoque-subtab-btn');
    const subtabPanes = document.querySelectorAll('.estoque-subtab-pane');

    subtabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        subtabBtns.forEach(b => b.classList.remove('active'));
        subtabPanes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-subtab');
        const pane = document.getElementById(targetId);
        if (pane) pane.classList.add('active');
      });
    });

    // Reatividade dos controles da calculadora
    const calcInputs = [
      'calc-aro-select',
      'calc-massa-select',
      'calc-recheio-select',
      'calc-cobertura-select',
      'calc-topo-select',
      'calc-check-cakeboard',
      'calc-check-caixa',
      'calc-check-fita',
      'calc-check-sacola'
    ];
    calcInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', renderEstoqueCalculadora);
      }
    });

    // Botão Dar Baixa no Estoque deste Bolo
    const btnCalcBaixa = document.getElementById('btn-calc-dar-baixa');
    const calcBaixaStatus = document.getElementById('calc-baixa-status');

    if (btnCalcBaixa) {
      btnCalcBaixa.addEventListener('click', async () => {
        const selAro = document.getElementById('calc-aro-select');
        const selMassa = document.getElementById('calc-massa-select');
        const selRecheio = document.getElementById('calc-recheio-select');
        const selCobertura = document.getElementById('calc-cobertura-select');
        const selTopo = document.getElementById('calc-topo-select');

        const aroId = selAro.value;
        const massaId = selMassa.value;
        const recheioId = selRecheio.value;
        const coberturaId = selCobertura.value;
        const topoId = selTopo.value;

        const packs = {
          cakeboard: document.getElementById('calc-check-cakeboard')?.checked !== false,
          caixa: document.getElementById('calc-check-caixa')?.checked !== false,
          fita: document.getElementById('calc-check-fita')?.checked !== false,
          sacola: document.getElementById('calc-check-sacola')?.checked !== false
        };

        const res = calculateBoloCostAndYield(aroId, massaId, recheioId, coberturaId, topoId, packs);

        const msg = `Confirmar baixa de estoque para este bolo?\n\n• Tamanho: ${res.consumo.nome}\n• Peso: ~${(res.pesoTotalBolo / 1000).toFixed(2)}kg\n• Custo CMV: R$ ${res.custoTotal.toFixed(2)}\n• Lucro Estimado: R$ ${res.lucroBruto.toFixed(2)} (${res.margemPct.toFixed(1)}%)\n\nOs insumos correspondentes serão debitados do saldo atual.`;
        if (!confirm(msg)) return;

        btnCalcBaixa.disabled = true;
        try {
          if (window.OfirSupabase && window.OfirSupabase.registrarBaixaEstoque) {
            await window.OfirSupabase.registrarBaixaEstoque({
              descricao: `Produção Bolo ${res.consumo.nome}`,
              custo_total: res.custoTotal,
              detalhes: {
                aro: res.consumo.nome,
                massa: massaId,
                recheio: recheioId,
                cobertura: coberturaId,
                topo: topoId
              },
              itensBaixados: res.itensParaBaixa
            });
          }

          await loadEstoqueData();

          if (calcBaixaStatus) {
            calcBaixaStatus.textContent = '✓ Baixa de estoque registrada com sucesso!';
            calcBaixaStatus.className = 'admin-save-status success';
            setTimeout(() => { calcBaixaStatus.textContent = ''; }, 3500);
          }
        } catch (err) {
          alert(`Erro na baixa: ${err.message}`);
        } finally {
          btnCalcBaixa.disabled = false;
        }
      });
    }

    // Botões de toolbar
    const btnRefreshEstoque = document.getElementById('btn-refresh-estoque');
    if (btnRefreshEstoque) btnRefreshEstoque.addEventListener('click', loadEstoqueData);

    const btnOpenNovoInsumo = document.getElementById('btn-open-novo-insumo');
    if (btnOpenNovoInsumo) btnOpenNovoInsumo.addEventListener('click', () => openInsumoModal(null));

    const btnOpenEntradaCompras = document.getElementById('btn-open-entrada-compras');
    if (btnOpenEntradaCompras) btnOpenEntradaCompras.addEventListener('click', openEntradaComprasModal);

    const searchInput = document.getElementById('insumos-search-input');
    if (searchInput) searchInput.addEventListener('input', renderEstoqueInsumosTable);

    const filterCat = document.getElementById('insumos-filter-cat');
    if (filterCat) filterCat.addEventListener('change', renderEstoqueInsumosTable);

    // ==============================================================================
    // LEITOR INTELIGENTE DE INSUMOS COM CÂMERA (SCANNER DE EMBALAGENS)
    // ==============================================================================
    const cameraScannerModal = document.getElementById('camera-scanner-modal');
    const closeScannerModal = document.getElementById('close-scanner-modal');
    const scannerVideo = document.getElementById('scanner-video');
    const scannerCanvas = document.getElementById('scanner-canvas');
    const scannerLoadingOverlay = document.getElementById('scanner-loading-overlay');
    const scannerLoadingText = document.getElementById('scanner-loading-text');
    const btnScannerSwitch = document.getElementById('btn-scanner-switch-camera');
    const btnScannerCapture = document.getElementById('btn-scanner-capture');
    const scannerFileInput = document.getElementById('scanner-file-input');
    const btnOpenCameraScanner = document.getElementById('btn-open-camera-scanner');
    const btnInsumoModalScan = document.getElementById('btn-insumo-modal-scan');

    let cameraMediaStream = null;
    let cameraFacingMode = 'environment';

    async function startCameraScanner() {
      if (insumoModal) closeModal(insumoModal);
      if (scannerLoadingOverlay) scannerLoadingOverlay.style.display = 'none';
      openModal(cameraScannerModal);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Seu navegador não suporta acesso direto à câmera em tempo real. Por favor, utilize o botão "Tirar Foto / Arquivo" para carregar ou tirar a foto com o app nativo do seu celular.');
        return;
      }

      try {
        if (cameraMediaStream) {
          cameraMediaStream.getTracks().forEach(t => t.stop());
        }
        cameraMediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: cameraFacingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        if (scannerVideo) {
          scannerVideo.srcObject = cameraMediaStream;
          await scannerVideo.play();
        }
      } catch (err) {
        console.warn('[Scanner Câmera] Tentando fallback sem facingMode:', err);
        try {
          cameraMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (scannerVideo) {
            scannerVideo.srcObject = cameraMediaStream;
            await scannerVideo.play();
          }
        } catch (err2) {
          console.warn('[Scanner Câmera] Falha de permissão:', err2);
          alert('Não foi possível abrir a câmera automaticamente (permissão bloqueada ou câmera ocupada). Você pode clicar em "Tirar Foto / Arquivo" para usar o aplicativo nativo da câmera.');
        }
      }
    }

    function stopCameraScanner() {
      if (cameraMediaStream) {
        cameraMediaStream.getTracks().forEach(t => t.stop());
        cameraMediaStream = null;
      }
      if (scannerVideo) {
        scannerVideo.srcObject = null;
      }
      closeModal(cameraScannerModal);
    }

    async function switchCameraFacingMode() {
      cameraFacingMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
      if (cameraMediaStream) {
        cameraMediaStream.getTracks().forEach(t => t.stop());
        cameraMediaStream = null;
      }
      await startCameraScanner();
    }

    // Processamento da Imagem Capturada (Visão IA ou OCR Local com Parser Confeiteiro)
    async function handleCaptureAndProcess(imageSource) {
      if (scannerLoadingOverlay) {
        scannerLoadingOverlay.style.display = 'flex';
        scannerLoadingText.textContent = 'Enquadrando imagem da embalagem...';
      }

      try {
        const ctx = scannerCanvas.getContext('2d');
        let targetWidth = 1200;
        let targetHeight = 900;

        if (imageSource instanceof HTMLVideoElement) {
          const vw = imageSource.videoWidth || 1280;
          const vh = imageSource.videoHeight || 720;
          targetWidth = Math.min(1280, vw);
          targetHeight = Math.round((vh / vw) * targetWidth);
          scannerCanvas.width = targetWidth;
          scannerCanvas.height = targetHeight;
          ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);
        } else if (imageSource instanceof HTMLImageElement) {
          const iw = imageSource.naturalWidth || 1280;
          const ih = imageSource.naturalHeight || 720;
          targetWidth = Math.min(1280, iw);
          targetHeight = Math.round((ih / iw) * targetWidth);
          scannerCanvas.width = targetWidth;
          scannerCanvas.height = targetHeight;
          ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);
        }

        const dataUrl = scannerCanvas.toDataURL('image/jpeg', 0.88);

        // 1. Tenta API Multimodal IA (/api/scan-insumo) se configurada na Vercel
        let aiResult = null;
        try {
          if (scannerLoadingText) scannerLoadingText.textContent = 'Analisando rótulo com visão computacional...';
          const apiRes = await fetch('/api/scan-insumo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: dataUrl })
          });
          if (apiRes.ok) {
            const apiJson = await apiRes.json();
            if (apiJson && apiJson.hasAi && apiJson.resultado && apiJson.resultado.nome) {
              aiResult = apiJson.resultado;
            }
          }
        } catch (_) {}

        if (aiResult && aiResult.nome) {
          finishScanSuccess(aiResult);
          return;
        }

        // 2. OCR Local com Tesseract.js no Navegador
        if (scannerLoadingText) scannerLoadingText.textContent = 'Lendo texto da embalagem com motor OCR...';
        let rawText = '';
        if (window.Tesseract) {
          const { data: { text } } = await window.Tesseract.recognize(scannerCanvas, 'por+eng', {
            logger: m => {
              if (m.status === 'recognizing text' && scannerLoadingText) {
                const pct = Math.round((m.progress || 0) * 100);
                scannerLoadingText.textContent = `Lendo rótulo: ${pct}%...`;
              }
            }
          });
          rawText = text || '';
        }

        const parsedData = parseRotuloConfeitaria(rawText);
        finishScanSuccess(parsedData);

      } catch (err) {
        console.warn('[Scanner] Erro na leitura:', err);
        alert('Não foi possível ler o rótulo com nitidez suficiente. Tente fotografar em um ambiente mais iluminado ou preencha os dados manualmente.');
        if (scannerLoadingOverlay) scannerLoadingOverlay.style.display = 'none';
      }
    }

    // Parser Semântico Especialista em Confeitaria Brasileira
    function parseRotuloConfeitaria(rawText) {
      const text = String(rawText || '');

      let pesoEncontrado = 1000;
      let unidadeEncontrada = 'g';
      let categoriaEncontrada = 'ingrediente';

      // 1. Detectar Peso Líquido / Volume / Unidade
      const weightMatches = [
        ...text.matchAll(/(?:peso\s*l[ií]quido|conte[úu]do\s*l[ií]quido|peso|conte[úu]do|net\s*wt\.?|l[ií]quido)?\s*[:.-]?\s*(\d+(?:[.,]\d+)?)\s*(kilos?|quilos?|kg|gramas?|g|litros?|l|mililitros?|ml|unidades?|unids?|un|cm)\b/gi)
      ];

      if (weightMatches.length > 0) {
        const match = weightMatches[weightMatches.length - 1];
        let val = parseFloat(match[1].replace(',', '.'));
        const unit = (match[2] || '').toLowerCase();

        if (unit.startsWith('k')) {
          pesoEncontrado = Math.round(val * 1000);
          unidadeEncontrada = 'g';
        } else if (unit === 'l' || unit.startsWith('litro')) {
          pesoEncontrado = Math.round(val * 1000);
          unidadeEncontrada = 'ml';
        } else if (unit.startsWith('g')) {
          pesoEncontrado = Math.round(val);
          unidadeEncontrada = 'g';
        } else if (unit.startsWith('ml')) {
          pesoEncontrado = Math.round(val);
          unidadeEncontrada = 'ml';
        } else if (unit.startsWith('un')) {
          pesoEncontrado = Math.max(1, Math.round(val));
          unidadeEncontrada = 'un';
          categoriaEncontrada = 'embalagem';
        } else if (unit === 'cm') {
          pesoEncontrado = 1;
          unidadeEncontrada = 'un';
          categoriaEncontrada = 'embalagem';
        }
      }

      // 2. Marcas Tradicionais de Confeitaria no Brasil
      const marcasConhecidas = [
        { trigger: /mo[çc]a/i, nome: 'Moça' },
        { trigger: /piracanjuba/i, nome: 'Piracanjuba' },
        { trigger: /italac/i, nome: 'Italac' },
        { trigger: /nestl[eé]/i, nome: 'Nestlé' },
        { trigger: /dona\s*benta/i, nome: 'Dona Benta' },
        { trigger: /rosa\s*branca/i, nome: 'Rosa Branca' },
        { trigger: /venturelli/i, nome: 'Venturelli' },
        { trigger: /melken/i, nome: 'Melken' },
        { trigger: /harald/i, nome: 'Harald' },
        { trigger: /sicao/i, nome: 'Sicao' },
        { trigger: /callebaut/i, nome: 'Barry Callebaut' },
        { trigger: /nutella/i, nome: 'Nutella Original' },
        { trigger: /itamb[eé]/i, nome: 'Itambé' },
        { trigger: /avia[çc][aã]o/i, nome: 'Aviação' },
        { trigger: /eleg[eê]/i, nome: 'Elegê' },
        { trigger: /norcau/i, nome: 'Norcau' },
        { trigger: /chantipak/i, nome: 'Chantipak' },
        { trigger: /hulal[aá]/i, nome: 'Hulalá' },
        { trigger: /rich'?s/i, nome: "Rich's" },
        { trigger: /uni[aã]o/i, nome: 'União' }
      ];

      let marcaDetectada = '';
      for (const m of marcasConhecidas) {
        if (m.trigger.test(text)) {
          marcaDetectada = m.nome;
          break;
        }
      }

      // 3. Identificação do Produto
      let nomeFinal = '';

      if (/leite\s*condensado/i.test(text) || (/condensado/i.test(text) && /leite/i.test(text)) || /mo[çc]a/i.test(text)) {
        nomeFinal = `Leite Condensado Integral ${marcaDetectada || 'Moça'} (${pesoEncontrado}g)`;
        unidadeEncontrada = 'g';
        categoriaEncontrada = 'ingrediente';
      } else if (/creme\s*de\s*leite/i.test(text) || (/creme/i.test(text) && /leite/i.test(text))) {
        const perc = /20%/i.test(text) ? '20% Gordura' : '';
        nomeFinal = `Creme de Leite ${perc} ${marcaDetectada} (${pesoEncontrado}g)`.replace(/\s+/g, ' ').trim();
        unidadeEncontrada = 'g';
        categoriaEncontrada = 'ingrediente';
      } else if (/farinha/i.test(text) && /trigo/i.test(text)) {
        nomeFinal = `Farinha de Trigo Especial Confeitaria ${marcaDetectada} (${pesoEncontrado >= 1000 ? `${pesoEncontrado/1000}kg` : `${pesoEncontrado}g`})`;
        unidadeEncontrada = 'g';
        categoriaEncontrada = 'ingrediente';
      } else if (/cacau/i.test(text) && (/(?:100%|alcalino|nobre)/i.test(text) || /p[oó]/i.test(text))) {
        nomeFinal = `Cacau em Pó 100% Nobre Alcalino ${marcaDetectada} (${pesoEncontrado}g)`;
        unidadeEncontrada = 'g';
        categoriaEncontrada = 'ingrediente';
      } else if (/chocolate/i.test(text)) {
        let subtipo = 'Nobre Meio Amargo 54%';
        if (/branco/i.test(text)) subtipo = 'Nobre Branco Veludo';
        else if (/ao\s*leite/i.test(text)) subtipo = 'Nobre Ao Leite';
        const formato = /gotas/i.test(text) ? 'em Gotas' : 'em Barra';
        nomeFinal = `Chocolate ${subtipo} ${formato} ${marcaDetectada} (${pesoEncontrado >= 1000 ? `${pesoEncontrado/1000}kg` : `${pesoEncontrado}g`})`;
        unidadeEncontrada = 'g';
        categoriaEncontrada = 'ingrediente';
      } else if (/nutella/i.test(text) || /avel[aã]/i.test(text)) {
        nomeFinal = `Creme de Avelã Nutella Original (${pesoEncontrado}g)`;
        unidadeEncontrada = 'g';
        categoriaEncontrada = 'ingrediente';
      } else if (/ninho/i.test(text) || (/leite/i.test(text) && /p[oó]/i.test(text))) {
        nomeFinal = `Leite em Pó Ninho Integral (${pesoEncontrado}g)`;
        unidadeEncontrada = 'g';
        categoriaEncontrada = 'ingrediente';
      } else if (/manteiga/i.test(text)) {
        nomeFinal = `Manteiga Extra Sem Sal ${marcaDetectada} (${pesoEncontrado}g)`;
        unidadeEncontrada = 'g';
        categoriaEncontrada = 'ingrediente';
      } else if (/chantilly/i.test(text) || /chantipak/i.test(text)) {
        nomeFinal = `Chantilly Líquido Premium ${marcaDetectada} (${pesoEncontrado >= 1000 ? '1 Litro' : `${pesoEncontrado}g`})`;
        unidadeEncontrada = 'g';
        categoriaEncontrada = 'ingrediente';
      } else if (/cakeboard/i.test(text) || /tabuleiro/i.test(text) || /prato/i.test(text)) {
        const matchCm = text.match(/(\d{2})\s*cm/i);
        const diam = matchCm ? `${matchCm[1]}cm` : '26cm';
        nomeFinal = `Cakeboard Rígido Mármore ${diam}`;
        unidadeEncontrada = 'un';
        categoriaEncontrada = 'embalagem';
        pesoEncontrado = 1;
      } else if (/caixa/i.test(text) || /transporte/i.test(text) || /visor/i.test(text)) {
        nomeFinal = `Caixa Alta de Transporte c/ Visor Panorâmico`;
        unidadeEncontrada = 'un';
        categoriaEncontrada = 'embalagem';
        pesoEncontrado = 1;
      } else if (/morango/i.test(text)) {
        nomeFinal = `Morangos Frescos Selecionados (${pesoEncontrado}g)`;
        unidadeEncontrada = 'g';
        categoriaEncontrada = 'ingrediente';
      } else if (/a[çc][uú]car/i.test(text)) {
        nomeFinal = `Açúcar Refinado Nobre ${marcaDetectada} (${pesoEncontrado >= 1000 ? `${pesoEncontrado/1000}kg` : `${pesoEncontrado}g`})`;
        unidadeEncontrada = 'g';
        categoriaEncontrada = 'ingrediente';
      } else {
        const lines = text
          .split('\n')
          .map(l => l.trim())
          .filter(l => l.length > 2 && !/nutricional|ingredientes|tabela|alergicos|conservar|industria|fabricado|lote|validade/i.test(l));

        const titlePart = lines.slice(0, 2).join(' ').replace(/[^a-zA-Z0-9À-ÿ\s]/g, '').trim();
        const capTitle = titlePart ? titlePart.slice(0, 40) : 'Novo Insumo Comercial';
        nomeFinal = `${capTitle} (${pesoEncontrado}${unidadeEncontrada})`;
      }

      return {
        nome: nomeFinal,
        categoria: categoriaEncontrada,
        unidade: unidadeEncontrada,
        peso_embalagem: pesoEncontrado,
        quantidade_atual: pesoEncontrado,
        quantidade_minima: categoriaEncontrada === 'embalagem' ? 10 : Math.round(pesoEncontrado * 3)
      };
    }

    function finishScanSuccess(itemData) {
      if (scannerLoadingOverlay) scannerLoadingOverlay.style.display = 'none';
      stopCameraScanner();

      openInsumoModal({
        id: 'insumo_' + Date.now(),
        nome: itemData.nome || 'Novo Insumo Comercial',
        categoria: itemData.categoria || 'ingrediente',
        unidade: itemData.unidade || 'g',
        peso_embalagem: itemData.peso_embalagem || 1000,
        preco_pago: '',
        quantidade_atual: itemData.quantidade_atual || itemData.peso_embalagem || 1000,
        quantidade_minima: itemData.quantidade_minima || Math.round((itemData.peso_embalagem || 1000) * 2)
      }, true);
    }

    // Listeners do Scanner
    if (btnOpenCameraScanner) {
      btnOpenCameraScanner.addEventListener('click', startCameraScanner);
    }

    if (btnInsumoModalScan) {
      btnInsumoModalScan.addEventListener('click', startCameraScanner);
    }

    if (closeScannerModal) {
      closeScannerModal.addEventListener('click', stopCameraScanner);
    }

    if (btnScannerSwitch) {
      btnScannerSwitch.addEventListener('click', switchCameraFacingMode);
    }

    if (btnScannerCapture && scannerVideo) {
      btnScannerCapture.addEventListener('click', () => {
        handleCaptureAndProcess(scannerVideo);
      });
    }

    if (scannerFileInput) {
      scannerFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          const img = new Image();
          img.onload = () => {
            handleCaptureAndProcess(img);
          };
          img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
        scannerFileInput.value = '';
      });
    }
  }
});
