import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { message } from "antd";
import { useEffect, useMemo, useState } from "react";

export function useCategories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
  });

  // Fetch data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          endpoints.policy.data_tier.category.get_all
        );

        // Handle different response formats
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
          // If data is wrapped in an object
          categoriesData = Array.isArray(response.data.data)
            ? response.data.data
            : [];
        } else {
          categoriesData = [];
        }

        // Extract last updated timestamp
        const timestamp = response.data?.meta?.timestamp || null;
        setLastUpdated(timestamp);

        setData(categoriesData);
        setError(null);
      } catch (err) {
        setError(err);
        console.error("Error fetching categories:", err);
        message.error("Lỗi khi tải dữ liệu danh mục: " + err.message);
        setData([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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

  return {
    filteredData,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    clearFilters,
    loading,
    error,
    lastUpdated,
  };
}
