'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useLocale } from 'next-intl';
import { signIn } from 'next-auth/react';
import { useProviderLoginError } from '@/hooks/useProviderLoginError';

interface ProviderSignInBTNProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  providerName: "google" | "github";
  onLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProviderSignInBTN = ({children, providerName,onLoading, ...props}:ProviderSignInBTNProps) => {
  const [showLoggedInfo, setShowLoggedInfo] = useState(false);
  const locale = useLocale();
  useProviderLoginError(showLoggedInfo);

  const signInHandler = async () => {
    // onLoading(true);
    setShowLoggedInfo(true);
    try {
      await signIn(providerName, { callbackUrl: `/${locale}/onboarding` });
    } catch (err) {}
    onLoading(false);
  };
  return (
    <Button {...props} variant={'secondary'} onClick={signInHandler} type='button'>
        {children}
    </Button>
  )
}
