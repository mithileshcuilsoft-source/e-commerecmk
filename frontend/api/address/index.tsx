import apiClient from "@/api/client";

// =========================
// GET ADDRESSES
// =========================

export const getAddresses =
  async () => {

    try {

      const response =
        await apiClient.get(
          "addresses"
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Get addresses error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// =========================
// CREATE ADDRESS
// =========================

export const createAddress =
  async (
    addressData: any
  ) => {

    try {

      const response =
        await apiClient.post(
          "addresses",
          addressData
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Create address error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// =========================
// UPDATE ADDRESS
// =========================

export const updateAddress =
  async (
    id: string,
    addressData: any
  ) => {

    try {

      const response =
        await apiClient.put(
          `addresses/${id}`,
          addressData
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Update address error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// =========================
// DELETE ADDRESS
// =========================

export const deleteAddress =
  async (
    id: string
  ) => {

    try {

      const response =
        await apiClient.delete(
          `addresses/${id}`
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Delete address error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// =========================
// SET DEFAULT ADDRESS
// =========================

export const setDefaultAddress =
  async (
    id: string
  ) => {

    try {

      const response =
        await apiClient.patch(
          `addresses/${id}/default`
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Set default address error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };