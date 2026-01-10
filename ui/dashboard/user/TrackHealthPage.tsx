"use client"
import React from 'react'
import Agent from './Agent'
import HealthCards from './HealthCards'
import { useState } from 'react'

const TrackHealthPage = () => {
  const [buttonClicked,setButtonClicked]  = useState<boolean>(false)
  return (
    <div className="h-auto w-full p-2 flex flex-col gap-5">
      {!buttonClicked && (
        <HealthCards/>
      )}
      <Agent buttonClicked={buttonClicked} setButtonClicked={setButtonClicked}/>
    </div>
  )
}

export default TrackHealthPage
