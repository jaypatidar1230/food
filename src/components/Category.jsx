import React, { useState, useEffect } from "react";
import axios from "axios";
import { Items } from "./Items";
import { Icon } from "@iconify/react";
import HashLoader from "react-spinners/HashLoader";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "https://6780e96b85151f714b08732e.mockapi.io"; // Base URL for API requests
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dgo8zfdjj/image/upload";
const UPLOAD_PRESET = "ml_default"; // Replace with your actual preset name

function Category() {
  // State variables
  const [categoryId, setCategoryId] = useState(0);
  const [itemName, setItemName] = useState("");
  const [bgId, setBgId] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const [modals, setModals] = useState({
    addCategory: false,
    addItem: false,
  });

  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemType, setNewItemType] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null); // For previewing category image
  const [itemImage, setItemImage] = useState(null);
  const [itemImagePreview, setItemImagePreview] = useState(null); // For previewing item image

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get(`${BASE_URL}/category`);
        setCategories(categoriesResponse.data);

        const itemsResponse = await axios.get(`${BASE_URL}/items`);
        setItems(itemsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
        toast.error("Failed to fetch data.");
      }
    };

    fetchCategories();
  }, []);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      console.log("Cloudinary Full Response:", response.data); // Debugging line
      if (response.data && response.data.secure_url) {
        return response.data.secure_url;
      } else {
        console.error(
          "Image upload response incomplete or pending:",
          response.data
        );
        return null;
      }
    } catch (error) {
      console.error(
        "Error uploading image to Cloudinary:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to upload image.");
      return null;
    }
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setCategoryImagePreview(URL.createObjectURL(file)); // Set preview URL
    }
  };

  const handleItemImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItemImage(file);
      setItemImagePreview(URL.createObjectURL(file)); // Set preview URL
    }
  };

  const addCategory = async () => {
    if (!newCategoryTitle) {
      toast.error("Category title is required!");
      return;
    }

    let imageUrl = "https://via.placeholder.com/75";
    if (categoryImage) {
      const uploadedUrl = await uploadImageToCloudinary(categoryImage);
      if (uploadedUrl) {
        console.log("Uploaded URL for Category:", uploadedUrl); // Debugging line
        imageUrl = uploadedUrl;
      }
    }

    try {
      const response = await axios.post(`${BASE_URL}/category`, {
        title: newCategoryTitle,
        img: imageUrl,
      });
      console.log("API Response:", response.data); // Debugging line
      setCategories((prevCategories) => [...prevCategories, response.data]);

      // Reset states after successful submission
      setNewCategoryTitle(""); // Clear category title
      setCategoryImage(null); // Clear category image
      setCategoryImagePreview(null); // Clear image preview

      // Close the modal
      setModals((prev) => ({ ...prev, addCategory: false }));

      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Error adding category", error);
      toast.error("Failed to add category.");
    }
  };

  const addItem = async () => {
    if (!newItemName || !newItemPrice || !newItemCategory || !newItemType) {
      toast.error("Item name, price, category, and type are required!");
      return;
    }

    if (isNaN(newItemPrice) || newItemPrice <= 0) {
      toast.error("Please provide a valid price!");
      return;
    }

    let imageUrl = "/assets/1.png";
    if (itemImage) {
      const uploadedUrl = await uploadImageToCloudinary(itemImage);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    try {
      const selectedCategory = categories.find(
        (cat) => cat.id === newItemCategory
      );
      if (!selectedCategory) {
        toast.error("Invalid category selected!");
        return;
      }

      const response = await axios.post(`${BASE_URL}/items`, {
        img: imageUrl,
        title: newItemName,
        category: selectedCategory.title,
        categoryId: newItemCategory,
        price: newItemPrice,
        veg: newItemType === "veg",
      });

      toast.success("Item added successfully!");

      const newItem = {
        id: response.data.id,
        img: response.data.img,
        title: newItemName,
        price: newItemPrice,
        veg: newItemType === "veg",
        categoryId: newItemCategory,
      };

      setItems((prevItems) => [...prevItems, newItem]);

      setNewItemName("");
      setNewItemPrice("");
      setNewItemCategory("");
      setNewItemType("");
      setItemImage(null);
      setItemImagePreview(null); // Clear preview
      setModals((prev) => ({ ...prev, addItem: false }));
    } catch (error) {
      console.error("Error adding item", error);
      toast.error("Failed to add item.");
    }
  };

  return (
    <>
      <div className="w-auto pt-3 pl-2">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <HashLoader color="#36d7b7" loading={loading} size={50} />
          </div>
        ) : (
          <>
            <ul className="rounded-xl flex overflow-x-auto">
              {categories.map(({ id, img, title }) => (
                <li
                  key={id}
                  className={`w-[95px] ${
                    bgId === id ? "bg-yellow-400" : "bg-white"
                  } h-[95px] rounded-xl p-2 mx-1 cursor-pointer`}
                  onClick={() => {
                    setCategoryId(id);
                    setBgId(id);
                  }}
                >
                  <div className="h-[75px] w-[75px] flex flex-col justify-center items-center">
                    <img src={img} alt={title} className="h-12" />
                    <p className="w-auto">{title}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="my-5">
              <div className="flex">
                <div className="relative w-96">
                  <input
                    type="search"
                    placeholder="Search Items"
                    className="w-full border-gray-500 border-2 rounded-xl pl-10 h-10"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                  <Icon
                    icon="mdi:magnify"
                    className="absolute left-3 top-2.5 text-gray-500 text-xl"
                  />
                </div>
                <div className=" ml-7">
                  <button
                    variant="contained"
                    color="primary"
                    className=" bg-purple-500 rounded-xl px-4 h-10 mr-3 font-semibold text-white"
                    onClick={() =>
                      setModals((prev) => ({ ...prev, addCategory: true }))
                    }
                  >
                    Add Category
                  </button>
                  <button
                    variant="contained"
                    color="secondary"
                    className=" bg-indigo-400 rounded-xl px-4 h-10 font-semibold text-white"
                    onClick={() =>
                      setModals((prev) => ({ ...prev, addItem: true }))
                    }
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Category Modal */}
      <Dialog
        open={modals.addCategory}
        onClose={() => setModals((prev) => ({ ...prev, addCategory: false }))}
      >
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Title"
            type="text"
            fullWidth
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
          />
          <input type="file" onChange={handleCategoryImageChange} />
          {categoryImagePreview && (
            <img
              src={categoryImagePreview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setModals((prev) => ({ ...prev, addCategory: false }))
            }
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={addCategory} color="primary">
            Add Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Item Modal */}
      <Dialog
        open={modals.addItem}
        onClose={() => setModals((prev) => ({ ...prev, addItem: false }))}
      >
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            type="text"
            fullWidth
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Item Price"
            type="number"
            fullWidth
            value={newItemPrice}
            onChange={(e) =>
              setNewItemPrice(e.target.value < 0 ? 0 : e.target.value)
            } // Ensure no negative value
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              label="Category"
            >
              {categories.map(({ id, title }) => (
                <MenuItem key={id} value={id}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value)}
              label="Type"
            >
              <MenuItem value="veg">Vegetarian</MenuItem>
              <MenuItem value="non-veg">Non-Vegetarian</MenuItem>
            </Select>
          </FormControl>
          <input type="file" onChange={handleItemImageChange} />
          {itemImagePreview && (
            <img
              src={itemImagePreview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setModals((prev) => ({ ...prev, addItem: false }))}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={addItem} color="primary">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
      <Items categoryId={categoryId} itemName={itemName} items={items} />
    </>
  );
}

export default Category;
