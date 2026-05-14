import apiClient from "../client";

// =========================
// TYPES
// =========================

export interface AddToCartPayload {
  productId: string;
  quantity?: number;
  variant?: string;
}

// =========================
// GET CART
// =========================

export const getCart =
  async () => {

    try {

      const response =
        await apiClient.get(
          "/cart"
        );

      return response.data;

    } catch (error) {

      throw error;
    }
  };

// =========================
// ADD TO CART
// =========================

export const addToCartApi =
  async (
    cartData: AddToCartPayload
  ) => {

    try {

      const response =
        await apiClient.post(
          "/cart/add",
          cartData
        );

      return response.data;

    } catch (error) {

      throw error;
    }
  };

// =========================
// UPDATE CART ITEM
// =========================

export const updateCartItemApi =
  async (
    itemId: string,
    quantity: number
  ) => {

    try {

      const response =
        await apiClient.put(
          `/cart/item/${itemId}`,
          { quantity }
        );

      return response.data;

    } catch (error) {

      throw error;
    }
  };

// =========================
// REMOVE CART ITEM
// =========================

export const removeCartItemApi =
  async (itemId: string) => {

    try {

      const response =
        await apiClient.delete(
          `/cart/item/${itemId}`
        );

      return response.data;

    } catch (error) {

      throw error;
    }
  };

// =========================
// CLEAR CART
// =========================

export const clearCartApi =
  async () => {

    try {

      const response =
        await apiClient.delete(
          "/cart/clear"
        );

      return response.data;

    } catch (error) {

      throw error;
    }
  };