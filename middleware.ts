import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);

const publicPages = ["/", "/sign-in", "/sign-up"];


if (!publicPages) {
  console.log('private page')
}

 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};


