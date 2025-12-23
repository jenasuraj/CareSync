"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  message:string;
  setMessage: React.Dispatch<React.SetStateAction<string>>
  loadingText: boolean;
  setLoadingText:React.Dispatch<React.SetStateAction<boolean>>
  sidebarOpen:boolean,
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false); // default false
  const [message,setMessage] = useState("")
  const [loadingText,setLoadingText] = useState<boolean>(false)
  const [sidebarOpen,setSidebarOpen] = useState<boolean>(false)

  return (
    <AuthContext.Provider value={{ loading, setLoading,message,setMessage,setLoadingText,loadingText,sidebarOpen,setSidebarOpen }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};