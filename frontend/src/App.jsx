import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./component/Admin/Admin";
import Coordinator from "./component/Coordinator/Coordinator";
import Club from "./component/Club/Club";

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/admin-panel" element={<Admin/>} />
        <Route path="/club-panel" element={<Coordinator/>} />
        <Route path="/clubs" element={<Club/>} />
    </Routes>
  );
};

export default App;
