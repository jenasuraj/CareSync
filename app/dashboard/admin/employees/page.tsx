"use client";

import React from 'react';
import { admin_employees_items } from '@/data/Doctor';
import { useState } from 'react';
import AddEmployee from '@/ui/dashboard/AddEmployee';
import FindEmployee from '@/ui/dashboard/FindEmployee';
import ShowEmployee from '@/ui/dashboard/ShowEmployee';
import { Employee } from '@/types/Employee';
import { useAuth } from "@/context/AppContext";
import { useEffect } from 'react';
import axios from 'axios';


const Page = () => {
const emptyEmployee: Employee = {
  id: 0,
  name: "",
  phone: "",
  email: "",
  department: "",
  experience: "",
  image: "",
  status:""
};  
const [currentPage,setCurrentPage] = useState('Doctors')    
const [items, setItems] = useState<Employee[]>([]);
const {message,setMessage,setLoading,loading} = useAuth()
const [pageRefreshed,setPageRefreshed] = useState(false)
const [employeeName,setEmployeeName] = useState('')
const [buttonTriggered, setButtonTriggered] = useState(false)
const [updateTriggered,setUpdateTriggered] = useState<Employee | null>(null)

useEffect(() => {
    const fetchData = async () => {
      console.log("db call is made to fetch data...");
      try {
        setUpdateTriggered(emptyEmployee)
        setLoading(true);
        const response = await axios.get("/api/dashboard/admin/crud_employees", {
          params: { currentPage, employeeName },
        });
        setItems(response.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setPageRefreshed(false)
      }
    };
    fetchData();
}, [currentPage,pageRefreshed,buttonTriggered]); //future error could it be this line


return (
<section className='min-h-screen w-full  flex flex-col gap-5 p-3'>
{/**for posts */}
<div className='w-full h-auto gap-5 flex flex-col md:flex-row'>
  {admin_employees_items.map((item,index)=>{
      return(
  <div onClick={()=>setCurrentPage(item.name)} key={index} className={`${item.name == currentPage ? 'bg-gradient-to-r from-blue-900 to-indigo-800 text-white': 'bg-sky-50 text-gray-700'}
  w-full md:w-1/4 h-30 border border-gray-300  flex items-center justify-center rounded-sm shadow-sm hover:cursor-pointer hover:bg-gradient-to-r from-blue-900 to-indigo-800 hover:text-white transition-all duration-700`}>
  <div className='flex items-center justify-center gap-4'>
  <p>{item.name}</p>
  <p className='p-2 bg-gradient-to-r from-blue-900 to-indigo-800 rounded-sm'>{item.icon}</p>
  </div>
  </div>
    )
  })}
</div>
  <AddEmployee currentPage = {currentPage} setMessage = {setMessage} setLoading={setLoading} setPageRefreshed={setPageRefreshed} updateTriggered={updateTriggered}/>
  <FindEmployee currentPage = {currentPage} setMessage = {setMessage} setEmployeeName={setEmployeeName} employeeName={employeeName} buttonTriggered={buttonTriggered} setButtonTriggered={setButtonTriggered}/>
  <ShowEmployee currentPage = {currentPage} loading={loading} items={items}  message={message} setMessage = {setMessage} setLoading={setLoading} setPageRefreshed={setPageRefreshed} setUpdateTriggered={setUpdateTriggered}/>
</section>
  )
}

export default Page