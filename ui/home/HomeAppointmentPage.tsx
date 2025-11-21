
import { doctors } from "@/data/Doctor";
import Image from "next/image";

const HomeAppointmentPage = () => {
  return (
    <>
      <section className="w-full min-h-screen flex flex-col justify-center items-center bg-slate-950 text-white py-16">
        {/* Header */}
        <header className="mb-12 text-center px-4">
          <h1 className="text-blue-400 text-4xl md:text-5xl  leading-tight">
            Meet our Expert Doctors <br />
            Select appointments with the bests<br/>
            Around the planet
          </h1>
        </header>

        {/* Scrolling container */}
        <div className="relative w-2/3 overflow-hidden">
          {/* Scrolling wrapper */}
          <div className="flex animate-scroll gap-8 px-8">
            {[...doctors, ...doctors].map((item, index) => (
              <div
                key={index}
                className="min-w-[220px] sm:min-w-[260px] md:min-w-[300px] 
                h-72 rounded-2xl overflow-hidden relative group shadow-lg"
              >
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0   bg-black/40 group-hover:bg-black/60 transition-all duration-500 flex flex-col justify-end p-4">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-300">{item.genre}</p>
                  <p className="text-xs text-gray-400">{item.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeAppointmentPage;
