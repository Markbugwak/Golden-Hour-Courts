import React from"react";
import{Routes,Route}from"react-router-dom";
import Navbar from"./components/Navbar";
import Footer from"./components/Footer";
import ProtectedRoute from"./components/ProtectedRoute";
import Home from"./pages/Home";
import Courts from"./pages/Courts";
import Availability from"./pages/Availability";
import Login from"./pages/Login";
import Register from"./pages/Register";
import Reservations from"./pages/Reservations";
import NotFound from"./pages/NotFound";

export default function App(){
 return <div className="min-h-screen bg-[#f4f0e8] text-[#10151d]"><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/courts" element={<Courts/>}/><Route path="/availability" element={<ProtectedRoute><Availability/></ProtectedRoute>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/reservations" element={<ProtectedRoute><Reservations/></ProtectedRoute>}/><Route path="*" element={<NotFound/>}/></Routes><Footer/></div>
}
