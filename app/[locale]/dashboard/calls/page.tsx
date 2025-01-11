import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding'
import React from 'react'

const page = async () => {
    const session = await checkIfUserCompletedOnboarding('/dashboard/settings')
   
  return (
    <div>page</div>
  )
}

export default page