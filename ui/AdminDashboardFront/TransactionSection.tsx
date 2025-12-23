"use client";

import React from "react";
import { ChartPieLegend } from "@/ui/AdminDashboardFront/ChartPieLegend";
import { ChartBarInteractive } from "./ChartBarInteractive";
import TopDoctors from "./TopDoctors";
import RecentPatients from "./RecentPatients";


interface Props {
  optionValue: string;
  setOptionValue: React.Dispatch<React.SetStateAction<string>>;
}

const TransactionSection = ({ optionValue, setOptionValue }: Props) => {
  return (
    <section className="w-full flex flex-col gap-5">
      <ChartBarInteractive
        optionValue={optionValue}
        setOptionValue={setOptionValue}/>
      <div className="w-full min-h-[20vh] mt-5 p-1 flex flex-col lg:flex-row gap-5">
      <TopDoctors/> 
      <RecentPatients/>
      </div> 
      <ChartPieLegend optionValue={optionValue} />
    </section>
  );
};

export default TransactionSection;
