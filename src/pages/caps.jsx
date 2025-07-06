import React from "react";
import CapBanner from "../assets/website/cap2.jpg";

export default function Caps() {
  return (
    <div className="bg-pink-50 dark:bg-gray-950 min-h-screen pb-10">
      {/* Banner with box shadow and rounded corners */}
      <section
        className="relative flex items-center justify-center min-h-[220px] md:min-h-[300px] lg:min-h-[340px] mb-12 overflow-hidden
        bg-gradient-to-tr from-primary/60 via-secondary/40 to-pink-200/70
        shadow-lg rounded-2xl mx-auto w-[98vw] max-w-[1600px]"
      >
        <img
          src={CapBanner}
          alt="Caps Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-secondary/30 to-pink-100/40 blur-2xl opacity-70"></div>
        <div className="container relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow mb-4">
            #Caps
          </h1>
        </div>
      </section>

      {/* Product Section with headline inside */}
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg px-2 sm:px-6 py-10 min-h-[180px] flex flex-col items-center justify-center mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-500 text-center mb-8">
          Our Premium Collection
        </h2>
        <div className="text-center text-gray-400 text-lg">
          No cap products yet.
          <br />
          (Products will appear here when added by admin.)
        </div>
      </div>
    </div>
  );
}
