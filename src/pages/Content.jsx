import React from "react";
import RightContent from "../components/RightContent";
import LeftContent from "../components/LeftContent";
import TransactionContent from "../components/TransactionContent";

function Content({ selectedContent }) {
  return (
    <div className="flex bg-gray-100">
      {selectedContent === "POS" && (
        <>
          <div className="w-1/3 bg-white">
            <LeftContent />
          </div>
          <div className="w-2/3">
            <RightContent />
          </div>
        </>
      )}
      {selectedContent === "Transaction" && (
        <div className="w-full">
          <TransactionContent />
        </div>
      )}
    </div>
  );
}

export default Content;
