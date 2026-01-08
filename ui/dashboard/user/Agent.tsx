import React from 'react'
import { HiArrowUturnRight } from "react-icons/hi2";
import { useState } from 'react';
import axios from 'axios';

interface propTypes {
  buttonClicked:boolean,
  setButtonClicked:React.Dispatch<React.SetStateAction<boolean>>;
}

const Agent = ({buttonClicked,setButtonClicked}:propTypes) => {
  const [inputData,setInputData] = useState("")
  const handleAskQuery = async()=>{
    if(inputData != ""){
      setButtonClicked(true)
      const response = await axios.post('http://127.0.0.1:8000',{query:inputData})
      if(response){
        console.log(response.data.message)
      }
      setInputData("")

    }
  }

  return (
<div className="h-auto flex flex-col w-full  gap-5 justify-center items-center p-4">
  {buttonClicked && (
    <div className='border border-gray-200 w-full lg:w-2/3 h-[70vh] rounded-2xl'></div>
  )}
  <div className="relative w-full lg:w-2/3">
    <input value={inputData}
    onChange={(e)=>setInputData(e.target.value)}
      type="text"
      placeholder="What you want me to do, Book appointments ?"
      className=" px-6 py-4 border border-gray-300 rounded-full w-full"
    />

    <button onClick={handleAskQuery} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-800 rounded-full hover:bg-blue-500 duration-300 cursor-pointer">
      <HiArrowUturnRight color="white" size={20} />
    </button>
  </div>
</div>

  )
}

export default Agent