import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  // console.log("PATH:", pathname);
  // console.log("TOKEN:", token);

  let role = "";

  // Decode token
  if (token) {
    try {
      const decoded = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      ) as { role: string };

      role = decoded?.role;

    } catch (error) {
      console.log("Invalid token");
    }
  }

  // =========================
  // PRODUCT PROTECTION
  // =========================

  if (pathname.startsWith("/products")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }
  }

  // =========================
  // GENERAL PROTECTED ROUTES
  // =========================

  const protectedRoutes = [
    "/orders",
    "/cart",
    "/checkout",
    "/addresses",
    "/profile",
  ];

  const isProtected = protectedRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(route + "/")
  );

  if (!token && isProtected) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  // =========================
  // AUTH ROUTE REDIRECTS
  // =========================

  if (pathname.startsWith("/auth")) {
    if (token) {
      if (role === "admin") {
        return NextResponse.redirect(
          new URL("/admin/dashboard", request.url)
        );
      }

      if (role === "vendor") {
        return NextResponse.redirect(
          new URL("/vendors/vendor-dashboard", request.url)
        );
      }

      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // =========================
  // ADMIN AUTHORIZATION
  // =========================

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }

    if (role !== "admin") {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }
  }

  // =========================
  // VENDOR AUTHORIZATION
  // =========================

  if (pathname.startsWith("/vendors")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }

    if (role !== "vendor") {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/orders/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/addresses/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/vendors/:path*",
  ],
};