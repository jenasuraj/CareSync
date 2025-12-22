"use client"
import React from 'react';
         // {!pathname.startsWith('/dashboard/admin') || !pathname.startsWith('/dashboard/patient') && (
import { usePathname } from "next/navigation";
  

const Footer = () => {
  const pathname = usePathname()
  if(!pathname.startsWith('/dashboard/admin')){
  return (
    <>
      <section className='text-white w-full h-24 bg-black flex flex-col md:flex-row items-center justify-between px-5 py-4'>
        <div className='mb-3 md:mb-0'>
          <h2 className='text-xl font-bold'>CareSync</h2>
          <p className='text-gray-400 text-sm'>© 2025 CareSync All rights reserved.</p>
        </div>

        <div className='flex items-center gap-5'>
          <a href='#' className='text-gray-400 hover:text-white transition-colors'>About</a>
          <a href='#' className='text-gray-400 hover:text-white transition-colors'>Contact</a>
          <a href='#' className='text-gray-400 hover:text-white transition-colors'>Privacy</a>
          <a href='#' className='text-gray-400 hover:text-white transition-colors'>Terms</a>
        </div>
      </section>
    </>
  );
  }
  else{
    return(
      <></>
    )
  }
};

export default Footer;
