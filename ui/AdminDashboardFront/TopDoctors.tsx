"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { doctors } from "@/data/Doctor";

interface TopDoctor {
  image: string;
  name: string;
  department: string;
  experience: number;
  appointment_counts: number;
}

const TopDoctors = () => {
  const [topDoctors, setTopDoctors] = useState<TopDoctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopDoctors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "/api/dashboard/admin/dashboardTop",
          {
            params: { name: "doctor" },
          }
        );

        if (response?.data?.data) {
          setTopDoctors(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch top doctors", err);
        setError("Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchTopDoctors();
  }, []);

  return (
    <div className="w-full md:w-1/2 h-auto border border-gray-300 shadow-sm rounded-lg p-3 flex flex-col">
      {/* Header */}
      <div className="w-full text-left">
        <p className="font-bold text-lg">Top Doctors</p>
        <p className="text-gray-600 text-sm">
          Top doctors as per most appointments assigned
        </p>
      </div>

      <hr className="my-3" />

      {/* Content */}
      <div className="h-auto flex flex-col gap-3 ">
        {loading && (
          <p className="text-sm text-gray-500">Loading top doctors...</p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && topDoctors.length === 0 && (
          <p className="text-sm text-gray-500">No doctors found</p>
        )}

        {!loading &&
          !error &&
          topDoctors.map((doctor, index) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded-md p-2"
            >
              <div className="flex items-center gap-3">
                <Image
                src={`https://res.cloudinary.com/dfxzsq5zj/image/upload/v1762148066/${doctor.image}.jpg`}
                alt={doctor.name}
                height={80}
                width={40}
                className="rounded-md"
                />
                <div>
                  <p className="font-medium">{doctor.name}</p>
                  <p className="text-xs text-gray-500">
                    {doctor.department} • {doctor.experience} yrs
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {doctor.appointment_counts}
                </p>
                <p className="text-xs text-gray-500">Appointments</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TopDoctors;
