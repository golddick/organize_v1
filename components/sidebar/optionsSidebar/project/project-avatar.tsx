import React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?:string
}

export const ProjectAvatar = ({image, className, name ,fallbackClassName}:ProjectAvatarProps) => {
  if (image) {
    return(
      <div className={
        cn('size-5 relative rounded-md overflow-hidden', className,  )
      }>
        <Image
        src={image} 
        alt={name}
        fill className='object-cover  '
        />
      </div>
    )
  }
  return (
    <Avatar className={
      cn('size-5  rounded-md overflow-hidden', className,  )
    }>
      <AvatarFallback className={cn('text-white bg-gold font-semibold text-sm uppercase rounded-md ',
      fallbackClassName,
      )}>
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}
