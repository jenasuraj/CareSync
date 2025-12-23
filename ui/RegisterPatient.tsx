"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { FcMindMap } from "react-icons/fc";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { useAuth } from "@/context/AppContext";

interface FormDataType {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const RegisterPatient = () => {
  const { setMessage } = useAuth();

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [localLoading, setLocalLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);

    try {
      await axios.post("/api/dashboard/admin/patients", formData);
      setMessage("Patient registered successfully");
      setFormData({ name: "", email: "", phone: "", address: "" });
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 409) {
        setMessage("Duplicate data detected");
      } else {
        setMessage("Server error");
      }
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <section className="w-full flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* CARD */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* HEADER */}
          <div className="border-b px-6 py-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
              <FcMindMap size={22} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Patient Registration
              </h1>
              <p className="text-sm text-gray-500">
                Enter patient personal details
              </p>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {/* NAME */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input p-2"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@email.com"
                className="input p-2"
                required
              />
            </div>

            {/* PHONE */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="input p-2"
                required
              />
            </div>

            {/* ADDRESS */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street, City, State"
                className="input p-2"
                required
              />
            </div>

            {/* BUTTON */}
            <div className="sm:col-span-2 mt-4">
              <button
                type="submit"
                disabled={localLoading}
                className="
                  w-full 
                  flex 
                  items-center 
                  justify-center 
                  gap-2 
                  rounded-lg 
                  bg-indigo-600 
                  py-3 
                  text-white 
                  font-medium 
                  transition 
                  hover:bg-indigo-700 
                  disabled:opacity-60
                "
              >
                {localLoading ? "Registering..." : "Register Patient"}
                <HiArrowTopRightOnSquare size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterPatient;
