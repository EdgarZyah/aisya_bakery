import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import BreadBanner from "../assets/Bread_and_wheat_on_wooden_background.jpg";
import Loader from "./common/loader";

const API_URL = "http://localhost:5000/api/testimonials";

const truncateString = (str, num) => {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
};

const Testimoni = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length > 3) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials, position]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Gagal memuat testimonial");
      }
      const data = await response.json();
      setTestimonials(data);
    } catch (e) {
      console.error("Fetch Testimonials Error:", e);
      setError("Gagal memuat testimonial. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (position >= testimonials.length) {
      setPosition(0);
    } else {
      setPosition((prevPosition) => prevPosition + 1);
    }
  };

  const handlePrev = () => {
    if (position <= 0) {
      setPosition(testimonials.length - 1);
    } else {
      setPosition((prevPosition) => prevPosition - 1);
    }
  };

  const carouselItems = [...testimonials, ...testimonials];

  return (
    <section className="relative w-full min-h-[500px] -mb-16 overflow-hidden">
      <img
        src={BreadBanner}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-center text-3xl font-semibold mb-12 text-[var(--color-background)]">
          Testimonials
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-48"><Loader /></div>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : testimonials.length > 0 ? (
          <div className="relative flex items-center justify-center">
            {testimonials.length > 3 && (
              <button
                onClick={handlePrev}
                className="absolute left-0 text-white bg-black/50 hover:bg-black/75 text-4xl p-2 rounded-full transition-colors duration-300 z-20"
                aria-label="Previous testimonial"
              >
                <FiChevronLeft />
              </button>
            )}
            <div className="relative w-full overflow-hidden">
              <div
                ref={carouselRef}
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${(position % testimonials.length) * (100 / 3)}%)` }}
              >
                {carouselItems.map((testimonial, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full md:w-1/3 p-4"
                  >
                    <div className="flex flex-col items-center justify-between min-h-[300px] bg-[var(--color-primary)] bg-opacity-70 rounded-lg p-6 shadow-lg text-[var(--color-background)]">
                      <img
                        src={testimonial.avatar ? `http://localhost:5000/${testimonial.avatar}` : "https://via.placeholder.com/100"}
                        alt={testimonial.name}
                        className="rounded-full w-24 h-24 mb-4 object-cover border-2 border-[var(--color-background)]"
                      />
                      <p className="italic text-center">"{truncateString(testimonial.comment, 150)}"</p>
                      <h4 className="font-semibold mt-auto">{testimonial.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {testimonials.length > 3 && (
              <button
                onClick={handleNext}
                className="absolute right-0 text-white bg-black/50 hover:bg-black/75 text-4xl p-2 rounded-full transition-colors duration-300 z-20"
                aria-label="Next testimonial"
              >
                <FiChevronRight />
              </button>
            )}
          </div>
        ) : (
          <p className="text-center text-white">Belum ada testimonial.</p>
        )}
      </div>
    </section>
  );
};

export default Testimoni;