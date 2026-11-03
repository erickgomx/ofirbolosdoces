/**
 * OFIR BOLOS & DOCES - ATELIER EM PRAIA DE PIPA
 * Real High-Resolution Photorealistic Multi-Layer Cake Engine & Interactive Customizer
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DATA DEFINITIONS ---
  const SIZES = [
    { id: 'aro-10', name: 'ARO 10', diameter: '10 cm', slices: '(6-8 fatias)', price: 70, scale: 0.58 },
    { id: 'aro-15', name: 'ARO 15', diameter: '15 cm', slices: '(12-15 fatias)', price: 135, scale: 0.67 },
    { id: 'aro-20', name: 'ARO 20', diameter: '20 cm', slices: '(20-25 fatias)', price: 195, scale: 0.76 },
    { id: 'aro-25', name: 'ARO 25', diameter: '25 cm', slices: '(30-35 fatias)', price: 285, scale: 0.86 },
    { id: 'aro-28', name: 'ARO 28', diameter: '28 cm', slices: '(40-45 fatias)', price: 365, scale: 0.94 },
    { id: 'aro-30', name: 'ARO 30', diameter: '30 cm', slices: '(50-55 fatias)', price: 410, scale: 1.00 }
  ];

  const MASSAS = {
    'branco': {
      name: 'Branco (ovos)',
      desc: 'Massa amanteigada fofa e delicada',
      cortado: 'assets/bolo_cortado_branco.png',
      fatia: 'assets/fatia_branco.png'
    },
    'chocolate': {
      name: 'Chocolate',
      desc: 'Cacau nobre aveludado e intenso',
      cortado: 'assets/bolo_cortado_chocolate.png',
      fatia: 'assets/fatia_chocolate.png'
    }
  };

  const RECHEIOS = {
    'morango': { name: 'Morango', desc: 'Geleia artesanal de morangos selecionados', eq: 93, comp: 82 },
    'ninho': { name: 'Ninho', desc: 'Brigadeiro cremoso de puro Leite Ninho', eq: 96, comp: 70 },
    'chocolate': { name: 'Chocolate', desc: 'Ganache encorpada de chocolate meio amargo', eq: 89, comp: 89 },
    'avela': { name: 'Avelã', desc: 'Creme gianduja com pedacinhos crocantes', eq: 97, comp: 86 },
    'coco': { name: 'Côco', desc: 'Beijinho suave com lascas de coco fresco', eq: 92, comp: 74 },
    'maracuja': { name: 'Maracujá', desc: 'Creme aveludado com redução de maracujá', eq: 95, comp: 91 },
    'abacaxi': { name: 'Abacaxi', desc: 'Compota dourada artesanal com toque cítrico', eq: 94, comp: 84 }
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
    isSwaying: false
  };

  // --- DOM ELEMENTS ---
  const cakeInteractiveBox = document.getElementById('cake-interactive-box');
  const realCakeWrapper = document.getElementById('real-cake-wrapper');
  const cakeBaseFixed = document.getElementById('cake-base-fixed');
  const cakeScalableGroup = document.getElementById('cake-scalable-group');
  
  // Layer Elements
  const layerBase = document.getElementById('layer-base');
  const layerCompleto = document.getElementById('layer-completo');
  const layerCortado = document.getElementById('layer-cortado');
  const layerFatia = document.getElementById('layer-fatia');

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
  const btnToggleSlice = document.getElementById('btn-toggle-slice');
  const sliceToggleText = document.getElementById('slice-toggle-text');

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
  const btnOpenCustomFromSummary = document.getElementById('btn-open-custom-from-summary');

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

  // Custom Wedding / Special Event Cake Elements
  const btnSendCustomWhatsapp = document.getElementById('btn-send-custom-whatsapp');
  const customDateInput = document.getElementById('custom-date');
  const customGuestsSelect = document.getElementById('custom-guests');
  const customClientNameInput = document.getElementById('custom-client-name');
  const customNotesInput = document.getElementById('custom-notes');
  const eventPills = document.querySelectorAll('.event-pill');

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

  // --- UPDATE APP UI & CAKE LAYERS ---
  function updateApp() {
    const currentSize = SIZES[state.sizeIndex];
    const currentMassa = MASSAS[state.massa];
    const currentRecheio = RECHEIOS[state.recheio];
    const currentTopper = TOPPERS[state.topper];

    // 1. Update Layer Images based on selected Massa
    if (layerCortado.getAttribute('src') !== currentMassa.cortado) {
      layerCortado.src = currentMassa.cortado;
    }
    if (layerFatia.getAttribute('src') !== currentMassa.fatia) {
      layerFatia.src = currentMassa.fatia;
    }

    // 2. Toggle Layers based on Slice vs Whole Cake
    if (state.cutView) {
      // Cut View: Display cake body with cutaway + animated separate slice
      layerCompleto.classList.remove('active');
      layerCortado.classList.add('active');
      layerFatia.classList.add('active');
    } else {
      // Whole Cake View: Display complete uncut cake, hide cut and slice
      layerCompleto.classList.add('active');
      layerCortado.classList.remove('active');
      layerFatia.classList.remove('active');
    }

    // Smoothly scale cake according to selected size (base stays unchanged)
    if (cakeScalableGroup) {
      cakeScalableGroup.style.transform = `scale(${currentSize.scale})`;
    }

    // 3. Slider & Controls
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

    // 8. Toggle Slice Button State
    btnToggleSlice.classList.toggle('active', state.cutView);
    sliceToggleText.textContent = state.cutView ? 'Ver Fatia' : 'Bolo Inteiro';
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
      realCakeWrapper.style.transform = `rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
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
        realCakeWrapper.style.transform = `rotateY(${tiltY.toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg)`;
      }, 25);
    } else {
      rotateBtnText.textContent = 'Girar Perspectiva';
      clearInterval(swayInterval);
      realCakeWrapper.style.transform = `rotateY(0deg) rotateX(0deg)`;
      currentTiltX = 0;
      currentTiltY = 0;
      targetTiltX = 0;
      targetTiltY = 0;
    }
  });

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

  btnToggleSlice.addEventListener('click', () => {
    state.cutView = !state.cutView;
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

  if (btnOpenCustomFromSummary) {
    btnOpenCustomFromSummary.addEventListener('click', () => {
      openModal(customCakeModal);
    });
  }

  // Event Type Pills active state handler
  eventPills.forEach(pill => {
    pill.addEventListener('click', () => {
      eventPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

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

  // --- WHATSAPP CUSTOM WEDDING / SPECIAL EVENT GENERATOR ---
  if (btnSendCustomWhatsapp) {
    btnSendCustomWhatsapp.addEventListener('click', () => {
      const clientName = (customClientNameInput && customClientNameInput.value.trim()) || 'Cliente Especial';
      const eventDate = (customDateInput && customDateInput.value) || '';
      const guests = (customGuestsSelect && customGuestsSelect.value) || '50 a 80 pessoas';
      const notes = (customNotesInput && customNotesInput.value.trim()) || '';

      // Selected Event Type
      const activeTypeRadio = document.querySelector('input[name="custom-event-type"]:checked');
      const eventType = activeTypeRadio ? activeTypeRadio.value : 'Casamento / Noivado';

      // Selected Styles
      const selectedStyles = [];
      document.querySelectorAll('input[name="custom-style-tag"]:checked').forEach(cb => {
        selectedStyles.push(cb.value);
      });
      const stylesText = selectedStyles.length > 0 ? selectedStyles.join(', ') : 'A definir no atendimento';

      let formattedDate = eventDate;
      if (eventDate && eventDate.includes('-')) {
        const parts = eventDate.split('-');
        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }

      const customMessage = 
`✨ *SOLICITAÇÃO DE PROJETO: BOLO PERSONALIZADO & EVENTOS*
*Ofir Bolos & Doces — Praia de Pipa / RN*
---------------------------------------------
Olá Lucieda! Gostaria de solicitar um orçamento para um projeto exclusivo sob medida:

💍 *Ocasião / Evento:* ${eventType}
👥 *Estimativa de Convidados:* ${guests}
📅 *Data Prevista do Evento:* ${formattedDate || 'A definir'}
🎂 *Estrutura & Detalhes:* ${stylesText}

👤 *Nome do Cliente:* ${clientName}
${notes ? `📝 *Ideias, Paleta de Cores e Referências:*\n"${notes}"\n` : ''}
Gostaria de consultar sua disponibilidade de agenda para realizarmos esse projeto em Praia de Pipa! ✨`;

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
