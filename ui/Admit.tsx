import React from 'react'
import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import axios from 'axios'
import { useAuth } from '@/context/AppContext'

interface RoomFormat {
  date: string,
  id: number,
  p_id: number,
  room_no: number,
  status: string
}

interface ParamValue {
  id?: string | number;
}

interface AdmitProps {
  slug: ParamValue;
}

const Admit = ({ slug }: AdmitProps) => {
  const { setMessage, setLoading } = useAuth()
  const [admitButtonClicked, setAdmitButtonClicked] = useState<boolean>(false)
  const [roomNo, setRoomNo] = useState<number>(0)
  const [roomData, setRoomData] = useState<RoomFormat[]>([])
  const [selectedRoom, setSelectedRoom] = useState<number>(0)
  const [mode, setMode] = useState<string>("online")
  const [amount, setAmount] = useState<number>(1000)
  const [isAdmitted, setIsAdmitted] = useState<boolean>(false)

  // Fetch admission status when component mounts
  useEffect(() => {
    fetchAdmissionStatus()
  }, [slug])

  const fetchAdmissionStatus = async () => {
    try {
      const res = await axios.get("/api/dashboard/admin/admit", {
        params: { id: slug }
      })
      
      if (res.data.success) {
        if (res.data.admitted) {
          // Patient is already admitted
          setRoomNo(res.data.data[0]?.room_no || 0)
          setIsAdmitted(true)
          setRoomData([])
        } else {
          // Patient is not admitted, rooms are available
          setIsAdmitted(false)
          setRoomNo(0)
          // Store available rooms for later use
          const formattedData: RoomFormat[] = res.data.data.map((item: RoomFormat) => ({
            ...item,
            date: item.date ? item.date.slice(0, 10) : ''
          }))
          setRoomData(formattedData)
        }
      }
    } catch (error) {
      console.error("Error fetching admission status:", error)
      setIsAdmitted(false)
      setRoomData([])
    }
  }

  const handleAdmitClick = async () => {
    if (isAdmitted) {
      // Discharge patient
      if (window.confirm(`Discharge patient from room ${roomNo}?`)) {
        await handleDischarge()
      }
    } else {
      // Show modal with available rooms
      // If we don't have room data yet, fetch it
      if (roomData.length === 0) {
        await fetchAdmissionStatus()
      }
      setAdmitButtonClicked(true)
    }
  }

  const handleDischarge = async () => {
    try {
      setLoading(true)
      const response = await axios.delete("/api/dashboard/admin/admit", {
        data: { patientId: slug }
      })

      if (response.data.success) {
        setRoomNo(0)
        setIsAdmitted(false)
        setMessage("Patient discharged successfully")
        await fetchAdmissionStatus() // Refresh to get available rooms
      }
    } catch (error) {
      console.error("Error discharging patient:", error)
      setMessage("Server error during discharge")
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setAdmitButtonClicked(false)
    setSelectedRoom(0)
    setMode("online")
  }

  const handleRoomSelection = (room_no: number) => {
    setSelectedRoom(prev => prev === room_no ? 0 : room_no)
  }

  const handleRoomBook = async () => {
    if (!selectedRoom) {
      setMessage("Please select a room first")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post('/api/dashboard/admin/admit', {
        room_no: selectedRoom,
        p_id: slug,
        mode: mode
      })
      
      if (response.data.success) {
        setMessage("Patient admitted successfully")
        setRoomNo(selectedRoom)
        setIsAdmitted(true)
        closeModal()
        await fetchAdmissionStatus() // Refresh status
      }
    } catch (error: any) {
      console.error("Error booking room:", error)
      
      // Check if it's a duplicate room booking error
      if (error.response?.data?.message?.includes('already admitted')) {
        setMessage("This room is already occupied. Please select another room.")
        // Refresh available rooms
        await fetchAdmissionStatus()
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
        <Modal closeModal={closeModal} heading={'Available Rooms'}>
          {roomData.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-400">No rooms available at the moment.</p>
              <p className="text-sm text-gray-500 mt-2">Please try again later.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-400 text-sm">Select a room:</p>
              </div>
              
              <div className='w-full h-auto flex flex-wrap gap-3 p-4 bg-gray-900 rounded-lg'>
                {roomData.map((item, index) => (
                  <div 
                    onClick={() => handleRoomSelection(item.room_no)} 
                    key={index} 
                    className={`
                      flex items-center justify-center
                      ${item.room_no === selectedRoom 
                        ? 'bg-blue-600 border-2 border-blue-400' 
                        : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'} 
                      w-16 h-16 text-gray-200 hover:cursor-pointer 
                      rounded-lg duration-200 transition-all
                      hover:scale-105 hover:shadow-lg
                    `}
                  >
                    <span className="font-semibold">{item.room_no}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 mb-6">
                <p className="text-gray-400 text-sm mb-3">Select payment method:</p>
                <div className="w-full flex items-center gap-4">
                  <button
                    className={`
                      flex-1 py-3 rounded-lg border-2 transition-all duration-200
                      ${mode === "online" 
                        ? 'bg-green-600 border-green-500 text-white' 
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}
                    `}
                    onClick={() => setMode("online")}
                  >
                    Online Payment
                  </button>
                  <button
                    className={`
                      flex-1 py-3 rounded-lg border-2 transition-all duration-200
                      ${mode === "offline" 
                        ? 'bg-green-600 border-green-500 text-white' 
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}
                    `}
                    onClick={() => setMode("offline")}
                  >
                    Cash Payment
                  </button>
                </div>
              </div>
              
              {selectedRoom > 0 && (
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Room No:</span>
                    <span className="font-bold text-xl text-white">{selectedRoom}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Amount:</span>
                    <span className="font-bold text-xl text-green-400">₹{amount}</span>
                  </div>
                </div>
              )}
              
              <button 
                className={`
                  w-full py-3 rounded-lg font-semibold text-lg
                  transition-all duration-200
                  ${selectedRoom 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-700 cursor-not-allowed text-gray-400'}
                `}
                onClick={handleRoomBook}
                disabled={!selectedRoom}
              >
                {selectedRoom 
                  ? `Confirm Admission - Room ${selectedRoom}`
                  : 'Please select a room'
                }
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Amount: ₹{amount} will be added to transactions
              </p>
            </>
          )}
        </Modal>
      )}
      
      <button 
        onClick={handleAdmitClick}
        className={`
          w-1/3 px-5 py-3 rounded-sm font-medium text-white
          transition-all duration-200 hover:scale-105
          ${isAdmitted 
            ? 'bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900' 
            : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-800 hover:to-blue-900'}
          shadow-lg hover:shadow-xl
        `}
      >
      {isAdmitted ? `Admitted in ${roomNo}` : 'Admit'}
      </button>
    </>
  )
}

export default Admit