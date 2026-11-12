-- ==============================================================================
-- OFIR BOLOS & DOCES - ATELIER PRAIA DE PIPA
-- SCRIPT DE CRIAÇÃO E BLINDAGEM DE SEGURANÇA SUPABASE (PLANO GRATUITO 500MB)
-- Execute este script no SQL Editor do seu projeto Supabase (supabase.com)
-- ==============================================================================

-- 0. TABELA DE ADMINISTRADORES AUTORIZADOS (WHITELIST DE SEGURANÇA - CWE-284)
CREATE TABLE IF NOT EXISTS public.admin_users (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Leitura de administradores" ON public.admin_users;
    CREATE POLICY "Leitura de administradores" ON public.admin_users FOR SELECT USING (true);
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

-- 1. TABELA DE PREÇOS POR ARO
CREATE TABLE IF NOT EXISTS public.precos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    diameter TEXT NOT NULL,
    slices TEXT NOT NULL,
    price NUMERIC NOT NULL,
    scale NUMERIC NOT NULL,
    sort_order INT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.precos ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura e Escrita para Preços
DO $$
BEGIN
    DROP POLICY IF EXISTS "Leitura pública de preços" ON public.precos;
    CREATE POLICY "Leitura pública de preços" ON public.precos FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Edição de preços por admin" ON public.precos;
    CREATE POLICY "Edição de preços por admin" ON public.precos FOR ALL 
    USING (
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

-- 2. TABELA DE CONFIGURAÇÕES (TOPPERS, ETC)
CREATE TABLE IF NOT EXISTS public.configuracoes (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Leitura pública de configurações" ON public.configuracoes;
    CREATE POLICY "Leitura pública de configurações" ON public.configuracoes FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Edição de configurações por admin" ON public.configuracoes;
    CREATE POLICY "Edição de configurações por admin" ON public.configuracoes FOR ALL 
    USING (
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

-- 3. TABELA DA GALERIA DE FOTOS
CREATE TABLE IF NOT EXISTS public.galeria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    categoria TEXT DEFAULT 'Casamento',
    imagem_url TEXT NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.galeria ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Leitura pública da galeria" ON public.galeria;
    CREATE POLICY "Leitura pública da galeria" ON public.galeria FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Gestão de galeria por admin" ON public.galeria;
    CREATE POLICY "Gestão de galeria por admin" ON public.galeria FOR ALL 
    USING (
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

-- 4. TABELA DE ORÇAMENTOS SOLICITADOS PELOS CLIENTES
CREATE TABLE IF NOT EXISTS public.orcamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT NOT NULL DEFAULT 'Monte seu Bolo',
    cliente_nome TEXT NOT NULL,
    data_retirada TEXT,
    tamanho TEXT,
    massa TEXT,
    cobertura TEXT,
    recheio TEXT,
    topo TEXT,
    valor_total NUMERIC,
    sinal NUMERIC,
    observacoes TEXT,
    escolhas JSONB,
    status TEXT NOT NULL DEFAULT 'Pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orcamentos_created_at ON public.orcamentos (created_at DESC);

ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Envio público de orçamentos" ON public.orcamentos;
    CREATE POLICY "Envio público de orçamentos" ON public.orcamentos
    FOR INSERT WITH CHECK (true);

    DROP POLICY IF EXISTS "Leitura de orçamentos por admin" ON public.orcamentos;
    CREATE POLICY "Leitura de orçamentos por admin" ON public.orcamentos
    FOR SELECT USING (
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );

    DROP POLICY IF EXISTS "Atualização de orçamentos por admin" ON public.orcamentos;
    CREATE POLICY "Atualização de orçamentos por admin" ON public.orcamentos
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );

    DROP POLICY IF EXISTS "Exclusão de orçamentos por admin" ON public.orcamentos;
    CREATE POLICY "Exclusão de orçamentos por admin" ON public.orcamentos
    FOR DELETE USING (
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );

    GRANT INSERT ON public.orcamentos TO anon, authenticated;
    GRANT SELECT, UPDATE, DELETE ON public.orcamentos TO authenticated;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

-- 5. CARGA DE DADOS INICIAIS DO ATELIER
INSERT INTO public.precos (id, name, diameter, slices, price, scale, sort_order) VALUES
('aro-10', 'ARO 10', '10 cm', '(6-8 fatias)', 70, 0.52, 1),
('aro-15', 'ARO 15', '15 cm', '(12-15 fatias)', 135, 0.63, 2),
('aro-20', 'ARO 20', '20 cm', '(20-25 fatias)', 195, 0.74, 3),
('aro-25', 'ARO 25', '25 cm', '(30-35 fatias)', 285, 0.84, 4),
('aro-28', 'ARO 28', '28 cm', '(40-45 fatias)', 365, 0.93, 5),
('aro-30', 'ARO 30', '30 cm', '(50-55 fatias)', 410, 1.00, 6)
ON CONFLICT (id) DO UPDATE 
SET price = EXCLUDED.price,
    updated_at = timezone('utc'::text, now());

INSERT INTO public.configuracoes (key, value) VALUES
('topper_3d_price', '35'::jsonb),
('coberturas_list', '[
  {"id": "chantily", "name": "Chantily", "desc": "Creme suave, leve e clássico batido no ponto perfeito", "icon": "🧁"},
  {"id": "chantininho", "name": "Chantininho", "desc": "Chantilly cremoso com puro leite Ninho", "icon": "🥛"},
  {"id": "glace", "name": "Glacê", "desc": "Cobertura aveludada tradicional de toque açucarado delicado", "icon": "✨"},
  {"id": "brigadeiro", "name": "Brigadeiro", "desc": "Brigadeiro gourmet cremoso e reluzente", "icon": "🍫"},
  {"id": "ganache_branco", "name": "Ganache branco", "desc": "Emulsão nobre de chocolate branco e creme fresco", "icon": "🤍"},
  {"id": "ganache_chocolate", "name": "Ganache de chocolate", "desc": "Ganache aveludada de chocolate meio amargo", "icon": "🤎"},
  {"id": "sem_cobertura", "name": "Sem cobertura ( com acetato)", "desc": "Estilo Naked Cake artesanal protegido com acetato", "icon": "🎂"}
]'::jsonb)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value,
    updated_at = timezone('utc'::text, now());

INSERT INTO public.galeria (titulo, categoria, imagem_url, descricao) VALUES
('Bolo Casamento Clássico Floral', 'Casamento', 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80', 'Cobertura acetinada com flores naturais e recheio de morango e ninho'),
('Bolo Rústico Boho Chic 15 Anos', '15 Anos', 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80', 'Massa cacau nobre com ganache meio amargo e flores desidratadas'),
('Bolo Redução de Maracujá Gourmet', 'Aniversário', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', 'Acabamento minimalista em anéis com redução pura de maracujá')
ON CONFLICT DO NOTHING;

-- 5. BUCKET DE ARMAZENAMENTO BLINDADO (SUPABASE STORAGE - LIMITE 2MB & MIME CHECK)
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
    VALUES ('galeria', 'galeria', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
    ON CONFLICT (id) DO UPDATE 
    SET public = true,
        file_size_limit = 2097152,
        allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

    DROP POLICY IF EXISTS "Visualização pública de fotos galeria" ON storage.objects;
    CREATE POLICY "Visualização pública de fotos galeria" ON storage.objects FOR SELECT USING (bucket_id = 'galeria');

    DROP POLICY IF EXISTS "Upload de fotos galeria por admin" ON storage.objects;
    CREATE POLICY "Upload de fotos galeria por admin" ON storage.objects FOR INSERT 
    WITH CHECK (
        bucket_id = 'galeria' AND 
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );

    DROP POLICY IF EXISTS "Exclusão de fotos galeria por admin" ON storage.objects;
    CREATE POLICY "Exclusão de fotos galeria por admin" ON storage.objects FOR DELETE 
    USING (
        bucket_id = 'galeria' AND 
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );
EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN others THEN NULL;
END $$;

-- ==============================================================================
-- 6. MÓDULO DE GESTÃO DE ESTOQUE, CUSTOS & RENDIMENTO (OFIR DOCERIA)
-- ==============================================================================

-- 6.1 TABELA DE INSUMOS BÁSICOS & EMBALAGENS ESPECIAIS
CREATE TABLE IF NOT EXISTS public.estoque_insumos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL DEFAULT 'ingrediente', -- 'ingrediente' ou 'embalagem'
    unidade TEXT NOT NULL DEFAULT 'g',            -- 'g', 'ml', 'un'
    peso_embalagem NUMERIC NOT NULL DEFAULT 1000, -- Conteúdo da embalagem comercial comprada
    preco_pago NUMERIC NOT NULL DEFAULT 0,        -- Valor pago pela embalagem
    quantidade_atual NUMERIC NOT NULL DEFAULT 0,  -- Saldo em estoque (em g, ml ou unidades)
    quantidade_minima NUMERIC NOT NULL DEFAULT 0, -- Ponto de reposição / alerta
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.estoque_insumos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Leitura de insumos por admin" ON public.estoque_insumos;
    CREATE POLICY "Leitura de insumos por admin" ON public.estoque_insumos FOR SELECT
    USING (
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );

    DROP POLICY IF EXISTS "Gestão de insumos por admin" ON public.estoque_insumos;
    CREATE POLICY "Gestão de insumos por admin" ON public.estoque_insumos FOR ALL
    USING (
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );

    GRANT SELECT, INSERT, UPDATE, DELETE ON public.estoque_insumos TO authenticated;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

-- 6.2 TABELA DE FICHAS TÉCNICAS / RECEITAS (RENDIMENTO REAL)
CREATE TABLE IF NOT EXISTS public.receitas (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,                           -- 'massa', 'recheio', 'cobertura'
    rendimento_final_g NUMERIC NOT NULL DEFAULT 1000, -- Peso pós-cocção / preparo pronto
    ingredientes JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Array com [{insumo_id, nome, quantidade_g}]
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.receitas ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Leitura de receitas por admin" ON public.receitas;
    CREATE POLICY "Leitura de receitas por admin" ON public.receitas FOR SELECT
    USING (
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );

    DROP POLICY IF EXISTS "Gestão de receitas por admin" ON public.receitas;
    CREATE POLICY "Gestão de receitas por admin" ON public.receitas FOR ALL
    USING (
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );

    GRANT SELECT, INSERT, UPDATE, DELETE ON public.receitas TO authenticated;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

-- 6.3 TABELA DE MOVIMENTAÇÕES DE ESTOQUE (BAIXAS DE PRODUÇÃO E ENTRADAS)
CREATE TABLE IF NOT EXISTS public.estoque_movimentacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT NOT NULL DEFAULT 'saida_producao', -- 'saida_producao', 'entrada_compra', 'ajuste_manual'
    descricao TEXT NOT NULL,
    orcamento_id TEXT,
    custo_total NUMERIC NOT NULL DEFAULT 0,
    detalhes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_estoque_mov_created_at ON public.estoque_movimentacoes (created_at DESC);

ALTER TABLE public.estoque_movimentacoes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Leitura de movimentações por admin" ON public.estoque_movimentacoes;
    CREATE POLICY "Leitura de movimentações por admin" ON public.estoque_movimentacoes FOR SELECT
    USING (
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );

    DROP POLICY IF EXISTS "Gestão de movimentações por admin" ON public.estoque_movimentacoes;
    CREATE POLICY "Gestão de movimentações por admin" ON public.estoque_movimentacoes FOR ALL
    USING (
        auth.role() = 'authenticated' AND (
            NOT EXISTS (SELECT 1 FROM public.admin_users) OR 
            EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
        )
    );

    GRANT SELECT, INSERT, UPDATE, DELETE ON public.estoque_movimentacoes TO authenticated;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

-- 6.4 CARGA INICIAL DE INSUMOS E EMBALAGENS ARTESANAIS OFIR DOCERIA
INSERT INTO public.estoque_insumos (id, nome, categoria, unidade, peso_embalagem, preco_pago, quantidade_atual, quantidade_minima) VALUES
-- Ingredientes Nobres de Confeitaria
('leite_condensado', 'Leite Condensado Integral Moça (Lata 395g)', 'ingrediente', 'g', 395, 6.50, 15800, 3950),
('creme_leite', 'Creme de Leite 20% Gordura (Caixa 200g)', 'ingrediente', 'g', 200, 3.80, 8000, 2000),
('farinha_trigo', 'Farinha de Trigo Especial Confeitaria (1kg)', 'ingrediente', 'g', 1000, 5.50, 25000, 5000),
('manteiga_extra', 'Manteiga Extra Sem Sal Primeira Qualidade (500g)', 'ingrediente', 'g', 500, 22.00, 6000, 1500),
('ovos_medios', 'Ovos Médios Frescos de Granja (Dúzia ~600g)', 'ingrediente', 'g', 600, 14.00, 7200, 1800),
('acucar_refinado', 'Açúcar Refinado Nobre (1kg)', 'ingrediente', 'g', 1000, 4.80, 20000, 4000),
('cacau_100', 'Cacau em Pó 100% Nobre Alcalino (500g)', 'ingrediente', 'g', 500, 36.00, 3500, 1000),
('leite_ninho', 'Leite em Pó Ninho Integral (Lata 400g)', 'ingrediente', 'g', 400, 18.50, 4800, 1200),
('nutella_avela', 'Creme de Avelã Nutella Original (Pote 650g)', 'ingrediente', 'g', 650, 39.00, 5200, 1300),
('chocolate_meio_amargo', 'Chocolate Nobre 54% Meio Amargo em Gotas (1kg)', 'ingrediente', 'g', 1000, 48.00, 8000, 2000),
('chocolate_branco', 'Chocolate Nobre Branco Veludo em Gotas (1kg)', 'ingrediente', 'g', 1000, 52.00, 6000, 1500),
('morangos_frescos', 'Morangos Frescos Selecionados (Bandeja 250g)', 'ingrediente', 'g', 250, 12.00, 2500, 750),
('polpa_maracuja', 'Polpa Pura de Maracujá Fresco (1kg)', 'ingrediente', 'g', 1000, 24.00, 4000, 1000),
('abacaxi_fruta', 'Abacaxi Pérola Fresco Descascado (1kg)', 'ingrediente', 'g', 1000, 12.00, 5000, 1000),
('coco_ralado_fresco', 'Coco Ralado Fino Puro Integral (500g)', 'ingrediente', 'g', 500, 19.00, 3000, 1000),
('chantilly_liquido', 'Chantilly Líquido Tradicional Premium (Litro 1000g)', 'ingrediente', 'g', 1000, 21.00, 9000, 2000),
('leite_integral', 'Leite Integral Pasteurizado (Litro 1000g)', 'ingrediente', 'g', 1000, 5.20, 12000, 3000),

-- Insumos Especiais & Embalagens de Apresentação
('cakeboard_aro10', 'Cakeboard Rígido Mármore 15cm (Aro 10)', 'embalagem', 'un', 1, 3.50, 30, 8),
('cakeboard_aro15', 'Cakeboard Rígido Mármore 20cm (Aro 15)', 'embalagem', 'un', 1, 4.50, 40, 10),
('cakeboard_aro20', 'Cakeboard Rígido Mármore 26cm (Aro 20)', 'embalagem', 'un', 1, 5.90, 45, 12),
('cakeboard_aro25', 'Cakeboard Rígido Mármore 32cm (Aro 25)', 'embalagem', 'un', 1, 7.60, 25, 6),
('cakeboard_aro28', 'Cakeboard Rígido Mármore 35cm (Aro 28)', 'embalagem', 'un', 1, 8.80, 20, 5),
('cakeboard_aro30', 'Cakeboard Rígido Mármore 38cm (Aro 30)', 'embalagem', 'un', 1, 10.40, 18, 5),
('caixa_transporte_p', 'Caixa Alta c/ Visor Panorâmico P (Aro 10 e 15)', 'embalagem', 'un', 1, 7.50, 35, 10),
('caixa_transporte_g', 'Caixa Alta c/ Visor Panorâmico G (Aro 20 a 30)', 'embalagem', 'un', 1, 11.50, 40, 10),
('fita_cetim_luxo', 'Fita de Cetim Personalizada Ouro (por bolo)', 'embalagem', 'un', 1, 1.40, 100, 20),
('topo_simples', 'Topo de Bolo Artesanal Simples (Incluso)', 'embalagem', 'un', 1, 5.00, 50, 10),
('topo_especial_3d', 'Topo de Bolo Especial 3D Acrílico Nobre', 'embalagem', 'un', 1, 22.00, 25, 5),
('sacola_kraft_luxo', 'Sacola Kraft Reforçada c/ Alça Torcida', 'embalagem', 'un', 1, 4.50, 50, 15)
ON CONFLICT (id) DO UPDATE 
SET nome = EXCLUDED.nome,
    categoria = EXCLUDED.categoria,
    unidade = EXCLUDED.unidade,
    peso_embalagem = EXCLUDED.peso_embalagem,
    preco_pago = EXCLUDED.preco_pago,
    quantidade_minima = EXCLUDED.quantidade_minima,
    updated_at = timezone('utc'::text, now());

-- 6.5 CARGA INICIAL DE FICHAS TÉCNICAS E RENDIMENTOS REAIS (MASSAS, RECHEIOS E COBERTURAS)
INSERT INTO public.receitas (id, nome, tipo, rendimento_final_g, ingredientes) VALUES
-- Massas Artesanais
('massa_branca', 'Massa Branca Amanteigada Veludo', 'massa', 1000, '[
  {"insumo_id": "farinha_trigo", "nome": "Farinha de Trigo", "quantidade_g": 300},
  {"insumo_id": "manteiga_extra", "nome": "Manteiga Extra", "quantidade_g": 200},
  {"insumo_id": "ovos_medios", "nome": "Ovos Médios", "quantidade_g": 250},
  {"insumo_id": "acucar_refinado", "nome": "Açúcar Refinado", "quantidade_g": 250},
  {"insumo_id": "leite_integral", "nome": "Leite Integral", "quantidade_g": 150}
]'::jsonb),

('massa_cacau', 'Massa Cacau Nobre 100%', 'massa', 1050, '[
  {"insumo_id": "farinha_trigo", "nome": "Farinha de Trigo", "quantidade_g": 250},
  {"insumo_id": "cacau_100", "nome": "Cacau 100%", "quantidade_g": 80},
  {"insumo_id": "manteiga_extra", "nome": "Manteiga Extra", "quantidade_g": 200},
  {"insumo_id": "ovos_medios", "nome": "Ovos Médios", "quantidade_g": 250},
  {"insumo_id": "acucar_refinado", "nome": "Açúcar Refinado", "quantidade_g": 250},
  {"insumo_id": "leite_integral", "nome": "Leite Integral", "quantidade_g": 170}
]'::jsonb),

-- Recheios Artesanais (Redução em Panela / Perda de Cocção)
('recheio_ninho', 'Recheio Brigadeiro Gourmet de Ninho', 'recheio', 1000, '[
  {"insumo_id": "leite_condensado", "nome": "Leite Condensado Moça", "quantidade_g": 790},
  {"insumo_id": "creme_leite", "nome": "Creme de Leite 20%", "quantidade_g": 400},
  {"insumo_id": "leite_ninho", "nome": "Leite Ninho", "quantidade_g": 120},
  {"insumo_id": "manteiga_extra", "nome": "Manteiga Extra", "quantidade_g": 30}
]'::jsonb),

('recheio_avela', 'Recheio Creme Nobre de Avelã & Nutella', 'recheio', 1150, '[
  {"insumo_id": "leite_condensado", "nome": "Leite Condensado Moça", "quantidade_g": 790},
  {"insumo_id": "creme_leite", "nome": "Creme de Leite 20%", "quantidade_g": 300},
  {"insumo_id": "nutella_avela", "nome": "Creme de Avelã Nutella", "quantidade_g": 250},
  {"insumo_id": "chocolate_meio_amargo", "nome": "Chocolate Meio Amargo", "quantidade_g": 100}
]'::jsonb),

('recheio_morango', 'Recheio Compota Artesanal de Morango & Ninho', 'recheio', 1100, '[
  {"insumo_id": "leite_condensado", "nome": "Leite Condensado Moça", "quantidade_g": 790},
  {"insumo_id": "creme_leite", "nome": "Creme de Leite 20%", "quantidade_g": 300},
  {"insumo_id": "morangos_frescos", "nome": "Morangos Selecionados", "quantidade_g": 300},
  {"insumo_id": "leite_ninho", "nome": "Leite Ninho", "quantidade_g": 60}
]'::jsonb),

('recheio_chocolate', 'Recheio Brigadeiro Nobre Meio Amargo 54%', 'recheio', 1050, '[
  {"insumo_id": "leite_condensado", "nome": "Leite Condensado Moça", "quantidade_g": 790},
  {"insumo_id": "creme_leite", "nome": "Creme de Leite 20%", "quantidade_g": 300},
  {"insumo_id": "chocolate_meio_amargo", "nome": "Chocolate Nobre Meio Amargo", "quantidade_g": 200},
  {"insumo_id": "cacau_100", "nome": "Cacau 100%", "quantidade_g": 40}
]'::jsonb),

('recheio_maracuja', 'Recheio Curd Suave de Maracujá Silvestre', 'recheio', 1050, '[
  {"insumo_id": "leite_condensado", "nome": "Leite Condensado Moça", "quantidade_g": 790},
  {"insumo_id": "creme_leite", "nome": "Creme de Leite 20%", "quantidade_g": 300},
  {"insumo_id": "polpa_maracuja", "nome": "Polpa Pura de Maracujá", "quantidade_g": 250},
  {"insumo_id": "chocolate_branco", "nome": "Chocolate Branco Veludo", "quantidade_g": 80}
]'::jsonb),

('recheio_coco', 'Recheio Cocada Cremosa Artesanal de Pipa', 'recheio', 1050, '[
  {"insumo_id": "leite_condensado", "nome": "Leite Condensado Moça", "quantidade_g": 790},
  {"insumo_id": "creme_leite", "nome": "Creme de Leite 20%", "quantidade_g": 300},
  {"insumo_id": "coco_ralado_fresco", "nome": "Coco Ralado Fresco", "quantidade_g": 250},
  {"insumo_id": "manteiga_extra", "nome": "Manteiga Extra", "quantidade_g": 20}
]'::jsonb),

('recheio_abacaxi', 'Recheio Doce de Abacaxi Pérola com Creme', 'recheio', 1100, '[
  {"insumo_id": "leite_condensado", "nome": "Leite Condensado Moça", "quantidade_g": 790},
  {"insumo_id": "creme_leite", "nome": "Creme de Leite 20%", "quantidade_g": 300},
  {"insumo_id": "abacaxi_fruta", "nome": "Abacaxi Pérola Fresco", "quantidade_g": 350},
  {"insumo_id": "acucar_refinado", "nome": "Açúcar Refinado", "quantidade_g": 80}
]'::jsonb),

-- Coberturas Artesanais
('cobertura_chantininho', 'Cobertura Chantininho Veludo Branco', 'cobertura', 1000, '[
  {"insumo_id": "chantilly_liquido", "nome": "Chantilly Líquido", "quantidade_g": 800},
  {"insumo_id": "leite_ninho", "nome": "Leite Ninho", "quantidade_g": 100},
  {"insumo_id": "leite_condensado", "nome": "Leite Condensado", "quantidade_g": 100}
]'::jsonb),

('cobertura_ganache_branco', 'Cobertura Ganache Nobre Branco', 'cobertura', 1000, '[
  {"insumo_id": "chocolate_branco", "nome": "Chocolate Branco Veludo", "quantidade_g": 700},
  {"insumo_id": "creme_leite", "nome": "Creme de Leite 20%", "quantidade_g": 300}
]'::jsonb),

('cobertura_ganache_chocolate', 'Cobertura Ganache Aveludado Meio Amargo', 'cobertura', 1000, '[
  {"insumo_id": "chocolate_meio_amargo", "nome": "Chocolate Meio Amargo", "quantidade_g": 650},
  {"insumo_id": "creme_leite", "nome": "Creme de Leite 20%", "quantidade_g": 350}
]'::jsonb),

('cobertura_brigadeiro', 'Cobertura Brigadeiro Espelhado', 'cobertura', 1000, '[
  {"insumo_id": "leite_condensado", "nome": "Leite Condensado Moça", "quantidade_g": 790},
  {"insumo_id": "creme_leite", "nome": "Creme de Leite 20%", "quantidade_g": 300},
  {"insumo_id": "cacau_100", "nome": "Cacau Nobre 100%", "quantidade_g": 50},
  {"insumo_id": "manteiga_extra", "nome": "Manteiga Extra", "quantidade_g": 30}
]'::jsonb),

('cobertura_sem_cobertura', 'Sem Cobertura (Acetato de Proteção)', 'cobertura', 1000, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET nome = EXCLUDED.nome,
    tipo = EXCLUDED.tipo,
    rendimento_final_g = EXCLUDED.rendimento_final_g,
    ingredientes = EXCLUDED.ingredientes,
    updated_at = timezone('utc'::text, now());
