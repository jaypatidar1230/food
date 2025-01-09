import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup({onLogin}) {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    // Check if all fields are filled out
    if (!formData.name || !formData.number || !formData.password) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      // Check if the phone number already exists
      const { data: users } = await axios.get("https://677263d3ee76b92dd4921ff8.mockapi.io/users");
      const userExists = users.some(user => user.number === formData.number);

      if (userExists) {
        setErrorMessage("User with this phone number already exists.");
        return;
      }

      // Submit the new user data
      const res = await axios.post("https://677263d3ee76b92dd4921ff8.mockapi.io/users", formData);
      console.log("Data submitted successfully:", res.data);

      // Clear the form and navigate to the login page
      setFormData({ name: "", number: "", password: "" });
      setErrorMessage("");
      localStorage.setItem('isLoggedIn', 'true');
      onLogin(); // Set login status in App component
      navigate("/home"); // Redirect to home page
    } catch (error) {
      console.error("There was an error submitting the data:", error);
      setErrorMessage("An error occurred while submitting the data.");
    }
  };

  return (
    <div className="flex overflow-hidden">
      <div className="w-1/2 relative h-full bg-[#EAF3FA]">
        <div className="absolute left-1/4 top-12">
          <img src="/assets/logo1.png" className="h-56" alt="Logo" />
        </div>
        <div className="pt-[370px]">
          <img
            src="/assets/img_signin.png"
            className="img-fluid"
            alt="Signup Illustration"
          />
        </div>
      </div>

      <div className="bg-[#F8F9FD] w-1/2">
        <form
          className="bg-white h-4/5 absolute w-[650px] mt-20 rounded-3xl -ml-12"
          onSubmit={handleSignup}
        >
          <div className="p-24 pt-20">
            <h2 className="text-3xl font-bold text-gray-700">
              Create a New Account
            </h2>
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
            <div className="flex flex-col mt-7">
              <label className="text-gray-600 font-semibold">Name</label>
              <input
                type="text"
                className="h-12 pl-4 rounded-full mt-3 bg-[#F8F9FD]"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col mt-5">
              <label className="text-gray-600 font-semibold">
                Phone Number
              </label>
              <input
                type="text"
                className="h-12 pl-4 rounded-full mt-3 bg-[#F8F9FD]"
                placeholder="Enter Phone Number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              />
            </div>
            <div className="flex flex-col mt-5">
              <label className="text-gray-600 font-semibold">Password</label>
              <input
                type="password"
                className="h-12 pl-4 rounded-full mt-3 bg-[#F8F9FD]"
                placeholder="Create Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-36 h-12 bg-yellow-500 rounded-full mt-7 text-white font-bold"
            >
              Signup
            </button>

            <div className="mt-5 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-500 font-bold"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
