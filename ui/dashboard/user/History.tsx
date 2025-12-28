"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Table from "@/components/Table"

/* ---------------- TYPES ---------------- */

interface transactionFormat {
  money_type: string
  reason: string
  amount: number
  date: string
}

interface appointmentFormat {
  date: string
  department: string
  experience: number
  name: string,
  status?:boolean
}

interface Column<T> {
  label: string
  key: string
  render?: (row: T, index: number) => React.ReactNode
}

/* ---------------- COMPONENT ---------------- */

const History = () => {
  const [transactionData, setTransactionData] = useState<transactionFormat[]>([])
  const [appointmentData, setAppointmentData] = useState<appointmentFormat[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTransactionInformation = async () => {
    try {
      setLoading(true)
      const storedId = localStorage.getItem("userId")
      if (!storedId) return
      const res = await axios.get(
        "/api/dashboard/user/history",
        { params: { userId: storedId,transaction:true } }
      )
      if (res.data.success) {
                   const formatted = res.data.data.map((item: transactionFormat) => ({
        ...item,
        date: item.date.slice(0, 10)
      }))
        setTransactionData(formatted)
      }
    } catch (error) {
      console.error("error fetching history for user", error)
    } finally {
      setLoading(false)
    }
  }


  const fetchAppointmentInformation = async () => {
    try {
      setLoading(true)
      const storedId = localStorage.getItem("userId")
      if (!storedId) return
      const res = await axios.get(
        "/api/dashboard/user/history",
        { params: { userId: storedId,appointment:true } }
      )
      console.log(res.data.data)
      if (res.data.success) {
        const formatted = res.data.data.map((item: appointmentFormat) => {
          const inputDate = new Date(item.date.slice(0, 10))
          const now = new Date()
          return {
            ...item,
            date:item.date.slice(0, 10),
            status:now<inputDate
          }
        })
        setAppointmentData(formatted)
      }
    } catch (error) {
      console.error("error fetching history for user", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactionInformation()
    fetchAppointmentInformation()
  },[])

  /* ---------------- TABLE COLUMNS ---------------- */

  const transactionColumns: Column<transactionFormat>[] = [
    { label: "Payment Type", key: "money_type" },
    { label: "Reason", key: "reason" },
    { label: "Amount", key: "amount" },
    { label: "Date", key: "date" },
  ]

    const appointmentColumns: Column<appointmentFormat>[] = [
    { label: "Doctor Name", key: "name" },
    { label: "Department", key: "department" },
    { label: "Experience", key: "experience" },
    { label: "Date", key: "date" },
                {
        label: "Status",
        key: "status",
        render: (row) => (
            <span
            className={
                !row.status 
                ? "bg-orange-500 py-1 px-2 rounded-lg text-white text-sm"
                : "bg-green-500 py-1 px-2 rounded-lg text-white text-sm"
            }
            >
            {row.status ? 'Pending' : 'Completed'}
            </span>
        )
        }
  ]

  /* ---------------- JSX ---------------- */

  return (
    <div className="w-full lg:w-2/3 min-h-screen p-4">
      <h1 className="text-xl font-bold mb-3">Appointment History</h1>
      {loading ? (
        <p>Loading...</p>
      ) : appointmentData.length > 0 ? (
        <Table items={appointmentData} columns={appointmentColumns} />
      ) : (
        <p>No history found</p>
      )}
      <h1 className="text-xl font-bold mt-10 mb-3">Transaction History</h1>
      {loading ? (
        <p>Loading...</p>
      ) : transactionData.length > 0 ? (
        <Table items={transactionData} columns={transactionColumns} />
      ) : (
        <p>No history found</p>
      )}
    </div>
  )
}

export default History
