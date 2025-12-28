"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { LiaSearchPlusSolid } from "react-icons/lia";
import img from '@/public/dashboard-img.jpg';
import ImageLayout from "./ImageLayout";
import { Employee } from "@/types/Employee";
import Image from "next/image";
import Table from "@/components/Table";
import { TiTick } from "react-icons/ti";
import Modal from '@/components/Modal'
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AppContext";

export interface Column<T> {
  label: string;
  key:  string;
  render?: (row: T, index: number) => React.ReactNode;
}

const Appointment = () => {
  const {userId,setUserId} = useAuth()
  const searchparams = useSearchParams()
  const [p_id,setP_id] = useState(0)
  const patientId:number = Number(searchparams.get("id"))
  const router = useRouter()
  const {setLoading,setMessage} = useAuth()
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Add 1 for human-readable month
  const day = currentDate.getDate();
  const [date, setDate] = useState(`${year}-${month}-${day}`);
  const [doctors, setDoctors] = useState<Employee[]>([]);
  const [showModal,setShowModal] = useState(false)
  const [bookDoctorDetails,setBookDoctorDetails] = useState({
    name:"",id:0
  })
  const [mode,setMode] = useState("online") 

  const checkUserOrAdmin = ()=>{
  const storedId = localStorage.getItem("userId")
  if(patientId){
    setP_id(patientId)
  }
  else if(storedId){
    setP_id(Number(storedId))
  }
  }

  useEffect(()=>{
  checkUserOrAdmin()
  },[patientId,userId])

  const columns: Column<Employee>[] = [
    {
      label: "Photo",
      key: "image",
      render: (row) => (
        <div className="w-12 h-12 relative rounded-full overflow-hidden">
          <Image
            src={`https://res.cloudinary.com/dfxzsq5zj/image/upload/v1762148066/${row.image}.jpg`}
            alt={row.name}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    { label: "Name", key: "name" },
    { label: "Phone", key: "phone" },
    { label: "Department", key: "department" },
    { label: "Experience", key: "experience" },
    {
      label: "Book",
      key: "Book",
      render: (row) => (
        <button onClick={() => handleBookDoctor(row.id,row.name)}>
          <TiTick size={20} color="blue" />
        </button>
      ),
    },
  ];
  const handleBookDoctor = (id:number,name:string)=>{
    console.log(id)
    setBookDoctorDetails({name:name,id:id})
    setShowModal(true)
  }

  const BookAppointment = async()=>{
    try{
      const response = await axios.post('/api/dashboard/appointment',{date:date,d_id:bookDoctorDetails.id,p_id:p_id,mode})
      setMessage("Appointment Booked !")
      setShowModal(false)
    }
    catch (err) {
       const error = err as AxiosError<{ message: string }>;
         setMessage("Server error");
     } 
  }

 useEffect(() => {
    if (!date) return;
    const fetchRelevantDoctors = async () => {
      try {
        setLoading(true)
        console.log("fetching ...")
        const response = await axios.get("/api/dashboard/appointment", { params: { date } });
        setDoctors(response?.data?.data || []);
        console.log(response)
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
      setLoading(false)
    };
    fetchRelevantDoctors();
  }, [date]);

  const closeModal = () => {
    setShowModal(false);
  };


return (
<>
      {showModal && (
        <Modal closeModal={closeModal} heading={`Appointment Booking with ${bookDoctorDetails.name} on ${date}`}>
           <div className="w-full h-auto flex flex-col items-center justify-center gap-3">
                    Please make sure that theres no refund policy !
              <div className="w-full h-auto  flex items-center justify-center gap-5 mt-10">
                <button
                  className={`${mode === "online" ? 'bg-white text-gray-800' : ''} rounded-sm px-1 py-2 w-1/2 border border-white`}
                  onClick={() => setMode("online")}
                >
                  Online
                </button>

                <button
                  className={`${mode === "offline" ? 'bg-white text-gray-800' : ''} rounded-sm px-1 py-2 w-1/2 border border-white`}
                  onClick={() => setMode("offline")}
                >
                  Offline
                </button>
              </div>
              <button className="rounded-sm px-1 py-2 w-full border border-white" onClick={()=>BookAppointment()}>Pay 200 & book</button>
           </div>
        </Modal>
      )}
    <section className="min-h-screen w-full text-gray-900 p-2 gap-10 relative flex flex-col items-center">
          <ImageLayout img={img}>
          <div className="flex items-center gap-3 text-center">
            <p className="text-2xl md:text-3xl text-white">
              Choose the Date for Your Appointment
            </p>
            <LiaSearchPlusSolid className="text-white" size={38} />
          </div>

          <div className="flex items-center w-full md:w-1/2 bg-transparent rounded-lg overflow-hidden border border-gray-300">
            <input
              type="date"
              className="flex-1 px-5 py-3 h-[9vh] text-gray-200 focus:outline-none rounded-sm"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          </ImageLayout>
          <Table items={doctors} columns={columns}/>
    </section>
</>
  );
};

export default Appointment;