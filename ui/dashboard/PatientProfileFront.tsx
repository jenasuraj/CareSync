"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageLayout from "@/ui/ImageLayout";
import img from "@/public/dashboard-img.jpg";
import { VscSearch } from "react-icons/vsc";
import { IoIosRefresh } from "react-icons/io";
import Table from "@/components/Table";
import { useAuth } from "@/context/AppContext";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";


interface patientData {
  id: number;
  p_id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Column<T> {
  label: string;
  key: string;
  render?: (row: T, index: number) => React.ReactNode;
}

const PatientProfileFront = () => {
  const { setLoading, setMessage} = useAuth();
  const [patients, setPatients] = useState<patientData[]>([]);
  const [showRefresh, setShowRefresh] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter()
  const [localLoading,setLocalLoading] = useState<number | null>(null)

  const RouteToProfile = (id:number)=>{
    setLocalLoading(id)
    router.push(`/dashboard/admin/profile/${id}`)
  }

  const columns: Column<patientData>[] = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Address", key: "address"},
    {label: "Profile", key:"profile",
      render: (row) => (
          <button onClick={()=>RouteToProfile(row.id)} className="cursor-pointer px-2 py-1 rounded-sm bg-blue-800 text-white">
            {localLoading == row.id ? "Loading" : "Profile"}
          </button>
        ),}
  ];

  // 🔹 Fetch all patients
  const fetchAllPatients = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/dashboard/admin/patients");
      setPatients(res.data.data || []);
      setShowRefresh(false);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setMessage("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Search patients
  const handleSearch = async () => {
    const value = inputRef.current?.value.trim();
    if (!value) return;

    try {
      setLoading(true);
      const res = await axios.get("/api/dashboard/admin/patients", {
        params: { name: value },
      });
      setPatients(res.data.data || []);
      setShowRefresh(true);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 404) {
        setPatients([]);
        setMessage("Patient not found");
      } else {
        setMessage("Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial load
  useEffect(() => {
    fetchAllPatients();
  }, []);

  return (
    <section className="h-screen w-full text-black p-1 flex flex-col overflow-y-auto">
      <ImageLayout img={img}>
        <p className="text-2xl md:text-3xl text-gray-300 text-center">
          Let the patient access the personalised profile
        </p>

        <div className="w-full h-[10vh] flex items-center justify-center p-3 z-20">
          <input
            ref={inputRef}
            placeholder="Enter Patient Name ( Ex: Suraj ) ..."
            className="p-2 w-1/2 h-full border border-gray-400 text-gray-200 rounded-l-md focus:outline-none"
          />

          <button
            onClick={showRefresh ? fetchAllPatients : handleSearch}
            className="flex items-center justify-center text-white shadow-sm rounded-r-md 
              bg-gradient-to-r from-blue-900 to-indigo-600 p-1 h-full w-20 border border-gray-400"
          >
            {showRefresh ? <IoIosRefresh size={22} /> : <VscSearch size={22} />}
          </button>
        </div>
      </ImageLayout>

      <div className="w-full p-2 mt-2 overflow-y-auto h-[40vh]">
        <Table items={patients} columns={columns} />
      </div>
    </section>
  );
};

export default PatientProfileFront;