import React, { useState } from "react";
import Button from "../components/common/button";

const ProductPage = () => {
  const product = {
    name: "Roti Tawar Gandum",
    price: 27000,
    imageUrl: "https://media.istockphoto.com/id/1163707527/photo/breads-assortment-background.jpg?s=612x612&w=0&k=20&c=5sOEI3D3ltan_Cs4RRE3O64z_WAdaaiELV_dDov6k3k=",
    isPreorder: false,
    description:
      "Roti tawar gandum sehat dan lezat, cocok untuk sarapan dan snack sehari-hari.",
    type: "Roti Tawar",
    images: [
      "https://media.istockphoto.com/id/1163707527/photo/breads-assortment-background.jpg?s=612x612&w=0&k=20&c=5sOEI3D3ltan_Cs4RRE3O64z_WAdaaiELV_dDov6k3k=",
    ]
  };

  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.imageUrl);

  const handleQuantityChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    setQuantity(val);
  };

  const handleAddToCart = () => {
    alert(
      `Ditambahkan ${quantity} item ${product.name}, total Rp${(
        product.price * quantity
      ).toLocaleString("id-ID")}`
    );
  };

  return (
    <main className="max-w-5xl mx-auto p-8 min-h-screen rounded-lg">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Kiri: gambar utama dan thumbnail */}
        <div className="flex flex-col items-center w-full md:w-[55%]">
          <div className="w-full">
            <img
              src={mainImage}
              alt={product.name}
              className="rounded-lg w-full object-cover"
              style={{ maxHeight: "400px" }}
            />
          </div>
          <div className="flex mt-4 space-x-3">
            {product.images.map((thumb, idx) => (
              <img
                key={idx}
                src={thumb}
                alt={`Thumbnail ${idx + 1}`}
                className={`cursor-pointer rounded border ${
                  mainImage === thumb
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                style={{ width: "64px", height: "64px" }}
                onClick={() => setMainImage(thumb)}
              />
            ))}
          </div>
        </div>

        {/* Kanan: info produk dan checkout */}
        <div className="w-full md:w-[45%] flex flex-col justify-start">
          {product.isPreorder && (
            <span className="inline-block bg-pink-100 text-pink-800 px-3 py-1 rounded text-xs font-semibold mb-2">
              Preorder
            </span>
          )}

          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="text-xl font-semibold text-gray-900 mb-4">
            Rp{product.price.toLocaleString("id-ID")},00
          </div>

          <p className="mb-6">{product.description}</p>

          <div className="flex items-center gap-2 my-1 max-w-xs">
            <label htmlFor="quantity" className="font-medium">
              Jumlah:
            </label>
            <input
              type="number"
              id="quantity"
              min={1}
              value={quantity}
              onChange={handleQuantityChange}
              className="border p-2 rounded w-20"
            />
            <Button onClick={handleAddToCart} className="px-8 py-2">
              Add to cart
            </Button>
          </div>

          <div className="mt-8">
            <div className="font-semibold mb-2">Product Information</div>
            <div className="mb-1 flex">
              <span className="text-gray-600 w-32">Type</span>
              <span className="ml-2 font-medium">{product.type}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
