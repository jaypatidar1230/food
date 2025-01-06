import React, { useState } from "react";
import logo from "/assets/logo1.png";
import menu from "/assets/rs_1.png";
import { Icon } from "@iconify/react";
import Slider from "./Slider";

function Header() {
    const [isSliderOpen, setIsSliderOpen] = useState(false);
  
    const toggleSlider = () => {
      setIsSliderOpen(!isSliderOpen);
    };
  
    return (
      <div className="absolute text-white">
        <div className="bg-black h-[70px] flex items-center fixed top-0 left-0 right-0 z-10"> {/* Fixed header */}
          <img src={logo} alt="logo" className="h-28 ml-5" />
          <div className="flex ml-16">
            <div className="flex items-center justify-around px-6 text-lg">
              <Icon style={{ color: "orange" }} icon="zmdi-assignment" />
              <h4 className="pl-3 font-bold">POS</h4>
            </div>
            <div className="flex items-center justify-around px-6 text-lg">
              <Icon style={{ color: "gray" }} icon="zmdi-collection-text" />
              <h4 className="pl-3">Transaction</h4>
            </div>
            <div className="flex items-center justify-around px-6 text-lg">
              <Icon style={{ color: "gray" }} icon="zmdi-airline-seat-recline-extra" />
              <h4 className="pl-3">Booking</h4>
            </div>
            <div className="flex items-center justify-around px-6 text-lg">
              <Icon style={{ color: "gray" }} icon="zmdi-hourglass-alt" />
              <h4 className="pl-3">Orders Status</h4>
            </div>
          </div>
          <div className="ml-auto mr-12 relative" onClick={toggleSlider}>
            <img src={menu} alt="menu" className="h-14 rounded-lg" />
            <Icon
              icon="zmdi-menu"
              className="absolute -right-1 top-10 bg-yellow-400 w-7 h-5 p-1 rounded-full"
            />
          </div>
        </div>
        {isSliderOpen && (
          <Slider setIsSliderOpen={setIsSliderOpen} />
        )}
      </div>
    );
  }
  

export default Header;
