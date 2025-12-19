"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useAuth } from "@/context/AppContext";
import { useState } from "react";


const GoogleLogin = ({ patientPortal}: { patientPortal: boolean}) => {
const {setMessage} = useAuth()
const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false)

const handleGoogleLogin = async () => {
  try{
    setLoadingGoogle(true)
    await signIn("google");
  }
  catch(err){
    setMessage("Server error with Google access")
    console.log("error with google login",err)
  }
};

  return (
    <>
      {patientPortal && (
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full border border-gray-700 py-2 mt-3 mb-2 rounded-md text-white font-semibold  flex gap-2 items-center justify-center bg-slate-900 cursor-pointer">
          <FcGoogle size={25} /> {loadingGoogle ? 'Loading with Google' : 'Continue with Google' }
        </button>
      )}
    </>
  );
};

export default GoogleLogin;
