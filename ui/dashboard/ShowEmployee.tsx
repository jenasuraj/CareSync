"use client";

import axios from "axios";
import React, { useEffect } from "react";
import Image from "next/image";
import { AxiosError } from "axios";
import { Employee } from "@/types/Employee";
import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { LiaEditSolid } from "react-icons/lia";



interface ShowEmployeeProps {
  currentPage: string;
  items: Employee[];
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>; 
  setLoading:React.Dispatch<React.SetStateAction<boolean>>;
  setPageRefreshed:React.Dispatch<React.SetStateAction<boolean>>
  loading:boolean
}

const ShowEmployee = ({ currentPage, items, setMessage,setLoading,loading,setPageRefreshed}: ShowEmployeeProps) => {

  const [appointment,setAppointment] = useState(0) 
  const [appointmentData, setAppointmentData] = useState<{name: string, phone: string}[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteDoctor = async(id: number)=>{
  setLoading(true)
  try{
     const response = await axios.delete('/api/dashboard/admin/crud_employees',
    {params: { id,currentPage },})
   setMessage(response?.data?.message)
  }
    catch (err) {
    const error = err as AxiosError<{ message: string }>;
    setMessage(error.response?.data?.message || "Something went wrong");
  }
  setPageRefreshed(true)
  setLoading(false)
  }

  
useEffect(() => {
  if (appointment > 0) {
    const fetchAppointmentData = async () => {
      try {
        const today = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");
        const formattedDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
        const response = await axios.get("/api/dashboard/appointment", {
          params: { appointment, date: formattedDate },
        });
        console.log("response is",response?.data?.data)
        // Check if response has data
        if (response.data.data &&  response.data.data.length > 0) {
          setAppointmentData(response.data.data);
        } else {
          setAppointmentData([]);
        }

        setShowModal(true); // show modal
      } catch (error) {
        console.error("Error fetching appointment data:", error);
        setAppointmentData([]);
        setShowModal(true); // still show modal with "no appointments"
      }
    };

    fetchAppointmentData();
  }
}, [appointment]);



  const handleChangeActive = async(id: number,index: number)=>{
    let target: string = ""
  if(items.length>0 && items[index]?.status == 'active'){
   target = "inactive" 
  }
  else{
    target = "active"
  }
  try{
     const response = await axios.put(`/api/dashboard/admin/crud_employees`,{id,target})
     setMessage(response?.data?.message);
   }
  catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setMessage(error.response?.data?.message || "Something went wrong");
      }
  }

  const closeModal = ()=>{
    setShowModal(false)
    setAppointment(0)
  }

  return (
    <>
    {/* Appointment Modal */}
{showModal && (
  <div className="fixed inset-0 bg-white/80 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-5 rounded border border-gray-300 shadow-md w-96 max-h-[80vh] overflow-y-auto relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={()=>closeModal()}
      >
        ✕
      </button>
      <h2 className="text-lg font-semibold mb-3">Todays Appointments</h2>

      {appointmentData.length > 0 ? (
        <ul>
          {appointmentData.map((appt, idx) => (
            <li key={idx} className="border-b py-2 flex justify-between">
              <span>{appt.name}</span>
              <span>{appt.phone}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No appointments for today.</p>
      )}
    </div>
  </div>
)}

      {/* ✅ Employee Table */}
      <section className="overflow-x-auto w-auto p-2 ">
        {items.length > 0 ? (
          <table className="w-full table-auto border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Photo</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Phone</th>
                {currentPage == 'Doctors' ? (
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                ):(
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                )}
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Department</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Experience</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Delete</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Update</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item,index) => (
                <tr key={index} className="hover:bg-gray-50 transition cursor-pointer">
                  <td className="px-2 py-2">
                    <div className="w-12 h-12 relative rounded-full overflow-hidden">
                      <Image onClick={currentPage == 'Doctors' ? ()=>setAppointment(item?.id): undefined}
                        src={`https://res.cloudinary.com/dfxzsq5zj/image/upload/v1762148066/${item.image}.jpg`}
                        alt={item.name || "Employee"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.phone}</td>
                  {currentPage == 'Doctors' ?(
                   <td className="px-4 py-2">
                      <p className={`cursor-pointer inline-block p-1 rounded-sm text-white`}
                        onClick={() => handleChangeActive(item?.id,index)}>
                        {item.status == 'active' ? <GoDotFill color="lightgreen" size={25}/> : <GoDotFill color="red" size={25}/>}
                      </p>
                    </td>
                  ):(
                    <td className="px-4 py-2">{item.email}</td>
                  )} 
                  <td className="px-4 py-2">{item.department}</td>
                  <td className="px-4 py-2">{item.experience}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteDoctor(item?.id)} // ✅ opens full object
                      className=" cursor-pointer"
                    >
                    <BsTrash size={20} color="red"/>
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="ml-2 cursor-pointer"
                    >
                    <LiaEditSolid size={22} color="blue"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && (
            <p className="text-center text-gray-600 text-lg mt-5">
              There are currently no {currentPage} for now!
            </p>
          )
        )}
      </section>
    </>
  );
};

export default ShowEmployee;