// Check if user is logged in
export const isUserLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  
  return !!token && !!user;
};

// Get token from storage
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Get user from storage
export const getUser = () => {
  if (typeof window === "undefined") return null;
  
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Remove auth data (logout)
export const clearAuthData = () => {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Set auth data (login)
export const setAuthData = (token: string, user: any) => {
  if (typeof window === "undefined") return;
  
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};
