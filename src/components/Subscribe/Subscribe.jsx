import React from "react";
import Banner from "../../assets/website/pink back.jpeg";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const Subscribe = () => {
  return (
    <section data-aos="zoom-in" className="mb-20" style={BannerImg}>
      <div className="container py-10">
        <div className="bg-white/70 dark:bg-gray-900/80 rounded-2xl shadow p-8 w-full mx-auto backdrop-blur-sm">
          <div className="space-y-6 text-center">
            <h1 className="text-2xl sm:text-4xl font-semibold text-primary dark:text-white">
              Get Notified About New Products
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                data-aos="fade-up"
                type="email"
                placeholder="Enter your email"
                className="flex-1 p-3 rounded-full border border-primary/30 focus:outline-primary shadow-sm text-gray-700 dark:bg-gray-800 dark:text-white text-center"
              />
              <button className="bg-gradient-to-r from-primary to-secondary text-white rounded-full px-6 py-3 font-semibold shadow hover:scale-105 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
