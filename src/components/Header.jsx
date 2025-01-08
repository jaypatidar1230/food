import React, { useState } from "react";
import logo from "/assets/logo1.png";
import menu from "/assets/rs_1.png";
import { Icon } from "@iconify/react";
import Slider from "./Slider";

function Header({ onNavSelect }) {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("POS");

  const toggleSlider = () => {
    setIsSliderOpen((prev) => !prev);
  };

  const navItems = [
    { id: "POS", icon: "zmdi-assignment", label: "POS", color: "orange" },
    { id: "Transaction", icon: "zmdi-collection-text", label: "Transaction", color: "orange" },
    { id: "Booking", icon: "zmdi-airline-seat-recline-extra", label: "Booking", color: "orange" },
    { id: "OrdersStatus", icon: "zmdi-hourglass-alt", label: "Orders Status", color: "orange" },
  ];

  const handleNavClick = (id) => {
    setSelectedOption(id);
    onNavSelect(id); // Call the parent function to update content
  };

  return (
    <header className="absolute text-white">
      <div className="bg-black h-[70px] flex items-center fixed top-0 left-0 right-0 z-10">
        <img src={logo} alt="logo" className="h-28 ml-5" />
        <nav className="flex ml-16">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center px-6 text-lg cursor-pointer ${
                selectedOption === item.id ? "text-white font-bold" : "text-gray-400"
              }`}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon style={{ color: selectedOption === item.id ? item.color : "gray" }} icon={item.icon} />
              <h4 className="pl-3">{item.label}</h4>
            </div>
          ))}
        </nav>
        <div className="ml-auto mr-12 relative" onClick={toggleSlider}>
          <img src={menu} alt="menu" className="h-14 rounded-lg" />
          <Icon
            icon="zmdi-menu"
            className="absolute -right-1 top-10 bg-yellow-400 w-7 h-5 p-1 rounded-full"
          />
        </div>
      </div>
      {isSliderOpen && <Slider setIsSliderOpen={setIsSliderOpen} />}
    </header>
  );
}

export default Header;
