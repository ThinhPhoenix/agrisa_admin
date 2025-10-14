import mockData from "@/app/(internal)/permissions/mock.json";
import { useEffect, useMemo, useState } from "react";

export function usePermissions() {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: "",
    module: "",
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
    const modules = [...new Set(mockData.map((item) => item.module))].map(
      (module) => ({
        label: module,
        value: module,
      })
    );

    const statuses = [...new Set(mockData.map((item) => item.status))].map(
      (stat) => ({
        label: stat,
        value: stat,
      })
    );

    return {
      modules,
      statuses,
    };
  }, []);

  // Filtered data
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesAction =
        !filters.action ||
        item.action.toLowerCase().includes(filters.action.toLowerCase());
      const matchesModule = !filters.module || item.module === filters.module;
      const matchesStatus = !filters.status || item.status === filters.status;

      return matchesAction && matchesModule && matchesStatus;
    });
  }, [filters]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const totalPermissions = mockData.length;
    const activePermissions = mockData.filter(
      (item) => item.status === "Hoạt động"
    ).length;
    const modulesCount = new Set(mockData.map((item) => item.module)).size;
    const actionsCount = new Set(mockData.map((item) => item.action)).size;

    return {
      totalPermissions,
      activePermissions,
      modulesCount,
      actionsCount,
    };
  }, []);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      action: "",
      module: "",
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
