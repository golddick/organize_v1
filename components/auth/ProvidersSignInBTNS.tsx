import { useTranslations } from 'next-intl';
import React from 'react';
import { ProviderSignInBTN } from './ProviderSignInBTN';
import { GoogleLogo } from '../svg/GoogleLogo';
import { AppleLogo } from '../svg/AppleLogo';
import { GithubLogo } from '../svg/GithubLogo';

interface ProvidersSignInBTNSProps {
  signInCard?: boolean;
  disabled?:boolean
  onLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProvidersSignInBTNS = ({ disabled,signInCard, onLoading }: ProvidersSignInBTNSProps) => {
  const t = useTranslations('AUTH');

  return (
    <div className="flex  items-center flex-col lg:flex-row justify-between gap-2">
      <ProviderSignInBTN   providerName="google"    onLoading={onLoading} disabled={disabled} className='w-full rounded-lg' >
      <GoogleLogo className="mr-2" width={20} height={20} />
        {signInCard 
          ? t('SIGN_IN.PROVIDERS.GOOGLE') 
          : t('SIGN_UP.PROVIDERS.GOOGLE')}
      </ProviderSignInBTN>

      {/* <ProviderSignInBTN disabled={disabled} className='w-full rounded-xl bg-black text-white'>
      <GithubLogo className="fill-white mr-2" width={20} height={20} />
      <div className=' hidden md:block'>
      {signInCard 
          ? t('SIGN_IN.PROVIDERS.GITHUB') 
          : t('SIGN_UP.PROVIDERS.GITHUB')}
      </div>
       
      </ProviderSignInBTN> */}
      
      <ProviderSignInBTN   providerName="github"  onLoading={onLoading} disabled={disabled} className='w-full rounded-lg'>
      <GithubLogo className="fill-black mr-2" width={20} height={20} />
        {signInCard 
          ? t('SIGN_IN.PROVIDERS.GITHUB') 
          : t('SIGN_UP.PROVIDERS.GITHUB')}
      </ProviderSignInBTN>
    </div>
  );
};
