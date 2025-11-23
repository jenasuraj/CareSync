import React from 'react'

interface propTypes {
  placeholder: string;
  valueData?: string | number | readonly string[] | undefined;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  name: string;
  size: "sm" | "auto" | "lg"; 
  style: "outline";
  extraclass?:string
}

const Input = ({ placeholder, valueData, handleChange, type, name, size, style, extraclass }: propTypes) => {

  const sizeClasses = {
    auto:"w-full md:w-auto px-4 py-2 h-auto",  //where size of width is not given like justify-between etc ...
    sm: "px-4 py-2 text-sm w-1/2  h-auto", //where size isn't full
    lg: "px-4 py-2 text-md w-full h-auto", //where size is full
  };
  const styleClasses = {
    outline: "border border-gray-300 shadow-sm rounded-sm", //no bg colour just simple as that
  };

  return (
    <input
      type={type}
      name={name}
      value={valueData}
      onChange={handleChange}
      placeholder={placeholder}
      className={`${styleClasses[style]} ${sizeClasses[size]} ${extraclass}`}
      required
    />
  );
};

export default Input
