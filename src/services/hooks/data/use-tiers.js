import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { useCategories } from "@/services/hooks/data/use-categories";
import { message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useTiers() {
  const { data: categories } = useCategories();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
  });

  // Fetch tiers data
  const fetchTiers = async () => {
    try {
      const response = await axiosInstance.get(
        endpoints.policy.data_tier.tier.get_all
      );
      let tiersData = response.data;
      if (Array.isArray(response.data)) {
        tiersData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        tiersData = response.data.data;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        response.data.data
      ) {
        tiersData = Array.isArray(response.data.data) ? response.data.data : [];
      } else {
        tiersData = [];
      }
      return tiersData;
    } catch (err) {
      console.error("Error fetching tiers:", err);
      throw err;
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch tiers
        const tiersData = await fetchTiers();

        // Extract last updated timestamp
        const timestamp = tiersData?.meta?.timestamp || null;
        setLastUpdated(timestamp);

        setData(tiersData);
        setError(null);
      } catch (err) {
        setError(err);
        console.error("Error fetching tiers:", err);
        message.error("Lỗi khi tải dữ liệu cấp độ: " + err.message);
        setData([]);
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

  // Create tier (wrapped in useCallback)
  const createTier = useCallback(async (tierData) => {
    try {
      const response = await axiosInstance.post(
        endpoints.policy.data_tier.tier.create,
        tierData
      );
      message.success("Cấp độ đã được tạo thành công");
      // Refetch data to update the list
      const newTiersData = await fetchTiers();
      setData(newTiersData);
      return response.data;
    } catch (err) {
      console.error("Error creating tier:", err);
      message.error(
        "Lỗi khi tạo cấp độ: " + (err.response?.data?.message || err.message)
      );
      throw err;
    }
  }, []);

  // Update tier (wrapped in useCallback)
  const updateTier = useCallback(async (id, tierData) => {
    try {
      const response = await axiosInstance.put(
        endpoints.policy.data_tier.tier.update(id),
        tierData
      );
      message.success("Cấp độ đã được cập nhật thành công");
      // Refetch data to update the list
      const newTiersData = await fetchTiers();
      setData(newTiersData);
      return response.data;
    } catch (err) {
      console.error("Error updating tier:", err);
      message.error(
        "Lỗi khi cập nhật cấp độ: " +
          (err.response?.data?.message || err.message)
      );
      throw err;
    }
  }, []);

  // Delete tier (wrapped in useCallback)
  const deleteTier = useCallback(async (id) => {
    try {
      await axiosInstance.delete(endpoints.policy.data_tier.tier.delete(id));
      message.success("Cấp độ đã được xóa thành công");
      // Refetch data to update the list
      const newTiersData = await fetchTiers();
      setData(newTiersData);
    } catch (err) {
      console.error("Error deleting tier:", err);
      message.error(
        "Lỗi khi xóa cấp độ: " + (err.response?.data?.message || err.message)
      );
      throw err;
    }
  }, []);

  // Get single tier (wrapped in useCallback to prevent infinite loops)
  const getTier = useCallback(async (id) => {
    try {
      const response = await axiosInstance.get(
        endpoints.policy.data_tier.tier.get_one(id)
      );
      let tierData = response.data;
      if (
        response.data &&
        typeof response.data === "object" &&
        response.data.data
      ) {
        tierData = response.data.data;
      }
      return tierData;
    } catch (err) {
      console.error("Error fetching tier:", err);
      message.error(
        "Lỗi khi tải cấp độ: " + (err.response?.data?.message || err.message)
      );
      throw err;
    }
  }, []); // Empty dependency array since it only uses axiosInstance and endpoints

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
    createTier,
    updateTier,
    deleteTier,
    getTier,
    fetchTiers,
  };
}
