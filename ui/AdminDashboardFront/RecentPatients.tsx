"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Patient {
  name: string;
  phone: string;
  address: string;
}

const RecentPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecentPatients = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "/api/dashboard/admin/dashboardTop",
          {
            params: { name: "patient" },
          }
        );

        if (response?.data?.data) {
          setPatients(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch patients", err);
        setError("Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPatients();
  }, []);

  return (
    <div className="w-full md:w-1/2 h-auto border border-gray-300 shadow-sm rounded-lg p-3 flex flex-col">
      {/* Header */}
      <div className="w-full text-left">
        <p className="font-bold text-lg">Recent Patients</p>
        <p className="text-gray-600 text-sm">
          Recently registered patients
        </p>
      </div>

      <hr className="my-3" />

      {/* Content */}
      <div className="flex flex-col gap-3">
        {loading && (
          <p className="text-sm text-gray-500">Loading patients...</p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && patients.length === 0 && (
          <p className="text-sm text-gray-500">No patients found</p>
        )}

        {!loading &&
          !error &&
          patients.map((patient, index) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded-md p-2"
            >
              <div>
                <p className="font-medium">{patient.name}</p>
                <p className="text-xs text-gray-500">
                  {patient.phone}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-sm">
                  {patient.address}
                </p>
                <p className="text-xs text-gray-500">Address</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentPatients;
