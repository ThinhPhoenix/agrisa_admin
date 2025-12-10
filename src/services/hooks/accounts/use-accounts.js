import axiosInstance from "@/libs/axios-instance";
import { message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { endpoints } from "../../endpoints";

export function useAccounts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [filters, setFilters] = useState({
    username: "",
    email: "",
    role: "",
    status: "",
  });

  // Fetch roles from API
  const fetchRoles = useCallback(async () => {
    try {
      const response = await axiosInstance.get(endpoints.auth.roles);
      // API returns roles directly in response.data.roles, not in response.data.data
      const rolesData = response.data?.roles || [];
      console.log("Fetched roles:", rolesData);
      setRoles(rolesData);
    } catch (err) {
      console.error("Error fetching roles:", err);
      console.error("Endpoint:", endpoints.auth.roles);
      console.error("Response:", err.response?.data);
      message.error("Lỗi khi tải danh sách vai trò: " + err.message);
      setRoles([]);
    }
  }, []);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(endpoints.user.list);
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
      setError(null);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError(err);
      message.error("Lỗi khi tải danh sách người dùng: " + err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, [fetchData, fetchRoles]);

  // Filter options
  const filterOptions = useMemo(() => {
    // Use roles from API instead of extracting from data
    const roleOptions = roles.map((role) => ({
      label: role.display_name || role.name,
      value: role.name,
    }));

    const statuses = [...new Set(data.map((item) => item.status))].map(
      (stat) => ({
        label: stat,
        value: stat,
      })
    );

    return {
      roles: roleOptions,
      statuses,
    };
  }, [data, roles]);

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

  // Register user with role
  const registerUser = useCallback(
    async (userData, roleName) => {
      try {
        const response = await axiosInstance.post(
          endpoints.user.register(roleName),
          userData
        );
        message.success("Đăng ký tài khoản thành công!");
        await fetchData(); // Refresh data
        return response.data;
      } catch (err) {
        console.error("Error registering user:", err);
        const errorMessage =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Lỗi khi đăng ký tài khoản";
        message.error(errorMessage);
        throw err;
      }
    },
    [fetchData]
  );

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
    refetch: fetchData,
    roles,
    registerUser,
  };
}
