/**
 * OFIR BOLOS & DOCES - ATELIER PRAIA DE PIPA
 * Vercel Serverless Function: Leitura Inteligente de Rótulos / Insumos com IA Multimodal
 * 
 * Se GEMINI_API_KEY estiver configurada nas variáveis da Vercel, utiliza IA de visão;
 * Caso contrário, o frontend utiliza o motor OCR embutido no navegador (Tesseract.js).
 */

module.exports = async (req, res) => {
  // CORS
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      hasAi: false,
      message: 'GEMINI_API_KEY não configurada. Utilizando OCR local do navegador.'
    });
  }

  try {
    const { imageBase64 } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ error: 'Imagem base64 não fornecida.' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const promptText = `
Você é um assistente de confeitaria artesanal de alto padrão no Brasil.
Analise a foto desta embalagem comercial de alimento ou insumo de confeitaria.
Extraia e retorne EXCLUSIVAMENTE um JSON válido (sem blocos markdown adicionais) com:
{
  "nome": "Nome comercial limpo do produto incluindo marca (ex: Leite Condensado Integral Moça ou Chocolate Nobre Meio Amargo Melken ou Cakeboard 26cm)",
  "categoria": "ingrediente" ou "embalagem",
  "unidade": "g", "ml" ou "un",
  "peso_embalagem": número da quantidade líquida da embalagem comercial (ex: 395 para lata de 395g, 1000 para 1kg, 200 para creme de leite, 1 para cakeboard/caixa),
  "quantidade_minima": número sugerido de estoque mínimo (ex: 3950 para leite condensado, 10 para embalagens)
}
Se não tiver certeza da marca, use apenas o tipo do produto (ex: Farinha de Trigo Especial).
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: cleanBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errTxt = await response.text();
      console.warn('[Gemini Vision API] Erro:', errTxt);
      return res.status(200).json({ hasAi: false, error: 'Falha na API Gemini' });
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return res.status(200).json({ hasAi: false });
    }

    const parsed = JSON.parse(candidateText.trim());
    return res.status(200).json({
      hasAi: true,
      resultado: parsed
    });
  } catch (err) {
    console.warn('[Scan Insumo Error]', err);
    return res.status(200).json({ hasAi: false, error: err.message });
  }
};
