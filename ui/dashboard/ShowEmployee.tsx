"use client";

import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Employee } from "@/types/Employee";
import { BsTrash } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { LiaEditSolid } from "react-icons/lia";
import Modal from "@/components/Modal";
import Table from "@/components/Table";



export interface Column<T> {
  label: string;
  key:  string;
  render?: (row: T, index: number) => React.ReactNode;
}


interface ShowEmployeeProps {
  currentPage: string;
  items: Employee[];
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setPageRefreshed: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setUpdateTriggered:React.Dispatch<React.SetStateAction<Employee | null>>;
}

const ShowEmployee = ({
  currentPage,
  items,
  setMessage,
  setLoading,
  loading,
  setPageRefreshed,
  setUpdateTriggered,
}: ShowEmployeeProps) => {
  
  const [appointment, setAppointment] = useState(0);
  const [appointmentData, setAppointmentData] = useState<
    { name: string; phone: string }[]
  >([]);
  const [showModal, setShowModal] = useState(false);


const columns: Column<Employee>[] = [
  {
    label: "Photo",
    key: "image",
    render: (row) => (
      <div className="w-12 h-12 relative rounded-full overflow-hidden">
        <Image
          onClick={() => setAppointment(row.id)}
          src={`https://res.cloudinary.com/dfxzsq5zj/image/upload/v1762148066/${row.image}.jpg`}
          alt={row.name}
          fill
          className="object-cover"
        />
      </div>
    ),
  },

  { label: "Name", key: "name" },
  { label: "Phone", key: "phone" },

  // 🔥 conditional column: allowed ONLY if it returns an object OR null
  ...(currentPage === "Doctors"
    ? [
        {
          label: "Status",
          key: "status",
          render: (row:any, index:any) => (
            <p
              className="cursor-pointer inline-block p-1 rounded-sm text-white"
              onClick={() => handleChangeActive(row.id, index)}
            >
              {row.status === "active" ? (
                <GoDotFill size={25} color="lightgreen" />
              ) : (
                <GoDotFill size={25} color="red" />
              )}
            </p>
          ),
        },
      ]
    : []),

  { label: "Department", key: "department" },
  { label: "Experience", key: "experience" },

  {
    label: "Delete",
    key: "delete",
    render: (row) => (
      <button onClick={() => handleDeleteDoctor(row.id)}>
        <BsTrash size={20} color="red" />
      </button>
    ),
  },

  {
    label: "Update",
    key: "update",
    render: (row) => (
      <button onClick={()=>setUpdateTriggered(row)} className="cursor-pointer">
        <LiaEditSolid size={22} color="blue" />
      </button>
    ),
  },
];

  const handleDeleteDoctor = async (id: number) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        "/api/dashboard/admin/crud_employees",
        { params: { id, currentPage } }
      );

      setMessage(response?.data?.message);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setMessage(error.response?.data?.message || "Something went wrong");
    }

    setPageRefreshed(true);
    setLoading(false);
  };

  const handleChangeActive = async (id: number, index: number) => {
    console.log("items is",items)
    console.log("index is",index,"id is",id)
    const target = items[index]?.status === "active" ? "inactive" : "active";
     console.log("target is",target) 
    try {
      const response = await axios.put(`/api/dashboard/admin/crud_employees`, {
        id,
        target,
      });
      console.log("response is",response)  
      setMessage(response?.data?.message);
      setPageRefreshed(true);
    } catch (err) {
       console.log("response is",err) 
      const error = err as AxiosError<{ message: string }>;
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (appointment > 0) {
      const fetchAppointmentData = async () => {
        try {
          const today = new Date();
          const pad = (n: number) => n.toString().padStart(2, "0");

          const date = `${today.getFullYear()}-${pad(
            today.getMonth() + 1
          )}-${pad(today.getDate())}`;

          const response = await axios.get("/api/dashboard/appointment", {
            params: { appointment, date },
          });

          if (response.data.data && response.data.data.length > 0) {
            setAppointmentData(response.data.data);
          } else {
            setAppointmentData([]);
          }

          setShowModal(true);
        } catch (error) {
          console.error("Error fetching appointment data:", error);
          setAppointmentData([]);
          setShowModal(true);
        }
      };

      fetchAppointmentData();
    }
  }, [appointment]);

  const closeModal = () => {
    setShowModal(false);
    setAppointment(0);
  };

  

return (
    <>
      {showModal && (
        <Modal closeModal={closeModal} heading="Todays Appointments">
          {appointmentData.length > 0 ? (
            <ul>
              {appointmentData.map((appt, idx) => (
                <li
                  key={idx}
                  className="border-b py-2 flex justify-between">
                  <span>{appt.name}</span>
                  <span>{appt.phone}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center ">No appointments for today.</p>
          )}
        </Modal>
      )}

      <section className="overflow-x-auto w-auto p-2 overflow-y-auto h-[40vh]">
        {items.length > 0 ? (
          <Table
            items={items}
            columns={columns}
          />
        ) : (
          !loading && (
            <p className="text-center text-gray-600 text-lg mt-5">
              There are currently no {currentPage} for now!
            </p>
          )
        )}
      </section>
    </>
  );
};

export default ShowEmployee;