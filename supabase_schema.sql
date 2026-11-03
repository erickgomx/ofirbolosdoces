-- ==============================================================================
-- OFIR BOLOS & DOCES - ATELIER PRAIA DE PIPA
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS SUPABASE (PLANO GRATUITO 500MB)
-- Execute este script no SQL Editor do seu projeto Supabase (supabase.com)
-- ==============================================================================

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

-- Habilitar RLS na tabela de preços
ALTER TABLE public.precos ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura e Escrita para Preços
DO $$
BEGIN
    DROP POLICY IF EXISTS "Leitura pública de preços" ON public.precos;
    CREATE POLICY "Leitura pública de preços" ON public.precos FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Edição de preços por admin" ON public.precos;
    CREATE POLICY "Edição de preços por admin" ON public.precos FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN undefined_table THEN
        NULL;
END $$;

-- 2. TABELA DE CONFIGURAÇÕES (TOPPERS, ETC)
CREATE TABLE IF NOT EXISTS public.configuracoes (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS na tabela de configurações
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura e Escrita para Configurações
DO $$
BEGIN
    DROP POLICY IF EXISTS "Leitura pública de configurações" ON public.configuracoes;
    CREATE POLICY "Leitura pública de configurações" ON public.configuracoes FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Edição de configurações por admin" ON public.configuracoes;
    CREATE POLICY "Edição de configurações por admin" ON public.configuracoes FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN undefined_table THEN
        NULL;
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

-- Habilitar RLS na tabela da galeria
ALTER TABLE public.galeria ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura e Escrita para Galeria
DO $$
BEGIN
    DROP POLICY IF EXISTS "Leitura pública da galeria" ON public.galeria;
    CREATE POLICY "Leitura pública da galeria" ON public.galeria FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Gestão de galeria por admin" ON public.galeria;
    CREATE POLICY "Gestão de galeria por admin" ON public.galeria FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN undefined_table THEN
        NULL;
END $$;

-- 4. CARGA DE DADOS INICIAIS DO ATELIER
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
('topper_3d_price', '35'::jsonb)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value,
    updated_at = timezone('utc'::text, now());

INSERT INTO public.galeria (titulo, categoria, imagem_url, descricao) VALUES
('Bolo Casamento Clássico Floral', 'Casamento', 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80', 'Cobertura acetinada com flores naturais e recheio de morango e ninho'),
('Bolo Rústico Boho Chic 15 Anos', '15 Anos', 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80', 'Massa cacau nobre com ganache meio amargo e flores desidratadas'),
('Bolo Redução de Maracujá Gourmet', 'Aniversário', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', 'Acabamento minimalista em anéis com redução pura de maracujá')
ON CONFLICT DO NOTHING;

-- 5. BUCKET DE ARMAZENAMENTO PARA FOTOS DA GALERIA (SUPABASE STORAGE)
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public) VALUES ('galeria', 'galeria', true)
    ON CONFLICT (id) DO UPDATE SET public = true;

    DROP POLICY IF EXISTS "Visualização pública de fotos galeria" ON storage.objects;
    CREATE POLICY "Visualização pública de fotos galeria" ON storage.objects FOR SELECT USING (bucket_id = 'galeria');

    DROP POLICY IF EXISTS "Upload de fotos galeria por admin" ON storage.objects;
    CREATE POLICY "Upload de fotos galeria por admin" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'galeria' AND auth.role() = 'authenticated');

    DROP POLICY IF EXISTS "Exclusão de fotos galeria por admin" ON storage.objects;
    CREATE POLICY "Exclusão de fotos galeria por admin" ON storage.objects FOR DELETE USING (bucket_id = 'galeria' AND auth.role() = 'authenticated');
EXCEPTION
    WHEN undefined_table THEN
        NULL;
    WHEN others THEN
        NULL;
END $$;
