"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Table from "@/components/Table"

/* ---------------- TYPES ---------------- */

interface HistoryFormat {
  money_type: string
  reason: string
  amount: number
  date: string
  status?:string
}

interface Column<T> {
  label: string
  key: string
  render?: (row: T, index: number) => React.ReactNode
}

/* ---------------- COMPONENT ---------------- */

const History = () => {
  const [historyData, setHistoryData] = useState<HistoryFormat[]>([])
  const [loading, setLoading] = useState(false)

  const fetchHistoryInformation = async () => {
    try {
      setLoading(true)
      const storedId = localStorage.getItem("userId")

      if (!storedId) return

      const res = await axios.get(
        "/api/dashboard/user/history",
        { params: { userId: storedId } }
      )

      if (res.data.success) {
                const formatted = res.data.data.map((item: HistoryFormat) => {
                const transactionDate = new Date(item.date)
                const today = new Date()

                // normalize time (important, otherwise timezone will screw you)
                transactionDate.setHours(0, 0, 0, 0)
                today.setHours(0, 0, 0, 0)

                return {
                    ...item,
                    date: item.date.slice(0, 10),
                    status: transactionDate > today ? "Pending" : "Completed"
                }
                })
        setHistoryData(formatted)
      }
    } catch (error) {
      console.error("error fetching history for user", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistoryInformation()
  }, [])

  /* ---------------- TABLE COLUMNS ---------------- */

  const historyColumns: Column<HistoryFormat>[] = [
    { label: "Payment Type", key: "money_type" },
    { label: "Reason", key: "reason" },
    { label: "Amount", key: "amount" },
    { label: "Date", key: "date" },
            {
        label: "Status",
        key: "status",
        render: (row) => (
            <span
            className={
                row.status === "Pending"
                ? "bg-red-500 py-1 px-2 rounded-lg text-white text-sm"
                : "bg-green-500 py-1 px-2 rounded-lg text-white text-sm"
            }
            >
            {row.status}
            </span>
        )
        }

  ]

  /* ---------------- JSX ---------------- */

  return (
    <div className="w-full min-h-screen p-4">
      <h1 className="text-xl font-bold mb-3">Transaction History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : historyData.length > 0 ? (
        <Table items={historyData} columns={historyColumns} />
      ) : (
        <p>No history found</p>
      )}
    </div>
  )
}

export default History
