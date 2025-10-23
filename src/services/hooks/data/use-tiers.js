import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { message } from "antd";
import { useEffect, useMemo, useState } from "react";

export function useTiers() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch tiers
        const tiersResponse = await axiosInstance.get(
          endpoints.policy.data_tier.tier.get_all
        );

        // Fetch categories
        const categoriesResponse = await axiosInstance.get(
          endpoints.policy.data_tier.category.get_all
        );

        // Handle tiers response
        let tiersData = tiersResponse.data;
        if (Array.isArray(tiersResponse.data)) {
          tiersData = tiersResponse.data;
        } else if (
          tiersResponse.data &&
          Array.isArray(tiersResponse.data.data)
        ) {
          tiersData = tiersResponse.data.data;
        } else if (
          tiersResponse.data &&
          typeof tiersResponse.data === "object" &&
          tiersResponse.data.data
        ) {
          tiersData = Array.isArray(tiersResponse.data.data)
            ? tiersResponse.data.data
            : [];
        } else {
          tiersData = [];
        }

        // Handle categories response
        let categoriesData = categoriesResponse.data;
        if (Array.isArray(categoriesResponse.data)) {
          categoriesData = categoriesResponse.data;
        } else if (
          categoriesResponse.data &&
          Array.isArray(categoriesResponse.data.data)
        ) {
          categoriesData = categoriesResponse.data.data;
        } else if (
          categoriesResponse.data &&
          typeof categoriesResponse.data === "object" &&
          categoriesResponse.data.data
        ) {
          categoriesData = Array.isArray(categoriesResponse.data.data)
            ? categoriesResponse.data.data
            : [];
        } else {
          categoriesData = [];
        }

        // Extract last updated timestamp
        const timestamp = tiersResponse.data?.meta?.timestamp || null;
        setLastUpdated(timestamp);

        setData(tiersData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        setError(err);
        console.error("Error fetching tiers:", err);
        message.error("Lỗi khi tải dữ liệu cấp độ: " + err.message);
        setData([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter options
  const filterOptions = useMemo(() => {
    const categoryOptions = categories.map((cat) => ({
      label: cat.category_name,
      value: cat.id,
    }));

    return {
      statuses: [],
      types: [],
      categories: categoryOptions,
    };
  }, [categories]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter((item) => {
      const matchesName =
        !filters.name ||
        item.tier_name?.toLowerCase().includes(filters.name.toLowerCase());
      const matchesCategory =
        !filters.category || item.data_tier_category_id === filters.category;
      return matchesName && matchesCategory;
    });
  }, [data, filters]);

  // Summary stats
  const summaryStats = useMemo(() => {
    if (!Array.isArray(data)) {
      return {
        totalItems: 0,
        highestLevel: 0,
        averageMultiplier: "0.0",
      };
    }

    const totalItems = data.length;
    const highestLevel =
      data.length > 0
        ? Math.max(...data.map((item) => item.tier_level || 0))
        : 0;
    const averageMultiplier =
      data.length > 0
        ? data.reduce(
            (sum, item) => sum + (item.data_tier_multiplier || 0),
            0
          ) / data.length
        : 0;

    return {
      totalItems,
      highestLevel,
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
      category: "",
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
