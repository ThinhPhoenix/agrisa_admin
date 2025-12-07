import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { useCallback, useState } from "react";

export const usePartnerProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(endpoints.user.profile(id));
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchProfile,
  };
};
