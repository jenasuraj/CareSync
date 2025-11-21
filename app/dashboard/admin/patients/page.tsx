import React from 'react'
import SearchPatients from '@/ui/SearchPatients'
import RegisterPatient from '@/ui/RegisterPatient'


const page = () => {
  return (
<section className='min-h-screen w-full text-gray-700 flex p-2 flex-col gap-5'>
<SearchPatients/>
<RegisterPatient/>
</section>
  )
}

export default page
