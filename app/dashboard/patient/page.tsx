import React from 'react'
import { Metadata } from 'next'
import img from '@/public/dashboard-img.jpg'
import Link from 'next/link';
import { patient_page_items } from '@/data/Doctor';
import ImageLayout from '@/ui/ImageLayout';
import CheckForPatient from '@/ui/CheckForPatient';


export const metadata: Metadata = {
  title: "Patient Dashboard page",
  description: "Welcome to Dashboard",
};


const page = () => {
return (
<>
<section className='min-h-screen w-full text-gray-700 flex p-2 flex-col gap-5'>


<ImageLayout img={img}>
        <p className='text-white text-3xl md:text-5xl '>Welcome to Medicure</p>
        <p className='text-white text-xl md:text-3xl'>What are your plans today ?</p>
</ImageLayout>

{/**feature section */}
<div className='w-full h-auto flex flex-col md:flex-row gap-5 p-2'>
{patient_page_items.map((item,index)=>{
  return(
    <Link href={item.path} key={index} className='bg-blue-900 w-full md:w-1/3 h-40 border text-gray-300 border-gray-300 shadow-sm rounded-sm flex items-center justify-center gap-2 hover:cursor-pointer hover:bg-blue-700 hover:text-white duration-700'>
      <p>{item.name}</p>
      <p className='p-2 bg-blue-900 rounded-md text-white'>{item.icon}</p>
    </Link>
  )
})}
</div>
<CheckForPatient/>
</section>

</>
  )
}

export default page