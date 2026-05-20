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

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white shadow-sm dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-8 w-8 object-contain sm:h-10 sm:w-10"
          />

          <span className="text-base font-bold text-black dark:text-white sm:text-lg md:text-xl">
            E -
            <span className="text-blue-600">
              {" "}COMMERCE
            </span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-6 md:flex">
          
          <Link
            href="/"
            className="text-sm font-medium hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/all-products"
            className="text-sm font-medium hover:text-blue-600"
          >
            Products
          </Link>

          {isLoggedIn ? (
            <DropdownMenu>

              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Avatar className="h-9 w-9">
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

              <DropdownMenuContent
                align="end"
                className="w-56"
              >
                <div className="px-3 py-2">
                  <p className="truncate font-semibold">
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

                  {role === "vendor" && (
                    <DropdownMenuItem asChild>
                      <Link href="/vendors/vendor-dashboard">
                        Vendor Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {role === "buyer" && (
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
            <div className="flex items-center gap-4">

              <Link
                href="/auth/login"
                className="text-sm font-medium hover:text-blue-600"
              >
                Login
              </Link>

              <Link href="/auth/signup">
                <button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                  Get Started
                </button>
              </Link>

            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={toggleMenu}
          className="block text-3xl text-black dark:text-white md:hidden"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="space-y-4 border-t bg-white px-4 py-5 dark:bg-gray-900 md:hidden">

          <Link
            href="/"
            className="block text-sm font-medium hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="block text-sm font-medium hover:text-blue-600"
          >
            Products
          </Link>

          <Link
            href="/about"
            className="block text-sm font-medium hover:text-blue-600"
          >
            About
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                href="/auth/login"
                className="block text-sm font-medium hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="block"
              >
                <button className="w-full rounded-full bg-blue-600 px-4 py-2 text-white">
                  Signup
                </button>
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b pb-4">

                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      avatar ||
                      "https://github.com/shadcn.png"
                    }
                  />

                  <AvatarFallback>
                    {userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold">
                    {userName}
                  </p>

                  <p className="text-sm capitalize text-gray-500">
                    {role}
                  </p>
                </div>

              </div>

              <Link
                href="/profile"
                className="block text-sm font-medium hover:text-blue-600"
              >
                Profile
              </Link>

              {role === "vendor" && (
                <Link
                  href="/vendors/vendor-dashboard"
                  className="block text-sm font-medium hover:text-blue-600"
                >
                  Vendor Dashboard
                </Link>
              )}

              {role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="block text-sm font-medium hover:text-blue-600"
                >
                  Admin Dashboard
                </Link>
              )}

              {role === "buyer" && (
                <Link
                  href="/orders"
                  className="block text-sm font-medium hover:text-blue-600"
                >
                  My Orders
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full rounded-full bg-red-500 px-4 py-2 text-white"
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