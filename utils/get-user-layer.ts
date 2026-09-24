/* eslint-disable @typescript-eslint/no-explicit-any */

import { isFacebookOrInstagramBrowser } from '@/utils/browser-detector';

// === CONFIGURAÇÕES ===
const blockedCountryList = ['RU', 'KP', 'IR'];
const blockedLanguageList: string[] = [];

// Detecta bots
function isBot(userAgent: string): boolean {
  return /bot|spider|crawler|google|bing|yandex|read-aloud|facebookexternalhit/i.test(userAgent);
}

type GetUserLayerProps = {
  cks: any;
  hdrs: Headers;
};

export async function getUserLayer({ cks, hdrs }: GetUserLayerProps): Promise<number> {
  // Dados dos headers
  const url = hdrs.get('x-url') || '';
  const country = hdrs.get('x-vercel-ip-country') || 'BR';
  const userAgent = hdrs.get('User-Agent') || '';
  const userLanguage = hdrs.get('Accept-Language')?.toLowerCase() || '';

  // Cookies e parâmetros
  const catParam = cks.get('xcat_valid');
  const localParam = hdrs.get('x-local-param') === 'true';

  console.log('HEADERS:', Object.fromEntries(hdrs.entries()));
  console.log('HAS PARAM:', !!catParam?.value);

  // 1. Teste local (força Black)
  if (localParam) {
    console.log('BLACK: LOCAL TEST');
    return 3;
  }

  // 2. Bots → White
  if (isBot(userAgent)) {
    console.log('WHITE: BOT');
    return 1;
  }

  // 3. Sem parâmetro xcat → White
  if (!catParam) {
    console.log('WHITE: SEM PARÂMETRO');
    return 1;
  }

  // 4. País bloqueado → White
  if (blockedCountryList.includes(country)) {
    console.log('WHITE: PAÍS BLOQUEADO');
    return 1;
  }

  // 5. Não é mobile → Gray
  const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  if (!isMobile) {
    console.log('GRAY: DESKTOP');
    return 2;
  }

  // 6. Idioma bloqueado → Gray
  if (blockedLanguageList.some(lang => userLanguage.includes(lang))) {
    console.log('GRAY: IDIOMA BLOQUEADO');
    return 2;
  }

  // 7. Não veio do Facebook/Instagram → Gray
  const isFBIG = isFacebookOrInstagramBrowser(hdrs, url);
  if (!isFBIG) {
    console.log('GRAY: NÃO É FB/IG');
    return 2;
  }

  // Tudo limpo → Black
  console.log('BLACK: TRÁFEGO LIMPO');
  return 3;
}