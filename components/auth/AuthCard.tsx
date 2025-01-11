import React from 'react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { SignUpCard } from './SignUpCard'
import { SignInCard } from './SignInCard'


interface AuthCardProps {
    signInCard?: boolean
}

export const AuthCard = ({signInCard}:AuthCardProps) => {
    const t = useTranslations('AUTH');
  return (
    <>
        <Card className='w-full sm:min-w-[28rem] sm:w-auto'>
            <CardHeader>
                <Image
                src={'/gnt.png'}
                width={100}
                height={50}
                alt='img'
                className='border-2 border-red-600 rounded-md object-cover self-center'
                />
                <CardTitle className='text-lg'>
                    {signInCard ? t('SIGN_IN.TITLE') : t('SIGN_UP.TITLE')}
                </CardTitle>
                <CardDescription className=' text-sm'>
                    {signInCard ? t('SIGN_IN.DESC') : t('SIGN_UP.DESC')}
                </CardDescription>
            </CardHeader>
            {signInCard? <SignInCard/> : <SignUpCard/>}
        </Card>
        <p className=' text-sm'>
        {signInCard ? t('SIGN_IN.DONT_HAVE_ACCOUNT.FIRST') : t('SIGN_UP.HAVE_ACCOUNT.FIRST')}
        {" "}
        <Link href={signInCard ? '/sign-up' : '/sign-in'} className='text-primary underline'>
        {signInCard ? t('SIGN_IN.DONT_HAVE_ACCOUNT.SECOND') : t('SIGN_UP.HAVE_ACCOUNT.SECOND')}
        </Link>
        </p>
    </>
  )
}
