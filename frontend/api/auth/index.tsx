import apiClient from "../client";


export const postRequest =
  async (
    url: string,
    data: any
  ) => {

    const res =
      await apiClient.post(
        url,
        data
      );

    return res.data;
  };

export const getRequest =
  async (url: string) => {

    const res =
      await apiClient.get(
        url
      );

    return res.data;
  };


export const postVendorRequest =
  async (
    url: string,
    data: any
  ) => {

    try {

      const response =
        await apiClient.post(
          url,
          data
        );

      return response.data;

    } catch (error: any) {

      console.error(
        "POST Vendor Error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };