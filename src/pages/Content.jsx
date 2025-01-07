import React from "react";
import RightContent from "../components/RightContent";
import LeftContent from "../components/LeftContent";

function Content() {
  return (
    <div className="flex bg-gray-100">
      <div className="w-1/3 bg-white">
        <LeftContent />
      </div>
      <div className="w-2/3">
        <RightContent />
      </div>
    </div>
  );
}

export default Content;
