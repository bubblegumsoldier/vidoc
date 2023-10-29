'use client'
import { ToastContainer } from "react-toastify";

export default function CustomToastContainer() {
  return (
    <ToastContainer position="bottom-right" theme="light" autoClose={3000} />
  );
}
