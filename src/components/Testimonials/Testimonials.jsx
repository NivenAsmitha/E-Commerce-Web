import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestimonialData = [
  {
    id: 1,
    name: "Victor",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Satya Nadella",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Virat Kohli",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://picsum.photos/104/104",
  },
  {
    id: 5,
    name: "Sachin Tendulkar",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://picsum.photos/103/103",
  },
];

const settings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3200,
  cssEase: "linear",
  pauseOnHover: false,
  pauseOnFocus: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const Testimonials = () => (
  <section className="py-14 mb-10 bg-pink-50 dark:bg-gray-950 rounded-3xl shadow-inner mx-2 md:mx-8">
    <div className="container">
      {/* header section */}
      <div className="text-center mb-12 max-w-[600px] mx-auto">
        <p data-aos="fade-up" className="text-sm text-primary">
          What our customers are saying
        </p>
        <h1 data-aos="fade-up" className="text-3xl font-bold text-primary mb-2">
          Testimonials
        </h1>
        <p
          data-aos="fade-up"
          className="text-xs text-gray-400 dark:text-gray-300"
        >
          Hear what our happy customers have to say about our products and
          service!
        </p>
      </div>
      {/* Testimonial cards */}
      <div data-aos="zoom-in">
        <Slider {...settings}>
          {TestimonialData.map((data) => (
            <div className="my-6" key={data.id}>
              <div className="relative flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl dark:bg-gray-800 bg-white border-2 border-primary/30">
                <span className="absolute text-pink-200 dark:text-pink-300 text-[7rem] -top-6 left-6 select-none font-serif opacity-30 pointer-events-none">
                  “
                </span>
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={data.img}
                    alt={data.name}
                    className="rounded-full w-20 h-20 object-cover border-4 border-pink-100 shadow"
                  />
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed text-center px-1">
                    {data.text}
                  </p>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
                    {data.name}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  </section>
);

export default Testimonials;
