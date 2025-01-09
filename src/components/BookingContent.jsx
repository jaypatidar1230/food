import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";

function BookingContent() {
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State to control delete confirmation dialog
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newBooking, setNewBooking] = useState({
    id: null,
    date: "",
    time: "",
    person: "",
    customerName: "",
    phoneNumber: "",
    notes: "",
  });
  const [persons, setPersons] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [bookingToDelete, setBookingToDelete] = useState(null); // Store the booking to delete

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://677f9a3c0476123f76a72fa9.mockapi.io/booking"
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleOpen = (booking = null) => {
    setIsEditing(!!booking);
    setNewBooking(
      booking || {
        date: "",
        time: "",
        person: "",
        customerName: "",
        phoneNumber: "",
        notes: "",
      }
    );
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(
          `https://677f9a3c0476123f76a72fa9.mockapi.io/booking/${newBooking.id}`,
          newBooking
        );
      } else {
        await axios.post(
          "https://677f9a3c0476123f76a72fa9.mockapi.io/booking",
          newBooking
        );
      }
      fetchBookings();
      handleClose();
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  const handleDelete = async () => {
    if (bookingToDelete) {
      try {
        await axios.delete(
          `https://677f9a3c0476123f76a72fa9.mockapi.io/booking/${bookingToDelete.id}`
        );
        fetchBookings();
        setOpenDeleteDialog(false);
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  const handleDeleteDialogOpen = (booking) => {
    setBookingToDelete(booking);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setBookingToDelete(null);
    setOpenDeleteDialog(false);
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phoneNumber.includes(searchTerm) ||
      booking.date.includes(searchTerm) ||
      booking.time.includes(searchTerm) ||
      booking.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'
  };

  return (
    <div>
      <div className="flex justify-between pt-7 pr-5 pb-7 pl-12">
        <div className="border-l-8 h-12 border-yellow-500 -ml-12">
          <h2 className="text-3xl font-bold text-gray-700 ml-12">Booking</h2>
        </div>
        <button
          className="bg-yellow-500 w-28 rounded-full"
          onClick={() => handleOpen()}
        >
          Book New
        </button>
        <div className="flex space-x-4">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 w-full h-10 border border-gray-300 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Phone Number</th>
              <th className="px-6 py-3">Notes</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr
                key={booking.id}
                className="odd:bg-white text-gray-900 even:bg-gray-100"
              >
                <td className="px-6 py-4">{booking.date}</td>
                <td className="px-6 py-4">{booking.time}</td>
                <td className="px-6 py-4">{booking.customerName}</td>
                <td className="px-6 py-4">{booking.phoneNumber}</td>
                <td className="px-6 py-4">{booking.notes}</td>
                <td className="px-6 py-4 flex space-x-4">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleOpen(booking)}
                  >
                    <Icon icon="mdi:pencil" className="text-xl" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteDialogOpen(booking)}
                  >
                    <Icon icon="mdi:delete" className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this booking?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteDialogClose}
            style={{ backgroundColor: "gray", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Edit Booking" : "Add Booking"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Select Date"
                type="date"
                fullWidth
                name="date"
                value={newBooking.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }} // Ensure min date is correct
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                margin="dense"
                label="Hour"
                type="number"
                fullWidth
                name="hour"
                value={newBooking.time.split(":")[0]}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "time",
                      value: `${e.target.value.padStart(2, "0")}:${
                        newBooking.time.split(":")[1]
                      }`,
                    },
                  })
                }
                InputProps={{ inputProps: { min: 0, max: 23, step: 1 } }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                margin="dense"
                label="Minute"
                type="number"
                fullWidth
                name="minute"
                value={newBooking.time.split(":")[1]}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "time",
                      value: `${
                        newBooking.time.split(":")[0]
                      }:${e.target.value.padStart(2, "0")}`,
                    },
                  })
                }
                InputProps={{ inputProps: { min: 0, max: 59, step: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Select Person"
                select
                fullWidth
                name="person"
                value={newBooking.person}
                onChange={handleChange}
              >
                {persons.map((person) => (
                  <MenuItem key={person} value={person}>
                    {person}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Customer Name"
                fullWidth
                name="customerName"
                value={newBooking.customerName}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Phone Number"
                fullWidth
                name="phoneNumber"
                value={newBooking.phoneNumber}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Notes"
                fullWidth
                name="notes"
                value={newBooking.notes}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            style={{ backgroundColor: "orange", color: "white" }}
          >
            {isEditing ? "Update Booking" : "Add Booking"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BookingContent;
