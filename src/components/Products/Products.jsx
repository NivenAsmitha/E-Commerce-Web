import React from "react";
import Img1 from "../../assets/women/women.png";
import Img2 from "../../assets/women/women2.jpg";
import Img3 from "../../assets/women/women3.jpg";
import Img4 from "../../assets/women/women4.jpg";
import { FaStar } from "react-icons/fa6";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Women Ethnic",
    rating: 5.0,
    color: "White",
    colorCode: "#fff",
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img2,
    title: "Women Western",
    rating: 4.5,
    color: "Red",
    colorCode: "#e53e3e",
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    title: "Goggles",
    rating: 4.7,
    color: "Brown",
    colorCode: "#b7791f",
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    title: "Printed T-Shirt",
    rating: 4.4,
    color: "Yellow",
    colorCode: "#ecc94b",
    aosDelay: "600",
  },
  {
    id: 5,
    img: Img2,
    title: "Fashion T-Shirt",
    rating: 4.5,
    color: "Pink",
    colorCode: "#ed64a6",
    aosDelay: "800",
  },
];

const Products = () => {
  return (
    <section className="bg-pink-50 dark:bg-gray-950 py-8 rounded-3xl shadow-inner mx-2 md:mx-8 my-4">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p
            data-aos="fade-up"
            className="text-sm text-primary font-semibold tracking-wide"
          >
            Top Selling Products for You
          </p>
          <h1
            data-aos="fade-up"
            className="text-3xl font-bold text-primary mb-2"
          >
            Products
          </h1>
          <p
            data-aos="fade-up"
            className="text-xs text-gray-400 dark:text-gray-300"
          >
            Discover our latest collection of bestsellers with unbeatable prices
            and quality. Refresh your style today!
          </p>
        </div>
        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center gap-8">
            {/* card section */}
            {ProductsData.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                key={data.id}
                className="w-[240px] space-y-3 bg-white rounded-xl shadow-md p-4 transition-transform duration-200 hover:-translate-y-2 hover:shadow-xl dark:bg-gray-900"
              >
                <img
                  src={data.img}
                  alt={data.title}
                  className="h-[300px] w-[200px] object-cover rounded-md mx-auto"
                />
                <div>
                  <h3 className="font-semibold text-lg text-primary dark:text-white text-center">
                    {data.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-100 mt-1 justify-center">
                    <span
                      className="inline-block w-3 h-3 rounded-full border-2 border-primary"
                      style={{ backgroundColor: data.colorCode }}
                    ></span>
                    {data.color}
                  </div>
                  <div className="flex items-center gap-1 text-sm mt-1 justify-center">
                    <FaStar className="text-yellow-400" />
                    <span className="text-gray-800 dark:text-white">
                      {data.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* view all button */}
          <div className="flex justify-center">
            <button className="text-center mt-10 cursor-pointer bg-gradient-to-r from-primary to-secondary text-white py-2 px-6 rounded-full font-medium shadow hover:scale-105 transition-all duration-200">
              View All Products
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
