import { NextRequest, NextResponse } from 'next/server';

// LOCAL TEST PARAM
const localTestParam = 'jabscnasjchasa';

// PARAM LIST
const paramList: Record<string, string> = {
  'opportunity': 'kim',
  'revealed': 'rock',
  'exclusive': 'megan',
};

export function middleware(req: NextRequest) {

  const { nextUrl } = req;
  const url = nextUrl.toString() || '';
  const host = nextUrl.hostname.toLowerCase() || '';
  const params = nextUrl.searchParams;
  const catParam = params.get('xcat') || '';
  const localParam = params.get('xtest') || '';
  const requestHeaders = new Headers(req.headers);

  requestHeaders.set('x-url', url);
  requestHeaders.set('x-host', host);
  requestHeaders.set('x-params', params.toString());
  requestHeaders.set('x-cat-param', catParam);

  if (localParam === localTestParam) {
    requestHeaders.set('x-local-param', 'true');
  };

  if (catParam && paramList[catParam]) {

    params.delete('xcat');
    const newUrl = req.nextUrl.clone();
    newUrl.search = params.toString();
  
    const response = NextResponse.redirect(newUrl, { status: 302 });
    
    response.cookies.set({
      name: 'xcat_valid',
      value: paramList[catParam],
      path: '/',
      maxAge: 60 * 60 * 72,
      httpOnly: false,
    });
  
    return response;
  
  };

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

};

export const config = {
  matcher: ["/:path*"],
};
