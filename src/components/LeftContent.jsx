import React, { useEffect, useState } from "react";

function LeftContent() {
  const [showOrder, setShowOrder] = useState(false);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const handleCartUpdate = () => {
      const savedCart = JSON.parse(localStorage.getItem("cartItem")) || [];
      setCartData(savedCart);
      setShowOrder(savedCart.length > 0);
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

  return (
    <div className="pt-3">
      {!showOrder ? (
        <div className="p-12">
          <img src="/assets/img_noorder.png" alt="order" className="w-64 h-64" />
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
              onClick={() => setShowOrder(true)}
            >
              Add Order
            </button>
            <button className="px-2 ml-4 h-12 rounded-full w-40 font-bold bg-[#FBAF03]/40 text-[#FBAF03]">
              Order Status
            </button>
          </div>
        </div>
      ) : (
        <div className="block w-[486px]">
          <div className="overflow-x-hidden h-full flex flex-col justify-between">
            <table className="w-full text-sm text-left rtl:text-right text-black overflow-scroll">
              <thead className="text-xs text-gray-400 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3">Item</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">Qnt.</th>
                  <th scope="col" className="px-6 py-3">Total($)</th>
                </tr>
              </thead>
              <tbody>
                {cartData.map(({ id, name, price, qnt }) => (
                  <tr
                    key={id}
                    className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-300"
                  >
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {name}
                    </th>
                    <td className="px-6 py-4">{price}.00</td>
                    <td className="px-6 py-4 flex items-center">
                      <button className="bg-yellow-400 rounded-full w-5 h-5 text-white font-bold mx-2">-</button>
                      {qnt}
                      <button className="bg-yellow-400 rounded-full w-5 h-5 text-white font-bold mx-2">+</button>
                    </td>
                    <td className="px-6 py-4">{(price * qnt).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table>
              <tbody>
                <tr className="bg-white">
                  <td className="font-medium text-gray-900 whitespace-nowrap">Sub total</td>
                  <td>{calculateSubTotal().toFixed(2)}</td>
                </tr>
                <tr className="bg-white">
                  <td className="font-medium text-gray-900 whitespace-nowrap">Tax</td>
                  <td>3.00</td>
                </tr>
                <tr className="bg-white">
                  <td className="font-medium text-gray-900 whitespace-nowrap">Order Charge</td>
                  <td>0.00</td>
                </tr>
                <tr className="bg-white">
                  <td className="font-medium text-gray-900 whitespace-nowrap">Amount to Pay</td>
                  <td>{(calculateSubTotal() + 3).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>
                    <button className="bg-red-500 w-full h-12" onClick={handleCancelOrder}>
                      Cancel
                    </button>
                  </td>
                  <td>
                    <button className="bg-yellow-500 w-full h-12">Place Order</button>
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
