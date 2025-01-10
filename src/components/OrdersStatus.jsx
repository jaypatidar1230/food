import React, { useCallback, useEffect, useState } from "react";
import Timer from "./Timer";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";

function OrdersStatus() {
  const [bgColor, setBgColor] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({});

  // Load initial data from localStorage on mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("orderData")) || [];
    const savedTimers = JSON.parse(localStorage.getItem("timers")) || {};

    setData(savedData);
    setTimers(savedTimers);

    setLoading(false); // Stop loading when data is loaded from localStorage
  }, []); // Empty dependency array ensures this runs only once

  const handleToggleTheme = (id, minutes, seconds) => {
    let color;
    if (minutes === 0 && seconds === 0) {
      color = "bg-green-600";
      // Schedule removal after 30 seconds when the time hits 00:00
      setTimeout(() => handleRemoveItem(id), 30000);
    } else if (minutes < 5) {
      color = "bg-yellow-600";
    } else {
      color = "bg-red-600";
    }
    setBgColor((prev) => ({ ...prev, [id]: color }));
  };

  const handleRemoveItem = async (id) => {
    try {
      // Make API call to remove item
      await axios.delete(`https://677f9a3c0476123f76a72fa9.mockapi.io/order/${id}`);
      // Remove item from state
      setData((prevData) => prevData.filter((item) => item.id !== id));
      setTimers((prevTimers) => {
        const updatedTimers = { ...prevTimers };
        delete updatedTimers[id]; // Stop the timer for this item
        return updatedTimers;
      });
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  // Fetch data from the API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://677f9a3c0476123f76a72fa9.mockapi.io/order");
      setData(res.data);

      // Initialize timers for new data
      const newTimers = {};
      res.data.forEach((item) => {
        newTimers[item.id] = { minutes: 10, seconds: 0 };
      });
      setTimers(newTimers);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  }, []); // Only fetch data once on mount

  // Only run fetchData once on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Effect only depends on fetchData and runs once

  // Handle new item addition and timer
  const handleAddItem = (newItem) => {
    setData((prevData) => {
      const updatedData = [...prevData, newItem];
      localStorage.setItem("orderData", JSON.stringify(updatedData)); // Persist updated data
      return updatedData;
    });

    setTimers((prevTimers) => {
      const updatedTimers = { ...prevTimers, [newItem.id]: { minutes: 10, seconds: 0 } };
      localStorage.setItem("timers", JSON.stringify(updatedTimers)); // Persist updated timers
      return updatedTimers;
    });
  };

  return (
    <div className="p-4 flex flex-wrap">
      {loading ? (
        <HashLoader />
      ) : (
        data.map((item) => (
          <div
            key={item.id}
            className="bg-white w-1/5 m-2"
            style={{ flexBasis: "calc(20% - 16px)" }} // Adjusting for margin
          >
            <div
              className={`flex justify-between ${bgColor[item.id] || "bg-red-600"} text-white font-semibold mb-4 px-4 py-4`}
            >
              <div>
                <h3>{item.orderType}</h3>
                <p>#{item.id}</p>
              </div>
              <Timer
                initialTime={timers[item.id]}
                onChange={(minutes, seconds) => handleToggleTheme(item.id, minutes, seconds)}
              />
            </div>
            <div>
              {item.cartData.map((cartItem) => (
                <div key={cartItem.id} className="flex justify-between mb-4 px-4 py-2">
                  <div>
                    <p>{cartItem.name}</p>
                  </div>
                  <div>
                    <p>{cartItem.qnt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrdersStatus;
