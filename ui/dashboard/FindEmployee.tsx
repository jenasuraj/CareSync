"use client";

import React from "react";
import { CiSearch } from "react-icons/ci";
import Input from "@/components/Input";
import Button from "@/components/Button";

interface ShowEmployeeProps {
  currentPage: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setEmployeeName: React.Dispatch<React.SetStateAction<string>>;
  employeeName: string
  buttonTriggered:boolean
  setButtonTriggered:React.Dispatch<React.SetStateAction<boolean>>;
}


const FindEmployee = ({ currentPage, setMessage, setEmployeeName, employeeName, buttonTriggered,setButtonTriggered }: ShowEmployeeProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.toLowerCase();
    if(buttonTriggered && search == "" ){
      setButtonTriggered(false)
      //fetch existing employees...
    }
    setEmployeeName(search)}


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault()
  if(!employeeName){
    setMessage("Input field is empty")
    return
  }
  else if(employeeName && !buttonTriggered){
    //do db operation...
    setButtonTriggered(true)
  }}  

  return (
    <form className="w-full  flex items-center  rounded-md" onSubmit={handleSubmit}>
      <Input
        type="text"
        name="find"
        size="lg"
        style="outline"
        placeholder={`Search ${currentPage} by name`}
        handleChange={handleChange}
        extraclass = "flex-1 rounded-l-md"/>
      <Button extraclass="rounded-r-md rounded-l-none" size="auto" style="primary">
      <CiSearch color="white" size={25}/>
      </Button>
    </form>
  );
};

export default FindEmployee;