"use client"
import React, { ReactNode } from 'react'
import { AuthProvider } from '@/context/AppContext'
import MessageToast from '@/components/MessageToast'

interface typeProps{
    children:ReactNode
}

const Provider = ({children}:typeProps) => {
  return (
<>
<AuthProvider>
  <MessageToast/>
    {children}
</AuthProvider>
</>
  )
}

export default Provider
