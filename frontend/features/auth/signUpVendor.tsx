"use client"; 
import { postRequest } from '@/api/auth';
import React, { useState } from 'react';

export const SignUpVendor = () => {
  const [loading, setLoading] = useState(false);
  const [vendorData, setVendorData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Changed to 'auth/vendor/register' to match your vendor logic
      const response = await postRequest('auth/vendor/register', vendorData);
      alert("Success! Vendor Account Created.");
      console.log(response);
    } catch (error) {
      alert("Error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="/images/logo.png"
          className="mx-auto h-20 w-auto"
        />
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">
          Sign Up Vendor account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-100">Full Name</label>
            <div className="mt-2">
              <input
                name="name"
                type="text"
                required
                placeholder="Enter vendor name"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-100">Email address</label>
            <div className="mt-2">
              <input
                name="email"
                type="email"
                required
                placeholder="Enter email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-100">Phone Number</label>
            <div className="mt-2">
              <input
                name="phone"
                type="number"
                required
                placeholder="Enter phone number"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-100">Password</label>
            <div className="mt-2">
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-400"
                }`}
            >
              {loading ? "Registering Vendor..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
