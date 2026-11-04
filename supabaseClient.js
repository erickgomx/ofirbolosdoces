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
    fetchRecheios,
    saveRecheios,
    fetchGallery,
    uploadGalleryPhoto,
    deleteGalleryPhoto
  };

})(window);
