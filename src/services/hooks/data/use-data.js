import mockData from "@/app/(internal)/data/mock.json";
import { useEffect, useMemo, useState } from "react";

export function useData(type) {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    type: "",
    category: "",
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const data = mockData[type] || [];

  // Filter options
  const filterOptions = useMemo(() => {
    const statuses =
      type === "dataSources"
        ? [
            ...new Set(
              data.map((item) => (item.is_active ? "Hoạt động" : "Tạm ngừng"))
            ),
          ].map((stat) => ({
            label: stat,
            value: stat,
          }))
        : [];

    let types = [];
    if (type === "dataSources") {
      types = [...new Set(data.map((item) => item.data_source))].map((t) => ({
        label: t,
        value: t,
      }));
    }

    let categories = [];
    if (type === "dataTiers") {
      categories = [
        ...new Set(data.map((item) => item.data_tier_category_id)),
      ].map((cat) => ({
        label:
          mockData.dataTierCategories?.find((c) => c.id === cat)
            ?.category_name || cat,
        value: cat,
      }));
    }

    return {
      statuses,
      types,
      categories,
    };
  }, [data, type]);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      let matchesName = true;
      let matchesStatus = true;
      let matchesType = true;
      let matchesCategory = true;

      if (type === "dataTierCategories") {
        matchesName =
          !filters.name ||
          item.category_name.toLowerCase().includes(filters.name.toLowerCase());
      } else if (type === "dataTiers") {
        matchesName =
          !filters.name ||
          item.tier_name.toLowerCase().includes(filters.name.toLowerCase());
        matchesCategory =
          !filters.category || item.data_tier_category_id === filters.category;
      } else if (type === "dataSources") {
        matchesName =
          !filters.name ||
          item.display_name_vi
            .toLowerCase()
            .includes(filters.name.toLowerCase()) ||
          item.parameter_name
            .toLowerCase()
            .includes(filters.name.toLowerCase());
        matchesType = !filters.type || item.data_source === filters.type;
        matchesStatus =
          !filters.status ||
          (filters.status === "Hoạt động" ? item.is_active : !item.is_active);
      }

      return matchesName && matchesStatus && matchesType && matchesCategory;
    });
  }, [data, filters, type]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const totalItems = data.length;
    let activeItems = 0;
    let inactiveItems = 0;

    if (type === "dataSources") {
      activeItems = data.filter((item) => item.is_active).length;
      inactiveItems = data.filter((item) => !item.is_active).length;
    }

    return {
      totalItems,
      activeItems,
      inactiveItems,
    };
  }, [data, type]);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      name: "",
      status: "",
      type: "",
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
  };
}
