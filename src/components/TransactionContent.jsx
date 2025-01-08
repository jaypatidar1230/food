import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { getDDMMYYYYDateWithTime } from "./Date";

function TransactionContent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false); // State to control the dialog visibility
  const [deleteId, setDeleteId] = useState(null); // Store the ID of the item to delete
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://677263d3ee76b92dd4921ff8.mockapi.io/Transaction"
      );
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce time
  
    return () => clearTimeout(timer); // Clean up the timeout on unmount
  }, [searchQuery]);

  // Filter data based on search query
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    )
  );

  const handleEdit = (id) => {
    console.log(`Editing transaction #${id}`);
    // Implement edit functionality here
  };

  const handleClickOpen = (id) => {
    setDeleteId(id);
    setOpen(true); // Open the confirmation dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
    setDeleteId(null); // Reset the deleteId state
  };

  const handleDelete = async () => {
    const previousData = [...data]; // Store the previous data
    setData((prevData) => prevData.filter((item) => item.id !== deleteId)); // Optimistically remove
    
    try {
      await axios.delete(`https://677263d3ee76b92dd4921ff8.mockapi.io/Transaction/${deleteId}`);
      fetchData(); // Refetch to ensure the delete was successful
      handleClose();
    } catch (error) {
      setData(previousData); // Revert to previous state if delete fails
      alert("Failed to delete transaction. Please try again.");
      handleClose();
    }
    
  };

  return (
    <div>
      <div className="flex justify-between pt-7 pr-5 pb-7 pl-12">
        <div className="border-l-8 h-12 border-yellow-500 -ml-12">
          <h2 className="text-3xl font-bold text-gray-700 ml-12">Transaction</h2>
        </div>
        <div className="flex justify-between">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 w-full h-10 border border-gray-300 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icon icon="mdi:magnify" className="absolute left-3 top-2.5 text-gray-400 text-xl" />
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-white">
            <thead className="text-xs uppercase bg-gray-200 text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Order num</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Items</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Payment</th>
                <th scope="col" className="px-6 py-3">Updated On</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="odd:bg-white text-gray-900 even:bg-gray-100">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    #{item.id}
                  </th>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">${item.totalAmount}</td>
                  <td className="px-6 py-4">{item.totalItems}</td>
                  <td className="px-6 py-4">{item.type}</td>
                  <td className="px-6 py-4">{item.payment}</td>
                  <td className="px-6 py-4">{getDDMMYYYYDateWithTime(item.createdAt)}</td>
                  <td className="px-6 py-4 flex space-x-4">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Icon icon="mdi:pencil" className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleClickOpen(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Icon icon="mdi:delete" className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MUI Dialog for confirmation */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this transaction?</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TransactionContent;
