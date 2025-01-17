import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
 
 
  return {
    locale,
    // messages: (await import(`../messages/${locale}.json`)).default
    messages:(await import (`./messages/${locale}.json`)).default
  };
});