import React from "react";
// If women2.jpg does not exist, use another image or a placeholder
import BannerImg from "../../assets/women/women6.jpg"; // <-- Update this path or file as needed!
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";

const Banner = () => {
  // Check if image exists, fallback to placeholder
  let imageSrc;
  try {
    imageSrc = BannerImg;
  } catch {
    imageSrc = "https://placehold.co/400x350?text=No+Image";
  }

  return (
    <section className="bg-pink-50 dark:bg-gray-950 py-8 rounded-3xl shadow-inner mx-2 md:mx-8 my-4">
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* image section */}
            <div data-aos="zoom-in" className="flex justify-center">
              <img
                src={imageSrc}
                alt="Fashion Sale"
                className="max-w-[400px] h-[480px] w-full mx-auto drop-shadow-[-10px_10px_12px_rgba(0,0,0,0.15)] object-cover rounded-xl bg-white"
                loading="lazy"
              />
            </div>
            {/* text details section */}
            <div className="flex flex-col justify-center gap-6 sm:pt-0">
              <h1
                data-aos="fade-up"
                className="text-3xl sm:text-4xl font-bold text-primary dark:text-white"
              >
                Winter Sale up to 50% Off
              </h1>
              <p
                data-aos="fade-up"
                className="text-base text-gray-700 dark:text-gray-200 tracking-wide leading-relaxed"
              >
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque
                reiciendis inventore iste ratione ex alias quis magni at optio.
              </p>
              <div className="flex flex-col gap-4">
                <div data-aos="fade-up" className="flex items-center gap-4">
                  <GrSecure className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400 text-primary" />
                  <p className="leading-relaxed text-gray-700 dark:text-gray-200 font-medium">
                    Quality Products
                  </p>
                </div>
                <div data-aos="fade-up" className="flex items-center gap-4">
                  <IoFastFood className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-orange-100 dark:bg-orange-400 text-primary" />
                  <p className="leading-relaxed text-gray-700 dark:text-gray-200 font-medium">
                    Fast Delivery
                  </p>
                </div>
                <div data-aos="fade-up" className="flex items-center gap-4">
                  <GiFoodTruck className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-green-100 dark:bg-green-400 text-primary" />
                  <p className="leading-relaxed text-gray-700 dark:text-gray-200 font-medium">
                    Easy Payment method
                  </p>
                </div>
                <div data-aos="fade-up" className="flex items-center gap-4">
                  <GiFoodTruck className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-yellow-100 dark:bg-yellow-400 text-primary" />
                  <p className="leading-relaxed text-gray-700 dark:text-gray-200 font-medium">
                    Get Offers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
