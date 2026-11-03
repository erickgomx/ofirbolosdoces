# Ofir Bolos & Doces — Atelier de Confeitaria em Praia de Pipa 🎂✨

Interface interativa e minimalista de alta confeitaria para encomenda personalizada de bolos artesanais da **Ofir Doceria**, inspirada em estética editorial e de luxo.

---

## 🌟 Funcionalidades do Sistema

### 1. Monte Seu Bolo Interativo
- **Dimensões & Tamanhos Proporcionais:**
  - `ARO 10` — (6-8 fatias)
  - `ARO 15` — (12-15 fatias)
  - `ARO 20` — (20-25 fatias)
  - `ARO 25` — (30-35 fatias)
  - `ARO 28` — (40-45 fatias)
  - `ARO 30` — (50-55 fatias)
- **Pedestal Fixo & Alinhamento Milimétrico:** Pedestal de mármore e latão permanece com tamanho estático e perfeito enquanto o bolo cresce na proporção do aro selecionado.
- **Visualização Cortado vs Inteiro:** Alternância instantânea entre o bolo inteiro e o bolo cortado com fatia aparente.
- **Massa Dinâmica:** Alternância fluida entre massa branca amanteigada e massa de cacau nobre.
- **Recheios Exclusivos:** 7 sabores artesanais (*Morango, Ninho, Chocolate, Avelã, Côco, Maracujá e Abacaxi*).
- **Métricas Sensoriais & Harmonia:** Medidores de Equilíbrio de Sabores e Complexidade.
- **Checkout Integrado ao WhatsApp da Lucieda `(84) 98772-3897`:** Cálculo de 50% de sinal e validação de antecedência mínima de 10 dias.

### 2. Menu Mobile Responsivo (Drawer / Sanduíche)
- Botão hambúrguer com animação suave e transição fluida.
- Menu lateral deslizante (*drawer*) com efeito de desfoque de fundo (*backdrop blur*).
- Acesso rápido a todas as áreas: Monte Seu Bolo, Galeria de Criações, Bolos Personalizados, Políticas, Sobre o Atelier e Área da Administradora.

### 3. Galeria do Atelier com Lightbox
- Seção pública dedicada com portfólio de criações reais em Praia de Pipa.
- Filtros por categoria: *Casamentos*, *15 Anos*, *Aniversários* e *Especiais*.
- Visualização ampliada (*lightbox*) ao clicar na foto.
- Botão direto para WhatsApp com mensagem pré-formatada: *"Quero um bolo parecido com este"*.

### 4. Sistema da Administradora (Login & Gestão)
- **Acesso Restrito:** Autenticação exclusiva para a administradora (Lucieda) via Supabase Auth.
- **Barra de Status do Administrador:** Indicador visual de modo admin ativo no topo com acesso ao painel e botão de logout.
- **Painel de Controle em Abas:**
  - **Tabela de Preços:** Permite alterar os valores de cada Aro (ARO 10 a 30) e do Topo Especial 3D em tempo real. Os novos preços são gravados no Supabase e atualizados instantaneamente no simulador do site.
  - **Galeria de Fotos:** Upload com arrastar-e-soltar (*drag & drop*), título, categoria e descrição.
  - **Compressão Inteligente Automática:** Reduz fotos pesadas de celulares (5MB-10MB) diretamente no navegador via HTML5 Canvas (máx. 1600px a 82% qualidade), garantindo fotos leves (~250-400KB) e abaixo do limite de 2MB para não consumir o plano gratuito de 500MB do Supabase.
  - **Exclusão de Fotos:** Gerenciador com prévia e exclusão de fotos do banco e do Storage.
  - **Configurações Supabase:** Interface para salvar a URL do projeto e a chave anônima pública (*anon public key*).

---

## 🗄️ Conexão Supabase (Plano Gratuito 500MB)

O projeto está 100% preparado para ser hospedado gratuitamente na **Vercel** conectado ao **Supabase**:

### Passo a Passo de Instalação:
1. Crie uma conta gratuita em [supabase.com](https://supabase.com).
2. Crie um novo projeto (ex: `ofir-doceria`).
3. Vá em **SQL Editor** no painel do Supabase.
4. Abra o arquivo `supabase_schema.sql` deste projeto, copie todo o conteúdo e clique em **Run**.
   - Isso criará as tabelas `public.precos`, `public.configuracoes`, `public.galeria`, as políticas de segurança RLS (leitura pública, escrita autenticada) e o bucket de armazenamento `storage.buckets ('galeria')`.
5. Vá em **Project Settings > API**:
   - Copie a **Project URL**.
   - Copie a chave **anon public**.
6. Vá em **Authentication > Users** e crie o usuário da administradora com e-mail e senha.
7. No site, clique no botão de cadeado no topo ou no menu mobile para acessar a Área da Administradora, faça o login e conecte as credenciais.

---

## 📜 Política de Encomendas Ofir Doceria

1. **Antecedência:** Faça seu pedido com no mínimo **10 dias de antecedência**.
2. **Confirmação:** Encomenda confirmada apenas após pagamento de **50% de sinal** via PIX ou Mercado Pago. Restante pago na entrega.
3. **Topo Incluso:** O preço já inclui o topo de bolo simples. Topos especiais 3D possuem acréscimo.
4. **Alterações:** Permitidas até 7 dias antes da data combinada.
5. **Retirada Exclusiva:** Não trabalhamos com delivery; retiradas apenas em **Praia de Pipa / RN**.
6. **Contato:** Atendimento direto com **Lucieda: (84) 98772-3897**.
