import { LocaleSwitcher } from '@/components/switcher/LocaleSwitcher'
import { ThemeToggle } from '@/components/themeToogleBTN'
import React from 'react'

export const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='flex relative flex-col gap-4 justify-center items-center min-h-screen w-full p-4 md:p-6'>
        <div className=' absolute bottom-2 right-2'>
          <div className=' flex flex-col gap-2'>
          <ThemeToggle/>
            <LocaleSwitcher/>
          </div>
        </div>
        {children}
    </div>
  )
}


export default AuthLayout