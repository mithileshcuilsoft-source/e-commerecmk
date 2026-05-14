export function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");

    if (key === name) {
      return value;
    }
  }

  return null;
}

export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    path?: string;
    sameSite?: "Lax" | "Strict" | "None";
  } = {}
) {
  if (typeof document === "undefined") return;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.maxAge !== undefined) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  } else {
    // Default to root path to avoid issues with cookies being set on sub-paths only
    cookieString += `; path=/`;
  }

  // Add Secure and SameSite flags for better security defaults
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    cookieString += "; Secure";
  }

  if (options.sameSite) {
    cookieString += `; SameSite=${options.sameSite}`;
  } else {
    cookieString += "; SameSite=Lax";
  }

  document.cookie = cookieString;
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return;

  // To reliably delete a cookie, we should overwrite it with multiple common configurations
  // because browsers require exact matching of Domain, Path, Secure, and SameSite attributes to delete.
  const paths = ["/", "/auth", "/auth/login"];
  const domains = [
    window.location.hostname,
    `.${window.location.hostname}`,
    undefined,
  ];

  paths.forEach((path) => {
    domains.forEach((domain) => {
      let base = `${encodeURIComponent(
        name
      )}=; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
      if (domain) base += `; domain=${domain}`;

      document.cookie = base; // Standard
      document.cookie = `${base}; Secure; SameSite=None`; // Cross-origin sets
      document.cookie = `${base}; Secure; SameSite=Lax`;
    });
  });
}

export function clearAuthCookies() {
  deleteCookie("token");
  deleteCookie("refresh_token");
  deleteCookie("last_activity");

  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("apex.lastActivity");
    // Completely remove the persisted zustand store
    localStorage.removeItem("user-store");
    // Ensure rememberMe is also cleaned up globally during logout
    localStorage.removeItem("rememberMe");
  }
}
