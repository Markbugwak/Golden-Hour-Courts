import React from"react";
import{Routes,Route}from"react-router-dom";
import Navbar from"./components/Navbar";
import Footer from"./components/Footer";
import ProtectedRoute from"./components/ProtectedRoute";
import AdminRoute from"./components/AdminRoute";
import Home from"./pages/Home";
import Courts from"./pages/Courts";
import Availability from"./pages/Availability";
import Login from"./pages/Login";
import Register from"./pages/Register";
import Reservations from"./pages/Reservations";
import PaymentSuccess from"./pages/PaymentSuccess";
import PaymentCancelled from"./pages/PaymentCancelled";
import NotFound from"./pages/NotFound";
import Admin from"./pages/Admin";

export default function App(){
 return <div className="min-h-screen bg-[#f4f0e8] text-[#10151d]"><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/courts" element={<Courts/>}/><Route path="/availability" element={<ProtectedRoute><Availability/></ProtectedRoute>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/reservations" element={<ProtectedRoute><Reservations/></ProtectedRoute>}/><Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess/></ProtectedRoute>}/><Route path="/payment/cancelled" element={<ProtectedRoute><PaymentCancelled/></ProtectedRoute>}/><Route path="/admin" element={<AdminRoute><Admin/></AdminRoute>}/><Route path="*" element={<NotFound/>}/></Routes><Footer/></div>
}
