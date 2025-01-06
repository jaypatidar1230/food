import React from "react";
import category from "../api/db_category.json";

function Category() {
  return (
    <div className="w-auto pt-3 pl-2">
      <ul className=" rounded-xl flex">
        {category.map(({ id, img, title }) => {
          return (
            <li
              key={id}
              className="w-[95px] bg-gray-500 h-[95px] rounded-xl p-2 mx-1"
            >
              <div className="h-[75px] w-[75px] flex flex-col justify-center items-center">
                <img src={img} alt={title} className="h-12" />
                <p className="w-auto">{title}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <form className="my-5">
        <div className="flex">
          <input type="search" placeholder="Search Items" className="w-96 border-gray-500 border-2 rounded-xl pl-3 h-10"/>
            <button type="button" className="bg-yellow-400 w-20 rounded-xl ml-3">Search</button>
        </div>
      </form>
    </div>
  );
}

export default Category;
