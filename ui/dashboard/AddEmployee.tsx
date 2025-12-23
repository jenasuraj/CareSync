"use client"
import React, { useState } from "react";
import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { CldUploadWidget } from "next-cloudinary";
import { doctor_departments,other_departments } from "@/data/Doctor";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { MdOutlineSubdirectoryArrowLeft } from "react-icons/md";
import { Employee } from "@/types/Employee";
import type { CloudinaryUploadWidgetInfo } from "next-cloudinary";


interface propTypes{ 
  currentPage: string, 
  setMessage: React.Dispatch<React.SetStateAction<string>>,  
  setLoading:React.Dispatch<React.SetStateAction<boolean>>,
  setPageRefreshed:React.Dispatch<React.SetStateAction<boolean>>,
  updateTriggered:Employee | null
}

const AddEmployee = ({ currentPage,setMessage,setLoading, setPageRefreshed,updateTriggered}:propTypes) => {
  const [formData, setFormData] = useState({
    name: "",
    ph_no: "",
    email: "",
    department: "",
    experience: "",
    file: "",
  });

useEffect(()=>{
  if(updateTriggered){
    console.log("ans is",updateTriggered)
    setFormData({
      name:updateTriggered.name,
      ph_no:updateTriggered.phone,
      email:updateTriggered.email,
      department:updateTriggered.department,
      experience:updateTriggered.experience,
      file:updateTriggered.image
    })
  }
},[updateTriggered])

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
      setLoading(true)
      const response = await axios.post('/api/dashboard/admin/crud_employees',{formData,currentPage,updateBTN:updateTriggered?.id})
      setPageRefreshed(true)
      setMessage(response?.data?.message)
      }
      catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setMessage(error.response?.data?.message || "Something went wrong");
    }
    setLoading(false)
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
      className="flex flex-col w-full md:flex-row gap-2 md:justify-between">
      <Input placeholder="Enter Name" size="auto" style="outline" valueData={formData.name} handleChange={handleChange} type="text" name="name"/>  
      <Input placeholder="Enter Phone"size="auto" style="outline" valueData={formData.ph_no} handleChange={handleChange} type="number" name="ph_no"/> 
      <Input placeholder="Enter Email"size="auto" style="outline" valueData={formData.email} handleChange={handleChange} type="text" name="email"/> 
      {(currentPage === "Doctors" || currentPage === "Others") && (
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="border border-gray-300 shadow-sm rounded-sm px-2 py-1 w-full md:w-1/7"
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
      <Input placeholder="Enter your Experience" size="auto" style="outline" valueData={formData.experience} handleChange={handleChange} type="number" name="experience"/> 
          <CldUploadWidget
            uploadPreset="jensen"
            onSuccess={(result) => {
              if (
                result.event === "success" &&
                typeof result.info === "object" &&
                "public_id" in result.info
              ) {
                const info = result.info as CloudinaryUploadWidgetInfo;

                setFormData((prev) => ({
                  ...prev,
                  file: info.public_id,
                }));
              }
            }}
          >
              {({ open }) => (
                <button
                  className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-2 px-4 rounded-sm  transition-all w-full md:w-1/7"
                  onClick={() => open()}
                  type="button"
                >
                  Image
                </button>
              )}
      </CldUploadWidget>
    <Button style="primary" size="auto">
      <MdOutlineSubdirectoryArrowLeft size={20} color="white"/>
    </Button>
    </form>
    </>
  );
};

export default AddEmployee;