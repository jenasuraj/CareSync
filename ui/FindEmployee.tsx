"use client";

import React, { useEffect, useRef } from "react";
import { Employee } from "@/types/Employee";

interface ShowEmployeeProps {
  currentPage: string;
  items: Employee[]; // Employees passed from parent
  setItems: React.Dispatch<React.SetStateAction<Employee[]>>;
}

const FindEmployee = ({ currentPage, items, setItems }: ShowEmployeeProps) => {
  // Use ref to store the original full data permanently
  const originalItemsRef = useRef<Employee[]>([]);

  // Load original data into ref only once
  useEffect(() => {
    if (originalItemsRef.current.length === 0 && items.length > 0) {
      originalItemsRef.current = items;
    }
  }, [items]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.toLowerCase();
    if (search === "") {
      setItems(originalItemsRef.current);
    } else {
      const filtered = originalItemsRef.current.filter((emp) =>
        emp.name.toLowerCase().includes(search)
      );
      setItems(filtered);
    }
  };

  return (
    <form className="w-full h-[7vh] flex items-center gap-3 rounded-md">
      <input
        type="text"
        placeholder={`Search ${currentPage} by name`}
        className="flex-1 border border-gray-300 shadow-sm rounded-md py-2 px-1 h-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
      />
    </form>
  );
};

export default FindEmployee;
