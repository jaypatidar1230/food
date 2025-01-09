import React from "react";

function OrdersStatus() {
  return (
    <div className="p-4">
      <div className="bg-white w-1/5">
        <div className="flex justify-between bg-red-600 text-white font-semibold mb-4 px-4 py-4 ">
          <div>
            <h3>Dine-in</h3>
            <p>AB00121</p>
          </div>
          <div className="text-3xl">08:49</div>
        </div>
        <div>
          <p className="px-2 py-3 font-semibold">1 Chat Masala</p>
          <p className="px-2 py-3 font-semibold">1 Chat Masala</p>
          <p className="px-2 py-3 font-semibold">1 Chat Masala</p>
          <p className="px-2 py-3 font-semibold">1 Chat Masala</p>
          <p className="px-2 py-3 font-semibold">1 Chat Masala</p>
        </div>
      </div>
    </div>
  );
}

export default OrdersStatus;
