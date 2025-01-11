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
import { SignUpFormSchema, signUpFormSchema } from '@/schema/signUpShema'
import { useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ProvidersSignInBTNS } from './ProvidersSignInBTNS'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { LoadingState } from '../loader/loadingState'

export const SignUpCard = () => {
    const t = useTranslations('AUTH');
    const m = useTranslations('MESSAGES');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const {toast} = useToast()
    const router= useRouter()
    const form = useForm<SignUpFormSchema>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        },
      })

      const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
        if (values.password !== values.confirmPassword) {
            toast({
                title: t('SIGN_UP.PASSWORD_MISMATCH'),
            })
            return null
        }
       setIsLoading(true)
       try {
        const res = await fetch('/api/auth/register',{
            method: 'POST',
            body: JSON.stringify(values),
            headers:{
                'Content-Type': 'application/json'
            }
        })

        if (!res.ok) {
            throw new Error ('Can not Sing Up something went wrong')
        }

        const signUpInfo = await res.json()

        if (res.status === 200) {
             
            toast({
                title: m('SUCCESS.SIGN_UP'),
            })
            await signIn('credentials', {
                email: values.email,
                password: values.password,
                redirect: false
            })
            router.push('/')
        }else throw new Error(signUpInfo)




       } catch (error) {
        let errMsg = m("ERRORS.DEFAULT");
        if (typeof error === "string") {
          errMsg = error;
        } else if (error instanceof Error) {
          errMsg = m(error.message);
        }
        toast({
          title: errMsg,
          variant: "destructive",
        });
       }
       setIsLoading(false);
       console.log(values)
      }

  return (
    <CardContent>
        <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <ProvidersSignInBTNS  onLoading={setIsLoading}  disabled={isLoading}/>
                   <div className=' space-y-2'>
                   <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder= {t('USERNAME') } {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
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
                            </div>
                          
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input type='password' placeholder={t('CONFIRM_PASSWORD') } {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <p className=' text-xs text-center text-muted-foreground'> 
                     {t('SIGN_UP.TERMS.FIRST')} {' '} 
                    <Link href={'/'} className=' text-sm text-bold underline'>
                    {t('SIGN_UP.TERMS.SECOND')} 
                    </Link>
                    </p>
                   </div>
                    <Button type="submit" disabled={isLoading} variant={'default'} className='w-full lg:w-fit font-bold'>
                    {isLoading ? (
                        <LoadingState loadingText={m("PENDING.LOADING")} />
                    ) : (
                        t("SIGN_UP.SUBMIT_BTN")
                    )}
                    </Button>
                </form>
        </Form>
    </CardContent>
  )
}
