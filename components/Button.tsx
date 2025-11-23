import React, { ReactNode } from 'react'

const Button = ({children,size,style,extraclass}:{children:ReactNode | string,size: "auto" | "sm" | "lg" ,style:"primary",extraclass?:string}) => {

const sizeClasses = {
    auto: "px-4 py-2 h-auto",
    sm: "px-2 py-1 text-sm  h-auto",
    lg: "px-5 py-2 text-md w-full h-auto",
  };

const styleClasses = {
    primary: "cursor-pointer hover:scale-105 transition-transform duration-300  shadow-lg hover:shadow-cyan-400/30 hover:bg-cyan-500 bg-gradient-to-r from-blue-900 to-indigo-600 text-white",
  };

return (
<>
    <button type="submit" className={`${sizeClasses[size]} ${extraclass} ${styleClasses[style]} flex items-center gap-2  justify-center   rounded-md text-white font-semibold`}>
      {children}
    </button>
</>
  )
}

export default Button