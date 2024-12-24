"use client";
import { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import { login } from "@/services/api";
import { useRouter } from "next/navigation"; // Import useRouter

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Initialize useRouter for navigation

  const handleLogin = async (e:any) => {
    e.preventDefault();
    if (email && password) {
      try {
        await login({ email, password }); // Call the login API
        toast.success("Login successful!");
        router.push("/admin"); // Redirect to /admin
      } catch (error) {
        toast.error("Login failed. Please check your credentials.");
      }
    } else {
      toast.error("Make sure you have filled all fields.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Admin Login</h2>
        <form className="mt-6 space-y-4" >
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
            onClick={(e) => handleLogin(e)}
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Forgot your password?{" "}
          <a href="#" className="text-purple-600 hover:underline">
            Reset it here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
