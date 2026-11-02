/**
 * OFIR BOLOS & DOCES - ATELIER EM PRAIA DE PIPA
 * Core Interactive Logic, Cake 3D Rig, Pricing & WhatsApp Checkout
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DATA DEFINITIONS ---
  const SIZES = [
    { id: 'aro-10', name: 'ARO 10', diameter: '10 cm', slices: '(6-8 fatias)', price: 70, scale: 0.80 },
    { id: 'aro-15', name: 'ARO 15', diameter: '15 cm', slices: '(12-15 fatias)', price: 135, scale: 0.90 },
    { id: 'aro-20', name: 'ARO 20', diameter: '20 cm', slices: '(20-25 fatias)', price: 195, scale: 1.00 },
    { id: 'aro-25', name: 'ARO 25', diameter: '25 cm', slices: '(30-35 fatias)', price: 285, scale: 1.10 },
    { id: 'aro-28', name: 'ARO 28', diameter: '28 cm', slices: '(40-45 fatias)', price: 365, scale: 1.18 },
    { id: 'aro-30', name: 'ARO 30', diameter: '30 cm', slices: '(50-55 fatias)', price: 410, scale: 1.25 }
  ];

  const MASSAS = {
    'branco': { name: 'Branco (ovos)', desc: 'Massa amanteigada fofa e delicada' },
    'chocolate': { name: 'Chocolate', desc: 'Cacau nobre aveludado e intenso' }
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

  // --- CURRENT STATE ---
  let currentState = {
    sizeIndex: 2, // ARO 20 default
    massa: 'branco',
    recheio: 'avela',
    topper: 'simples',
    cutView: true,
    isRotating: false,
    rotationDeg: 0
  };

  // --- DOM ELEMENTS ---
  const cakeModel = document.getElementById('cake-model');
  const cakeRig = document.getElementById('cake-rig');
  const cakeInteractiveBox = document.getElementById('cake-interactive-box');

  // Dimension Controls
  const dimRange = document.getElementById('dimensions-range');
  const dimPrevBtn = document.getElementById('dim-prev');
  const dimNextBtn = document.getElementById('dim-next');
  const dimLabelName = document.getElementById('dim-label-name');
  const dimServingsText = document.getElementById('dim-servings-text');
  const dimDiameterText = document.getElementById('dim-diameter-text');
  const sizePills = document.querySelectorAll('.size-pill');
  const sliderTicks = document.querySelectorAll('.tick');

  // Massa & Recheio Controls
  const massaCards = document.querySelectorAll('.massa-card');
  const recheioItems = document.querySelectorAll('.recheio-item');
  const topperSelect = document.getElementById('topper-select');

  // Guide Labels
  const guideLabelMassa = document.getElementById('guide-label-massa');
  const guideLabelRecheio = document.getElementById('guide-label-recheio');

  // Summary Elements
  const summaryAro = document.getElementById('summary-aro');
  const summaryMassa = document.getElementById('summary-massa');
  const summaryRecheio = document.getElementById('summary-recheio');
  const finalPriceValue = document.getElementById('final-price-value');
  const depositNoteText = document.getElementById('deposit-note-text');

  // Sensory Gauges
  const metricEquilibrioVal = document.getElementById('metric-equilibrio-val');
  const metricEquilibrioFill = document.getElementById('metric-equilibrio-fill');
  const metricComplexVal = document.getElementById('metric-complex-val');
  const metricComplexFill = document.getElementById('metric-complex-fill');

  // View Actions
  const btnRotate3d = document.getElementById('btn-rotate-3d');
  const btnToggleSlice = document.getElementById('btn-toggle-slice');
  const sliceToggleText = document.getElementById('slice-toggle-text');

  // Modals & Navigation
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
  const cardPolicyShortcut = document.getElementById('card-policy-shortcut');

  // Checkout Form
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

  // --- INITIALIZE MINIMUM PICKUP DATE (10 DAYS NOTICE RULE) ---
  function initPickupDateConstraint() {
    const today = new Date();
    // Rule 1: Minimum 10 days notice
    today.setDate(today.getDate() + 10);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;
    pickupDateInput.min = minDateStr;
    pickupDateInput.value = minDateStr;
  }
  initPickupDateConstraint();

  // --- UPDATE ALL UI & STATE ---
  function updateUI() {
    const currentSize = SIZES[currentState.sizeIndex];
    const currentMassa = MASSAS[currentState.massa];
    const currentRecheio = RECHEIOS[currentState.recheio];
    const currentTopper = TOPPERS[currentState.topper];

    // 1. Dimensions Header & Range
    dimRange.value = currentState.sizeIndex;
    dimLabelName.textContent = currentSize.name;
    dimServingsText.textContent = currentSize.slices;
    dimDiameterText.textContent = currentSize.diameter;

    // Update Slider Ticks & Pills
    sliderTicks.forEach(tick => {
      const idx = parseInt(tick.dataset.index, 10);
      tick.classList.toggle('active', idx === currentState.sizeIndex);
    });

    sizePills.forEach(pill => {
      const idx = parseInt(pill.dataset.index, 10);
      pill.classList.toggle('active', idx === currentState.sizeIndex);
    });

    // 2. Massa UI
    massaCards.forEach(card => {
      const m = card.dataset.massa;
      const isSelected = (m === currentState.massa);
      card.classList.toggle('active', isSelected);
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = isSelected;
    });

    // 3. Recheio UI
    recheioItems.forEach(item => {
      const radio = item.querySelector('input[type="radio"]');
      const isSelected = (radio && radio.value === currentState.recheio);
      item.classList.toggle('active', isSelected);
      if (radio) radio.checked = isSelected;
    });

    // 4. Update Visual Cake Model Attributes
    cakeModel.setAttribute('data-massa', currentState.massa);
    cakeModel.setAttribute('data-recheio', currentState.recheio);
    cakeModel.style.transform = `scale(${currentSize.scale})`;

    // Toggle Cut View
    cakeModel.classList.toggle('cut-view', currentState.cutView);
    btnToggleSlice.classList.toggle('active', currentState.cutView);
    sliceToggleText.textContent = currentState.cutView ? 'Ver Fatia' : 'Bolo Inteiro';

    // 5. Update Annotation Guide Labels
    if (guideLabelMassa) guideLabelMassa.textContent = `Massa: ${currentMassa.name}`;
    if (guideLabelRecheio) guideLabelRecheio.textContent = `Recheio: ${currentRecheio.name}`;

    // 6. Summary Panel
    summaryAro.textContent = `${currentSize.name} ${currentSize.slices}`;
    summaryMassa.textContent = currentMassa.name;
    summaryRecheio.textContent = currentRecheio.name;

    // 7. Calculate Total Price & Deposit
    const totalPrice = currentSize.price + currentTopper.extra;
    const depositPrice = totalPrice / 2;

    finalPriceValue.textContent = totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    depositNoteText.innerHTML = `Sinal de 50%: <strong>R$ ${depositPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> (restante na entrega)`;

    // 8. Sensory Metrics Gauges
    const eqScore = currentRecheio.eq;
    const compScore = currentRecheio.comp;
    metricEquilibrioVal.textContent = `${eqScore}%`;
    metricEquilibrioFill.style.width = `${eqScore}%`;
    metricComplexVal.textContent = `${compScore}%`;
    metricComplexFill.style.width = `${compScore}%`;
  }

  // --- EVENT LISTENERS: DIMENSIONS ---
  dimRange.addEventListener('input', (e) => {
    currentState.sizeIndex = parseInt(e.target.value, 10);
    updateUI();
  });

  dimPrevBtn.addEventListener('click', () => {
    if (currentState.sizeIndex > 0) {
      currentState.sizeIndex--;
      updateUI();
    }
  });

  dimNextBtn.addEventListener('click', () => {
    if (currentState.sizeIndex < SIZES.length - 1) {
      currentState.sizeIndex++;
      updateUI();
    }
  });

  sizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      currentState.sizeIndex = parseInt(pill.dataset.index, 10);
      updateUI();
    });
  });

  // --- EVENT LISTENERS: MASSA ---
  massaCards.forEach(card => {
    card.addEventListener('click', () => {
      currentState.massa = card.dataset.massa;
      updateUI();
    });
  });

  // --- EVENT LISTENERS: RECHEIO ---
  recheioItems.forEach(item => {
    item.addEventListener('click', () => {
      const radio = item.querySelector('input[type="radio"]');
      if (radio) {
        currentState.recheio = radio.value;
        updateUI();
      }
    });
  });

  // --- EVENT LISTENERS: TOPPER ---
  topperSelect.addEventListener('change', (e) => {
    currentState.topper = e.target.value;
    updateUI();
  });

  // --- EVENT LISTENERS: VIEW ACTIONS ---
  btnToggleSlice.addEventListener('click', () => {
    currentState.cutView = !currentState.cutView;
    updateUI();
  });

  let rotateInterval = null;
  btnRotate3d.addEventListener('click', () => {
    currentState.isRotating = !currentState.isRotating;
    btnRotate3d.classList.toggle('active', currentState.isRotating);

    if (currentState.isRotating) {
      rotateInterval = setInterval(() => {
        currentState.rotationDeg = (currentState.rotationDeg + 1.2) % 360;
        cakeRig.style.transform = `rotateY(${currentState.rotationDeg}deg) rotateX(4deg)`;
      }, 30);
    } else {
      clearInterval(rotateInterval);
      cakeRig.style.transform = `rotateY(0deg) rotateX(0deg)`;
      currentState.rotationDeg = 0;
    }
  });

  // Mouse drag / touch rotate interactive perspective
  let isDragging = false;
  let startX = 0;
  let currentTiltY = 0;

  cakeInteractiveBox.addEventListener('mousedown', (e) => {
    if (currentState.isRotating) return;
    isDragging = true;
    startX = e.clientX;
    cakeInteractiveBox.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    startX = e.clientX;
    currentTiltY = Math.max(-45, Math.min(45, currentTiltY + deltaX * 0.4));
    cakeRig.style.transform = `rotateY(${currentTiltY}deg) rotateX(3deg)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    cakeInteractiveBox.style.cursor = 'default';
    if (!currentState.isRotating) {
      cakeRig.style.transition = 'transform 0.5s ease';
      cakeRig.style.transform = `rotateY(0deg) rotateX(0deg)`;
      setTimeout(() => {
        cakeRig.style.transition = '';
        currentTiltY = 0;
      }, 500);
    }
  });

  // --- MODAL CONTROLS ---
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

  // Open Checkout Modal
  btnConcluirCriacao.addEventListener('click', () => {
    const currentSize = SIZES[currentState.sizeIndex];
    const currentMassa = MASSAS[currentState.massa];
    const currentRecheio = RECHEIOS[currentState.recheio];
    const currentTopper = TOPPERS[currentState.topper];
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

  // Close when clicking modal backdrop
  [checkoutModal, policyModal, aboutModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // --- WHATSAPP ORDER GENERATOR ---
  btnSendWhatsapp.addEventListener('click', () => {
    const name = customerNameInput.value.trim() || 'Cliente';
    const pickupDate = pickupDateInput.value;
    const notes = orderNotesInput.value.trim();

    const currentSize = SIZES[currentState.sizeIndex];
    const currentMassa = MASSAS[currentState.massa];
    const currentRecheio = RECHEIOS[currentState.recheio];
    const currentTopper = TOPPERS[currentState.topper];
    const totalPrice = currentSize.price + currentTopper.extra;
    const depositPrice = totalPrice / 2;

    // Format pickup date to Brazilian style DD/MM/YYYY
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
    const whatsappUrl = `https://wa.me/5584994114341?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  });

  // Initial render
  updateUI();
});
