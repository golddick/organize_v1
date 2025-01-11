'use client'

import { HomePage } from '@/components/home/HomePage';
import { Button } from '@/components/ui/button';
import { getAuthSession } from '@/lib/auth';
import { signOut, useSession } from 'next-auth/react';
import {useTranslations} from 'next-intl';
import { redirect } from 'next/navigation';


 
const Home = () => {
  const session = useSession();

  console.log('session', session)

  if (session) redirect("/dashboard");

  return <HomePage />;
};

export default Home;

