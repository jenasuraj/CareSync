"use client"

import React from 'react'
import { HiArrowUturnRight } from "react-icons/hi2";
import { useState } from 'react';
import axios from 'axios';
import { useRef,useEffect } from 'react';


interface propTypes {
  buttonClicked:boolean,
  setButtonClicked:React.Dispatch<React.SetStateAction<boolean>>;
}
interface conversationType {
  user:string,
  agent:string
}

const Agent = ({buttonClicked,setButtonClicked}:propTypes) => {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [inputData,setInputData] = useState("")
  const [conversation,setConversation] = useState<conversationType[]>([])

  const showStreamingResponse = (agent_response:string) => {
    const text_chunks = agent_response.split(' ')
    let idx:number = -1
    const interval = setInterval(()=>{
        setConversation(prev=>{
         const last = prev[prev.length - 1]
         const updatedLast = { ...last, agent: last["agent"] +" "+ text_chunks[idx]}
           return [
          ...prev.slice(0, -1),
          updatedLast
        ]
        })
        idx+=1
        if(idx == text_chunks.length-1){
          clearInterval(interval)
        }
    },100)
  }

  useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation])

  const handleAskQuery = async()=>{
    if(inputData != ""){
      const storedId = localStorage.getItem("userId");
      const initial_obj = {
                            user: inputData,
                            agent: ""
                      }
      setConversation(prev=>[...prev,(initial_obj)])                    
      setButtonClicked(true)
      const response = await axios.post('http://127.0.0.1:8000',{query:inputData,patient_id:Number(storedId)})
      if(response){
        showStreamingResponse(response.data.message)
      setInputData("")
    }
  }
}

return (
<div className="h-auto flex flex-col w-full  gap-5 justify-center items-center p-4">
  {buttonClicked && (
    <div className={`${buttonClicked ? ' w-full h-[80vh]' : 'lg:w-2/3 h-[70vh]'} border border-gray-200 p-4 bg-gray-200 overflow-y-auto rounded-2xl`}>
      {conversation.map((item, index) => (
        <div key={index} className="flex flex-col gap-2 mt-2">

          {/* User message */}
          <div className="self-start max-w-[70%]">
            <p className="px-4 py-2 rounded-lg border shadow-sm bg-white text-gray-800">
              {item.user}
            </p>
          </div>

          {/* Agent message */}
          <div className="self-end max-w-[70%]" ref={bottomRef} >
             <p className="px-4 py-2 rounded-lg bg-blue-800 text-gray-200 shadow-sm" dangerouslySetInnerHTML={{ __html: item.agent }} />
          </div>

        </div>
      ))}
    </div>
  )}
  <div className={`${buttonClicked ? 'w-full' : 'w-full lg:w-2/3'} relative`}>
    <input value={inputData}
    onChange={(e)=>setInputData(e.target.value)}
      type="text"
      placeholder="What you want me to do, Book appointments ?"
      className=" px-6 py-4 border border-gray-300 rounded-full w-full bg-gray-200"
    />

    <button onClick={handleAskQuery} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-800 rounded-full hover:bg-blue-500 duration-300 cursor-pointer">
      <HiArrowUturnRight color="white" size={20} />
    </button>
  </div>
</div>

  )
}

export default Agent