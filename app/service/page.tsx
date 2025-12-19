import React from "react";

const page = () => {
  return (
    <main className="min-h-screen bg-gradient-to-t from-violet-800 to-indigo-700 text-white font-sans relative overflow-hidden">
      <div className="relative z-10 px-6 py-24 md:py-32 lg:py-40">
        {/* Hero */}
        <div className="max-w-5xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl  mb-6 tracking-tight">
            Our Services
          </h1>

          <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto font-light text-white/90">
            CareSync delivers end-to-end hospital automation powered by AI —
            designed to reduce chaos, improve care, and scale operations
            intelligently.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/30 my-16 w-3/4 mx-auto" />

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Service Card */}
          {[
            {
              title: "🗓 Appointment Management",
              desc:
                "AI-assisted appointment scheduling that reduces wait times, avoids clashes, and optimizes doctor availability in real time.",
            },
            {
              title: "🏥 Admission & Room Allocation",
              desc:
                "Smart admission handling with live room tracking, discharge flow, and predictive room availability.",
            },
            {
              title: "📁 Digital Medical Records",
              desc:
                "Secure, centralized patient records including prescriptions, diagnosis history, and treatment plans.",
            },
            {
              title: "💳 Billing & Payments",
              desc:
                "Transparent billing with payment tracking, invoices, and admin-level verification for financial accuracy.",
            },
            {
              title: "🤖 AI Health Assistant",
              desc:
                "Conversational AI for symptom guidance, basic triage, appointment suggestions, and FAQs.",
            },
            {
              title: "📊 Analytics & Insights",
              desc:
                "Admin-level analytics on hospital operations, patient flow, revenue trends, and resource utilization.",
            },
          ].map((service, index) => (
            <div
              key={index}
              className="border border-black/20 rounded-xl p-10 bg-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-black/20"
            >
              <h2 className="text-3xl md:text-3xl  mb-6">
                {service.title}
              </h2>
              <p className="text-md md:text-lg text-white/90 leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-24">
          <div className="inline-flex items-center gap-4 text-white/80">
            <div className="w-20 h-px bg-white/40"></div>
            <span className="text-sm md:text-base font-light tracking-wide">
              BUILT FOR MODERN HOSPITALS
            </span>
            <div className="w-20 h-px bg-white/40"></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
