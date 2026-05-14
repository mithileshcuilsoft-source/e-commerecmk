import axios from "axios";

// =========================
// GET COOKIE
// =========================

const getCookie = (
  name: string
) => {

  if (
    typeof document ===
    "undefined"
  ) {
    return null;
  }

  const cookies =
    document.cookie.split(
      "; "
    );

  for (const cookie of cookies) {

    const [key, value] =
      cookie.split("=");

    if (key === name) {
      return value;
    }
  }

  return null;
};

// =========================
// AXIOS INSTANCE
// =========================

const apiClient =
  axios.create({
    baseURL:
      "http://localhost:5000",

    timeout: 10000,
  });

// =========================
// REQUEST INTERCEPTOR
// =========================

apiClient.interceptors.request.use(
  (config) => {

    let token =
      getCookie("token");

    // fallback localStorage
    if (
      !token &&
      typeof window !==
        "undefined"
    ) {

      token =
        localStorage.getItem(
          "token"
        );
    }

    // attach token
    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

// =========================
// RESPONSE INTERCEPTOR
// =========================

apiClient.interceptors.response.use(
  (response) =>
    response,

  (error) => {

    // =========================
    // DEBUGGING
    // =========================

    console.log(
      "FULL ERROR:",
      error
    );

    console.log(
      "STATUS:",
      error.response?.status
    );

    console.log(
      "DATA:",
      error.response?.data
    );

    console.log(
      "MESSAGE:",
      error.message
    );

    // =========================
    // AUTO LOGOUT
    // =========================

    if (
      error.response?.status ===
      401
    ) {

      // clear localStorage
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "userName"
      );

      localStorage.removeItem(
        "role"
      );

      localStorage.removeItem(
        "userId"
      );

      // clear cookie
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // SPA SAFE REDIRECT
      if (
        typeof window !==
        "undefined"
      ) {

        window.location.replace(
          "/auth/login"
        );
      }
    }

    return Promise.reject(
      error
    );
  }
);

export default apiClient;