import axiosInstance from "@/libs/axios-instance";
import {
  getTierCategoryError,
  getTierCategoryInfo,
  getTierCategorySuccess,
  parseDataSourceError,
} from "@/libs/message";
import { endpoints } from "@/services/endpoints";
import { message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useCategories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
  });

  // Fetch categories data
  const fetchCategories = async () => {
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

  // Fetch data
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setLoading(true);
        const categoriesData = await fetchCategories();

        // Extract last updated timestamp
        const timestamp = categoriesData?.meta?.timestamp || null;
        setLastUpdated(timestamp);

        setData(categoriesData);
        setError(null);
      } catch (err) {
        setError(err);
        console.error("Error fetching categories:", err);
        const errorMessage = parseDataSourceError(err, "tier_category");
        message.error(errorMessage);
        setData([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  // Filter options (empty for categories)
  const filterOptions = useMemo(() => {
    return {
      statuses: [],
      types: [],
      categories: [],
    };
  }, []);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter((item) => {
      const matchesName =
        !filters.name ||
        item.category_name.toLowerCase().includes(filters.name.toLowerCase());
      return matchesName;
    });
  }, [data, filters]);

  // Summary stats
  const summaryStats = useMemo(() => {
    if (!Array.isArray(data)) {
      return {
        totalItems: 0,
        activeItems: 0,
        inactiveItems: 0,
        averageMultiplier: "0.0",
      };
    }

    const totalItems = data.length;
    const averageMultiplier =
      data.length > 0
        ? data.reduce((sum, item) => sum + item.category_cost_multiplier, 0) /
          data.length
        : 0;

    return {
      totalItems,
      activeItems: totalItems, // Assuming all are active
      inactiveItems: 0,
      averageMultiplier: averageMultiplier.toFixed(1),
    };
  }, [data]);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      name: "",
    });
  };

  // Create category
  const createCategory = async (categoryData) => {
    try {
      const response = await axiosInstance.post(
        endpoints.policy.data_tier.category.create,
        categoryData
      );
      message.success(getTierCategorySuccess("CREATE_SUCCESS"));
      // Optionally refetch data to update the list
      const newCategoriesData = await fetchCategories();
      setData(newCategoriesData);
      return response.data;
    } catch (err) {
      console.error("Error creating category:", err);
      const errorMessage = parseDataSourceError(err, "tier_category");
      message.error(errorMessage);
      throw err;
    }
  };

  // Update category
  const updateCategory = async (id, categoryData) => {
    try {
      const response = await axiosInstance.put(
        endpoints.policy.data_tier.category.update(id),
        categoryData
      );
      message.success(getTierCategorySuccess("UPDATE_SUCCESS"));
      // Refetch data to update the list
      const newCategoriesData = await fetchCategories();
      setData(newCategoriesData);
      return response.data;
    } catch (err) {
      console.error("Error updating category:", err);
      const errorMessage = parseDataSourceError(err, "tier_category");
      message.error(errorMessage);
      throw err;
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      await axiosInstance.delete(
        endpoints.policy.data_tier.category.delete(id)
      );
      message.success(getTierCategorySuccess("DELETE_SUCCESS"));
      // Refetch data to update the list
      const newCategoriesData = await fetchCategories();
      setData(newCategoriesData);
    } catch (err) {
      console.error("Error deleting category:", err);
      const errorMessage = parseDataSourceError(err, "tier_category");
      message.error(errorMessage);
      throw err;
    }
  };

  // Get single category
  const getCategory = useCallback(async (id) => {
    try {
      const response = await axiosInstance.get(
        endpoints.policy.data_tier.category.get_one(id)
      );
      let categoryData = response.data;
      if (
        response.data &&
        typeof response.data === "object" &&
        response.data.data
      ) {
        categoryData = response.data.data;
      }
      return categoryData;
    } catch (err) {
      console.error("Error fetching category:", err);
      const errorMessage = parseDataSourceError(err, "tier_category");
      message.error(errorMessage);
      throw err;
    }
  }, []);

  return {
    data,
    filteredData,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    clearFilters,
    loading,
    error,
    lastUpdated,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
  };
}
