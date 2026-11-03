/**
 * OFIR BOLOS & DOCES - ATELIER PRAIA DE PIPA
 * Vercel Serverless Function: Detecta variáveis de ambiente do Supabase injetadas pela Vercel
 */

module.exports = (req, res) => {
  // Coleta as variáveis geradas automaticamente pela integração Vercel + Supabase
  const supabaseUrl = 
    process.env.SUPABASE_URL || 
    process.env.NEXT_PUBLIC_SUPABASE_URL || 
    '';

  const supabaseAnonKey = 
    process.env.SUPABASE_ANON_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    '';

  const origin = req.headers.origin || '';
  const host = req.headers.host || '';

  // Validação segura de CORS: permite mesma origem, deploys na vercel e localhost
  const isAllowedOrigin = 
    !origin || 
    origin.endsWith('.vercel.app') || 
    origin.includes('localhost') || 
    origin.includes('127.0.0.1') ||
    (host && origin.includes(host));

  if (isAllowedOrigin && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    supabaseUrl,
    supabaseAnonKey,
    hasSupabase: Boolean(supabaseUrl && supabaseAnonKey),
    hasPostgres: Boolean(process.env.POSTGRES_URL)
  });
};
