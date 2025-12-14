"use client";

import React, { useRef, useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { useAuth } from "@/context/AppContext";

interface patientData {
  id: number;
  p_id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const SearchPatients = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [patients, setPatients] = useState<patientData[]>([]);
  const { setMessage, setLoading } = useAuth();

  /* ----------------------------------
     CLOSE DROPDOWN ON OUTSIDE CLICK
  -----------------------------------*/
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setPatients([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ----------------------------------
     SEARCH HANDLER
  -----------------------------------*/
  const handleSubmit = async () => {
    if (!inputRef.current) return;

    const searchValue = inputRef.current.value.trim();
    if (!searchValue) return;

    try {
      setLoading(true);

      const response = await axios.get(
        "/api/dashboard/admin/patients",
        {
          params: { name: searchValue },
        }
      );

      if (response?.data?.data) {
        setPatients(response.data.data);
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setMessage("Patient not exists!");
      } else {
        setMessage("Server error");
      }
    } finally {
      setLoading(false);
      inputRef.current.value = "";
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center relative"
    >
      {/* SEARCH BAR */}
      <div className="w-full h-[10vh] flex items-center justify-center p-3 z-20">
        <input
          ref={inputRef}
          placeholder="Enter Patient Name ( Ex: Suraj ) ..."
          className="p-2 w-1/2 h-full border border-gray-300 rounded-l-md focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          className="flex items-center justify-center text-white shadow-sm rounded-r-md 
          bg-gradient-to-r from-blue-900 to-indigo-600 p-1 h-full w-20
          hover:bg-blue-900"
        >
          <CiSearch size={25} />
        </button>
      </div>

      {/* DROPDOWN */}
      {patients.length > 0 && (
        <div className="absolute top-[10vh] w-2/3 bg-white border border-gray-200 
        shadow-xl rounded-md z-30 min-h-80 overflow-y-auto">

          {/* HEADER */}
          <div className="grid grid-cols-6 gap-2 px-4 py-2 text-sm font-semibold 
          text-white bg-gradient-to-r from-blue-900 to-indigo-600">
            <span>Name</span>
            <span>Phone</span>
            <span>Address</span>
            <span>Admit</span>
            <span>Appointment</span>
            <span>Test</span>
          </div>

          {/* ROWS */}
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="grid grid-cols-6 gap-2 px-4 py-3 text-sm 
              hover:bg-blue-50 transition cursor-pointer"
            >
              <span className="font-medium text-gray-800">
                {patient.name}
              </span>

              <span className="text-gray-700">
                {patient.phone}
              </span>

              <span className="text-gray-600 truncate">
                {patient.address}
              </span>

              <span className="text-white bg-red-500 text-center rounded-sm py-1 hover:bg-red-700">
                Admit
              </span>

              <span className="text-white bg-green-500 text-center rounded-sm py-1 hover:bg-green-700">
                Appoint
              </span>

              <span className="text-white bg-blue-500 text-center rounded-sm py-1 hover:bg-blue-700">
                Test
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPatients;
