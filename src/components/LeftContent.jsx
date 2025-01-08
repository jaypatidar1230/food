import React, { useEffect, useState } from "react";
import axios from "axios";

function LeftContent() {
  const [showOrder, setShowOrder] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [orderData, setOrderData] = useState({
    name: "",
    type: "",
    payment: "",
  });

  useEffect(() => {
    const handleCartUpdate = () => {
      const savedCart = JSON.parse(localStorage.getItem("cartItem")) || [];
      setCartData(savedCart);
      setShowOrder(savedCart.length > 0);
      setShowPay(false); // Reset payment view whenever the cart is updated
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    handleCartUpdate();

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const handleCancelOrder = () => {
    setShowOrder(false);
    setCartData([]);
    localStorage.removeItem("cartItem");
    window.dispatchEvent(new Event("cartClear"));
  };

  const calculateSubTotal = () =>
    cartData.reduce((sum, item) => sum + item.price * item.qnt, 0);

  const handleIncrement = (id) => {
    const updatedCart = cartData.map((item) =>
      item.id === id ? { ...item, qnt: item.qnt + 1 } : item
    );
    setCartData(updatedCart);
    localStorage.setItem("cartItem", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleDecrement = (id) => {
    const updatedCart = cartData
      .map((item) => (item.id === id ? { ...item, qnt: item.qnt - 1 } : item))
      .filter((item) => item.qnt > 0); // Remove items with quantity 0

    setCartData(updatedCart);
    localStorage.setItem("cartItem", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleSubmit = async () => {
    // Calculate total items and total amount
    const totalItems = cartData.reduce((sum, item) => sum + item.qnt, 0);
    const totalAmount = calculateSubTotal() + 3;
    const createdAt = new Date().toLocaleString();
  
    // Add totalItems and totalAmount to orderData
    const updatedOrderData = {
      ...orderData,
      createdAt,
      totalItems,
      totalAmount: totalAmount.toFixed(2),
    };
  
    console.log(updatedOrderData);
  
    try {
      const res = await axios.post(
        "https://677263d3ee76b92dd4921ff8.mockapi.io/Transaction",
        updatedOrderData
      );
      console.log("Data submitted successfully:", res.data);
      handleCancelOrder(); // Clear cart after submitting the order
    } catch (error) {
      console.error("There was an error submitting the data:", error);
    }
  };
  

  return (
    <div className="pt-3">
      {!showOrder ? (
        <div className="p-12">
          <img
            src="/assets/img_noorder.png"
            alt="order"
            className="w-64 h-64"
          />
          <div className="text-2xl font-bold pb-4">
            <h2>You've no</h2>
            <h2>order in process from</h2>
            <h2>Counter Desk.</h2>
          </div>
          <h3 className="w-72 text-gray-500 text-base">
            Click on any item or Add Order Button to create order
          </h3>
          <div className="pt-12">
            <button
              className="px-2 h-12 rounded-full w-40 font-bold bg-yellow-500 text-white"
              onClick={() => {
                if (cartData.length > 0) {
                  setShowOrder(true);
                }
              }}
            >
              Add Order
            </button>
            <button className="px-2 ml-4 h-12 rounded-full w-40 font-bold bg-[#FBAF03]/40 text-[#FBAF03]">
              Order Status
            </button>
          </div>
        </div>
      ) : showPay ? (
        cartData.length > 0 && (
          <div className="px-4 py-3">
            <h3 className="pt-4 pb-3 mb-4 text-lg font-semibold">
              Amount to Pay{" "}
              <span className="font-bold text-indigo-700">
                ${(calculateSubTotal() + 3).toFixed(2)}
              </span>
            </h3>
            <label
              className="pb-3 font-semibold text-gray-600/70"
              htmlFor="paymentMethod"
            >
              Select Payment Method
            </label>
            <div className="pt-3 pb-2 mb-6">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                id="cash"
                className="mr-2"
                onChange={() => setOrderData({ ...orderData, payment: "Cash" })}
              />
              <label className="font-semibold" htmlFor="cash">
                Cash
              </label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                id="card"
                className="mr-2 ml-7"
                onChange={() => setOrderData({ ...orderData, payment: "Card" })}
              />
              <label className="font-semibold" htmlFor="card">
                Card
              </label>
            </div>
            <label
              className="pb-3 font-semibold text-gray-600/70"
              htmlFor="orderType"
            >
              Order type
            </label>
            <div className="pt-3 pb-2 mb-6">
              <input
                type="radio"
                name="orderType"
                value="Takeaway"
                id="Takeaway"
                className="mr-2"
                onChange={() =>
                  setOrderData({ ...orderData, type: "Takeaway" })
                }
              />
              <label className="font-semibold" htmlFor="Takeaway">
                Takeaway
              </label>
              <input
                type="radio"
                name="orderType"
                value="Dine-in"
                id="Dine-in"
                className="mr-2 ml-7"
                onChange={() => setOrderData({ ...orderData, type: "Dine-in" })}
              />
              <label className="font-semibold" htmlFor="Dine-in">
                Dine-in
              </label>
              <select className="mr-2 ml-7 font-semibold">
                <option>Select Table</option>
                <option>Table No 01</option>
                <option>Table No 02</option>
                <option>Table No 03</option>
                <option>Table No 04</option>
                <option>Table No 05</option>
                <option>Table No 06</option>
                <option>Table No 07</option>
                <option>Table No 08</option>
                <option>Table No 09</option>
                <option>Table No 10</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label
                className="pb-3 font-semibold text-gray-600/70"
                htmlFor="name"
              >
                Customer Info (Optional)
              </label>
              <input
                className="rounded-full my-3 bg-slate-200 h-10 pl-5 "
                placeholder="Enter Your Name"
                type="text"
                onChange={(e) =>
                  setOrderData({ ...orderData, name: e.target.value })
                }
              />
              <input
                className="rounded-full my-3 bg-slate-200 h-10 pl-5 "
                placeholder="Enter Your Number"
                type="number"
                min={0}
              />
            </div>
            <button
              className="bg-[#EF1010] w-1/2 h-12 mt-12"
              onClick={() => setShowPay(false)}
            >
              <span className="font-bold text-white">Cancel</span>
            </button>
            <button className="bg-[#fbaf03] w-1/2 h-12 " onClick={handleSubmit}>
              <span className="font-bold text-white">Submit</span>
            </button>
          </div>
        )
      ) : (
        <div className="block w-[486px]">
          <div className="overflow-x-hidden h-full flex flex-col justify-between">
            <table className="w-full text-sm text-left rtl:text-right text-black overflow-scroll">
              <thead className="text-xs text-gray-400 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Qnt.
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total($)
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartData.map(({ id, name, price, qnt }) => (
                  <tr
                    key={id}
                    className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-300"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {name}
                    </th>
                    <td className="px-6 py-4">{price}.00</td>
                    <td className="px-6 py-4 flex items-center">
                      <button
                        className="bg-yellow-400 rounded-full w-5 h-5 text-white font-bold mx-2"
                        onClick={() => handleDecrement(id)}
                      >
                        -
                      </button>
                      {qnt}
                      <button
                        className="bg-yellow-400 rounded-full w-5 h-5 text-white font-bold mx-2"
                        onClick={() => handleIncrement(id)}
                      >
                        +
                      </button>
                    </td>
                    <td className="px-6 py-4">{(price * qnt).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table>
              <tbody>
                <tr className="bg-white">
                  <td className="font-medium text-gray-900 whitespace-nowrap">
                    Sub total
                  </td>
                  <td>{calculateSubTotal().toFixed(2)}</td>
                </tr>
                <tr className="bg-white">
                  <td className="font-medium text-gray-900 whitespace-nowrap">
                    Tax
                  </td>
                  <td>3.00</td>
                </tr>
                <tr className="bg-white">
                  <td className="font-medium text-gray-900 whitespace-nowrap">
                    Order Charge
                  </td>
                  <td>0.00</td>
                </tr>
                <tr className="bg-white">
                  <td className="font-medium text-gray-900 whitespace-nowrap">
                    Amount to Pay
                  </td>
                  <td>{(calculateSubTotal() + 3).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>
                    <button
                      className="bg-red-500 w-full h-12"
                      onClick={handleCancelOrder}
                    >
                      Cancel
                    </button>
                  </td>
                  <td>
                    <button
                      className="bg-yellow-500 w-full h-12"
                      onClick={() => {
                        if (cartData.length > 0) {
                          setShowPay(true);
                        }
                      }}
                    >
                      Place Order
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeftContent;
