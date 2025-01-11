'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
 
import { CardContent } from '../ui/card'
import { useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ProvidersSignInBTNS } from './ProvidersSignInBTNS'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { SignInFormSchema, signInFormSchema } from '@/schema/signInShema'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export const SignInCard = () => {
    const t = useTranslations('AUTH');
    const m = useTranslations('MESSAGES');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const {toast} = useToast()
    const router= useRouter()
    const form = useForm<SignInFormSchema>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      })

      const onSubmit = async (data: SignInFormSchema) => {
        setIsLoading(true);
    
        try {
          const account = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
          });
    
          if (!account) throw new Error("Something went wrong");
    
          if (account.error) {
            toast({
              title: m(account.error),
              variant: "destructive",
            });
          } else {
            toast({
              title: m("SUCCESS.SIGN_IN"),
            });
            router.push("/onboarding");
            router.refresh();
          }
        } catch (err) {
          let errMsg = m("ERRORS.DEFAULT");
          if (typeof err === "string") {
            errMsg = err;
          } else if (err instanceof Error) {
            errMsg = m(err.message);
          }
          toast({
            title: errMsg,
            variant: "destructive",
          });
        }
        setIsLoading(false);
      };
    

  return (
    <CardContent>
        <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <ProvidersSignInBTNS onLoading={setIsLoading}  disabled={isLoading}/>
                   <div className=' space-y-2'>
           
                     <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder={t('EMAIL') } {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <div className='flex items-center w-full justify-between gap-4'>
                            <Input    type={showPassword ? 'text' : 'password'} placeholder={t('PASSWORD') } {...field} />
                            <Button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                variant={'secondary'}

                                >

                                {showPassword ? <EyeOff /> : <Eye />}
                            </Button>
                            </div>
                          
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
              
                    <p className=' text-xs text-center text-muted-foreground'> 
                     {t('SIGN_IN.TERMS.FIRST')} {' '} 
                    <Link href={'/'} className=' text-sm text-bold underline'>
                    {t('SIGN_IN.TERMS.SECOND')} 
                    </Link>
                    </p>
                    <Link href={'/'} className=' underline'>
                      
                    <p  className='text-xs text-center mt-2'>  {t('SIGN_IN.FORGOT_PASSWORD')}? </p>
                      </Link>
                   </div>
                    <Button type="submit" variant={'default'} className='w-full lg:w-fit font-bold'>   {t('SIGN_IN.SUBMIT_BTN')}</Button>
                </form>
        </Form>
    </CardContent>
  )
}
