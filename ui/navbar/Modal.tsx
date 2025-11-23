import React from 'react'
import { BiUser} from "react-icons/bi";
import Link from 'next/link';

interface propsType{
    authenticated:boolean,
    setIsMenuOpen:React.Dispatch<React.SetStateAction<boolean>>,
    handleLogout:()=>void,
    isMenuOpen:boolean
}

const Modal = ({authenticated,setIsMenuOpen, handleLogout,isMenuOpen}:propsType) => {
  return (
<>
      {/* Mobile Menu */}
      <div className={`fixed top-20 left-0 w-full bg-indigo-800 z-40 transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="flex flex-col items-center py-6 space-y-6 text-white">
          {/* Mobile Navigation Links */}
          <ul className="flex flex-col gap-6 items-center text-sm">
            <li>Services</li>
            <li>About us</li>
            <li>Contact</li>
            <li>How it works</li>
          </ul>

          {/* Mobile Auth Section */}
          <div className="flex flex-col items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <BiUser size={20} color="white"/>
              <span>Account</span>
            </div>
            <div className="flex flex-col gap-4 items-center">
              {!authenticated && (
                <button className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-md border border-gray-400 font-medium">
                  <div className="inline-flex h-12 translate-y-0 items-center justify-center px-4 text-white transition duration-500 group-hover:-translate-y-[150%]">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  </div>
                  <div className="absolute inline-flex h-9 w-full translate-y-[100%] items-center justify-center text-neutral-50 transition duration-500 group-hover:translate-y-0">
                    <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-blue-700 transition duration-500 group-hover:translate-y-0 group-hover:scale-150"></span>
                    <span className="z-10">
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    </span>
                  </div>
                </button>
              )} 
              {authenticated && (
                <button onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }} className="cursor-pointer group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-md  font-medium">
                  <div className="inline-flex h-12 translate-y-0 items-center justify-center px-4 text-white transition duration-500 group-hover:-translate-y-[150%]">Logout</div>
                  <div className="absolute inline-flex h-9 w-full translate-y-[100%] items-center justify-center text-neutral-50 transition duration-500 group-hover:translate-y-0">
                    <span className="cursor-pointer absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-red-800 transition duration-500 group-hover:translate-y-0 group-hover:scale-150"></span>
                    <span className="z-10">Log out</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
</>
  )
}

export default Modal
