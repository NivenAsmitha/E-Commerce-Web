import React from "react";
import WomenBanner from "../assets/website/womenbanner.jpg"; // Update with your actual image path

export default function Womenwear() {
  return (
    <div className="bg-pink-50 dark:bg-gray-950 min-h-screen pb-10">
      {/* Banner */}
      <section className="relative flex items-center justify-center min-h-[220px] md:min-h-[300px] lg:min-h-[340px] bg-gradient-to-tr from-pink-200 via-secondary/40 to-primary/60 mb-12 overflow-hidden shadow-lg rounded-2xl mx-auto w-[98vw] max-w-[1600px]">
        <img
          src={WomenBanner}
          alt="Womenwear Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/30 via-pink-100/40 to-primary/40 blur-2xl opacity-70"></div>
        <div className="container relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow mb-4">
            #Women’s Wear
          </h1>
        </div>
      </section>

      {/* Products Section */}
      <section className="container px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-500 text-center mb-10">
          Fashion for Every Occasion
        </h2>

        {/* Placeholder or product list */}
        <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg px-2 sm:px-6 py-10 min-h-[180px] flex flex-col items-center justify-center mx-auto">
          <div className="text-center text-gray-400 text-lg">
            No women’s wear products yet.
            <br />
            (Products will appear here when added by admin.)
          </div>
        </div>
      </section>
    </div>
  );
}
