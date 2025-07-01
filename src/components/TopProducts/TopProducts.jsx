import React from "react";
import Img1 from "../../assets/shirt/shirt.png";
import Img2 from "../../assets/shirt/shirt2.png";
import Img3 from "../../assets/shirt/shirt3.png";
import { FaStar } from "react-icons/fa";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Casual Wear",
    description:
      "Effortless comfort and modern style—perfect for every occasion. Shop the latest casual trends now!",
    rating: 4,
  },
  {
    id: 2,
    img: Img2,
    title: "Printed Shirt",
    description:
      "Bold prints and premium fabrics for stand-out style. Grab yours before they're gone!",
    rating: 4,
  },
  {
    id: 3,
    img: Img3,
    title: "Women Shirt",
    description:
      "Elevate your wardrobe with our best-selling women's shirts—trendy, comfy, and affordable.",
    rating: 4,
  },
];

const TopProducts = ({ handleOrderPopup }) => {
  return (
    <section className="bg-gray-50 dark:bg-gray-950 py-8 rounded-3xl shadow-inner mx-2 md:mx-8 my-4">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-xl mx-auto">
          <p className="text-sm text-primary" data-aos="fade-up">
            Top Rated Products for You
          </p>
          <h1 className="text-3xl font-bold text-primary" data-aos="fade-up">
            Best Products
          </h1>
          <p
            className="text-xs text-gray-400 dark:text-gray-300"
            data-aos="fade-up"
          >
            Discover the highest-rated picks from our newest arrivals. Curated
            for quality and style.
          </p>
        </div>
        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-6 place-items-center">
          {ProductsData.map((data) => (
            <div
              key={data.id}
              data-aos="zoom-in"
              className="group bg-white dark:bg-gray-800 border-2 border-primary rounded-2xl shadow-xl max-w-[340px] w-full pt-8 pb-5 px-6 transition duration-300 transform hover:-translate-y-3 hover:shadow-2xl"
            >
              {/* floating image (no ring, no box) */}
              <div className="flex justify-center">
                <img
                  src={data.img}
                  alt={data.title}
                  className="max-w-[150px] -mt-20 mb-2 drop-shadow-lg transition duration-300 group-hover:scale-110"
                  draggable={false}
                />
              </div>
              {/* Card details */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(4)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                  <FaStar className="text-yellow-300 opacity-60" />
                </div>
                <h1 className="text-xl font-bold mb-1">{data.title}</h1>
                <p className="text-gray-500 dark:text-gray-200 text-sm mb-4">
                  {data.description}
                </p>
                <button
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-full font-medium mt-2 shadow hover:scale-105 transition"
                  onClick={handleOrderPopup}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopProducts;
