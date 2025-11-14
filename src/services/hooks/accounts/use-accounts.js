import axios from "@/libs/axios-instance";
import { useEffect, useMemo, useState } from "react";
import { endpoints } from "../../endpoints";

export function useAccounts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    username: "",
    email: "",
    role: "",
    status: "",
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(endpoints.user.list);
        const users = response.data.data.users;
        // Transform API data to match expected structure
        const transformedData = users.map((user) => ({
          id: user.id,
          username: user.email, // Use email as username
          full_name: user.email, // Use email as full name since no name field
          email: user.email,
          role: user.role === "admin" ? "Quản trị viên" : "Người dùng", // Map role to Vietnamese
          status:
            user.status === "active"
              ? "Tài khoản đang hoạt động bình thường."
              : user.status === "suspended"
              ? "Tài khoản bị tạm ngừng."
              : user.status === "pending_verification"
              ? "Tài khoản đang chờ xác minh."
              : user.status === "deactivated"
              ? "Tài khoản đã bị vô hiệu hóa."
              : user.status,
          last_login: user.last_login || user.created_at,
          avatar:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN", // Default avatar
        }));
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter options
  const filterOptions = useMemo(() => {
    const roles = [...new Set(data.map((item) => item.role))].map((role) => ({
      label: role,
      value: role,
    }));

    const statuses = [...new Set(data.map((item) => item.status))].map(
      (stat) => ({
        label: stat,
        value: stat,
      })
    );

    return {
      roles,
      statuses,
    };
  }, [data]);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesUsername =
        !filters.username ||
        item.username.toLowerCase().includes(filters.username.toLowerCase());
      const matchesEmail =
        !filters.email ||
        item.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchesRole = !filters.role || item.role === filters.role;
      const matchesStatus = !filters.status || item.status === filters.status;

      return matchesUsername && matchesEmail && matchesRole && matchesStatus;
    });
  }, [filters, data]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const totalAccounts = data.length;
    const activeAccounts = data.filter(
      (item) => item.status === "Tài khoản đang hoạt động bình thường."
    ).length;
    const adminAccounts = data.filter(
      (item) => item.role === "Quản trị viên"
    ).length;

    return {
      totalAccounts,
      activeAccounts,
      adminAccounts,
    };
  }, [data]);

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
