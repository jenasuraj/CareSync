"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { LiaSearchPlusSolid } from "react-icons/lia";
import Image from "next/image";
import { AxiosError } from "axios";
import { appointmentFormdata,doctorProperty } from "@/types/Employee";
import img from '@/public/dashboard-img.jpg'
import ImageLayout from "./ImageLayout";

const Appointment = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Add 1 for human-readable month
  const day = currentDate.getDate();
  const [formData, setFormData] = useState<appointmentFormdata>({
    name: "",
    phone: "",
    address: "",
    doctorId: 0,
  });
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<doctorProperty[]>([]);
  const [doctorSelected, setDoctorSelected] = useState<string>("");
  const [date, setDate] = useState(`${year}-${month}-${day}`);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });

  console.log("date is",date)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add symptom to list
  const handleSymptomAdd = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = symptomInput.trim();
      if (trimmed && !symptoms.includes(trimmed)) {
        setSymptoms([...symptoms, trimmed]);
        setSymptomInput("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { ...formData, symptoms,date };
    console.log("Submitting:", payload);
    try {
      const res = await axios.post("/api/dashboard/appointment", payload);
      setMessage({ text: res.data.message || "Appointment booked successfully!", type: "success" });
      setFormData({ name: "", phone: "", address: "", doctorId: 0 });
      setSymptoms([]);
      setDoctorSelected("");
    }catch (err) {
    const error = err as AxiosError<{ message: string }>;
    setMessage({
    text: error.response?.data?.message || "Something went wrong!",
    type: "error",
  });
  }
  };

  useEffect(() => {
    if (!date) return;
    const fetchRelevantDoctors = async () => {
      try {
        const response = await axios.get("/api/dashboard/appointment", { params: { date } });
        setDoctors(response?.data?.data || []);
        console.log(response)
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchRelevantDoctors();
  }, [date]);

  return (
    <section className="min-h-screen w-full text-gray-900 relative flex flex-col items-center">

      {/* ✅ Message Box */}
      {message.text && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center justify-between min-w-[300px] ${
            message.type === "success" ? "bg-green-100 text-green-800 border border-green-400" : "bg-red-100 text-red-800 border border-red-400"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage({ text: "", type: "" })}
            className="ml-4 text-lg font-bold hover:text-gray-700"
          >
            ✖
          </button>
        </div>
      )}

      {!doctorSelected ? (
        <div className="min-h-screen w-full flex flex-col items-center  bg-white p-2 gap-10">
          <ImageLayout img={img}>
          <div className="flex items-center gap-3 text-center">
            <p className="text-2xl md:text-3xl text-white">
              Choose the Date for Your Appointment
            </p>
            <LiaSearchPlusSolid className="text-white" size={38} />
          </div>

          <div className="flex items-center w-full  bg-white rounded-lg overflow-hidden border border-gray-300">
            <input
              type="date"
              className="flex-1 px-5 py-3 h-[9vh] text-gray-700 focus:outline-none rounded-sm"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          </ImageLayout>


          {doctors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 w-8/12">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setDoctorSelected(doc?.name);
                    setFormData({ ...formData, doctorId: doc.id });
                  }}
                  className="cursor-pointer bg-sky-100 border border-gray-300 rounded-lg shadow-lg p-5 hover:scale-105 transition-all duration-300 text-center"
                >
                  <Image
                    src={`https://res.cloudinary.com/dfxzsq5zj/image/upload/v1762148066/${doc.image}.jpg`}
                    alt={doc.name}
                    width={100}
                    height={100}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                  <h3 className="text-xl font-semibold mt-3 text-blue-800">{doc.name}</h3>
                  <p className="text-gray-600">{doc.department}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Experience: {doc.experience} years
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-2/3 gap-5 border border-gray-300  h-auto shadow-sm p-4 mt-10 rounded-4xl py-10"
        >
          <h1 className="w-full text-center text-blue-900 text-3xl p-4">
            Book an Appointment with {doctorSelected}
          </h1>

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-sm p-2 border border-gray-300 mt-2"
          />

          <input
            type="number"
            name="phone"
            placeholder="Enter Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-sm p-2 border border-gray-300 mt-2"
          />

          <input
            type="text"
            name="address"
            placeholder="Enter Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded-sm p-2 border border-gray-300 mt-2"
          />

          {/* Symptoms Input */}
          <textarea
            name="symptoms"
            placeholder="Type symptom and press Enter"
            value={symptomInput}
            onChange={(e) => setSymptomInput(e.target.value)}
            onKeyDown={handleSymptomAdd}
            className="w-full rounded-sm p-2 border border-gray-300 mt-2"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {symptoms.map((s, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {s}
              </span>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-900 text-white p-2 rounded-sm mt-4 hover:bg-blue-800 transition"
          >
            Pay & Book Appointment
          </button>

          <button
            type="button"
            onClick={() => setDoctorSelected("")}
            className="w-full bg-gray-300 text-gray-700 p-2 rounded-sm mt-2 hover:bg-gray-400 transition"
          >
            Go Back
          </button>
        </form>
      )}
    </section>
  );
};

export default Appointment;