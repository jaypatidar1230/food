import React, { useEffect, useState } from "react";
import axios from "axios";

export const Items = ({ categoryId, itemName, items }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const handleCartUpdate = () => setCart([]); 
    window.addEventListener("cartClear", handleCartUpdate);
    handleCartUpdate(); // Initial load

    return () => {
      window.removeEventListener("cartClear", handleCartUpdate);
    };
  }, []);

  const handleCart = (id, name, price) => {
    const savedCart = JSON.parse(localStorage.getItem("cartItem")) || [];
    const itemIndex = savedCart.findIndex(item => item.id === id);

    let updatedCart;

    if (itemIndex > -1) {
      updatedCart = savedCart.map((item, index) => 
        index === itemIndex ? { ...item, qnt: item.qnt + 1 } : item
      );
    } else {
      updatedCart = [...savedCart, { id, name, price, qnt: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cartItem", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const filteredItems = items.filter(
    ({ categoryId: itemCategoryId, title }) =>
      (itemCategoryId === categoryId || categoryId === 0) &&
      title.toLowerCase().includes(itemName.toLowerCase())
  );

  return (
    <div className="grid grid-cols-4 gap-4 px-3">
      {filteredItems.map(({ id, img, price, title, veg }) => (
        <div
          key={id}
          className="bg-white rounded-xl text-black cursor-pointer"
          onClick={() => handleCart(id, title, price)}
        >
          <img
            src={img}
            alt={title}
            className="rounded-lg h-60 w-60 object-cover"
          />
          <div className="pl-2">
            <p className="font-semibold">{title}</p>
            <div className="flex items-center mb-2">
              <img
                src={veg ? "/assets/ic_veg.png" : "/assets/ic_nonveg.png"}
                alt={title}
                className="h-4 mr-3"
              />
              <p>$ {price}.00</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
