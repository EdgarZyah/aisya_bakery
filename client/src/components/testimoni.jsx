import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import BreadBanner from "../assets/Bread_and_wheat_on_wooden_background.jpg";
import Loader from "./common/loader";
import axiosClient, { BASE_URL_IMAGES } from "../api/axiosClient";

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
  const [currentIndex, setCurrentIndex] = useState(0); // Use index instead of position
  const carouselRef = useRef(null);
  const [itemsToShow, setItemsToShow] = useState(3); // Default to 3 for desktop

  // Check window size on mount and resize
  useEffect(() => {
    const checkSize = () => {
      // Tailwind's 'md' breakpoint is 768px
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else {
        setItemsToShow(3);
      }
    };
    checkSize(); // Check initially
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize); // Cleanup listener
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Autoplay effect
  useEffect(() => {
    // Only autoplay if there are more items than shown
    if (testimonials.length > itemsToShow) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials, currentIndex, itemsToShow]); // Re-run if itemsToShow changes

  const fetchTestimonials = async () => {
    // ... (fetch logic remains the same) ...
     try {
       const response = await axiosClient.get("/testimonials");
       setTestimonials(response.data);
       setError(null);
     } catch (e) {
       console.error("Fetch Testimonials Error:", e);
       setError("Gagal memuat testimonial. Silakan coba lagi nanti.");
     } finally {
       setLoading(false);
     }
  };

  const totalItems = testimonials.length;
  const canScroll = totalItems > itemsToShow; // Check if scrolling is possible

  const handleNext = () => {
    if (!canScroll) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  const handlePrev = () => {
     if (!canScroll) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };

  // Duplicate items only if needed for smooth looping (especially for 3 items)
  // No need to duplicate if showing only 1 item and totalItems > 1
   const displayItems = canScroll ? [...testimonials, ...testimonials] : testimonials;
   // Adjust the transform calculation based on itemsToShow
   const translateXValue = canScroll ? `-${(currentIndex % totalItems) * (100 / itemsToShow)}%` : '0%';


  return (
    <section className="relative w-full min-h-[500px] overflow-hidden"> {/* Remove -mb-16 if not needed */}
      <img
        src={BreadBanner}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20"> {/* Adjusted padding */}
        <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-8 sm:mb-12 text-[var(--color-background)]">
          Testimonials
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-48"><Loader /></div>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : testimonials.length > 0 ? (
          <div className="relative flex items-center justify-center">
             {/* Show buttons only if scrolling is possible */}
            {canScroll && (
              <button
                onClick={handlePrev}
                className="absolute left-0 sm:left-2 md:left-4 text-white bg-black/30 hover:bg-black/60 text-3xl sm:text-4xl p-2 rounded-full transition-colors duration-300 z-20"
                aria-label="Previous testimonial"
              >
                <FiChevronLeft />
              </button>
            )}
            <div className="relative w-full overflow-hidden">
              <div
                ref={carouselRef}
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(${translateXValue})` }} // Updated transform calculation
              >
                {/* Adjust item width based on itemsToShow */}
                {displayItems.map((testimonial, index) => (
                  <div
                    key={`${testimonial.id}-${index}`} // Use a more unique key if duplicating
                    className={`flex-shrink-0 w-full ${itemsToShow === 3 ? 'md:w-1/3' : 'md:w-full'} p-2 sm:p-4`} // w-full for mobile, md:w-1/3 for desktop (if itemsToShow is 3)
                  >
                    {/* Card styling remains the same */}
                    <div className="flex flex-col items-center justify-between h-[350px] sm:h-[300px] bg-[var(--color-primary)] bg-opacity-70 rounded-lg p-4 sm:p-6 shadow-lg text-[var(--color-background)] overflow-hidden"> {/* Fixed height, adjusted padding */}
                      <img
                        src={testimonial.avatar ? `${BASE_URL_IMAGES}/${testimonial.avatar}` : "https://via.placeholder.com/100"}
                        alt={testimonial.name}
                        className="rounded-full w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 object-cover border-2 border-[var(--color-background)]" // Slightly smaller avatar on mobile
                      />
                      <p className="italic text-center text-sm sm:text-base flex-grow overflow-y-auto mb-2 sm:mb-4"> {/* Allow text scrolling if needed */}
                         "{truncateString(testimonial.comment, 150)}"
                       </p>
                      <h4 className="font-semibold mt-auto text-sm sm:text-base">{testimonial.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
             {/* Show buttons only if scrolling is possible */}
            {canScroll && (
              <button
                onClick={handleNext}
                className="absolute right-0 sm:right-2 md:right-4 text-white bg-black/30 hover:bg-black/60 text-3xl sm:text-4xl p-2 rounded-full transition-colors duration-300 z-20"
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