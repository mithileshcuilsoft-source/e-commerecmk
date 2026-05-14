"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { postRequest } from "@/api/auth";

import { useAuthStore } from "@/store/useAuthStore";

export const Login = () => {

  const router = useRouter();

  // =========================
  // ZUSTAND
  // =========================

  const login = useAuthStore(
    (state) => state.login
  );

  // =========================
  // STATES
  // =========================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // LOGIN SUBMIT
  // =========================

  const onSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      // API CALL
      const response = await postRequest("auth/login",
        {
          email,
          password,
        }
      );

      const { token, user, } = response;
      login({
        token,

        userName:
          user.name || "User",

        role: user.role,

        avatar:
          user.avatar || "",
      });
      debugger
      // OPTIONAL
      localStorage.setItem(
        "userId",
        user._id
      );
      if (
        user.role === "admin"
      ) {

        router.push(
          "/admin/dashboard"
        );

      } else if (
        user.role ===
        "vendor"
      ) {

        router.push(
          "/vendors/vendor-dashboard"
        );

      } else {

        router.push("/");
      }

    } catch (err: any) {

      console.log(err);

      setError(
        err?.response?.data
          ?.message ||
        "Invalid email or password"
      );

    } finally {

      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, } = e.target;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">

      {/* LOGO */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">

        <img
          alt="Logo"
          src="/images/logo.png"
          className="mx-auto h-20 w-auto"
        />

        <h2 className="mt-6 text-center text-2xl font-bold text-white">
          Sign in to your account
        </h2>

      </div>

      {/* FORM */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

        {error && (

          <p className="mb-4 rounded bg-red-100 p-2 text-center text-sm text-red-500">

            {error}

          </p>
        )}

        <form
          onSubmit={
            onSubmit
          }
          className="space-y-6"
        >

          {/* EMAIL */}
          <div>

            <label className="block text-sm font-medium text-gray-100">

              Email address

            </label>

            <div className="mt-2">

              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={
                  handleChange
                }
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 focus:outline-indigo-500"
              />

            </div>
          </div>

          {/* PASSWORD */}
          <div>

            <div className="flex items-center justify-between">

              <label className="block text-sm font-medium text-gray-100">

                Password

              </label>

            </div>

            <div className="mt-2">

              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={
                  handleChange
                }
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 focus:outline-indigo-500"
              />

            </div>
          </div>

          {/* BUTTON */}
          <div>

            <button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white ${loading
                  ? "cursor-not-allowed bg-indigo-400"
                  : "bg-indigo-500 hover:bg-indigo-400"
                }`}
            >

              {loading
                ? "Signing in..."
                : "Sign in"}

            </button>

          </div>
        </form>
      </div>
    </div>
  );
};