"use client";


import React from "react";
import { dashboard_items } from "@/data/Doctor";
import {LuPanelRightClose } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AppContext";
import { ReactNode,useEffect } from "react";

interface dashboard_items_type{
    id: number,
    name: string,
    icon:ReactNode,
    back?:ReactNode,
    genre?:string,
    path?:string,
}

const Sidebar = ({ role }: { role: string}) => {
  const pathname = usePathname()
  const router = useRouter()
  const {sidebarOpen,setSidebarOpen,setLoading} = useAuth()
  console.log("side bar",sidebarOpen)

const handleRoute = (item: dashboard_items_type) => {
  console.log(item)
  if (item.id === 13) {
    setSidebarOpen(!sidebarOpen)
    return
  }
  let base = ''
  if (pathname.startsWith('/dashboard/patient')) {
    base = '/dashboard/patient'
  } else if (pathname.startsWith('/dashboard/admin')) {
    base = '/dashboard/admin'
  }
  const target = item.path === '/' ? base : `${base}${item.path}`
  if (pathname === target) return
  setLoading(true)
  router.push(target || '/')
}

  useEffect(() => {
  setLoading(false);
  }, [pathname]);


return (
<aside className={`flex flex-col p-2 border-t border-gray-600 ${!sidebarOpen ? 'w-20':'w-40 md:w-[50vh]'} bg-gradient-to-t from-violet-700 to-indigo-800 text-white gap-2 min-h-screen `}>
{sidebarOpen ? dashboard_items.map((item, index) => {
      if (item.genre && item.genre !== role) return null;
      return (
        <div  key={index} onClick={()=>handleRoute(item)}
          className={`${item.id === 13 ? 'bg-blue-900 text-white' : pathname.startsWith(`/dashboard/patient${item.path}`) && item.id !=8 ? 'bg-blue-900 text-white'
          : pathname.startsWith(`/dashboard/admin${item.path}`) && item.id !=1 ? 'bg-blue-900 text-white' : 'text-gray-300'} 
          cursor-pointer w-full h-auto p-4 flex items-center text-sm justify-start gap-2 hover:bg-blue-900 hover:text-white duration-600`}>
          <p>{item.icon}</p>
          <p>{item.name}</p>
          <p>{item.back || ' '}</p>
        </div>
      );
    })
  : (
    <div className="w-full flex  items-center flex-col h-full gap-10 p-2">
     {dashboard_items.map((item,index)=>{
      if (item.genre && item.genre !== role) return null;
      return(
        <p onClick={()=>handleRoute(item)} className={`${item.id == 13 ? 'p-2 border border-gray-700 rounded-lg bg-blue-900': ' ' } cursor-pointer`} key={index}>
          {item.icon}
        </p>
      )
     })}
    </div>
  )}  
</aside>
);};

export default Sidebar;