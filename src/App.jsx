import { useState } from "react";
import {Route, Routes } from "react-router-dom";
import DashBoard from "./components/DashBoard";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import ViewProduct from "./components/ViewProduct";

function App() {
  const [search,setSearch] = useState("")
  return (
    <>
        <Navbar search={search} setSearch={setSearch}  />
        <Routes>
          <Route path="/" element={<Home search={search} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup /> } />
          <Route path="/dashboard" element={<DashBoard /> } />
          <Route path="/product/:id" element={<ViewProduct />} />
          <Route path="*" element={<h2 className="text-xl">Page On Build</h2>} />
        </Routes>
      
    </>
  );
}

export default App;
