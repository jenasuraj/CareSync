"use client"

import React from 'react'
import CardDataSection from '@/ui/AdminDashboardFront/CardDataSection'
import TransactionSection from '@/ui/AdminDashboardFront/TransactionSection'
import { useState } from 'react'

const Page = () => {
const [optionValue,setOptionValue] = useState<string>("month")
  return (
<>
<section className='flex-1 text-black flex flex-col p-2 gap-5'>
{/**Upper 4 boxes to show data like total(appointments,admitted,money,users)*/}
<CardDataSection optionValue={optionValue} setOptionValue={setOptionValue}/>
<TransactionSection optionValue={optionValue} setOptionValue={setOptionValue}/>
</section>
</>
  )
}

export default Page