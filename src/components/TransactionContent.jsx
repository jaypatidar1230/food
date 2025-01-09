import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { getDDMMYYYYDateWithTime } from "./Date";

function TransactionContent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false); // State to control the delete dialog visibility
  const [deleteId, setDeleteId] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [editOpen, setEditOpen] = useState(false); // State to control the edit dialog visibility
  const [editableTransaction, setEditableTransaction] = useState(null); // Store the editable transaction

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

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    )
  );

  const handleEdit = (transaction) => {
    setEditableTransaction(transaction);
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedTransaction = {
        ...editableTransaction,
        updatedAt: new Date().toISOString(), // Add current timestamp
      };

      await axios.put(
        `https://677263d3ee76b92dd4921ff8.mockapi.io/Transaction/${editableTransaction.id}`,
        updatedTransaction
      );
      fetchData(); // Refresh the data
      setEditOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error updating transaction: ", error);
      alert("Failed to update transaction. Please try again.");
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditableTransaction(null);
  };

  const handleFieldChange = (field, value) => {
    setEditableTransaction((prev) => ({ ...prev, [field]: value }));
  };

  const handleClickOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    const previousData = [...data];
    setData((prevData) => prevData.filter((item) => item.id !== deleteId));

    try {
      await axios.delete(
        `https://677263d3ee76b92dd4921ff8.mockapi.io/Transaction/${deleteId}`
      );
      fetchData();
      handleClose();
    } catch (error) {
      setData(previousData);
      alert("Failed to delete transaction. Please try again.");
      handleClose();
    }
  };

  return (
    <div>
      <div className="flex justify-between pt-7 pr-5 pb-7 pl-12">
        <div className="border-l-8 h-12 border-yellow-500 -ml-12">
          <h2 className="text-3xl font-bold text-gray-700 ml-12">
            Transaction
          </h2>
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
            <Icon
              icon="mdi:magnify"
              className="absolute left-3 top-2.5 text-gray-400 text-xl"
            />
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
       
          <table className="w-full text-sm text-left rtl:text-right text-white">
            <thead className="text-xs uppercase bg-gray-200 text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Order num
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Items
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3">
                  Updated On
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="odd:bg-white text-gray-900 even:bg-gray-100"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    #{item.id}
                  </th>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">${item.totalAmount}</td>
                  <td className="px-6 py-4">{item.totalItems}</td>
                  <td className="px-6 py-4">{item.type}</td>
                  <td className="px-6 py-4">{item.payment}</td>
                  <td className="px-6 py-4">
                    {getDDMMYYYYDateWithTime(item.updatedAt || item.createdAt)}
                  </td>

                  <td className="px-6 py-4 flex space-x-4">
                    <button
                      onClick={() => handleEdit(item)}
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
        )}
          </table>
      </div>

      {/* MUI Dialog for confirmation */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this transaction?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit transaction dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="xs">
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={editableTransaction?.name || ""}
            onChange={(e) => handleFieldChange("name", e.target.value)}
          />
          <TextField
            margin="dense"
            label="Total Amount"
            fullWidth
            value={editableTransaction?.totalAmount || ""}
            onChange={(e) => handleFieldChange("totalAmount", e.target.value)}
          />
          <TextField
            margin="dense"
            label="Total Items"
            fullWidth
            value={editableTransaction?.totalItems || ""}
            onChange={(e) => handleFieldChange("totalItems", e.target.value)}
          />

          <div>
            <label className="pb-3 font-semibold text-gray-600/70">
              Order Type
            </label>
            <div>
              <input
                type="radio"
                name="orderType"
                value="Takeaway"
                id="Takeaway"
                className="mt-4"
                checked={editableTransaction?.type === "Takeaway"}
                onChange={() => handleFieldChange("type", "Takeaway")}
              />
              <label className="font-semibold pl-3" htmlFor="Takeaway">
                Takeaway
              </label>
              <input
                type="radio"
                name="orderType"
                value="Dine-in"
                id="Dine-in"
                className="ml-7"
                checked={editableTransaction?.type === "Dine-in"}
                onChange={() => handleFieldChange("type", "Dine-in")}
              />
              <label className="font-semibold pl-3" htmlFor="Dine-in">
                Dine-in
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="pb-3 font-semibold text-gray-600/70">
              Payment
            </label>
            <div>
              <input
                type="radio"
                name="paymentMethod"
                value="Cash"
                id="cash"
                className="mt-4"
                checked={editableTransaction?.payment === "Cash"}
                onChange={() => handleFieldChange("payment", "Cash")}
              />
              <label className="font-semibold pl-3" htmlFor="cash">
                Cash
              </label>
              <input
                type="radio"
                name="paymentMethod"
                value="Card"
                id="card"
                className="ml-7"
                checked={editableTransaction?.payment === "Card"}
                onChange={() => handleFieldChange("payment", "Card")}
              />
              <label className="font-semibold pl-3" htmlFor="card">
                Card
              </label>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TransactionContent;
