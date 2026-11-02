# Ofir Bolos & Doces — Atelier de Confeitaria em Praia de Pipa 🎂✨

Interface interativa e minimalista de alta confeitaria para encomenda personalizada de bolos artesanais da **Ofir Doceria**, inspirada em estética editorial e de luxo.

---

## 🌟 Demonstração Visual & Funcionalidades

- **Monte Seu Bolo Interativo:**
  - **Dimensões & Tamanhos:** Seletor intuitivo via slider e botões pills:
    - `ARO 10` — R$ 70 (6-8 fatias)
    - `ARO 15` — R$ 135 (12-15 fatias)
    - `ARO 20` — R$ 195 (20-25 fatias)
    - `ARO 25` — R$ 285 (30-35 fatias)
    - `ARO 28` — R$ 365 (40-45 fatias)
    - `ARO 30` — R$ 410 (50-55 fatias)
  - **Massas Nobres:** Amostras visuais dinâmicas de *Branco (ovos)* e *Chocolate*.
  - **Recheios Exclusivos:** 7 sabores artesanais (*Morango, Ninho, Chocolate, Avelã, Côco, Maracujá e Abacaxi*).
  - **Visualizador 3D com Fatia (Cutaway):**
    - Atualização em tempo real das camadas internas (massa e recheio) de acordo com a seleção.
    - Controles interativos: rotação 3D contínua, inclinação ao arrastar o mouse e alternância entre *Ver Fatia* e *Bolo Inteiro*.
    - Linhas-guia elegantes com ponteiros para as camadas do bolo.
  - **Cálculo de Harmonia & Métricas Sensoriais:**
    - Indicador de *Equilíbrio de Sabores* e *Complexidade*.
    - Escolha de *Topo Simples (Incluso)* ou *Topo Especial 3D (+ R$ 35,00)*.
  - **Checkout Integrado ao WhatsApp da Lucieda `(84) 99411-4341`:**
    - Modal de finalização com validação de data mínima de 10 dias de antecedência.
    - Mensagem formatada com cálculo automático do valor total e do sinal de 50%.
  - **Central de Políticas de Encomenda:**
    - Modal explicativo detalhando as 6 diretrizes da doceria (antecedência, sinal de 50%, retirada em Praia de Pipa, etc.).

---

## 📜 Política de Encomendas Ofir Doceria

1. **Antecedência:** Faça seu pedido com no mínimo **10 dias de antecedência**.
2. **Confirmação:** Encomenda confirmada apenas após pagamento de **50% de sinal** via PIX ou Mercado Pago. Restante pago na entrega.
3. **Topo Incluso:** O preço já inclui o topo de bolo simples. Topos especiais 3D possuem acréscimo.
4. **Alterações:** Permitidas até 7 dias antes da data combinada.
5. **Retirada Exclusiva:** Não trabalhamos com delivery; retiradas apenas em **Praia de Pipa / RN**.
6. **Contato:** Atendimento direto com **Lucieda: (84) 99411-4341**.

---

## 🛠️ Tecnologias Utilizadas

- **Three.js & WebGL 3D Real:** Modelagem procedural tridimensional do bolo com iluminação PBR (Physically Based Rendering), sombras dinâmicas, texturas em tempo real e controle de órbita 360° com toque/mouse.
- **Animação da Fatia em 3D:** Separação e fechamento suave da fatia (*cutaway view*) expondo camadas internas reais (3 de massa e 2 de recheio).
- **HTML5 Semântico:** Estrutura acessível com tags ARIA e microdados.
- **CSS3 Moderno:** Variáveis CSS, Glassmorphism, sombras multi-camadas e gradientes metálicos.
- **JavaScript Moderno:** Sem necessidade de build/compilação pesada, carregamento instantâneo e total compatibilidade com GitHub Pages.
- **Google Fonts:** *Cormorant Garamond* (editorial de luxo) e *Plus Jakarta Sans* (tipografia limpa contemporânea).
