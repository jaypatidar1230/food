import React from "react";
import item from "../api/db_items.json";

function Items({ categoryId, itemName }) {
  return (
    <div className="grid grid-cols-4 gap-4 pl-3">
      {item
        .filter(
          (item) =>
            (item.categoryId === categoryId || categoryId == 0) &&
            item.title.toLowerCase().includes(itemName.toLowerCase())
        )
        .map(({ id, img, price, title, veg }) => {
          return (
            <div
              key={id}
              className="bg-gray-500 rounded-xl text-white cursor-pointer"
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
                  <p>$ {price + ".00"}</p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Items;
