import React from "react";
import RightContent from "../components/RightContent";
import LeftContent from "../components/LeftContent";

function Content() {
  return (
    <div className="flex">
      <div className="w-1/3 bg-purple-500">
        <LeftContent />
      </div>
      <div className="w-2/3">
        <RightContent />
      </div>
    </div>
  );
}

export default Content;
