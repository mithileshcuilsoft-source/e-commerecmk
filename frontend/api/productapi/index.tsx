import apiClient from "../client";

// =========================
// MULTIPART CONFIG
// =========================

const getMultipartConfig = (
  data: any
) =>
  data instanceof FormData
    ? {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    : {};

// =========================
// CREATE PRODUCT
// =========================

export const createProduct =
  async (data: any) => {

    const res =
      await apiClient.post(
        "/products",
        data,
        getMultipartConfig(
          data
        )
      );

    return res.data;
  };

export const getVendorProducts =
  async () => {

    const res =
      await apiClient.get(
        "/products/vendor"
      );

    return res.data;
  };
export const deleteProduct =
  async (id: string) => {

    const res =
      await apiClient.delete(
        `/products/${id}`
      );

    return res.data;
  };

// =========================
// UPDATE PRODUCT
// =========================

export const updateProduct =
  async (
    id: string,
    data: any
  ) => {

    const res =
      await apiClient.put(
        `/products/${id}`,
        data,
        getMultipartConfig(
          data
        )
      );

    return res.data;
  };

// =========================
// GET ALL PRODUCTS
// =========================

export const getAllProducts =
  async () => {

    const res =
      await apiClient.get(
        "/products"
      );

    return res.data;
  };

// =========================
// GET PRODUCT BY ID
// =========================

export const getProductById =
  async (id: string) => {

    const res =
      await apiClient.get(
        `/products/${id}`
      );

    return res.data;
  };