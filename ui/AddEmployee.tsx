"use client"
import React, { useState } from "react";
import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { CldUploadWidget } from "next-cloudinary";
import { doctor_departments,other_departments } from "@/data/Doctor";
import { Dispatch, SetStateAction } from "react";



const AddEmployee = ({ currentPage,setMessage }: { currentPage: string, setMessage: Dispatch<SetStateAction<string>>; }) => {
  const [formData, setFormData] = useState({
    name: "",
    ph_no: "",
    email: "",
    department: "",
    experience: "",
    file: "",
  });

  
useEffect(() => {
  const timer = setTimeout(() => {
    setFormData({
      name: "",
      ph_no: "",
      email: "",
      department: "",
      experience: "",
      file: "",
    });
  }, 0);
  return () => clearTimeout(timer);
}, [currentPage]);


  const departments =
    currentPage.toLowerCase() === "doctors"
      ? doctor_departments
      : other_departments;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if((currentPage == 'Doctors' || currentPage == 'Others') && (!formData.name || !formData.ph_no || !formData.email || !formData.experience || !formData.experience || !formData.file))
      {
      setMessage('Some fields are empty !')
      return
      }
    else if(!formData.name || !formData.ph_no || !formData.email || !formData.experience || !formData.file)
      {
      setMessage('Some fields are empty !')
      return
      }   
    try{
      const response = await axios.post('/api/dashboard/admin/crud_employees',{formData,currentPage})
      setMessage(response?.data?.message)
      }
      catch (err) {
  const error = err as AxiosError<{ message: string }>;
  setMessage(error.response?.data?.message || "Something went wrong");
}
    setFormData({
      name: "",
      ph_no: "",
      email: "",
      department: "",
      experience: "",
      file: "",
    });
  };


  return (
    <>
    <form
      onSubmit={handleSubmit}
      className="max-w-full h-[7vh] gap-2 flex justify-between">
      <input
        name="name"
        type="text"
        placeholder="Enter Name"
        value={formData.name}
        onChange={handleChange}
        className="border border-gray-300 shadow-sm rounded-sm px-2 py-1 w-1/7"/>

      <input
        name="ph_no"
        type="number"
        placeholder="Enter PH.no"
        value={formData.ph_no}
        onChange={handleChange}
        className="border border-gray-300 shadow-sm rounded-sm px-2 py-1 w-1/7"/>

      <input
        name="email"
        type="text"
        placeholder="Enter Email"
        value={formData.email}
        onChange={handleChange}
        className="border border-gray-300 shadow-sm rounded-sm px-2 py-1 w-1/7"/>

      {(currentPage === "Doctors" || currentPage === "Others") && (
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="border border-gray-300 shadow-sm rounded-sm px-2 py-1 w-1/7"
          >
            <option value="" disabled>
              Enter Department
            </option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        )}

      <input
        name="experience"
        type="number"
        placeholder="Enter Experience"
        value={formData.experience}
        onChange={handleChange}
        className="border border-gray-300 shadow-sm rounded-sm px-2 py-1 w-1/7"/>

      <CldUploadWidget
              uploadPreset="jensen"
              onSuccess={(result) => {
                if (result.event === "success") {
                  setFormData((prev) => ({
                  ...prev,
                  file: result?.info?.public_id,
                }));
                }
              }}
            >
              {({ open }) => (
                <button
                  className=" bg-blue-900 text-white py-2 px-4 rounded-sm  transition-all"
                  onClick={() => open()}
                  type="button"
                >
                  Image
                </button>
              )}
      </CldUploadWidget>

      <button
        type="submit"
        className="border border-gray-300 bg-blue-900 text-white shadow-sm rounded-sm px-2 py-1 w-1/7">
        ADD
      </button>
    </form>
    </>
  );
};

export default AddEmployee;