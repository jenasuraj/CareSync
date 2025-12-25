"use client"

import { useEffect } from 'react'
import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { AxiosError } from 'axios'
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";
import { GoDotFill } from "react-icons/go";
import { FcMindMap } from "react-icons/fc";
import { useAuth } from '@/context/AppContext'


const CheckForPatient = () => {

    const {setUserId,userId} = useAuth()
    const [showModal,setShowModal] = useState(false)
    const [formData,setFormData] = useState({name:"",email:"",phone:"",address:""})
    const [step, setStep] = useState(1);
    const [loading,setLoading] = useState(false)

    type StepKey = "name" | "email" | "phone" | "address";
    const steps: { key: StepKey,placeholder:string}[] = [
    { key: "name", placeholder: "Enter your Name" },
    { key: "email", placeholder: "Enter your Email" },
    { key: "phone", placeholder: "Enter your Phone Number" },
    { key: "address", placeholder: "Enter your Address" },
    ];
        
    useEffect(()=>{
    const checkpatientaxist = async()=>{
        setLoading(true)
        try{
            const response = await axios.get("/api/dashboard/patient") 
            if(response.data.data){
                console.log("patient exists",response.data.data.id)
              setUserId(response.data.data.id)
            }
        }
        catch(err){
            const error = err as AxiosError<{ message: string }>;
            if(error.status == 404){
                console.log("patient ain't axists, open up modal page.")
                setShowModal(true)
            }
        }
        setLoading(false)
    }  
    checkpatientaxist()
    },[])

    const handlechange = (event:React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async()=>{
    setLoading(true)
    try{
        if(!formData.address || !formData.name || !formData.email || !formData.phone) return
        const response = await axios.post('/api/dashboard/patient',{formData})
        console.log("response is",response)
        if(response){
            setLoading(false)
            setShowModal(false)
        } 
    }
    catch(err){
        setLoading(false)
        const error = err as AxiosError<{ message: string }>;
        console.log("error",error)  
        }
    }

return (
<>
{loading && (
    <div className='fixed z-50 inset-0 bg-white/95 flex items-center justify-center'>
    Loading please wait ...
    </div>
)}
{showModal && (
  <div className="fixed inset-0 z-30 bg-white/90 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
    <div className="relative gap-5 z-40 w-full md:w-1/2 h-2/4 bg-white backdrop-blur-xl border border-gray-300  rounded-2xl shadow-lg p-10 flex items-center justify-between flex-col animate-scaleIn">
        <p className='text-2xl flex items-center gap-3'>Just a few formalities <FcMindMap size={30}/></p>
        <div className='w-full h-full flex items-center justify-between'>
            <button className='p-3 cursor-pointer text-gray-500 rounded-full' disabled={step == 1 } onClick={()=>setStep(prev=>prev-1)}>
            <SlArrowLeft size={30}/>
            </button>

            <div className="w-1/2 h-auto flex flex-col items-center justify-center gap-5">
            <textarea name={steps[step-1].key} value={formData[steps[step-1].key]} 
            className="w-full min-h-[120px] bg-white/80 border border-gray-300 backdrop-blur-md  shadow-inner rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder={steps[step-1].placeholder}
            onChange={handlechange}/>
            </div>
      
            <button className='p-3 cursor-pointer text-gray-500 rounded-full' disabled={step == 4 } onClick={()=>setStep(prev=>prev+1)}>
                <SlArrowRight size={30}/>
            </button>
        </div>
        <div className='w-full p-2 flex justify-center items-center gap-3'>
         {steps.map((item,index)=>{
            return(
                <React.Fragment key={index}>
                        <GoDotFill size={20} color={formData[item.key] ? 'lightgreen' : 'black'}/>
                </React.Fragment>
            )
         })}
        </div>
        {formData.name && formData.address && formData.phone && formData.email &&(
            <button onClick={()=>handleSubmit()} className='cursor-pointer w-full p-2 bg-gradient-to-r from-blue-900 to-indigo-600 text-white rounded-sm'>Lets go</button>
        )}
    </div>
  </div>
)}
</>
)
}

export default CheckForPatient