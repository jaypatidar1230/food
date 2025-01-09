import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from 'react';
import Home from "./pages/home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={<Login onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="/home"
          element={
            isLoggedIn ? <Home /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
