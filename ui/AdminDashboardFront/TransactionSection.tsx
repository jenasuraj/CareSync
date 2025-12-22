"use client"

import React from "react"
import { ChartPieLegend } from '@/ui/AdminDashboardFront/ChartPieLegend'
import { ChartBarInteractive } from "./ChartBarInteractive"


interface propTypes{
  optionValue:string,
  setOptionValue:React.Dispatch<React.SetStateAction<string>>;
}

const TransactionSection = ({optionValue,setOptionValue}:propTypes) => {
  return (
    <div className="flex-1 p-6 flex flex-col  gap-5">
    <div className="w-full h-auto">
     <ChartBarInteractive  optionValue={optionValue} setOptionValue={setOptionValue}/>
    </div>
      <ChartPieLegend optionValue={optionValue}/>
    </div>
  )
}

export default TransactionSection