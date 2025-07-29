import React from "react";
import Banner from "../assets/website/banner.jpg";
import FastDelivery from "../assets/website/f4.png";
import OnlineOrder from "../assets/website/f2.png";
import Offers from "../assets/website/f6.png";
import SaleBanner from "../assets/website/sale2.jpg";
import SupportChat from "../components/SupportChat/SupportChat";

export default function About() {
  const userId = localStorage.getItem("user_id");

  return (
    <div className="bg-pink-50 dark:bg-gray-950 min-h-screen">
      {/* Banner Section */}
      <section className="relative w-full h-72 md:h-96 flex items-center justify-center mb-10">
        <img
          src={Banner}
          alt="About Banner"
          className="absolute w-full h-full object-cover rounded-2xl shadow-lg"
          style={{ objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-secondary/70 to-pink-200/60 rounded-2xl" />
        <div className="relative z-10 text-center w-full">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-lg mb-2">
            #About Us
          </h1>
          <p className="text-xl text-white/90 font-semibold">
            Where style meets comfort. Discover your next favorite fit!
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 pb-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto -mt-16 relative z-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Who We Are
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 mb-3">
            Welcome to{" "}
            <span className="font-semibold text-secondary">
              KAIZEN Clothing
            </span>{" "}
            – where style meets comfort! We are dedicated to bringing you
            high-quality apparel for every occasion.
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
            Our focus is on quality and comfort. Each piece is crafted from
            premium materials, ensuring durability and a great feel. We’re
            passionate about fashion, details, and delivering exceptional
            service.
          </p>
          <div className="font-medium text-pink-600 dark:text-pink-300 mb-4">
            <i>
              “KAIZEN Clothing – where you find the perfect fit every time.”
            </i>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-primary text-center mb-8">
          Why Shop With Us?
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <img
              src={FastDelivery}
              alt="Fast Delivery"
              className="w-24 h-24 mb-4"
            />
            <h3 className="text-xl font-semibold mb-2 text-primary">
              Fast Delivery
            </h3>
            <p className="text-gray-500 text-center">
              Quick, reliable delivery right to your doorstep.
            </p>
          </div>
          <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <img
              src={OnlineOrder}
              alt="Online Order"
              className="w-24 h-24 mb-4"
            />
            <h3 className="text-xl font-semibold mb-2 text-primary">
              Online Support
            </h3>
            <p className="text-gray-500 text-center">
              We’re always here to help with your orders or questions.
            </p>
          </div>
          <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <img src={Offers} alt="Amazing Offers" className="w-24 h-24 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-primary">
              Amazing Offers
            </h3>
            <p className="text-gray-500 text-center">
              Enjoy exclusive deals and rewards every time you shop.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Offers */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-tr from-secondary/10 via-primary/10 to-pink-100/30 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
          <div className="flex-1 flex justify-center">
            <img
              src={SaleBanner}
              alt="Upcoming Offers"
              className="w-full max-w-md rounded-2xl shadow-lg animate-fadein"
              loading="lazy"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Upcoming Offers!
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-3">
              Exciting new deals are on the way! Stay tuned for our special
              sales and limited-time offers. Make sure you’ve signed up for our
              newsletter so you never miss a chance to save big.
            </p>
            <div className="font-semibold text-secondary mt-6">
              📢 Watch this space for more updates!
            </div>
          </div>
        </div>
      </section>

      {/* Support Chat Box */}
      <section className="container mx-auto px-4 py-10">
        {userId ? (
          <SupportChat userId={userId} />
        ) : (
          <div className="text-center text-red-400 text-lg font-medium">
            ⚠️ Please log in to chat with support.
          </div>
        )}
      </section>
    </div>
  );
}
