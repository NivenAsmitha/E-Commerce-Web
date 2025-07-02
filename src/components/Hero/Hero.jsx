import React from "react";
import Image1 from "../../assets/hero/women.png";
import Image2 from "../../assets/hero/shopping.png";
import Image3 from "../../assets/hero/sale.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Upto 50% Off on All Men's Wear",
    description:
      "Discover top brands and the latest styles for every occasion. Shop smart, save more on men's fashion today.",
  },
  {
    id: 2,
    img: Image2,
    title: "30% Off on All Women's Wear",
    description:
      "Update your wardrobe with trending looks at amazing prices. Fashion-forward styles, limited-time offer.",
  },
  {
    id: 3,
    img: Image3,
    title: "70% Off Storewide Sale",
    description:
      "Massive discounts on our best-selling products. Hurry, shop your favorites before they're gone!",
  },
];

const Hero = ({ handleOrderPopup }) => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gradient-to-tr from-primary/60 via-secondary/50 to-pink-300/50 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200">
      {/* Big vibrant gradient circles / blobs */}
      <div className="absolute -top-32 -left-40 w-[380px] h-[380px] bg-gradient-to-br from-primary via-fuchsia-400 to-pink-300 opacity-60 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-[-120px] right-[-140px] w-[340px] h-[340px] bg-gradient-to-tl from-secondary via-purple-300 to-yellow-200 opacity-70 rounded-full blur-2xl animate-pulse z-0" />
      {/* Decorative gradient stripe */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[95vw] h-[90px] bg-gradient-to-r from-pink-300 via-primary to-fuchsia-400 opacity-70 blur-lg z-0"></div>

      <div className="container pb-8 sm:pb-0 relative z-10">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* Text content */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-black via-gray-700 to-gray-900 bg-clip-text text-transparent drop-shadow">
                    {data.title}
                  </h1>
                  <p className="text-base text-gray-800 dark:text-gray-200">
                    {data.description}
                  </p>
                  <div>
                    <button
                      onClick={handleOrderPopup}
                      className="bg-gradient-to-r from-pink-400 via-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-7 rounded-full font-semibold shadow-lg shadow-pink-100/40"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
                {/* Image section */}
                <div className="order-1 sm:order-2 flex justify-center items-center">
                  <img
                    src={data.img}
                    alt={data.title}
                    className="w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] object-contain drop-shadow-2xl rounded-3xl bg-white/30 p-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
