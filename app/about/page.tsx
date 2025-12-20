"use client";

import React from "react";
import { FaUserInjured } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { GiArtificialIntelligence } from "react-icons/gi";

const page = () => {
  return (
    <main className="min-h-screen bg-gradient-to-t from-violet-700 to-indigo-800 text-white font-sans relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 px-6 py-24 md:py-32 lg:py-40">
        {/* Hero */}
        <div className="max-w-5xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl mb-6 tracking-tight">
            CareSync, The AI-Powered Hospital Management System
          </h1>

          <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto font-light text-white/90">
            A smart hospital ecosystem where patients, doctors, and admins
            operate on one intelligent platform. From appointments to
            admissions, billing to AI assistance — everything automated,
            organized, and scalable.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/30 my-16 w-3/4 mx-auto" />

        {/* Dashboards */}
        <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
          {/* Patient Dashboard */}
          <div className="flex-1 border border-black/20 rounded-xl p-10 bg-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2">
            <h2 className="text-3xl md:text-4xl mb-7 flex items-center gap-3">
              <FaUserInjured  className="text-indigo-200 text-4xl" />
              Patient Dashboard
            </h2>

            <ul className="text-lg md:text-xl text-white/90 leading-relaxed space-y-3">
              <li>• Book & manage doctor appointments</li>
              <li>• AI health assistant for symptom analysis</li>
              <li>• View prescriptions & medical history</li>
              <li>• Track admissions, rooms & discharge status</li>
              <li>• Secure payments & billing records</li>
            </ul>
          </div>

          {/* Admin Dashboard */}
          <div className="flex-1 border border-black/20 rounded-xl p-10 bg-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2">
            <h2 className="text-3xl md:text-4xl mb-7 flex items-center gap-3">
              <MdAdminPanelSettings className="text-indigo-200 text-4xl" />
              Admin Dashboard
            </h2>

            <ul className="text-lg md:text-xl text-white/90 leading-relaxed space-y-3">
              <li>• Manage doctors, staff & patients</li>
              <li>• Room allocation & admission control</li>
              <li>• Hospital analytics & reports</li>
              <li>• Payment verification & billing logs</li>
              <li>• AI-driven operational insights</li>
            </ul>
          </div>

          {/* AI Intelligence Layer */}
          <div className="flex-1 border border-black/20 rounded-xl p-10 bg-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2">
            <h2 className="text-3xl md:text-4xl mb-7 flex items-center gap-3">
              <GiArtificialIntelligence className="text-indigo-200 text-4xl" />
              AI Intelligence Layer
            </h2>

            <ul className="text-lg md:text-xl text-white/90 leading-relaxed space-y-3">
              <li>• AI chat assistant for patients</li>
              <li>• Smart appointment recommendations</li>
              <li>• Predictive room & resource allocation</li>
              <li>• LangGraph-powered medical workflows</li>
              <li>• FastAPI + real-time system sync</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-24">
          <div className="inline-flex items-center gap-4 text-white/80">
            <div className="w-20 h-px bg-white/40"></div>
            <span className="text-sm md:text-base font-light tracking-wide">
              SMART • SECURE • AI-DRIVEN HEALTHCARE
            </span>
            <div className="w-20 h-px bg-white/40"></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
