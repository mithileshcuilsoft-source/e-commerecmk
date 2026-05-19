import apiClient from "../client";


export const postRequest = async (
  url: string,
  data: any
) => {
  try {

    const res = await apiClient.post(url, data);

    return res.data;

  } catch (error: any) {

    console.log(
      "POST REQUEST ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
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