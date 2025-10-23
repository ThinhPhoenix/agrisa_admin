import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { message } from "antd";
import { useEffect, useMemo, useState } from "react";

export function useSources() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    status: "",
  });

  // Fetch data
  useEffect(() => {
    const fetchSources = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          endpoints.policy.data_tier.data_source.get_all
        );

        // Handle different response formats
        let sourcesData = response.data;
        if (Array.isArray(response.data)) {
          sourcesData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          sourcesData = response.data.data;
        } else if (
          response.data &&
          typeof response.data === "object" &&
          response.data.data
        ) {
          // If data is wrapped in an object
          sourcesData = Array.isArray(response.data.data)
            ? response.data.data
            : [];
        } else {
          sourcesData = [];
        }

        // Extract last updated timestamp
        const timestamp = response.data?.meta?.timestamp || null;
        setLastUpdated(timestamp);

        setData(sourcesData);
        setError(null);
      } catch (err) {
        setError(err);
        console.error("Error fetching sources:", err);
        message.error("Lỗi khi tải dữ liệu nguồn: " + err.message);
        setData([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, []);

  // Filter options
  const filterOptions = useMemo(() => {
    const types = [
      ...new Set(data.map((item) => item.data_source).filter(Boolean)),
    ];
    const statuses = [
      { label: "Hoạt động", value: "true" },
      { label: "Tạm ngừng", value: "false" },
    ];

    return {
      statuses,
      types: types.map((type) => ({ label: type, value: type })),
      categories: [],
    };
  }, [data]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter((item) => {
      const matchesName =
        !filters.name ||
        item.display_name_vi
          ?.toLowerCase()
          .includes(filters.name.toLowerCase()) ||
        item.parameter_name?.toLowerCase().includes(filters.name.toLowerCase());
      const matchesType = !filters.type || item.data_source === filters.type;
      const matchesStatus =
        !filters.status || item.is_active.toString() === filters.status;
      return matchesName && matchesType && matchesStatus;
    });
  }, [data, filters]);

  // Summary stats
  const summaryStats = useMemo(() => {
    if (!Array.isArray(data)) {
      return {
        totalItems: 0,
        activeItems: 0,
        inactiveItems: 0,
        averageCost: "0.0",
      };
    }

    const totalItems = data.length;
    const activeItems = data.filter((item) => item.is_active).length;
    const inactiveItems = totalItems - activeItems;
    const averageCost =
      data.length > 0
        ? data.reduce((sum, item) => sum + (item.base_cost || 0), 0) /
          data.length
        : 0;

    return {
      totalItems,
      activeItems,
      inactiveItems,
      averageCost: averageCost.toFixed(1),
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
      type: "",
      status: "",
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
