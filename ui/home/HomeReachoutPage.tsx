import React from "react";
import img from "@/public/hospital.jpg";
import Image from "next/image";

const HomeReachoutPage = () => {
  return (
    <>
      <section className="w-full h-screen flex flex-col md:flex-row md:p-10 lg:py-10 lg:px-20">
        {/* Left Section */}
        <div className="bg-blue-600 h-full w-full md:w-1/2 flex justify-center items-center p-6 md:p-10 rounded-none md:rounded-l-4xl">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg p-8 flex flex-col gap-6 border border-white/20">
            <h1 className="text-4xl font-semibold text-white text-center">
              Emergency Message
            </h1>
            <p className="text-white/80 text-center text-sm">
              Fill in your details and our team will get in touch with you soon.
            </p>

            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-white/90 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>


              <div>
                <label className="block text-white/90 mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              <div>
                <label className="block text-white/90 mb-1">Message</label>
                <textarea
                  placeholder="Write your message..."
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/50 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 transition-transform duration-300 text-white py-3 rounded-full font-medium shadow-lg hover:shadow-cyan-400/30"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Right Section (Hidden on small screens) */}
        <div className="hidden md:block relative md:w-1/2 h-full overflow-hidden md:rounded-r-4xl">
          <Image
            src={img}
            alt="hospital image"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </section>
    </>
  );
};

export default HomeReachoutPage;
