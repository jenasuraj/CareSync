'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from "react"
import ImageLayout from "@/ui/ImageLayout"
import img from "@/public/dashboard-img.jpg"
import Table from "@/components/Table"
import { useAuth } from "@/context/AppContext"
import axios from "axios"
import Test from "../Test"
import { RiMoneyRupeeCircleLine } from "react-icons/ri"
import Admit from "../Admit"


/* ---------------- TYPES ---------------- */

interface AppointmentFormat {
  name: string
  experience: number
  department: string
  timezone: string
}

interface TransactionFormat {
  money_type: string
  reason: string
  timezone: string
  amount: number
}

export interface Column<T> {
  label: string
  key: string
  render?: (row: T, index: number) => React.ReactNode
}

/* ---------------- COMPONENT ---------------- */

const PatientProfileFront = () => {
const params = useParams()
const {setLoading,setMessage} = useAuth() 
const router = useRouter()
const slug = useMemo(() => {
  const raw = params?.slug
  return Array.isArray(raw) ? raw[0] : raw ?? null
}, [params])

// ✅ HOOKS FIRST — ALWAYS
const [appointmentData, setAppointmentData] = useState<AppointmentFormat[]>([])
const [transactionData, setTransactionData] = useState<TransactionFormat[]>([])
const [testClicked, setTestClicked] = useState(false)
const [localLoading, setLocalLoading] = useState(false)

// ✅ EFFECT CAN GUARD
useEffect(() => {
  if (!slug) return
  fetchAppointmentData()
  fetchTransactionData()
}, [slug])



  /* ---------------- TABLE COLUMNS ---------------- */

  const appointmentColumns: Column<AppointmentFormat>[] = [
    { label: "Name", key: "name" },
    { label: "Department", key: "department" },
    { label: "Experience", key: "experience" },
    { label: "Date", key: "timezone" }
  ]

  const transactionColumns: Column<TransactionFormat>[] = [
    { label: "Type", key: "money_type" },
    { label: "Genre", key: "reason" },
    { label: "Amount", key: "amount" },
    { label: "Date", key: "timezone" }
  ]

  /* ---------------- API CALLS ---------------- */

  const fetchAppointmentData = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/api/dashboard/admin/profile", {
        params: { id: slug, appointmentData: true }
      })
       console.log("appointments data is",res)
      const formatted = res.data.data.map((item: AppointmentFormat) => ({
        ...item,
        timezone: item.timezone.slice(0, 10)
      }))

      setAppointmentData(formatted)
    } catch {
      setMessage("Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactionData = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/api/dashboard/admin/profile", {
        params: { id: slug, transactionData: true }
      })

      const formatted = res.data.data.map((item: TransactionFormat) => ({
        ...item,
        timezone: item.timezone.slice(0, 10)
      }))

      setTransactionData(formatted)
    } catch {
      setMessage("Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- EFFECT ---------------- */

  useEffect(() => {
    fetchAppointmentData()
    fetchTransactionData()
  }, [slug])

  /* ---------------- HELPERS ---------------- */

  const transactionAmount = (data: TransactionFormat[]) =>
    data.reduce((sum, item) => sum + item.amount, 0)

  const routeToAppointment = () => {
    setLocalLoading(true)
    router.push(`/dashboard/admin/appointments/?id=${slug}`)
  }

  /* ---------------- JSX ---------------- */

  return (
    <>
      {testClicked && (
        <Test patientId={slug} setTestClicked={setTestClicked} />
      )}

      <section className="min-h-screen w-full p-1 flex flex-col">
        <ImageLayout img={img}>
          <p className="text-2xl md:text-3xl text-gray-300 text-center">
            Welcome to your personalised platform!
          </p>

          <div className="w-full h-[10vh] px-5 py-2 m-2 text-gray-300 flex gap-2">
            <button
              onClick={routeToAppointment}
              className="w-1/3 bg-blue-900 hover:bg-transparent border border-transparent hover:border-gray-500 transition"
            >
              {localLoading ? "Loading..." : "Appointment"}
            </button>

            {/* ✅ CLEAN STRING PASSED */}
            <Admit slug={slug} />

            <button
              onClick={() => setTestClicked(true)}
              className="w-1/3 bg-blue-900 hover:bg-transparent border border-transparent hover:border-gray-500 transition"
            >
              Test Charges
            </button>
          </div>
        </ImageLayout>

        <ul className="w-full flex-1 mt-2 flex flex-col gap-3">
          {appointmentData.length > 0 ? (
            <>
              <li className="text-lg font-bold">Your Future Appointments</li>
              <Table items={appointmentData} columns={appointmentColumns} />
            </>
          ) : (
            <li className="text-lg font-bold">No Appointments</li>
          )}

          {transactionData.length > 0 ? (
            <>
              <li className="text-lg font-bold flex items-center gap-1">
                Total Transactions: <RiMoneyRupeeCircleLine size={22} />
                {transactionAmount(transactionData)}
              </li>
              <Table items={transactionData} columns={transactionColumns} />
            </>
          ) : (
            <li className="text-lg font-bold">No Transactions</li>
          )}
        </ul>
      </section>
    </>
  )
}

export default PatientProfileFront
