'use client'

import { useParams } from 'next/navigation';
import React, { useEffect,  useState } from "react";
import ImageLayout from "@/ui/ImageLayout";
import img from "@/public/dashboard-img.jpg";
import Table from "@/components/Table";
import { useAuth } from "@/context/AppContext";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Test from '../Test';
import {  } from "react-icons/ri";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import Admit from '../Admit';


interface appointmentFormat {
  name: string;
  experience:number,
  department:string,
  timezone: string,
}
interface transactionFormat {
  money_type: string;
  reason:string,
  timezone:string,
  amount: number,
}

export interface Column<T> {
  label: string;
  key: string;
  render?: (row: T, index: number) => React.ReactNode;
}

const PatientProfileFront = () => {
  const { slug } = useParams();
  const { setLoading, setMessage } = useAuth();
  const [appointmentData, setAppointmentData] = useState<appointmentFormat[]>([]);
  const [transactionData, setTransactionData] = useState<transactionFormat[]>([]);
  const [showRefresh, setShowRefresh] = useState(false);
  const router = useRouter()
  const [testClicked,setTestClicked] = useState<boolean>(false)
  const [localLoading,setLocalLoading] = useState<boolean>(false)


  const appointment_columns: Column<appointmentFormat>[] = [
    { label: "Name", key: "name" },
    { label: "Department", key: "department" },
    { label: "Experience", key: "experience"},
    {label: "Date",key:"timezone"}
  ];

    const transaction_columns: Column<transactionFormat>[] = [
    { label: "Type", key: "money_type" },
    { label: "Genre", key: "reason" },
    { label: "Amount", key: "amount"},
    {label: "Date",key:"timezone"}
  ];

  // 🔹 Fetch all patients
  const fetchAppointmentData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/dashboard/admin/profile",{params: {id:slug,appointmentData:true},});
      const formattedData : appointmentFormat[] = res.data.data.map((item:appointmentFormat)=>{
        return(
          {
            ...item,
            timezone:item.timezone.slice(0,10)
          }
        )
      })
      setAppointmentData(formattedData|| []);
      setShowRefresh(false);
    } catch {
      setMessage("Failed to load appointments...");
    } finally {
      setLoading(false);
    }
  };



    const fetchTransactionData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/dashboard/admin/profile",{params: {id:slug,transactionData:true},});
      const formattedData : transactionFormat[] = res.data.data.map((item:transactionFormat)=>{
        return(
          {
            ...item,
            timezone:item.timezone.slice(0,10)
          }
        )
      })
      setTransactionData(formattedData|| []);
      setShowRefresh(false);
    } catch {
      setMessage("Failed to load transaction data...");
    } finally {
      setLoading(false);
    }
  };

  const transactionAmount = (transaction:transactionFormat[])=>{
    let sum:number = 0
    for(let i = 0;i<transaction.length;i++){
      sum+=transaction[i].amount
    }
    return sum
  }

  // 🔹 Initial load
  useEffect(() => {
    fetchAppointmentData();
    fetchTransactionData();
  }, []);

  const RouteToAppointment = (slug:ParamValue)=>{
    setLocalLoading(true)
    router.push(`/dashboard/admin/appointments/?id=${slug}`)
  }

  return (
<>
{testClicked && (
<Test patientId={slug} setTestClicked={setTestClicked}/>
)}

    <section className="min-h-screen w-full text-black p-1 flex flex-col">
      <ImageLayout img={img}>
        <p className="text-2xl md:text-3xl text-gray-300 text-center">
          Welcome to your personalised platform !
        </p>
        <div className="w-full h-[10vh] px-5 py-2 m-2 text-gray-300 flex gap-2">
        <button onClick={()=>RouteToAppointment(slug)} className="w-1/3 h-full hover:border hover:border-gray-500 rounded-sm bg-blue-900 hover:bg-transparent hover:cursor-pointer transition-all  duration-300">
            {localLoading ? 'Loading' : 'Appointment'}
        </button>
       <Admit slug={slug}/>
        <button onClick={()=>setTestClicked(true)} className="w-1/3 h-full hover:border hover:border-gray-500 rounded-sm bg-blue-900 hover:bg-transparent hover:cursor-pointer transition-all  duration-300">
            Test Charges
        </button>
        </div>
      </ImageLayout>

      <ul className="w-full p-1 flex-1 mt-2 flex flex-col gap-3">
        {appointmentData.length>0 ? (
        <>
                <li className='p-1 text-lg font-bold'>Your Future Appointments</li>
                <Table items={appointmentData} columns={appointment_columns} />
        </>
        ):<li className='p-1 text-lg font-bold'>No current Appointments for now</li>}
        {transactionData.length>0 ? (
        <>
                <li className='p-1 text-lg font-bold flex items-center gap-1'>Your Transactions till so far is: {<RiMoneyRupeeCircleLine size={25}/>}{transactionAmount(transactionData)}</li>
                <Table items={transactionData} columns={transaction_columns} />
        </>
        ):<li className='p-1 text-lg font-bold'>No current Transactions for now</li>}
      </ul>
    </section>
</>
  );
};

export default PatientProfileFront;