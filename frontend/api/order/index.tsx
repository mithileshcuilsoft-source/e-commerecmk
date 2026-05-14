import apiClient from "@/api/client";

// =========================
// CREATE ORDER
// =========================

export const createOrder =
  async (orderData: any) => {

    try {

      const response =
        await apiClient.post(
          "/orders",
          orderData
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Create order error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// =========================
// GET MY ORDERS
// =========================

export const getMyOrders =
  async () => {

    try {

      const response =
        await apiClient.get(
          "/orders"
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Get orders error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// =========================
// GET ORDER BY ID
// =========================

export const getOrderById =
  async (orderId: string) => {

    try {

      const response =
        await apiClient.get(
          `/orders/${orderId}`
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Get order error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// =========================
// GET VENDOR ORDERS
// =========================

export const getVendorOrders =
  async () => {

    try {

      const response =
        await apiClient.get(
          "/orders/vendor"
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Get vendor orders error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// =========================
// UPDATE ORDER STATUS
// =========================

export const updateOrderStatus =
  async (
    orderId: string,
    status: string,
    note?: string,
    trackingNumber?: string
  ) => {

    try {

      const response =
        await apiClient.patch(
          `/orders/${orderId}/status`,
          {
            status,
            note,
            trackingNumber,
          }
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

// =========================
// GET ORDER TRACKING
// =========================

export const getOrderTracking =
  async (orderId: string) => {

    try {

      const response =
        await apiClient.get(
          `/orders/${orderId}/tracking`
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "Get order tracking error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// =========================
// CALCULATE CHECKOUT
// =========================

export const calculateCheckout =
  async (checkoutData: any) => {

    try {

      const response =
        await apiClient.post(
          "/orders/calculate",
          checkoutData
        );

      return response.data;

    } catch (error: any) {

      if (
        error.response?.status >=
        400
      ) {

        console.error(
          "Calculate checkout error:",
          error.response?.data ||
            error.message
        );
      }

      return error.response?.data;
    }
  };