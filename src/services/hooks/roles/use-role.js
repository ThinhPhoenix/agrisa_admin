import mockData from "@/app/(internal)/roles/mock.json";
import { useEffect, useMemo, useState } from "react";

export function useRoles() {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    status: "",
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter options
  const filterOptions = useMemo(() => {
    const statuses = [...new Set(mockData.map((item) => item.status))].map(
      (stat) => ({
        label: stat,
        value: stat,
      })
    );

    return {
      statuses,
    };
  }, []);

  // Filtered data
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesName =
        !filters.name ||
        item.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesStatus = !filters.status || item.status === filters.status;

      return matchesName && matchesStatus;
    });
  }, [filters]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const total = mockData.length;
    const active = mockData.filter(
      (item) => item.status === "Hoạt động"
    ).length;
    const inactive = total - active;

    return {
      total,
      active,
      inactive,
    };
  }, []);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      name: "",
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
  };
}
