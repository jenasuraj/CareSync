import React, { ReactNode } from 'react'

interface propTypes{
    closeModal: ()=>void,
    heading:string,
    children:ReactNode
}

const Modal = ({closeModal,heading,children}:propTypes) => {
  return (
  <div className="fixed inset-0 bg-white/80 bg-opacity-50 flex items-center justify-center z-50 text-gray-200">
    <div className="bg-gradient-to-t from-violet-700 to-indigo-800 p-5 rounded-2xl border border-gray-300 shadow-lg w-full md:w-1/2 min-h-1/2 overflow-y-auto relative">
      <button
        className="absolute top-5 right-5 text-red-500  hover:text-red-800 font-extrabold text-lg"
        onClick={()=>closeModal()}>
        ✕
      </button>
      <h2 className="text-lg font-semibold mb-3">{heading}</h2>
      {children}
    </div>
  </div>
  )
}

export default Modal