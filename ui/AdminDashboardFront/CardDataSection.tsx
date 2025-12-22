"use client"

import React from 'react'
import { VscGraphLine } from "react-icons/vsc";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AppContext';
import { LuNotebookPen } from "react-icons/lu";
import { FaBed } from "react-icons/fa6";
import { PiMoneyLight } from "react-icons/pi"
import { FaUser } from "react-icons/fa6";


interface HospitalDataType{
    appointments:number | null,
    admitted:number | null,
    money:number | null,
    users:number | null
}

interface propTypes{
  optionValue:string,
  setOptionValue:React.Dispatch<React.SetStateAction<string>>;
}

const UpperSection = ({optionValue,setOptionValue}:propTypes) => {
  const {setMessage} = useAuth()  
    const items = [
    { label: "Appointments", key: "appointments",icon:<LuNotebookPen size={20}/> },
    { label: "Admitted", key: "admitted",icon:<FaBed size={20}/>},
    { label: "Money", key: "money",icon:<PiMoneyLight size={20}/> },
    { label: "Users", key: "users",icon:<FaUser size={20}/> },
    ] as const

  const [hospitalData,setHospitalData] = useState<HospitalDataType>({
    appointments:null,
    admitted:null,
    money:null,
    users:null
  })
  const [localLoading,setLocalLoading] = useState<boolean>(false)

  const fetchHospitalData = async()=>{
  try{
   setLocalLoading(true)
   const response = await axios.get('/api/dashboard/admin/dashboardCard',{ params: { option:optionValue } })
   if(response.data){
    console.log(response.data)
    setHospitalData({
    appointments: response.data.appointment_count.count ?? null,
    admitted: response.data.admit_count.count ?? null,
    money: response.data.money_count?.total ?? null,
    users: response.data.users_count.count ?? null,
    });
   }
  }catch(err){
    console.log("error in retriving hospital info in uppersection",err)
    setMessage("Server Error")
  }
  setLocalLoading(false)
  }

  const AddCommaToNumbers = (plainNumber:number | null):string=>{
  return String(plainNumber) 
  }

  useEffect(()=>{
  fetchHospitalData()
  },[optionValue])
  
  return (
<>
  <div className='w-full min-h-[25vh] rounded-sm p-1 flex flex-col'>
    <div className='text-black h-auto w-full flex items-center justify-end p-1'>
      <select className='p-2 bg-white border border-gray-400 rounded-sm hover:bg-blue-900 hover:text-white cursor-pointer duration-300'onChange={(e) => setOptionValue(e.target.value)}>
        <option value="">Select Time</option>
        <option value="today">{localLoading ? 'Loading' : 'Today'}</option>
        <option value="week">{localLoading ? 'Loading' : 'Week'}</option>
        <option value="month">{localLoading ? 'Loading' : 'Month'}</option>
        <option value="threemonth">{localLoading ? 'Loading' : '3 Months'}</option>
      </select>
    </div>
    <div className='flex flex-col lg:flex-row gap-5 items-center justify-between h-full w-full mt-2 '>
    {items.map((item,index)=>{
      return(
        <div key={index} className='w-full h-auto lg:flex-1 lg:h-full px-3 bg-blue-900 text-xl flex  items-center flex-col justify-center rounded-sm text-white gap-2 cursor-pointer p-4'>
          <div className='w-full h-auto flex items-center justify-center gap-3'>
          {item.label}{item.icon} 
          </div>
          <span className='text-green-300 flex text-sm items-center justify-center gap-2'>{AddCommaToNumbers(hospitalData[item.key])}<VscGraphLine color='lightgreen' size={20}/></span>
        {item.key == 'users' && (
            <span className='text-green-300 flex text-sm items-center justify-center gap-2'>Always static</span>
        )}
        </div>
      )
    })}
    </div>
  </div>
</>
  )
}

export default UpperSection