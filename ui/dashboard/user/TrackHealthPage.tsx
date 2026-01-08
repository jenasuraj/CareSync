import React from 'react'
import Agent from './Agent'
import HealthCards from './HealthCards'

const TrackHealthPage = () => {
  return (
    <div className="min-h-screen w-full p-2 flex flex-col gap-5">
      <HealthCards />
      <Agent />
    </div>
  )
}

export default TrackHealthPage
