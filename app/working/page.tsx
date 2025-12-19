import React from "react";

const page = () => {
  return (
    <main className="min-h-screen bg-gradient-to-t from-violet-800 to-indigo-700 text-white font-sans relative overflow-hidden">
      <div className="relative z-10 px-6 py-24 md:py-32 lg:py-40">
        {/* Hero */}
        <div className="max-w-5xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl  mb-6 tracking-tight">
            How CareSync Works
          </h1>

          <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto font-light text-white/90">
            CareSync connects patients, doctors, and hospital administrators
            through an AI-powered workflow — reducing manual effort and
            improving care delivery.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/30 my-16 w-3/4 mx-auto" />

        {/* Steps */}
        <div className="max-w-6xl mx-auto space-y-12">
          {[
            {
              step: "01",
              title: "User Onboarding",
              desc:
                "Patients, doctors, and admins sign up with role-based access. Each role gets a tailored dashboard with only what they need.",
            },
            {
              step: "02",
              title: "Appointment & Admission Flow",
              desc:
                "Patients book appointments or get admitted. The system checks doctor availability, room status, and schedules everything intelligently.",
            },
            {
              step: "03",
              title: "AI Assistance Layer",
              desc:
                "AI helps patients with symptom guidance, recommends doctors, and assists admins with operational decisions using real-time data.",
            },
            {
              step: "04",
              title: "Hospital Operations",
              desc:
                "Admins manage staff, rooms, billing, and hospital resources from a centralized dashboard with live insights.",
            },
            {
              step: "05",
              title: "Data, Security & Scaling",
              desc:
                "All data is securely stored, role-protected, and built to scale across multiple hospitals and locations.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-8 items-start border border-black/20 rounded-xl p-10 bg-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-5xl font-bold text-white/30">
                {item.step}
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  {item.title}
                </h2>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-24">
          <div className="inline-flex items-center gap-4 text-white/80">
            <div className="w-20 h-px bg-white/40"></div>
            <span className="text-sm md:text-base font-light tracking-wide">
              SIMPLE FLOW. POWERFUL SYSTEM.
            </span>
            <div className="w-20 h-px bg-white/40"></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
