"use client";

import React, { useState } from "react";
import CardDataSection from "@/ui/AdminDashboardFront/CardDataSection";
import TransactionSection from "@/ui/AdminDashboardFront/TransactionSection";

const Page = () => {
  const [optionValue, setOptionValue] = useState<string>("month");

  return (
    <section className="w-full p-3 grid grid-cols-1 gap-5 lg:grid-cols-12">
      {/* TOP CARDS */}
      <div className="lg:col-span-12">
        <CardDataSection
          optionValue={optionValue}
          setOptionValue={setOptionValue}
        />
      </div>

      {/* CHARTS */}
      <div className="lg:col-span-12">
        <TransactionSection
          optionValue={optionValue}
          setOptionValue={setOptionValue}
        />
      </div>
    </section>
  );
};

export default Page;
