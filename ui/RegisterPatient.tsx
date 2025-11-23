import React from 'react'
import { FcMindMap } from "react-icons/fc";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";

const RegisterPatient = () => {
  return (
    <div className='w-full h-auto flex items-center justify-center p-3 flex-col mt-7'>
        <form className='rounded-lg min-h-[50vh] w-full gap-3 md:w-2/3 p-4 flex flex-col items-center justify-center  border border-gray-300 shadow-sm'>
               <h1 className='w-full flex items-center gap-2 justify-center text-2xl mb-5'>Patient Registration <FcMindMap size={25}/></h1>
               <input type="text" name='name'placeholder='Enter Your Name' className='p-2 w-full border border-gray-300 rounded-md'/>
               <input type="text" name='email' placeholder='Enter Your Email' className='p-2 w-full border border-gray-300 rounded-md'/>
               <input type="text" name='phone' placeholder='Enter Your Phone' className='p-2 w-full border border-gray-300 rounded-md'/>
               <input type="text" name='address' placeholder='Enter Your Address' className='p-2 w-full border border-gray-300 rounded-md'/> 
               <button className='mb-3 bg-gradient-to-r from-blue-900 to-indigo-600 w-full p-3 flex items-center justify-center gap-2 text-white rounded-md hover:cursor-pointer hover:bg-none hover:bg-blue-900'>
                Register <HiArrowTopRightOnSquare color='white' size={20} /></button>     
        </form>
    </div>
  )
}

export default RegisterPatient
