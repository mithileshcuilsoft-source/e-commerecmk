"use client";

import Link from "next/link";

import React from "react";

import { useRouter } from "next/navigation";

import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";

import { useAuthStore } from "@/store/useAuthStore";

const Navbar = () => {

  const router = useRouter();

  const {
    isLoggedIn,
    userName,
    role,
    avatar,
    logout,
    isOpen,
    toggleMenu,
  } = useAuthStore();

  // SPA LOGOUT
  const handleLogout = () => {

    logout();

    router.push("/auth/login");
  };

  return (
    <nav className="fixed top-0 z-30 w-full border-b bg-white shadow-sm dark:bg-gray-900">

      <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center space-x-2"
        >
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-8"
          />

          <span className="text-xl font-bold text-black dark:text-white">
            E -{" "}
            <span className="text-blue-600">
              COMMERCE
            </span>
          </span>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-4">

          {isLoggedIn ? (
            <DropdownMenu>

              <DropdownMenuTrigger asChild>

                <Button
                  variant="ghost"
                  size="icon"
                >
                  <Avatar>

                    <AvatarImage
                      src={
                        avatar ||
                        "https://github.com/shadcn.png"
                      }
                    />

                    <AvatarFallback>
                      {userName
                        ?.charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>

                  </Avatar>
                </Button>

              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-52">

                <div className="px-3 py-2">

                  <p className="font-semibold">
                    {userName}
                  </p>

                  <p className="text-sm capitalize text-gray-500">
                    {role}
                  </p>

                </div>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>

                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  {role ===
                    "vendor" && (
                    <DropdownMenuItem asChild>
                      <Link href="/vendors/vendor-dashboard">
                        Vendor Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {role ===
                    "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {role ===
                    "buyer" && (
                    <DropdownMenuItem asChild>
                      <Link href="/orders">
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem>
                    Settings
                  </DropdownMenuItem>

                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500"
                >
                  Logout
                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="font-medium hover:text-blue-600"
              >
                Login
              </Link>

              <Link href="/auth/signup">

                <button className="rounded-full bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                  Get Started
                </button>

              </Link>
            </>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={toggleMenu}
            className="text-2xl md:hidden"
          >
            ☰
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="space-y-4 border-t bg-white p-4 dark:bg-gray-900 md:hidden">

          <Link
            href="/"
            className="block"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="block"
          >
            Products
          </Link>

          {!isLoggedIn && (
            <>
              <Link
                href="/auth/login"
                className="block"
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="block"
              >
                Signup
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link
                href="/profile"
                className="block"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-500"
              >
                Logout
              </button>
            </>
          )}

        </div>
      )}
    </nav>
  );
};

export default Navbar;