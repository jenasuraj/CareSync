"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AppContext";// adjust path
import { HiOutlineEmojiHappy } from "react-icons/hi";


const MessageToast = () => {
  const { message,setMessage,loading } = useAuth();

useEffect(() => {
  if (message) {
    const timer = setTimeout(() => {
      setMessage(""); // clear message after 2s
    }, 2000);

    return () => clearTimeout(timer); // cleanup (important)
  }
}, [message]);

  return (
    <>
      {message && (
          <div className="fixed top-10 right-10 z-50 flex p-8 items-center justify-between bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-3 rounded-md shadow-lg min-w-[250px]">
          <span className="mr-4 flex gap-2 items-center">{message} <HiOutlineEmojiHappy size={18} color="white"/></span>
        </div>
      )}
      {loading && (
        <div className="fixed z-50 bg-white/90 inset-0 gap-3 flex items-center justify-center text-black text-lg">
         Loading please wait<div className="animate-spin rounded-full h-6 w-6 border-t-4 border-black"></div>
        </div>
      )}
    </>
  );
};

export default MessageToast;