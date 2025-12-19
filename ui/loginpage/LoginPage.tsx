"use client"

import React, { useState } from "react";
import axios from "axios";
import GoogleLogin from "../GoogleLogin";
import { useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/context/AppContext";
import { useEffect } from "react";

const LoginPage = () => {
  const {setMessage} = useAuth()
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [formData,setFormData] = useState({email:'',name:'',password:'',hospital_id:'',hospital_password:''}); 
  const [patientPortal,setPatientPortal] = useState(true);
  const errorMsg = searchParams.get("error");
  const [localLoading,setLocalLoading] = useState<boolean>(false)

  useEffect(()=>{
  if(errorMsg == "use-local-account"){
    setMessage("Please login using your manual username and password.")
  }
  else if(errorMsg == "server-error"){
    setMessage("Server error occurred. Try again later.")
  }
  },[errorMsg])

  //const [userMsg, setUserMsg] = useState(() => {
  //if (errorMsg === "use-local-account") return "Please login using your manual username and password.";
  //if (errorMsg === "server-error") return "Server error occurred. Try again later.";
  //return "";
  //});
  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalLoading(true)
    if (isLogin && patientPortal) {
      if(!formData.email || !formData.password) return;
      try {
        const serverResponse = await axios.post("/api/auth/login",{formData}) 
        if(serverResponse){
        setMessage(serverResponse.data.message)
        window.location.reload()
        } 
        }
      catch (err) {
  const error = err as AxiosError<{ message: string }>;
  setMessage(error.response?.data?.message || "Something went wrong");
}
    } else if(!isLogin && patientPortal) {
      if(!formData.email || !formData.password || !formData.name) return;
      try {
        const serverResponse = await axios.post("/api/auth/registration",{formData}) 
        if(serverResponse){
        setMessage(serverResponse?.data?.message)
        setIsLogin(true)
        }
      }   catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setMessage(error.response?.data?.message || "Something went wrong");
      }
    }
    else{
      //it is a admin request ...
      if(!formData.hospital_id || !formData.hospital_password) return
      try{
        const server_response = await axios.post('/api/auth/login',{formData})
        if(server_response){
          window.location.reload()
        }
      }
      catch (err) {
  const error = err as AxiosError<{ message: string }>;
  setMessage(error.response?.data?.message || "Something went wrong");
}
    }
    setLocalLoading(false)
  };


  return (
    <form onSubmit={handleSubmit} className="p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 mt-10 gap-2">
      <h2 className="text-3xl mb-6 text-center">
        {!patientPortal ? "Admin portal": patientPortal && isLogin ? 'User Login Page' : patientPortal && !isLogin ? 'User Registration': ''}
      </h2>
      {!isLogin && patientPortal && (
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <Input placeholder="Enter your name"size="lg" style="outline" valueData={formData.name} handleChange={handleChange} type="text" name="name"/> 
        </div>
      )}
      {patientPortal && (
        <>
          <div className="mb-4">
           <label className="block mb-2">Email</label>
           <Input placeholder="Enter your Email"size="lg" style="outline" valueData={formData.email} handleChange={handleChange} type="text" name="email"/> 
          </div>
          <div className="mb-6">
            <label className="block mb-2">Password</label>
            <Input placeholder="Enter your password"size="lg" style="outline" valueData={formData.password} handleChange={handleChange} type="password" name="password"/> 
          </div>
        </>
      )}
      {!patientPortal && (
        <>
          <div className="mb-4">
            <label className="block mb-2">Hospital ID</label>
            <Input placeholder="Enter your Hospital Id"size="lg" style="outline" valueData={formData.hospital_id} handleChange={handleChange} type="text" name="hospital_id"/> 
          </div>
          <div className="mb-6">
            <label className="block mb-2">Hospital Password</label>
            <Input placeholder="Enter your Hospital Password"size="lg" style="outline" valueData={formData.hospital_password} handleChange={handleChange} type="text" name="hospital_password"/> 
          </div>
        </>
      )}
      <Button size="lg" style="primary">
        {localLoading ? ('Assisting...'):(
          <>
          {!patientPortal ? "Access" : isLogin && patientPortal ? "Login": !isLogin && patientPortal ? 'Register': ''}
        </>
        )}   
        
      </Button>
      <GoogleLogin patientPortal = {patientPortal}/>

      {patientPortal && (
        <p className="text-center text-gray-400 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-500 font-bold cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      )}
      <p className="text-center mt-2 text-sm text-gray-400 gap-2">
        {!patientPortal ? 'Access the user portal':'Access the Admin portal'}
        <span onClick={()=>setPatientPortal(!patientPortal)} className="font-bold cursor-pointer hover:underline ml-2 text-blue-500">
          {!patientPortal ? 'User' : 'Admin'}
        </span>
      </p>
    </form>
  )
}

export default LoginPage