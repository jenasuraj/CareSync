"use client"
import React from 'react'
import Modal from '@/components/Modal'
import { useState } from 'react'
import { useAuth } from '@/context/AppContext'
import axios,{ AxiosError } from 'axios'



const Test = ({patientId,setTestClicked}:{patientId:ParamValue,setTestClicked: React.Dispatch<React.SetStateAction<boolean>>;}) => {
  interface scheme {
  id:number
  name:string,
  amount:number
}

  const [mode,setMode] = useState("online")
  const {setMessage,setLoading} = useAuth()
  const [admit_type,setAdmit_type] = useState("health")
  const [amount,setAmount]=useState<number>(1000)
  const [showModal,setShowModal] =  useState<boolean>(true)
  const facilities: scheme[] =
    [{id:1 ,name:"health",amount:1000},
    {id:2, name:"dental",amount:5000},
    {id:3, name:"eye",amount:3000},
    {id:4, name:"heart",amount:100000},
    {id:5, name:"kidney",amount:50000},
    {id:6, name:"ache",amount:500},]

const showAdmitType = (name: string) => {
  const facility = facilities.find(f => f.name === name)
  if (!facility) {
    console.error("Invalid facility:", name)
    return
  }
  setAdmit_type(facility.name)
  setAmount(facility.amount)
}


const makePayment = async()=>{
    try{
      const response = await axios.post('/api/dashboard/transaction',{money_type:mode,reason:admit_type,amount:amount,p_id:patientId})
      if(response.data){
        setMessage("Payment Done !")
      }
    }
    catch(err){
      const error = err as AxiosError<{ message: string }>;
      if (error?.response?.status === 404) {
        setMessage("Patient");
      } else {
        setMessage("Server error");
      }
    }
    setShowModal(false)
    setTestClicked(false)
  }

  const closeModal = ()=>{
    setShowModal(false)
    setTestClicked(false)
  }


return (
<>
{showModal && (
  <Modal heading={"Patient page for test charges"} closeModal={closeModal}>
        Please make sure that theres no refund policy !
                <div className="h-auto w-full p-2 flex gap-4 items-center justify-center">
                    {facilities.map((item,index)=>{
                      return(
                        <p key={index} onClick={()=>showAdmitType(item.name)} className={`${admit_type === item.name ? 'bg-white text-gray-800':''}  cursor-pointer px-3 py-2 border border-gray-300 rounded-2xl`}>
                              {item.name}
                        </p>
                      )
                    })}
                  </div>
              <div className="w-full h-auto  flex items-center justify-center gap-5 mt-10 p-2">
                <button
                  className={`${mode === "online" ? 'bg-white text-gray-800' : ''} cursor-pointer rounded-sm px-1 py-2 w-1/2 border border-white`}
                  onClick={() => setMode("online")}
                >
                  Online
                </button>

                <button
                  className={`${mode === "offline" ? 'bg-white text-gray-800' : ''} rounded-sm px-1 py-2 w-1/2 border border-white`}
                  onClick={() => setMode("offline")}
                >
                  Offline
                </button>
              </div>
              <button className="rounded-sm px-1 py-2 w-full border border-white" onClick={()=>makePayment()}>{`Pay ${amount}`}</button>
</Modal>
)}
</>
  )
}

export default Test
