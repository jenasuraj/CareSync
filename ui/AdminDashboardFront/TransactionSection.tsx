"use client";

import React from "react";
import { ChartPieLegend } from "@/ui/AdminDashboardFront/ChartPieLegend";
import { ChartBarInteractive } from "./ChartBarInteractive";

interface Props {
  optionValue: string;
  setOptionValue: React.Dispatch<React.SetStateAction<string>>;
}

const TransactionSection = ({ optionValue, setOptionValue }: Props) => {
  return (
    <section className="w-full flex flex-col gap-5">
      <ChartBarInteractive
        optionValue={optionValue}
        setOptionValue={setOptionValue}
      />

      <ChartPieLegend optionValue={optionValue} />
    </section>
  );
};

export default TransactionSection;
