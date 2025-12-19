import React from "react";

const page = () => {


  return (
    <main className="min-h-screen bg-gradient-to-t from-violet-700 to-indigo-800 text-white font-sans relative overflow-hidden">
      <div className="relative z-10 px-6 py-24 md:py-32 lg:py-40">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl mb-6 tracking-tight">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed font-light text-white/90">
            Have questions, need a demo, or want to integrate CareSync in your
            hospital? Drop us a message — we respond fast.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/30 my-16 w-3/4 mx-auto" />

        {/* Form */}
        <div className="max-w-3xl mx-auto border border-black/20 rounded-xl p-10 bg-black/10 backdrop-blur-xl">
          <form  className="space-y-6">
            {/* Name */}
            <div>
              <label className="block mb-2 text-sm uppercase tracking-wide text-white/80">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm uppercase tracking-wide text-white/80">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="john@hospital.com"
                className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-white"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block mb-2 text-sm uppercase tracking-wide text-white/80">
                Subject
              </label>
              <input
                type="text"
                placeholder="Hospital onboarding / Demo request"
                className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-white"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block mb-2 text-sm uppercase tracking-wide text-white/80">
                Message
              </label>
              <textarea
                rows={5}
                required
                placeholder="Tell us about your hospital requirements..."
                className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-white resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-md bg-white text-black font-semibold text-lg transition-all hover:bg-gray-200 disabled:opacity-60"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-24">
          <div className="inline-flex items-center gap-4 text-white/80">
            <div className="w-20 h-px bg-white/40"></div>
            <span className="text-sm md:text-base font-light tracking-wide">
              WE BUILD HEALTHCARE INTELLIGENCE
            </span>
            <div className="w-20 h-px bg-white/40"></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
