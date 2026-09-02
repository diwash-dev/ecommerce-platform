import React from "react";
import ItemCart from "./ItemCart";
import { useSelector } from "react-redux";

export const Itemlist = () => {
  const { products } = useSelector((state) => state.Product);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 place-items-center my-8 sm:my-10 md:my-12">
      {products?.map((product) => (
        <ItemCart key={product._id || product.id} {...product} />
      ))}
      
    </div>
  );
};
export default Itemlist;
