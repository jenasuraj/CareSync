"use client";

import React, { useState } from "react";
import axios from "axios";
import { FcMindMap } from "react-icons/fc";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { useAuth } from "@/context/AppContext";
import { AxiosError } from "axios";

interface FormDataType {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const RegisterPatient = () => {
  const {setLoading,setMessage} = useAuth()
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stops page refresh
    setLoading(true);

    try {
      const res = await axios.post(
        "/api/dashboard/admin/patients",
        formData
      );
      setMessage("User registered")
      setFormData({name:"",phone:"",address:"",email:""}) 
      console.log("Patient registered:", res.data);

      // reset form after success
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    }     catch(err){
                const error = err as AxiosError<{ message: string }>;
                if(error.status == 404){
                    setMessage("patient ain't axists, open up modal page.")
                }
                else{
                    setMessage("Server error")
                }
            }
            setLoading(false)
  };

  return (
    <div className="w-full flex items-center justify-center p-3 flex-col mt-7">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg min-h-[50vh] w-full md:w-2/3 p-4 flex flex-col gap-3 items-center justify-center border border-gray-300 shadow-sm"
      >
        <h1 className="w-full flex items-center gap-2 justify-center text-2xl mb-5">
          Patient Registration <FcMindMap size={25} />
        </h1>

        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Enter Your Name"
          className="p-2 w-full border border-gray-300 rounded-md"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter Your Email"
          className="p-2 w-full border border-gray-300 rounded-md"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          value={formData.phone}
          placeholder="Enter Your Phone"
          className="p-2 w-full border border-gray-300 rounded-md"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          value={formData.address}
          placeholder="Enter Your Address"
          className="p-2 w-full border border-gray-300 rounded-md"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="mb-3 bg-gradient-to-r from-blue-900 to-indigo-600 w-full p-3 flex items-center justify-center gap-2 text-white rounded-md hover:cursor-pointer disabled:opacity-60"
        >
          Register
          <HiArrowTopRightOnSquare size={20} />
        </button>
      </form>
    </div>
  );
};

export default RegisterPatient;
