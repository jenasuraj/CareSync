"use client";

import React, { useState,useEffect } from "react";
import axios from "axios";
import { BiMenu, BiX } from "react-icons/bi";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { IoLogoFirefox } from "react-icons/io5";
import Modal from "./Modal";
import { useAuth } from "@/context/AppContext";
import Link from "next/link";


const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboard,setIsDashboard] = useState(false);
  const [authenticated,setAuthenticated] = useState(false);
  const {loadingText,setLoadingText} = useAuth()

  useEffect(() => {
    setAuthenticated(pathname.startsWith("/dashboard"))
    setIsDashboard(pathname.startsWith("/dashboard"));
  }, [pathname]);

  const handleLogout =async() => {
    try{
      setLoadingText(true)
      const response = await axios.get('/api/auth/logout/')
      if(response){
      await axios.post('/api/auth/logout')  
      window.location.reload()
      }
    }
    catch(err){
      console.log(err)
      signOut({ callbackUrl: "/login" })
    }
    setLoadingText(false)
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <>
      <nav className={`${!isDashboard ? 'fixed z-50' : " bg-indigo-800"} w-full h-20 bg-black-20 text-white flex items-center justify-between`}>
        {/* Logo */}
        <h1 className="ml-5 text-2xl flex items-center justify-center gap-2 ">
          {!isDashboard ? (
            <Link href="/" className="flex gap-2 text-white items-center">
              <IoLogoFirefox color="white" size={35}/><p>CareSync</p>
            </Link>
          ):(
            <div className="flex gap-2  text-white items-center">
              <IoLogoFirefox color="white" size={35}/><p>CareSync</p>
            </div>
          )}
        </h1>

       {!isDashboard && (
        <ul className="hidden md:flex gap-10  justify-center items-center text-sm">
          <Link href="/service">
            <li>Services</li>
          </Link>
          <Link href="/about">
            <li>About us</li>
          </Link>
          <Link href="/contact">
            <li>Contact</li>
          </Link>
          <Link href="/working">
            <li>How it works</li>
          </Link>
        </ul>
       )}

        {/* Desktop Auth Section */}
        <div className="hidden md:flex justify-center items-center gap-2">
          <div className="flex items-center justify-center p-2 gap-5 mr-5">
            {!authenticated && (
              <button className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-md border border-gray-400 font-medium">
                <div className="inline-flex h-12 translate-y-0 items-center justify-center px-4 text-white transition duration-500 group-hover:-translate-y-[150%]">
                  <Link href="/login">Login</Link>
                </div>
                <div className="absolute inline-flex h-9 w-full translate-y-[100%] items-center justify-center text-neutral-50 transition duration-500 group-hover:translate-y-0">
                  <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-blue-700 transition duration-500 group-hover:translate-y-0 group-hover:scale-150"></span>
                  <span className="z-10"><Link href="/login">Login</Link></span>
                </div>
              </button>
            )} 
            {authenticated && (
              <button onClick={handleLogout} className="cursor-pointer group relative inline-flex h-8 items-center justify-center overflow-hidden rounded-md  font-medium">
                <div className={`inline-flex ${isDashboard ? 'bg-red-600': ''} h-8 translate-y-0 items-center justify-center px-4 text-white transition duration-500 group-hover:-translate-y-[150%]`}>{loadingText ? 'Loading' : 'Log out'}</div>
                <div className="absolute inline-flex h-9 w-full translate-y-[100%] items-center justify-center text-neutral-50 transition duration-500 group-hover:translate-y-0">
                  <span className="cursor-pointer absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-red-800 transition duration-500 group-hover:translate-y-0 group-hover:scale-150"></span>
                  <span className="z-10">{loadingText ? 'Loading' : 'Log out'}</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center mr-5">
          <button 
            onClick={toggleMenu}
            className="focus:outline-none text-white">
            {isMenuOpen ? <BiX size={30} /> : <BiMenu size={30}  />}
          </button>
        </div>
      </nav>
      <Modal authenticated={authenticated} setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen}  handleLogout={handleLogout}/>
    </>
  );
};

export default Navbar;