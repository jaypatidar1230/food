import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ number: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const { data: users } = await axios.get("https://677263d3ee76b92dd4921ff8.mockapi.io/users");
      const user = users.find(user => user.number === formData.number);

      if (user && user.password === formData.password) {
        // Store login state in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        onLogin(); // Set login status in App component
        navigate("/home"); // Redirect to home page
      } else {
        setErrorMessage("Invalid phone number or password.");
      }
    } catch (error) {
      console.error("There was an error fetching the users:", error);
      setErrorMessage("An error occurred while trying to log in.");
    }
  };

  return (
    <div className="flex overflow-hidden">
      <div className="w-1/2 relative h-full bg-[#EAF3FA]">
        <div className="absolute left-1/4 top-12">
          <img src="/assets/logo1.png" className="h-56" alt="Logo" />
        </div>
        <div className="pt-[370px]">
          <img src="/assets/img_signin.png" className="img-fluid" alt="Login Illustration" />
        </div>
      </div>

      <div className="bg-[#F8F9FD] w-1/2">
        <form className="bg-white h-2/3 absolute w-[650px] mt-28 rounded-3xl -ml-12" onSubmit={handleLogin}>
          <div className="p-24">
            <h2 className="text-3xl font-bold text-gray-700">Login to your Account</h2>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            <div className="flex flex-col mt-7">
              <label className="text-gray-600 font-semibold">Phone Number</label>
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
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-36 h-12 bg-yellow-500 rounded-full mt-7 text-white font-bold"
            >
              Login
            </button>

            <div className="mt-5 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-500 font-bold"
                  onClick={() => navigate("/signup")}
                >
                  Signup
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
