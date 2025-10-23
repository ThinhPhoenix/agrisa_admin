import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";

export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get(
      endpoints.policy.data_tier.category.get_all
    );
    let categoriesData = response.data;
    if (Array.isArray(response.data)) {
      categoriesData = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      categoriesData = response.data.data;
    } else if (
      response.data &&
      typeof response.data === "object" &&
      response.data.data
    ) {
      categoriesData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
    } else {
      categoriesData = [];
    }
    return categoriesData;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
};
