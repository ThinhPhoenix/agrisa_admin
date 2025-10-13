import mockData from "@/app/(internal)/accounts/mock.json";
import { useEffect, useMemo, useState } from "react";

export function useAccounts() {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    username: "",
    email: "",
    role: "",
    status: "",
    department: "",
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
    const roles = [...new Set(mockData.map((item) => item.role))].map(
      (role) => ({
        label: role,
        value: role,
      })
    );

    const statuses = [...new Set(mockData.map((item) => item.status))].map(
      (stat) => ({
        label: stat,
        value: stat,
      })
    );

    const departments = [
      ...new Set(mockData.map((item) => item.department)),
    ].map((dept) => ({
      label: dept,
      value: dept,
    }));

    return {
      roles,
      statuses,
      departments,
    };
  }, []);

  // Filtered data
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesUsername =
        !filters.username ||
        item.username.toLowerCase().includes(filters.username.toLowerCase());
      const matchesEmail =
        !filters.email ||
        item.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchesRole = !filters.role || item.role === filters.role;
      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesDepartment =
        !filters.department || item.department === filters.department;

      return (
        matchesUsername &&
        matchesEmail &&
        matchesRole &&
        matchesStatus &&
        matchesDepartment
      );
    });
  }, [filters]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const totalAccounts = mockData.length;
    const activeAccounts = mockData.filter(
      (item) => item.status === "Hoạt động"
    ).length;
    const adminAccounts = mockData.filter(
      (item) => item.role === "Super Admin" || item.role === "Admin"
    ).length;
    const avgPermissions = Math.round(
      mockData.reduce((sum, item) => sum + item.permissions.length, 0) /
        mockData.length
    );

    return {
      totalAccounts,
      activeAccounts,
      adminAccounts,
      avgPermissions,
    };
  }, []);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      username: "",
      email: "",
      role: "",
      status: "",
      department: "",
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
