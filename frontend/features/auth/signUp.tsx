"use client";

import React, { useState } from 'react';
import { Router } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { postRequest } from '@/api/auth';
import toast from "react-hot-toast";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Sends data to backend
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    setLoading(true);
  
    try {
      const response = await postRequest("auth/register", data);
  
      toast.success("User created successfully");
  
      console.log(response);
  
      router.push("/");
  
    } catch (error: any) {
      console.log(error?.response?.data);
  
      toast.error(
        error?.response?.data?.message ||
        "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-900 px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold text-white">Create Account</h2>
        
        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            required
            className="block w-full rounded-md bg-white/10 px-3 py-2 text-white"
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="block w-full rounded-md bg-white/10 px-3 py-2 text-white"
            onChange={handleChange}
          />
            <input
            name="phone"
            type="number"
            placeholder="Phone Number"
            required
            className="block w-full rounded-md bg-white/10 px-3 py-2 text-white"
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="block w-full rounded-md bg-white/10 px-3 py-2 text-white"
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-500 disabled:bg-gray-600"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>

        </form>
        <p className="mt-10 text-center text-sm text-gray-400">
          <a href="/signupvendor" className="font-semibold text-indigo-400 hover:text-indigo-300">
            SignUp as a Vendor
          </a>
        </p>
      </div>
    </div>
  );
}
