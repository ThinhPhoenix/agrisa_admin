import mockData from "@/app/(internal)/permissions/mock.json";
import { useEffect, useMemo, useState } from "react";

export function usePermissions() {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
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
      const matchesName =
        !filters.name ||
        item.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesModule = !filters.module || item.module === filters.module;
      const matchesStatus = !filters.status || item.status === filters.status;

      return matchesName && matchesModule && matchesStatus;
    });
  }, [filters]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const totalPermissions = mockData.length;
    const activePermissions = mockData.filter(
      (item) => item.status === "Hoạt động"
    ).length;
    const modulesCount = new Set(mockData.map((item) => item.module)).size;
    const avgActions = Math.round(
      mockData.reduce((sum, item) => sum + item.actions.length, 0) /
        mockData.length
    );

    return {
      totalPermissions,
      activePermissions,
      modulesCount,
      avgActions,
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
