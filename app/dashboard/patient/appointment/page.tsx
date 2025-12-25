import React from 'react'
import Appointment from '@/ui/Appointment'
import { Suspense } from 'react'


const page = () => {
  return (
<Suspense fallback={<div>Loading...</div>}>
<section className='min-h-screen w-full text-gray-700 flex p-2 flex-col items-center justify-center gap-5'>
  <Appointment/>
</section>
</Suspense>
  )
}

export default page
