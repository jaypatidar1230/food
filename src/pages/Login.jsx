import React from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    onLogin();
    navigate("/home");
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
            <div className="flex flex-col mt-7">
              <label className="text-gray-600 font-semibold">Phone Number</label>
              <input
                type="text"
                className="h-12 pl-4 rounded-full mt-3 bg-[#F8F9FD]"
                placeholder="Enter Phone Number"
              />
            </div>
            <div className="flex flex-col mt-5">
              <label className="text-gray-600 font-semibold">Password</label>
              <input
                type="password"
                className="h-12 pl-4 rounded-full mt-3 bg-[#F8F9FD]"
                placeholder="Enter Password"
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
