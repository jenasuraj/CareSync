"use client"
import React from 'react'
import { CiSearch } from "react-icons/ci";
import { useRef } from 'react';
import axios from 'axios';

const SearchPatients = () => {
    const inputref = useRef<HTMLInputElement>(null)
    const handleSubmit = async()=>{
        if(!inputref.current) return
        console.log("data->",inputref.current.value)
        try{
          const response = await axios.get('/api/dashboard/patient',{ params: {name: inputref.current.value }})
          console.log(response)
        }
        catch(error){
            console.log("error",error)
        }
    }   
  return (
    <div className='w-full h-[10vh] flex items-center justify-center p-3'>
        <input ref={inputref} placeholder='Enter Patient Name ( Ex: Suraj ) ...' 
        className='p-2 w-1/2 h-full border border-gray-300  rounded-l-md'/>
        <button className='flex items-center justify-center text-white shadow-sm rounded-r-md bg-gradient-to-r from-blue-900 to-indigo-600 p-1 h-full w-20
        hover:cursor-pointer hover:bg-none hover:bg-blue-900 ' onClick={()=>handleSubmit()}>
            <CiSearch size={25}/>
        </button>
    </div>
  )
}

export default SearchPatients
