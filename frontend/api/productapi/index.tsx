import apiClient from "../client";

/**
 * CREATE PRODUCT
 */

export const createProduct = async (
  data: FormData
) => {
  const res = await apiClient.post(
    "/products",
    data
  );

  return res.data;
};

/**
 * UPDATE PRODUCT
 */

export const updateProduct = async (
  id: string,
  data: FormData
) => {
  const res = await apiClient.put(
    `/products/${id}`,
    data
  );

  return res.data;
};

/**
 * GET ALL PRODUCTS
 */

export const getAllProducts = async () => {
  const res = await apiClient.get("/products");

  return res.data;
};

/**
 * GET PRODUCT BY ID
 */

export const getProductById = async (
  id: string
) => {
  const res = await apiClient.get(
    `/products/${id}`
  );

  return res.data;
};

/**
 * GET VENDOR PRODUCTS
 */

export const getVendorProducts =
  async () => {
    const res = await apiClient.get(
      "/products/vendor"
    );

    return res.data;
  };

/**
 * DELETE PRODUCT
 */

export const deleteProduct = async (
  id: string
) => {
  const res = await apiClient.delete(
    `/products/${id}`
  );

  return res.data;
};