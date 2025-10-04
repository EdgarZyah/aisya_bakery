import React from "react";
import Button from "./common/button";
import BreadHero from "../assets/bakery-background-hand-drawn-bread-seamless-pattern-motif-wallpaper-bake-shop-backdrop-packaging-food-wrapper-vector.jpg"

const Hero = ({ title, subtitle, ctaText, onCtaClick }) => {
  return (
    <section className="relative overflow-hidden text-center text-[var(--color-background)]">
      <img
        src={BreadHero}
        alt="Hero Background"
        className="w-full h-[400px] object-cover brightness-50"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center p-8">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">{title}</h1>
        <p className="text-lg max-w-xl mb-8 drop-shadow-md">{subtitle}</p>
      </div>
    </section>
  );
};

export default Hero;
