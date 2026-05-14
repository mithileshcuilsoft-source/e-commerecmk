import { create } from "zustand";

import { persist } from "zustand/middleware";

interface AuthState {

  isLoggedIn: boolean;

  token: string | null;

  userName: string | null;

  role:
    | "admin"
    | "vendor"
    | "buyer"
    | null;

  avatar: string | null;

  isOpen: boolean;

  login: (
    userData: {
      token: string;

      userName: string;

      role: AuthState["role"];

      avatar?: string;
    }
  ) => void;

  logout: () => void;

  toggleMenu: () => void;

  setMenuOpen: (
    open: boolean
  ) => void;
}

export const useAuthStore =
  create<AuthState>()(
    persist(
      (set) => ({

        isLoggedIn: false,

        token: null,

        userName: null,

        role: null,

        avatar: null,

        isOpen: false,

        // LOGIN
        login: (
          userData
        ) => {

          localStorage.setItem(
            "token",
            userData.token
          );

          localStorage.setItem(
            "userName",
            userData.userName
          );

          localStorage.setItem(
            "role",
            userData.role || ""
          );

          document.cookie = `token=${userData.token}; path=/; max-age=604800`;

          set({
            isLoggedIn: true,

            token:
              userData.token,

            userName:
              userData.userName,

            role:
              userData.role,

            avatar:
              userData.avatar ||
              null,
          });
        },

        // LOGOUT
        logout: () => {

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

          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

          set({
            isLoggedIn: false,

            token: null,

            userName: null,

            role: null,

            avatar: null,

            isOpen: false,
          });
        },

        // MENU
        toggleMenu: () =>
          set(
            (state) => ({
              isOpen:
                !state.isOpen,
            })
          ),

        setMenuOpen: (
          open
        ) =>
          set({
            isOpen: open,
          }),
      }),

      {
        name: "auth-storage",
      }
    )
  );