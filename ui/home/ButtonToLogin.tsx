"use client"

import React from 'react'
import Button from '@/components/Button'
import { useState } from 'react';
import { RxDashboard } from "react-icons/rx";
import { useRouter } from 'next/navigation';


const ButtonToLogin = () => {
    const [loading,setLoading] = useState<boolean>(false) 
    const router = useRouter()

    const handleClick = async()=>{
        setLoading(true)
        router.push('/login')
    }

return (
<>
    <Button size="auto" style="primary" handleClick={handleClick}>
    {loading ? "Assisting you ..." : <>Access to Dashboard <RxDashboard size={20} /></>}
    </Button>
</>
  )
}

export default ButtonToLogin
