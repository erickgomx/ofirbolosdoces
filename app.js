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
    }
  };

  const RECHEIOS = {
    'morango': { name: 'Morango', desc: 'Geleia artesanal de morangos selecionados', eq: 93, comp: 82, color: { r: 214, g: 40, b: 57 } },
    'ninho': { name: 'Ninho', desc: 'Brigadeiro cremoso de puro Leite Ninho', eq: 96, comp: 70, color: { r: 255, g: 246, b: 229 } },
    'chocolate': { name: 'Chocolate', desc: 'Ganache encorpada de chocolate meio amargo', eq: 89, comp: 89, color: { r: 64, g: 34, b: 24 } },
    'avela': { name: 'Avelã', desc: 'Creme gianduja com pedacinhos crocantes', eq: 97, comp: 86, color: { r: 140, g: 89, b: 53 } },
    'coco': { name: 'Côco', desc: 'Beijinho suave com lascas de coco fresco', eq: 92, comp: 74, color: { r: 250, g: 248, b: 245 } },
    'maracuja': { name: 'Maracujá', desc: 'Creme aveludado com redução de maracujá', eq: 95, comp: 91, color: { r: 255, g: 184, b: 0 } },
    'abacaxi': { name: 'Abacaxi', desc: 'Compota dourada artesanal com toque cítrico', eq: 94, comp: 84, color: { r: 255, g: 174, b: 25 } }
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
    viewMode: 'inteiro', // 'inteiro' or 'cortado'
    isSwaying: false
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
  const sizePills = document.querySelectorAll('.size-pill');
  const sliderTicks = document.querySelectorAll('.tick');

  const massaCards = document.querySelectorAll('.massa-card');
  const recheioItems = document.querySelectorAll('.recheio-item');
  const topperSelect = document.getElementById('topper-select');

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
  const rotateBtnText = document.getElementById('rotate-btn-text');

  // Modals
  const checkoutModal = document.getElementById('checkout-modal');
  const policyModal = document.getElementById('policy-modal');
  const aboutModal = document.getElementById('about-modal');
  const customCakeModal = document.getElementById('custom-cake-modal');

  const btnConcluirCriacao = document.getElementById('btn-concluir-criacao');
  const closeCheckoutModal = document.getElementById('close-checkout-modal');
  const closePolicyModal = document.getElementById('close-policy-modal');
  const closeAboutModal = document.getElementById('close-about-modal');
  const closeCustomCakeModal = document.getElementById('close-custom-cake-modal');

  const openPoliciesBtn = document.getElementById('open-policies-btn');
  const openAboutBtn = document.getElementById('open-about-btn');
  const openPolicyModalInline = document.getElementById('open-policy-modal-inline');
  const btnCustomEventCake = document.getElementById('btn-custom-event-cake');
  const openCustomCakeNav = document.getElementById('open-custom-cake-nav');

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

  // --- PRELOAD ALL 18 NATIVE HIGH-RES CAKE RENDERS ---
  const CAKE_ASSETS = [
    'assets/bolo_inteiro_aro10.png', 'assets/bolo_inteiro_aro15.png', 'assets/bolo_inteiro_aro20.png',
    'assets/bolo_inteiro_aro25.png', 'assets/bolo_inteiro_aro28.png', 'assets/bolo_inteiro_aro30.png',
    'assets/bolo_cortado_branco_aro10.png', 'assets/bolo_cortado_branco_aro15.png', 'assets/bolo_cortado_branco_aro20.png',
    'assets/bolo_cortado_branco_aro25.png', 'assets/bolo_cortado_branco_aro28.png', 'assets/bolo_cortado_branco_aro30.png',
    'assets/bolo_cortado_chocolate_aro10.png', 'assets/bolo_cortado_chocolate_aro15.png', 'assets/bolo_cortado_chocolate_aro20.png',
    'assets/bolo_cortado_chocolate_aro25.png', 'assets/bolo_cortado_chocolate_aro28.png', 'assets/bolo_cortado_chocolate_aro30.png'
  ];
  CAKE_ASSETS.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  function getCakeImagePath() {
    const currentSize = SIZES[state.sizeIndex];
    const aroNum = currentSize.id.replace('aro-', '');
    if (state.viewMode === 'cortado') {
      const massaType = (state.massa === 'chocolate') ? 'chocolate' : 'branco';
      return `assets/bolo_cortado_${massaType}_aro${aroNum}.png`;
    }
    return `assets/bolo_inteiro_aro${aroNum}.png`;
  }

  // --- UPDATE APP UI & CAKE LAYERS ---
  function updateApp() {
    const currentSize = SIZES[state.sizeIndex];
    const currentMassa = MASSAS[state.massa];
    const currentRecheio = RECHEIOS[state.recheio];
    const currentTopper = TOPPERS[state.topper];

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

    // 5. Recheio Items
    recheioItems.forEach(item => {
      const radio = item.querySelector('input[type="radio"]');
      const isSel = (radio && radio.value === state.recheio);
      item.classList.toggle('active', isSel);
      if (radio) radio.checked = isSel;
    });

    // 6. Summary & Sensory Metrics
    summaryAro.textContent = `${currentSize.name} ${currentSize.slices}`;
    summaryMassa.textContent = currentMassa.name;
    summaryRecheio.textContent = currentRecheio.name;

    metricEquilibrioVal.textContent = `${currentRecheio.eq}%`;
    metricEquilibrioFill.style.width = `${currentRecheio.eq}%`;
    metricComplexVal.textContent = `${currentRecheio.comp}%`;
    metricComplexFill.style.width = `${currentRecheio.comp}%`;

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
        toggleViewText.textContent = isCut ? 'Bolo Inteiro' : 'Bolo Cortado';
      }
    }
  }

  // --- SUBTLE 3D PARALLAX TILT ON MOUSE MOVE ---
  let targetTiltX = 0;
  let targetTiltY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;

  cakeInteractiveBox.addEventListener('mousemove', (e) => {
    if (state.isSwaying) return;
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

  // Smooth Parallax Lerp Loop
  function tiltLoop() {
    if (!state.isSwaying) {
      currentTiltX += (targetTiltX - currentTiltX) * 0.1;
      currentTiltY += (targetTiltY - currentTiltY) * 0.1;
      if (cakeShowcaseWrapper) cakeShowcaseWrapper.style.transform = `rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
    }
    requestAnimationFrame(tiltLoop);
  }
  requestAnimationFrame(tiltLoop);

  // --- PERSPECTIVE SWAY ANIMATION ---
  let swayAngle = 0;
  let swayInterval = null;

  btnRotate3d.addEventListener('click', () => {
    state.isSwaying = !state.isSwaying;
    btnRotate3d.classList.toggle('active', state.isSwaying);

    if (state.isSwaying) {
      rotateBtnText.textContent = 'Parar Giro';
      swayInterval = setInterval(() => {
        swayAngle += 0.035;
        const tiltY = Math.sin(swayAngle) * 9.5;
        const tiltX = Math.cos(swayAngle * 0.6) * 4.0;
        if (cakeShowcaseWrapper) cakeShowcaseWrapper.style.transform = `rotateY(${tiltY.toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg)`;
      }, 25);
    } else {
      rotateBtnText.textContent = 'Girar Perspectiva';
      clearInterval(swayInterval);
      if (cakeShowcaseWrapper) cakeShowcaseWrapper.style.transform = `rotateY(0deg) rotateX(0deg)`;
      currentTiltX = 0;
      currentTiltY = 0;
      targetTiltX = 0;
      targetTiltY = 0;
    }
  });

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

  [checkoutModal, policyModal, aboutModal, customCakeModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
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
    window.open(`https://wa.me/5584987723897?text=${encodedMessage}`, '_blank');
  });

  // Initial render
  updateApp();
});
