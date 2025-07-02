import React from "react";
import footerLogo from "../../assets/logo.png";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";

const ExploreLinks = [
  { title: "Home", link: "/#" },
  { title: "About", link: "/#about" },
  { title: "Shop", link: "/#shop" },
  { title: "Blog", link: "/#blog" },
];

const HelpLinks = [
  { title: "Contact", link: "/#contact" },
  { title: "FAQ", link: "/#faq" },
  { title: "Shipping", link: "/#shipping" },
  { title: "Returns", link: "/#returns" },
];

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-pink-100 dark:border-gray-900 pt-10 shadow-2xl shadow-pink-100/40 dark:shadow-gray-900/60 rounded-t-3xl">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between gap-10">
          {/* Brand & description */}
          <div className="md:w-1/4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src={footerLogo}
                alt="KAIZEN Logo"
                className="w-12 h-12 rounded-2xl shadow"
              />
              <span className="font-bold text-2xl text-primary">KAIZEN</span>
            </div>
            <p className="text-gray-500 dark:text-gray-300">
              KAIZEN is your destination for top trends and unbeatable value.
              Shop the latest with confidence.
            </p>
            {/* Socials */}
            <div className="flex gap-3 mt-2">
              <a href="#" aria-label="Instagram">
                <FaInstagram className="text-2xl hover:text-primary transition" />
              </a>
              <a href="#" aria-label="Facebook">
                <FaFacebook className="text-2xl hover:text-primary transition" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedin className="text-2xl hover:text-primary transition" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:w-2/4 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-primary mb-3">Explore</h3>
              <ul className="flex flex-col gap-2">
                {ExploreLinks.map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.link}
                      className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary mb-3">Help</h3>
              <ul className="flex flex-col gap-2">
                {HelpLinks.map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.link}
                      className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div className="md:w-1/4 flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-bold text-primary mb-3">
                Newsletter
              </h3>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-full border border-primary/30 focus:outline-primary bg-gray-100 dark:bg-gray-900 text-sm"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full font-semibold hover:scale-105 transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
            {/* Contact */}
            <div className="flex flex-col gap-2 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <FaLocationArrow />
                <span>Noida, Uttar Pradesh</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMobileAlt />
                <span>+91 123456789</span>
              </div>
            </div>
            {/* Payment Methods */}
            <div className="flex gap-3 mt-2 text-gray-400">
              <FaCcVisa className="text-3xl" title="Visa" />
              <FaCcMastercard className="text-3xl" title="Mastercard" />
              <FaCcPaypal className="text-3xl" title="Paypal" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 my-6"></div>
        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm pb-5">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-bold text-primary">KAIZEN</span>. All Rights
          Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
