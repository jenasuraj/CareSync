import homeImg from "@/public/home-img.jpg";
import Image from "next/image";
import Link from "next/link";
import React from 'react'


const HomePage = () => {   

return (
<>
      <section className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden">
        <Image
          src={homeImg}
          alt="Home image"
          fill
          priority
          className="object-cover absolute inset-0"
        />
        <header className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-10 gap-6 md:gap-8">
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl  leading-tight ">
            Your health is in <br /> Good hands
          </h1>

          <p className="text-md sm:text-base md:text-lg text-gray-300 max-w-3xl">
            Welcome to our Hospital Management System — a modern platform
            designed to simplify healthcare operations. Manage patients, doctors,
            appointments, and payments seamlessly in one secure dashboard.
            Empowering hospitals with efficiency, accuracy, and better patient care
            through technology.
          </p>

          <Link
            href="/login"
            className="mt-4 py-3 px-8 sm:px-10 border border-gray-300 rounded-full 
            text-white bg-white/20 backdrop-blur-md "
          >
            Access to Dashboard
          </Link>
        </header>
      </section>
</>
  )
}

export default HomePage
