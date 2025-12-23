import React, { useEffect, useState } from "react"
import Modal from "@/components/Modal"
import axios from "axios"
import { useAuth } from "@/context/AppContext"

interface RoomFormat {
  date: string
  id: number
  p_id: number
  room_no: number
  status: string
}

interface AdmitProps {
  slug: string | null // normalized patient id ONLY
}

const Admit = ({ slug }: AdmitProps) => {
  const { setMessage, setLoading } = useAuth()

  const [admitButtonClicked, setAdmitButtonClicked] = useState(false)
  const [roomNo, setRoomNo] = useState(0)
  const [roomData, setRoomData] = useState<RoomFormat[]>([])
  const [selectedRoom, setSelectedRoom] = useState(0)
  const [mode, setMode] = useState<"online" | "offline">("online")
  const [amount] = useState(1000)
  const [isAdmitted, setIsAdmitted] = useState(false)
  const [patientId, setPatientId] = useState<string>("")

  // normalize ONCE
  useEffect(() => {
    if (!slug) return
    setPatientId(slug)
    fetchAdmissionStatus(slug)
  }, [slug])

  const fetchAdmissionStatus = async (id: string) => {
    try {
      const res = await axios.get("/api/dashboard/admin/admit", {
        params: { id }
      })

      if (!res.data?.success) return

      if (res.data.admitted) {
        setRoomNo(res.data.data[0]?.room_no || 0)
        setIsAdmitted(true)
        setRoomData([])
      } else {
        setIsAdmitted(false)
        setRoomNo(0)

        const formatted: RoomFormat[] = res.data.data.map((item: RoomFormat) => ({
          ...item,
          date: item.date?.slice(0, 10) || ""
        }))

        setRoomData(formatted)
      }
    } catch (err) {
      console.error(err)
      setIsAdmitted(false)
      setRoomData([])
    }
  }

  const handleAdmitClick = async () => {
    if (isAdmitted) {
      if (window.confirm(`Discharge patient from room ${roomNo}?`)) {
        await handleDischarge()
      }
    } else {
      if (roomData.length === 0) {
        await fetchAdmissionStatus(patientId)
      }
      setAdmitButtonClicked(true)
    }
  }

  const handleDischarge = async () => {
    try {
      setLoading(true)
      const res = await axios.delete("/api/dashboard/admin/admit", {
        data: { patientId }
      })

      if (res.data.success) {
        setRoomNo(0)
        setIsAdmitted(false)
        setMessage("Patient discharged successfully")
        fetchAdmissionStatus(patientId)
      }
    } catch {
      setMessage("Server error during discharge")
    } finally {
      setLoading(false)
    }
  }

  const handleRoomSelection = (roomNo: number) => {
    setSelectedRoom(prev => (prev === roomNo ? 0 : roomNo))
  }

  const closeModal = () => {
    setAdmitButtonClicked(false)
    setSelectedRoom(0)
    setMode("online")
  }

  const handleRoomBook = async () => {
    if (!selectedRoom) {
      setMessage("Please select a room first")
      return
    }

    try {
      setLoading(true)
      const res = await axios.post("/api/dashboard/admin/admit", {
        room_no: selectedRoom,
        p_id: patientId,
        mode
      })

      if (res.data.success) {
        setMessage("Patient admitted successfully")
        setRoomNo(selectedRoom)
        setIsAdmitted(true)
        closeModal()
        fetchAdmissionStatus(patientId)
      }
    } catch (err: any) {
      if (err.response?.data?.message?.includes("already admitted")) {
        setMessage("Room already occupied")
        fetchAdmissionStatus(patientId)
      } else {
        setMessage("Server error during admission")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {admitButtonClicked && (
        <Modal closeModal={closeModal} heading="Available Rooms">
          {roomData.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No rooms available
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3 p-4 bg-gray-900 rounded-lg">
                {roomData.map(room => (
                  <div
                    key={room.id}
                    onClick={() => handleRoomSelection(room.room_no)}
                    className={`w-16 h-16 flex items-center justify-center rounded-lg cursor-pointer
                      ${
                        selectedRoom === room.room_no
                          ? "bg-blue-600 border-2 border-blue-400"
                          : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
                      }`}
                  >
                    {room.room_no}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setMode("online")}
                  className={`flex-1 py-3 rounded ${
                    mode === "online" ? "bg-green-600" : "bg-gray-800"
                  }`}
                >
                  Online
                </button>
                <button
                  onClick={() => setMode("offline")}
                  className={`flex-1 py-3 rounded ${
                    mode === "offline" ? "bg-green-600" : "bg-gray-800"
                  }`}
                >
                  Cash
                </button>
              </div>

              {selectedRoom > 0 && (
                <div className="mt-4 p-4 bg-gray-800 rounded">
                  <div className="flex justify-between">
                    <span>Room</span>
                    <span>{selectedRoom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span>₹{amount}</span>
                  </div>
                </div>
              )}

              <button
                disabled={!selectedRoom}
                onClick={handleRoomBook}
                className={`mt-4 w-full py-3 rounded ${
                  selectedRoom
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-700 cursor-not-allowed"
                }`}
              >
                Confirm Admission
              </button>
            </>
          )}
        </Modal>
      )}

      <button
        onClick={handleAdmitClick}
        className={`px-5 py-3 w-1/3 text-white rounded ${
          isAdmitted ? "bg-red-700" : "bg-blue-800"
        }`}
      >
        {isAdmitted ? `Admitted in ${roomNo}` : "Admit"}
      </button>
    </>
  )
}

export default Admit
