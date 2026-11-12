/**
 * OFIR BOLOS & DOCES - ATELIER PRAIA DE PIPA
 * Supabase Client Integration & Admin Management
 * 
 * Configurado para plano gratuito (500MB) no Supabase conectado à Vercel.
 */

(function (window) {
  'use strict';

  // Chaves padrão / configuráveis via Admin ou LocalStorage
  const STORAGE_KEY_URL = 'ofir_supabase_url';
  const STORAGE_KEY_KEY = 'ofir_supabase_anon_key';

  // URLs padrão configuráveis (podem ser ajustadas pela administradora no painel ou preenchidas aqui)
  const DEFAULT_SUPABASE_URL = localStorage.getItem(STORAGE_KEY_URL) || 'https://xnlndmtyhhlxuxsfgxvb.supabase.co';
  const DEFAULT_SUPABASE_ANON_KEY = localStorage.getItem(STORAGE_KEY_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

  let client = null;

  function initClient(url, key) {
    if (window.supabase && url && key && key !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder') {
      try {
        client = window.supabase.createClient(url, key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            storageKey: 'ofir_admin_auth_token'
          }
        });
        console.log('[Supabase] Cliente inicializado com sucesso.');
      } catch (err) {
        console.warn('[Supabase] Falha ao inicializar:', err);
        client = null;
      }
    } else {
      client = null;
    }
    return client;
  }

  // Tenta inicializar se as chaves estiverem disponíveis
  initClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);

  /**
   * Atualiza as credenciais do Supabase dinamicamente
   */
  function setCredentials(url, key) {
    if (!url || !key) throw new Error('URL e Chave Anônima são obrigatórias.');
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, key.trim());
    return initClient(url.trim(), key.trim());
  }

  function getCredentials() {
    return {
      url: localStorage.getItem(STORAGE_KEY_URL) || '',
      key: localStorage.getItem(STORAGE_KEY_KEY) || '',
      isConnected: Boolean(client)
    };
  }

  /**
   * Tenta detectar credenciais do Supabase injetadas pela Vercel via /api/config
   */
  async function autoDetectVercelConfig() {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        if (data && data.supabaseUrl && data.supabaseAnonKey) {
          console.log('[Supabase] Credenciais detectadas automaticamente via Vercel Storage!');
          setCredentials(data.supabaseUrl, data.supabaseAnonKey);
          return true;
        }
      }
    } catch (e) {
      // Ignora erro em ambiente local/estático
    }
    return false;
  }

  /**
   * Compressão automática de imagem via Canvas HTML5 (mantém < 2MB e excelente qualidade)
   */
  async function compressImage(file, maxDimension = 1600, quality = 0.82) {
    // Se o arquivo já tiver menos de 300KB e dimensões razoáveis, retorna direto
    if (file.size <= 300 * 1024 && !file.type.includes('heic')) {
      return file;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;

          // Redimensionamento proporcional se exceder maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // Suavização bicúbica
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Exportar como JPEG otimizado
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error('Falha ao processar imagem no navegador.'));
              }

              // Se ainda exceder 2MB (muito raro após 1600px 0.82), faz um segundo passe com 1200px 0.75
              if (blob.size > 2 * 1024 * 1024) {
                console.log('[Compressão] Imagem ainda > 2MB, aplicando compressão adicional...');
                compressImage(file, 1200, 0.72).then(resolve).catch(reject);
                return;
              }

              const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now()
              });

              console.log(`[Compressão] Original: ${(file.size / 1024).toFixed(1)} KB -> Otimizado: ${(compressedFile.size / 1024).toFixed(1)} KB`);
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Erro ao carregar imagem para compressão.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo da foto.'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * --- MÓDULO DE AUTENTICAÇÃO ---
   */
  async function signInAdmin(email, password) {
    if (!client) {
      throw new Error('Supabase não conectado. Configure a URL e Chave nas Configurações.');
    }
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });
    if (error) throw error;
    return data;
  }

  async function signOutAdmin() {
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) throw error;
  }

  async function getAdminSession() {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data && data.session ? data.session : null;
  }

  function onAuthStateChange(callback) {
    if (!client) return { unsubscribe: () => {} };
    const { data: authListener } = client.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return authListener.subscription;
  }

  /**
   * --- MÓDULO DE PREÇOS ---
   */
  async function fetchPrices() {
    if (!client) {
      // Fallback para cache local se disponível
      const local = localStorage.getItem('ofir_cached_prices');
      return local ? JSON.parse(local) : null;
    }

    try {
      const { data, error } = await client
        .from('precos')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem('ofir_cached_prices', JSON.stringify(data));
        return data;
      }
      return null;
    } catch (err) {
      console.warn('[Supabase] Erro ao buscar preços, usando local:', err);
      const local = localStorage.getItem('ofir_cached_prices');
      return local ? JSON.parse(local) : null;
    }
  }

  async function savePrices(pricesList) {
    if (!client) {
      // Salva localmente se Supabase não estiver conectado
      localStorage.setItem('ofir_cached_prices', JSON.stringify(pricesList));
      return { success: true, localOnly: true };
    }

    // Upsert na tabela precos
    const rows = pricesList.map((p, idx) => ({
      id: p.id,
      name: p.name,
      diameter: p.diameter,
      slices: p.slices,
      price: Number(p.price),
      scale: Number(p.scale || 1.0),
      sort_order: idx + 1,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await client
      .from('precos')
      .upsert(rows, { onConflict: 'id' });

    if (error) throw error;
    localStorage.setItem('ofir_cached_prices', JSON.stringify(rows));
    return { success: true, data };
  }

  /**
   * --- MÓDULO DE RECHEIOS ---
   */
  async function fetchRecheios() {
    if (!client) {
      const local = localStorage.getItem('ofir_cached_recheios');
      return local ? JSON.parse(local) : null;
    }

    try {
      const { data, error } = await client
        .from('configuracoes')
        .select('value')
        .eq('key', 'recheios_list')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('[Supabase] Erro ao buscar recheios:', error);
      }

      if (data && data.value && Array.isArray(data.value) && data.value.length > 0) {
        localStorage.setItem('ofir_cached_recheios', JSON.stringify(data.value));
        return data.value;
      }

      const local = localStorage.getItem('ofir_cached_recheios');
      return local ? JSON.parse(local) : null;
    } catch (err) {
      console.warn('[Supabase] Erro ao consultar recheios, usando cache local:', err);
      const local = localStorage.getItem('ofir_cached_recheios');
      return local ? JSON.parse(local) : null;
    }
  }

  async function saveRecheios(recheiosList) {
    localStorage.setItem('ofir_cached_recheios', JSON.stringify(recheiosList));

    if (client) {
      try {
        const { data, error } = await client
          .from('configuracoes')
          .upsert({
            key: 'recheios_list',
            value: recheiosList,
            updated_at: new Date().toISOString()
          }, { onConflict: 'key' });

        if (error) {
          console.warn('[Supabase] Aviso ao persistir recheios:', error);
        }
        return { success: true, data };
      } catch (e) {
        console.warn('[Supabase] Falha ao salvar recheios na nuvem:', e);
      }
    }
    return { success: true, data: recheiosList };
  }

  /**
   * --- MÓDULO DE COBERTURAS ---
   */
  async function fetchCoberturas() {
    if (!client) {
      const local = localStorage.getItem('ofir_cached_coberturas');
      return local ? JSON.parse(local) : null;
    }

    try {
      const { data, error } = await client
        .from('configuracoes')
        .select('value')
        .eq('key', 'coberturas_list')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('[Supabase] Erro ao buscar coberturas:', error);
      }

      if (data && data.value && Array.isArray(data.value) && data.value.length > 0) {
        localStorage.setItem('ofir_cached_coberturas', JSON.stringify(data.value));
        return data.value;
      }

      const local = localStorage.getItem('ofir_cached_coberturas');
      return local ? JSON.parse(local) : null;
    } catch (err) {
      console.warn('[Supabase] Erro ao consultar coberturas, usando cache local:', err);
      const local = localStorage.getItem('ofir_cached_coberturas');
      return local ? JSON.parse(local) : null;
    }
  }

  async function saveCoberturas(coberturasList) {
    localStorage.setItem('ofir_cached_coberturas', JSON.stringify(coberturasList));

    if (client) {
      try {
        const { data, error } = await client
          .from('configuracoes')
          .upsert({
            key: 'coberturas_list',
            value: coberturasList,
            updated_at: new Date().toISOString()
          }, { onConflict: 'key' });

        if (error) {
          console.warn('[Supabase] Aviso ao persistir coberturas:', error);
        }
        return { success: true, data };
      } catch (e) {
        console.warn('[Supabase] Falha ao salvar coberturas na nuvem:', e);
      }
    }
    return { success: true, data: coberturasList };
  }

  /**
   * --- MÓDULO DE GALERIA ---
   */
  async function fetchGallery() {
    if (!client) {
      const local = localStorage.getItem('ofir_cached_galeria');
      return local ? JSON.parse(local) : null;
    }

    try {
      const { data, error } = await client
        .from('galeria')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        localStorage.setItem('ofir_cached_galeria', JSON.stringify(data));
        return data;
      }
      return [];
    } catch (err) {
      console.warn('[Supabase] Erro ao buscar galeria, usando local:', err);
      const local = localStorage.getItem('ofir_cached_galeria');
      return local ? JSON.parse(local) : null;
    }
  }

  async function uploadGalleryPhoto(rawFile, { title, category, description }) {
    if (!client) {
      throw new Error('Supabase não conectado. Conecte sua conta para fazer upload.');
    }

    // 1. Comprime a foto automaticamente no navegador
    const file = await compressImage(rawFile);

    // Validação estrita do limite de 2MB
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('A imagem excedeu o limite máximo de 2MB mesmo após otimização. Selecione uma imagem menor.');
    }

    // 2. Cria nome limpo e seguro para o arquivo no Supabase Storage
    const timestamp = Date.now();
    const sanitizedTitle = (title || 'bolo')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-');
    const storagePath = `foto-${timestamp}-${sanitizedTitle}.jpg`;

    // 3. Upload para o bucket 'galeria'
    const { data: uploadData, error: uploadError } = await client.storage
      .from('galeria')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg'
      });

    if (uploadError) {
      throw uploadError;
    }

    // 4. Obter URL pública
    const { data: urlData } = client.storage
      .from('galeria')
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // 5. Inserir registro na tabela galeria
    const { data: insertData, error: insertError } = await client
      .from('galeria')
      .insert([
        {
          titulo: title.trim(),
          categoria: category || 'Casamento',
          imagem_url: publicUrl,
          descricao: (description || '').trim()
        }
      ])
      .select()
      .single();

    if (insertError) {
      // Se falhar o insert no banco, tenta remover do storage para não acumular lixo
      await client.storage.from('galeria').remove([storagePath]);
      throw insertError;
    }

    return insertData;
  }

  async function deleteGalleryPhoto(id, imageUrl) {
    if (!client) {
      throw new Error('Supabase não conectado.');
    }

    // 1. Tenta extrair o nome do arquivo da URL para apagar do storage
    try {
      if (imageUrl && imageUrl.includes('/storage/v1/object/public/galeria/')) {
        const parts = imageUrl.split('/storage/v1/object/public/galeria/');
        if (parts[1]) {
          const filePath = parts[1];
          await client.storage.from('galeria').remove([filePath]);
        }
      }
    } catch (e) {
      console.warn('[Supabase Storage] Não foi possível apagar arquivo do storage:', e);
    }

    // 2. Apaga da tabela galeria
    const { error } = await client
      .from('galeria')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  /**
   * --- MÓDULO DE ORÇAMENTOS SOLICITADOS ---
   */
  const STORAGE_KEY_ORCAMENTOS = 'ofir_cached_orcamentos';

  function getLocalOrcamentos() {
    try {
      const local = localStorage.getItem(STORAGE_KEY_ORCAMENTOS);
      return local ? JSON.parse(local) : [];
    } catch (_) {
      return [];
    }
  }

  function saveLocalOrcamento(row) {
    try {
      const current = getLocalOrcamentos();
      const updated = [row, ...current].slice(0, 100);
      localStorage.setItem(STORAGE_KEY_ORCAMENTOS, JSON.stringify(updated));
    } catch (_) {}
  }

  async function saveOrcamento(payload) {
    const nowIso = new Date().toISOString();
    const row = {
      tipo: payload.tipo || 'Monte seu Bolo',
      cliente_nome: (payload.cliente_nome || 'Cliente').trim(),
      data_retirada: payload.data_retirada || null,
      tamanho: payload.tamanho || null,
      massa: payload.massa || null,
      cobertura: payload.cobertura || null,
      recheio: payload.recheio || null,
      topo: payload.topo || null,
      valor_total: payload.valor_total !== null && payload.valor_total !== undefined ? Number(payload.valor_total) : null,
      sinal: payload.sinal !== null && payload.sinal !== undefined ? Number(payload.sinal) : null,
      observacoes: payload.observacoes ? String(payload.observacoes).trim() : null,
      escolhas: payload.escolhas || {},
      status: 'Pendente'
    };

    const localBackup = {
      ...row,
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      created_at: nowIso,
      localOnly: true
    };

    if (!client) {
      saveLocalOrcamento(localBackup);
      return { success: true, localOnly: true, data: localBackup };
    }

    try {
      // insert sem .select() pois a política RLS permite INSERT público, mas SELECT apenas para Admin
      const { error } = await client
        .from('orcamentos')
        .insert([row]);

      if (error) throw error;
      return { success: true, localOnly: false };
    } catch (err) {
      console.warn('[Supabase] Aviso ao salvar orçamento no banco, mantendo backup local:', err);
      saveLocalOrcamento(localBackup);
      return { success: false, error: err, localOnly: true, data: localBackup };
    }
  }

  async function fetchOrcamentos() {
    const localItems = getLocalOrcamentos();
    if (!client) {
      return { items: localItems, tableMissing: false, localOnly: true };
    }

    try {
      const { data, error } = await client
        .from('orcamentos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;

      const dbItems = Array.isArray(data) ? data : [];
      const localOnlyItems = localItems.filter(item => item.localOnly);
      const merged = [...dbItems, ...localOnlyItems].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      return { items: merged, tableMissing: false, localOnly: false };
    } catch (err) {
      console.warn('[Supabase] Erro ao consultar orçamentos:', err);
      const msg = (err && (err.message || err.code || '')) + '';
      const tableMissing = msg.includes('does not exist') || err.code === '42P01' || err.code === 'PGRST205';
      return { items: localItems, tableMissing, error: err, localOnly: true };
    }
  }

  async function updateOrcamentoStatus(id, newStatus) {
    if (String(id).startsWith('local-')) {
      const updated = getLocalOrcamentos().map(item =>
        String(item.id) === String(id) ? { ...item, status: newStatus } : item
      );
      localStorage.setItem(STORAGE_KEY_ORCAMENTOS, JSON.stringify(updated));
      return true;
    }

    if (!client) throw new Error('Supabase não conectado.');
    const { error } = await client
      .from('orcamentos')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async function deleteOrcamento(id) {
    if (String(id).startsWith('local-')) {
      const updated = getLocalOrcamentos().filter(item => String(item.id) !== String(id));
      localStorage.setItem(STORAGE_KEY_ORCAMENTOS, JSON.stringify(updated));
      return true;
    }

    if (!client) throw new Error('Supabase não conectado.');
    const { error } = await client
      .from('orcamentos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // ==============================================================================
  // MÓDULO DE ESTOQUE, RENDIMENTO & CUSTOS
  // ==============================================================================
  const STORAGE_KEY_INSUMOS = 'ofir_estoque_insumos';
  const STORAGE_KEY_RECEITAS = 'ofir_receitas';
  const STORAGE_KEY_MOVIMENTACOES = 'ofir_estoque_movimentacoes';

  const DEFAULT_ESTOQUE_INSUMOS = [
    { id: 'leite_condensado', nome: 'Leite Condensado Integral Moça (395g)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 395, preco_pago: 6.50, quantidade_atual: 15800, quantidade_minima: 3950 },
    { id: 'creme_leite', nome: 'Creme de Leite 20% Gordura (200g)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 200, preco_pago: 3.80, quantidade_atual: 8000, quantidade_minima: 2000 },
    { id: 'farinha_trigo', nome: 'Farinha de Trigo Especial Confeitaria (1kg)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 1000, preco_pago: 5.50, quantidade_atual: 25000, quantidade_minima: 5000 },
    { id: 'manteiga_extra', nome: 'Manteiga Extra Sem Sal (500g)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 500, preco_pago: 22.00, quantidade_atual: 6000, quantidade_minima: 1500 },
    { id: 'ovos_medios', nome: 'Ovos Médios Frescos de Granja (Dúzia ~600g)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 600, preco_pago: 14.00, quantidade_atual: 7200, quantidade_minima: 1800 },
    { id: 'acucar_refinado', nome: 'Açúcar Refinado Nobre (1kg)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 1000, preco_pago: 4.80, quantidade_atual: 20000, quantidade_minima: 4000 },
    { id: 'cacau_100', nome: 'Cacau em Pó 100% Nobre Alcalino (500g)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 500, preco_pago: 36.00, quantidade_atual: 3500, quantidade_minima: 1000 },
    { id: 'leite_ninho', nome: 'Leite em Pó Ninho Integral (400g)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 400, preco_pago: 18.50, quantidade_atual: 4800, quantidade_minima: 1200 },
    { id: 'nutella_avela', nome: 'Creme de Avelã Nutella Original (650g)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 650, preco_pago: 39.00, quantidade_atual: 5200, quantidade_minima: 1300 },
    { id: 'chocolate_meio_amargo', nome: 'Chocolate Nobre 54% Meio Amargo em Gotas (1kg)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 1000, preco_pago: 48.00, quantidade_atual: 8000, quantidade_minima: 2000 },
    { id: 'chocolate_branco', nome: 'Chocolate Nobre Branco Veludo em Gotas (1kg)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 1000, preco_pago: 52.00, quantidade_atual: 6000, quantidade_minima: 1500 },
    { id: 'morangos_frescos', nome: 'Morangos Frescos Selecionados (Bandeja 250g)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 250, preco_pago: 12.00, quantidade_atual: 2500, quantidade_minima: 750 },
    { id: 'polpa_maracuja', nome: 'Polpa Pura de Maracujá Fresco (1kg)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 1000, preco_pago: 24.00, quantidade_atual: 4000, quantidade_minima: 1000 },
    { id: 'abacaxi_fruta', nome: 'Abacaxi Pérola Fresco Descascado (1kg)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 1000, preco_pago: 12.00, quantidade_atual: 5000, quantidade_minima: 1000 },
    { id: 'coco_ralado_fresco', nome: 'Coco Ralado Fino Puro Integral (500g)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 500, preco_pago: 19.00, quantidade_atual: 3000, quantidade_minima: 1000 },
    { id: 'chantilly_liquido', nome: 'Chantilly Líquido Tradicional Premium (1000g)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 1000, preco_pago: 21.00, quantidade_atual: 9000, quantidade_minima: 2000 },
    { id: 'leite_integral', nome: 'Leite Integral Pasteurizado (1000g)', categoria: 'ingrediente', unidade: 'g', peso_embalagem: 1000, preco_pago: 5.20, quantidade_atual: 12000, quantidade_minima: 3000 },
    
    // Embalagens & Insumos Especiais
    { id: 'cakeboard_aro10', nome: 'Cakeboard Rígido Mármore 15cm (Aro 10)', categoria: 'embalagem', unidade: 'un', peso_embalagem: 1, preco_pago: 3.50, quantidade_atual: 30, quantidade_minima: 8 },
    { id: 'cakeboard_aro15', nome: 'Cakeboard Rígido Mármore 20cm (Aro 15)', categoria: 'embalagem', unidade: 'un', peso_embalagem: 1, preco_pago: 4.50, quantidade_atual: 40, quantidade_minima: 10 },
    { id: 'cakeboard_aro20', nome: 'Cakeboard Rígido Mármore 26cm (Aro 20)', categoria: 'embalagem', unidade: 'un', peso_embalagem: 1, preco_pago: 5.90, quantidade_atual: 45, quantidade_minima: 12 },
    { id: 'cakeboard_aro25', nome: 'Cakeboard Rígido Mármore 32cm (Aro 25)', categoria: 'embalagem', unidade: 'un', peso_embalagem: 1, preco_pago: 7.60, quantidade_atual: 25, quantidade_minima: 6 },
    { id: 'cakeboard_aro28', nome: 'Cakeboard Rígido Mármore 35cm (Aro 28)', categoria: 'embalagem', unidade: 'un', peso_embalagem: 1, preco_pago: 8.80, quantidade_atual: 20, quantidade_minima: 5 },
    { id: 'cakeboard_aro30', nome: 'Cakeboard Rígido Mármore 38cm (Aro 30)', categoria: 'embalagem', unidade: 'un', peso_embalagem: 1, preco_pago: 10.40, quantidade_atual: 18, quantidade_minima: 5 },
    { id: 'caixa_transporte_p', nome: 'Caixa Alta c/ Visor Panorâmico P (Aro 10 e 15)', categoria: 'embalagem', unidade: 'un', peso_embalagem: 1, preco_pago: 7.50, quantidade_atual: 35, quantidade_minima: 10 },
    { id: 'caixa_transporte_g', nome: 'Caixa Alta c/ Visor Panorâmico G (Aro 20 a 30)', categoria: 'embalagem', unidade: 'un', peso_embalagem: 1, preco_pago: 11.50, quantidade_atual: 40, quantidade_minima: 10 },
    { id: 'fita_cetim_luxo', nome: 'Fita de Cetim Personalizada Ouro (por bolo)', categoria: 'embalagem', unidade: 'un', peso_embalagem: 1, preco_pago: 1.40, quantidade_atual: 100, quantidade_minima: 20 },
    { id: 'topo_simples', nome: 'Topo de Bolo Artesanal Simples (Incluso)', categoria: 'embalagem', unidade: 'un', peso_embalagem: 1, preco_pago: 5.00, quantidade_atual: 50, quantidade_minima: 10 },
    { id: 'topo_especial_3d', nome: 'Topo de Bolo Especial 3D Acrílico Nobre', categoria: 'embalagem', unidade: 'un', peso_embalagem: 1, preco_pago: 22.00, quantidade_atual: 25, quantidade_minima: 5 },
    { id: 'sacola_kraft_luxo', nome: 'Sacola Kraft Reforçada c/ Alça Torcida', categoria: 'embalagem', unidade: 'un', peso_embalagem: 1, preco_pago: 4.50, quantidade_atual: 50, quantidade_minima: 15 }
  ];

  const DEFAULT_RECEITAS = [
    {
      id: 'massa_branca',
      nome: 'Massa Branca Amanteigada Veludo',
      tipo: 'massa',
      rendimento_final_g: 1000,
      ingredientes: [
        { insumo_id: 'farinha_trigo', nome: 'Farinha de Trigo', quantidade_g: 300 },
        { insumo_id: 'manteiga_extra', nome: 'Manteiga Extra', quantidade_g: 200 },
        { insumo_id: 'ovos_medios', nome: 'Ovos Médios', quantidade_g: 250 },
        { insumo_id: 'acucar_refinado', nome: 'Açúcar Refinado', quantidade_g: 250 },
        { insumo_id: 'leite_integral', nome: 'Leite Integral', quantidade_g: 150 }
      ]
    },
    {
      id: 'massa_cacau',
      nome: 'Massa Cacau Nobre 100%',
      tipo: 'massa',
      rendimento_final_g: 1050,
      ingredientes: [
        { insumo_id: 'farinha_trigo', nome: 'Farinha de Trigo', quantidade_g: 250 },
        { insumo_id: 'cacau_100', nome: 'Cacau 100%', quantidade_g: 80 },
        { insumo_id: 'manteiga_extra', nome: 'Manteiga Extra', quantidade_g: 200 },
        { insumo_id: 'ovos_medios', nome: 'Ovos Médios', quantidade_g: 250 },
        { insumo_id: 'acucar_refinado', nome: 'Açúcar Refinado', quantidade_g: 250 },
        { insumo_id: 'leite_integral', nome: 'Leite Integral', quantidade_g: 170 }
      ]
    },
    {
      id: 'recheio_ninho',
      nome: 'Recheio Brigadeiro Gourmet de Ninho',
      tipo: 'recheio',
      rendimento_final_g: 1000,
      ingredientes: [
        { insumo_id: 'leite_condensado', nome: 'Leite Condensado Moça', quantidade_g: 790 },
        { insumo_id: 'creme_leite', nome: 'Creme de Leite 20%', quantidade_g: 400 },
        { insumo_id: 'leite_ninho', nome: 'Leite Ninho', quantidade_g: 120 },
        { insumo_id: 'manteiga_extra', nome: 'Manteiga Extra', quantidade_g: 30 }
      ]
    },
    {
      id: 'recheio_avela',
      nome: 'Recheio Creme Nobre de Avelã & Nutella',
      tipo: 'recheio',
      rendimento_final_g: 1150,
      ingredientes: [
        { insumo_id: 'leite_condensado', nome: 'Leite Condensado Moça', quantidade_g: 790 },
        { insumo_id: 'creme_leite', nome: 'Creme de Leite 20%', quantidade_g: 300 },
        { insumo_id: 'nutella_avela', nome: 'Creme de Avelã Nutella', quantidade_g: 250 },
        { insumo_id: 'chocolate_meio_amargo', nome: 'Chocolate Meio Amargo', quantidade_g: 100 }
      ]
    },
    {
      id: 'recheio_morango',
      nome: 'Recheio Compota Artesanal de Morango & Ninho',
      tipo: 'recheio',
      rendimento_final_g: 1100,
      ingredientes: [
        { insumo_id: 'leite_condensado', nome: 'Leite Condensado Moça', quantidade_g: 790 },
        { insumo_id: 'creme_leite', nome: 'Creme de Leite 20%', quantidade_g: 300 },
        { insumo_id: 'morangos_frescos', nome: 'Morangos Selecionados', quantidade_g: 300 },
        { insumo_id: 'leite_ninho', nome: 'Leite Ninho', quantidade_g: 60 }
      ]
    },
    {
      id: 'recheio_chocolate',
      nome: 'Recheio Brigadeiro Nobre Meio Amargo 54%',
      tipo: 'recheio',
      rendimento_final_g: 1050,
      ingredientes: [
        { insumo_id: 'leite_condensado', nome: 'Leite Condensado Moça', quantidade_g: 790 },
        { insumo_id: 'creme_leite', nome: 'Creme de Leite 20%', quantidade_g: 300 },
        { insumo_id: 'chocolate_meio_amargo', nome: 'Chocolate Meio Amargo', quantidade_g: 200 },
        { insumo_id: 'cacau_100', nome: 'Cacau 100%', quantidade_g: 40 }
      ]
    },
    {
      id: 'recheio_maracuja',
      nome: 'Recheio Curd Suave de Maracujá Silvestre',
      tipo: 'recheio',
      rendimento_final_g: 1050,
      ingredientes: [
        { insumo_id: 'leite_condensado', nome: 'Leite Condensado Moça', quantidade_g: 790 },
        { insumo_id: 'creme_leite', nome: 'Creme de Leite 20%', quantidade_g: 300 },
        { insumo_id: 'polpa_maracuja', nome: 'Polpa Pura de Maracujá', quantidade_g: 250 },
        { insumo_id: 'chocolate_branco', nome: 'Chocolate Branco Veludo', quantidade_g: 80 }
      ]
    },
    {
      id: 'recheio_coco',
      nome: 'Recheio Cocada Cremosa Artesanal de Pipa',
      tipo: 'recheio',
      rendimento_final_g: 1050,
      ingredientes: [
        { insumo_id: 'leite_condensado', nome: 'Leite Condensado Moça', quantidade_g: 790 },
        { insumo_id: 'creme_leite', nome: 'Creme de Leite 20%', quantidade_g: 300 },
        { insumo_id: 'coco_ralado_fresco', nome: 'Coco Ralado Fresco', quantidade_g: 250 },
        { insumo_id: 'manteiga_extra', nome: 'Manteiga Extra', quantidade_g: 20 }
      ]
    },
    {
      id: 'recheio_abacaxi',
      nome: 'Recheio Doce de Abacaxi Pérola com Creme',
      tipo: 'recheio',
      rendimento_final_g: 1100,
      ingredientes: [
        { insumo_id: 'leite_condensado', nome: 'Leite Condensado Moça', quantidade_g: 790 },
        { insumo_id: 'creme_leite', nome: 'Creme de Leite 20%', quantidade_g: 300 },
        { insumo_id: 'abacaxi_fruta', nome: 'Abacaxi Pérola Fresco', quantidade_g: 350 },
        { insumo_id: 'acucar_refinado', nome: 'Açúcar Refinado', quantidade_g: 80 }
      ]
    },
    {
      id: 'cobertura_chantininho',
      nome: 'Cobertura Chantininho Veludo Branco',
      tipo: 'cobertura',
      rendimento_final_g: 1000,
      ingredientes: [
        { insumo_id: 'chantilly_liquido', nome: 'Chantilly Líquido', quantidade_g: 800 },
        { insumo_id: 'leite_ninho', nome: 'Leite Ninho', quantidade_g: 100 },
        { insumo_id: 'leite_condensado', nome: 'Leite Condensado', quantidade_g: 100 }
      ]
    },
    {
      id: 'cobertura_ganache_branco',
      nome: 'Cobertura Ganache Nobre Branco',
      tipo: 'cobertura',
      rendimento_final_g: 1000,
      ingredientes: [
        { insumo_id: 'chocolate_branco', nome: 'Chocolate Branco Veludo', quantidade_g: 700 },
        { insumo_id: 'creme_leite', nome: 'Creme de Leite 20%', quantidade_g: 300 }
      ]
    },
    {
      id: 'cobertura_ganache_chocolate',
      nome: 'Cobertura Ganache Aveludado Meio Amargo',
      tipo: 'cobertura',
      rendimento_final_g: 1000,
      ingredientes: [
        { insumo_id: 'chocolate_meio_amargo', nome: 'Chocolate Meio Amargo', quantidade_g: 650 },
        { insumo_id: 'creme_leite', nome: 'Creme de Leite 20%', quantidade_g: 350 }
      ]
    },
    {
      id: 'cobertura_brigadeiro',
      nome: 'Cobertura Brigadeiro Espelhado',
      tipo: 'cobertura',
      rendimento_final_g: 1000,
      ingredientes: [
        { insumo_id: 'leite_condensado', nome: 'Leite Condensado Moça', quantidade_g: 790 },
        { insumo_id: 'creme_leite', nome: 'Creme de Leite 20%', quantidade_g: 300 },
        { insumo_id: 'cacau_100', nome: 'Cacau Nobre 100%', quantidade_g: 50 },
        { insumo_id: 'manteiga_extra', nome: 'Manteiga Extra', quantidade_g: 30 }
      ]
    },
    {
      id: 'cobertura_sem_cobertura',
      nome: 'Sem Cobertura (Acetato de Proteção)',
      tipo: 'cobertura',
      rendimento_final_g: 1000,
      ingredientes: []
    }
  ];

  function getLocalInsumos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_INSUMOS);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return DEFAULT_ESTOQUE_INSUMOS;
  }

  function setLocalInsumos(items) {
    localStorage.setItem(STORAGE_KEY_INSUMOS, JSON.stringify(items));
  }

  function getLocalReceitas() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RECEITAS);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return DEFAULT_RECEITAS;
  }

  function setLocalReceitas(items) {
    localStorage.setItem(STORAGE_KEY_RECEITAS, JSON.stringify(items));
  }

  function getLocalMovimentacoes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MOVIMENTACOES);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [];
  }

  function setLocalMovimentacoes(items) {
    localStorage.setItem(STORAGE_KEY_MOVIMENTACOES, JSON.stringify(items));
  }

  async function fetchEstoqueInsumos() {
    const localItems = getLocalInsumos();
    if (!client) {
      return { items: localItems, tableMissing: false, localOnly: true };
    }

    try {
      const { data, error } = await client
        .from('estoque_insumos')
        .select('*')
        .order('categoria', { ascending: true })
        .order('nome', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        setLocalInsumos(data);
        return { items: data, tableMissing: false, localOnly: false };
      }
      return { items: localItems, tableMissing: false, localOnly: false };
    } catch (err) {
      console.warn('[Supabase] Erro ao consultar estoque_insumos:', err);
      const msg = (err && (err.message || err.code || '')) + '';
      const tableMissing = msg.includes('does not exist') || err.code === '42P01' || err.code === 'PGRST205';
      return { items: localItems, tableMissing, error: err, localOnly: true };
    }
  }

  async function saveEstoqueInsumo(item) {
    const items = getLocalInsumos();
    const existingIndex = items.findIndex(i => String(i.id) === String(item.id));
    if (existingIndex >= 0) {
      items[existingIndex] = { ...items[existingIndex], ...item, updated_at: new Date().toISOString() };
    } else {
      items.push({ ...item, updated_at: new Date().toISOString() });
    }
    setLocalInsumos(items);

    if (client) {
      try {
        await client.from('estoque_insumos').upsert([item]);
      } catch (err) {
        console.warn('[Supabase] Falha ao sincronizar insumo:', err);
      }
    }
    return true;
  }

  async function deleteEstoqueInsumo(id) {
    const items = getLocalInsumos().filter(i => String(i.id) !== String(id));
    setLocalInsumos(items);

    if (client) {
      try {
        await client.from('estoque_insumos').delete().eq('id', id);
      } catch (err) {
        console.warn('[Supabase] Falha ao excluir insumo:', err);
      }
    }
    return true;
  }

  async function adjustEstoqueSaldo(id, deltaOrTotal, isDelta = true) {
    const items = getLocalInsumos();
    const item = items.find(i => String(i.id) === String(id));
    if (item) {
      if (isDelta) {
        item.quantidade_atual = Math.max(0, Number(item.quantidade_atual || 0) + Number(deltaOrTotal));
      } else {
        item.quantidade_atual = Math.max(0, Number(deltaOrTotal));
      }
      item.updated_at = new Date().toISOString();
      setLocalInsumos(items);

      if (client) {
        try {
          await client.from('estoque_insumos').update({ quantidade_atual: item.quantidade_atual }).eq('id', id);
        } catch (err) {
          console.warn('[Supabase] Falha ao atualizar saldo:', err);
        }
      }
    }
    return item;
  }

  async function fetchReceitas() {
    const local = getLocalReceitas();
    if (!client) {
      return { items: local, tableMissing: false, localOnly: true };
    }

    try {
      const { data, error } = await client
        .from('receitas')
        .select('*')
        .order('tipo', { ascending: true })
        .order('nome', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        setLocalReceitas(data);
        return { items: data, tableMissing: false, localOnly: false };
      }
      return { items: local, tableMissing: false, localOnly: false };
    } catch (err) {
      console.warn('[Supabase] Erro ao consultar receitas:', err);
      const msg = (err && (err.message || err.code || '')) + '';
      const tableMissing = msg.includes('does not exist') || err.code === '42P01' || err.code === 'PGRST205';
      return { items: local, tableMissing, error: err, localOnly: true };
    }
  }

  async function saveReceita(receita) {
    const list = getLocalReceitas();
    const idx = list.findIndex(r => String(r.id) === String(receita.id));
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...receita, updated_at: new Date().toISOString() };
    } else {
      list.push({ ...receita, updated_at: new Date().toISOString() });
    }
    setLocalReceitas(list);

    if (client) {
      try {
        await client.from('receitas').upsert([receita]);
      } catch (err) {
        console.warn('[Supabase] Falha ao sincronizar receita:', err);
      }
    }
    return true;
  }

  async function fetchEstoqueMovimentacoes() {
    const local = getLocalMovimentacoes();
    if (!client) {
      return { items: local, tableMissing: false, localOnly: true };
    }

    try {
      const { data, error } = await client
        .from('estoque_movimentacoes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      if (data && data.length > 0) {
        setLocalMovimentacoes(data);
        return { items: data, tableMissing: false, localOnly: false };
      }
      return { items: local, tableMissing: false, localOnly: false };
    } catch (err) {
      console.warn('[Supabase] Erro ao consultar movimentações:', err);
      const msg = (err && (err.message || err.code || '')) + '';
      const tableMissing = msg.includes('does not exist') || err.code === '42P01' || err.code === 'PGRST205';
      return { items: local, tableMissing, error: err, localOnly: true };
    }
  }

  async function registrarBaixaEstoque({ descricao, orcamento_id = null, custo_total = 0, detalhes = {}, itensBaixados = [] }) {
    const movId = 'mov-' + Date.now();
    const movRecord = {
      id: movId,
      tipo: 'saida_producao',
      descricao,
      orcamento_id,
      custo_total,
      detalhes,
      created_at: new Date().toISOString()
    };

    // 1. Grava a movimentação local
    const movs = getLocalMovimentacoes();
    movs.unshift(movRecord);
    setLocalMovimentacoes(movs.slice(0, 100));

    // 2. Decrementa o saldo dos insumos
    const insumos = getLocalInsumos();
    itensBaixados.forEach(item => {
      const found = insumos.find(i => String(i.id) === String(item.insumo_id));
      if (found) {
        const gasto = Number(item.quantidade || 0);
        found.quantidade_atual = Math.max(0, Number(found.quantidade_atual || 0) - gasto);
        found.updated_at = new Date().toISOString();
      }
    });
    setLocalInsumos(insumos);

    // 3. Sincroniza com Supabase se disponível
    if (client) {
      try {
        await client.from('estoque_movimentacoes').insert([{
          tipo: movRecord.tipo,
          descricao: movRecord.descricao,
          orcamento_id: movRecord.orcamento_id,
          custo_total: movRecord.custo_total,
          detalhes: movRecord.detalhes
        }]);

        // Atualiza os saldos dos insumos em paralelo
        for (const it of itensBaixados) {
          const updated = insumos.find(i => String(i.id) === String(it.insumo_id));
          if (updated) {
            await client.from('estoque_insumos').update({ quantidade_atual: updated.quantidade_atual }).eq('id', updated.id);
          }
        }
      } catch (err) {
        console.warn('[Supabase] Falha ao persistir baixa na nuvem:', err);
      }
    }

    return movRecord;
  }

  // Exportar para o escopo global
  window.OfirSupabase = {
    initClient,
    setCredentials,
    getCredentials,
    autoDetectVercelConfig,
    compressImage,
    signInAdmin,
    signOutAdmin,
    getAdminSession,
    onAuthStateChange,
    fetchPrices,
    savePrices,
    fetchCoberturas,
    saveCoberturas,
    fetchRecheios,
    saveRecheios,
    fetchGallery,
    uploadGalleryPhoto,
    deleteGalleryPhoto,
    saveOrcamento,
    fetchOrcamentos,
    updateOrcamentoStatus,
    deleteOrcamento,
    // Estoque & Custos
    fetchEstoqueInsumos,
    saveEstoqueInsumo,
    deleteEstoqueInsumo,
    adjustEstoqueSaldo,
    fetchReceitas,
    saveReceita,
    fetchEstoqueMovimentacoes,
    registrarBaixaEstoque
  };

})(window);
