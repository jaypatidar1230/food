import React from "react";
import RightContent from "../components/RightContent";
import LeftContent from "../components/LeftContent";
import TransactionContent from "../components/TransactionContent";
import BookingContent from "../components/BookingContent";
import OrdersStatus from "../components/OrdersStatus";

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
      {selectedContent === "Booking" && (
        <div className="w-full">
          <BookingContent />
        </div>
      )}
      {selectedContent === "OrdersStatus" && (
        <div className="w-full">
          <OrdersStatus />
        </div>
      )}
    </div>
  );
}

export default Content;
