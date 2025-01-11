'use client'

import { HomePage } from '@/components/home/HomePage';
import { Button } from '@/components/ui/button';
import { getAuthSession } from '@/lib/auth';
import { signOut, useSession } from 'next-auth/react';
import {useTranslations} from 'next-intl';

 
const Home = () => {
  const session = useSession();

  // if (session) redirect("/dashboard");

  return <HomePage />;
};

export default Home;

