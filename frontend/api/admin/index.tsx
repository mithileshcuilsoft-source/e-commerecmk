import apiClient from "@/api/client";

// =========================
// VENDOR MANAGEMENT
// =========================

export const getVendors =
  async () => {

    try {

      const response =
        await apiClient.get(
          "admin/vendors"
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Get vendors error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

export const blockVendor =
  async (
    vendorId: string
  ) => {

    try {

      const response =
        await apiClient.patch(
          `admin/vendors/${vendorId}/block`
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Block vendor error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

export const unblockVendor =
  async (
    vendorId: string
  ) => {

    try {

      const response =
        await apiClient.patch(
          `admin/vendors/${vendorId}/unblock`
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Unblock vendor error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

export const deleteVendor =
  async (
    vendorId: string
  ) => {

    try {

      const response =
        await apiClient.delete(
          `admin/vendors/${vendorId}`
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Delete vendor error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// =========================
// PRODUCT MANAGEMENT
// =========================

export const getAllProducts =
  async () => {

    try {

      const response =
        await apiClient.get(
          "admin/products"
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Get all products error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// =========================
// USER MANAGEMENT
// =========================

export const getAllUsers =
  async () => {

    try {

      const response =
        await apiClient.get(
          "admin/users"
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Get all users error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// =========================
// ORDER MANAGEMENT
// =========================

export const getAllOrders =
  async () => {

    try {

      const response =
        await apiClient.get(
          "admin/orders"
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Get all orders error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

export const updateOrderStatus =
  async (
    orderId: string,
    statusData: any
  ) => {

    try {

      const response =
        await apiClient.patch(
          `orders/${orderId}/status`,
          statusData
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Update order status error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };