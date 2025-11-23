"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  message:string;
  setMessage: React.Dispatch<React.SetStateAction<string>>
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false); // default false
  const [message,setMessage] = useState("")

  return (
    <AuthContext.Provider value={{ loading, setLoading,message,setMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};