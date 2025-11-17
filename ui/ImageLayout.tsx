import React from 'react'
import Image from 'next/image'
import { StaticImageData } from 'next/image'

interface imgProps {
    img:StaticImageData | string,
    children?:React.ReactNode;
                   }

const ImageLayout = ({img,children}:imgProps) => {
  return (
<>
{/**img section */}
<div className='relative w-full h-[40vh] rounded-lg  border border-gray-200 shadow-sm flex items-center justify-center'>
    <Image
        src={img}
        alt='img'
        fill
        priority
        className="object-cover absolute inset-0 rounded-lg"
    />
    <div className='w-full h-full bg-black/60 absolute z-10 rounded-lg'></div>
    <div className='text-center flex flex-col items-center justify-center gap-4 absolute z-20'>
    {children}
    </div>
</div>
</>
  )
}

export default ImageLayout
