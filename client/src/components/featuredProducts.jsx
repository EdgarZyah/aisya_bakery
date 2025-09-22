import React from "react";
import ProductCard from "./productCard";

const featuredProducts = [
  {
    id: 1,
    name: "Roti Tawar Spesial",
    description: "Roti tawar lembut dan segar",
    price: 35000,
    image: "https://via.placeholder.com/300x180?text=Roti+Tawar",
  },
  {
    id: 2,
    name: "Donat Coklat",
    description: "Donat dengan topping coklat",
    price: 25000,
    image: "https://via.placeholder.com/300x180?text=Donat+Coklat",
  },
  {
    id: 3,
    name: "Kue Keju",
    description: "Kue keju lezat untuk cemilan",
    price: 40000,
    image: "https://via.placeholder.com/300x180?text=Kue+Keju",
  },
  {
    id: 4,
    name: "Brownies Kukus",
    description: "Brownies kukus legit dan lembut",
    price: 30000,
    image: "https://via.placeholder.com/300x180?text=Brownies+Kukus",
  },
  {
    id: 5,
    name: "Roti Coklat",
    description: "Roti pilihan rasa coklat",
    price: 28000,
    image: "https://via.placeholder.com/300x180?text=Roti+Coklat",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="max-w-5xl mx-auto mt-12 px-4 flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center auto-cols-max">
        {featuredProducts.slice(0, 3).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
