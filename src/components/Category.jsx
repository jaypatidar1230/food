import React, { useState } from "react";
import category from "../api/db_category.json";
import Items from "./Items";
import { Icon } from "@iconify/react";

function Category() {
  const [categoryId, setCategoryId] = useState(0);
  const [itemName, setItemName] = useState("");
  const [bgId, setBgId] = useState(0);

  return (
    <>
      <div className="w-auto pt-3 pl-2">
        <ul className=" rounded-xl flex overflow-x-auto">
          {category.map(({ id, img, title }) => {
            return (
              <li
                key={id}
                className={`w-[95px] ${
                  bgId === id ? "bg-yellow-400" : "bg-white"
                } h-[95px] rounded-xl p-2 mx-1 cursor-pointer `}
                onClick={() => {
                  setCategoryId(id);
                  setBgId(id);
                }}
              >
                <div className="h-[75px] w-[75px] flex flex-col justify-center items-center">
                  <img src={img} alt={title} className="h-12" />
                  <p className="w-auto">{title}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <form
          className="my-5"
          onSubmit={(e) => {
            e.preventDefault();
            setItemName(e.target[0].value);
          }}
        >
          <div className="flex">
          <div className="relative w-96">
  <input
    type="search"
    placeholder="Search Items"
    className="w-full border-gray-500 border-2 rounded-xl pl-10 h-10"
  />
  <Icon icon="mdi:magnify" className="absolute left-3 top-2.5 text-gray-500 text-xl" />
</div>

            <button
              type="submit"
              className="bg-yellow-400 w-20 rounded-xl ml-3"
            >
              Search
            </button>
            <button
              type="reset"
              className="bg-red-400 w-20 rounded-xl ml-3"
              onClick={() => setItemName("")}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
      <Items categoryId={categoryId} itemName={itemName} />
    </>
  );
}

export default Category;
