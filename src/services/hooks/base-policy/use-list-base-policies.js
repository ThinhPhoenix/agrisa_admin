import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { message } from "antd";
import { useCallback, useEffect, useState } from "react";

export function useListBasePolicies() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBasePolicies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(
                endpoints.policy.base_policy.list
            );

            let policiesData = [];
            if (response.data?.success && response.data?.data) {
                policiesData = response.data.data;
            } else if (Array.isArray(response.data)) {
                policiesData = response.data;
            }

            setData(policiesData);
        } catch (err) {
            console.error("Error fetching base policies:", err);
            setError(err);
            message.error(
                "Lỗi khi tải danh sách chính sách cơ bản: " + err.message
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBasePolicies();
    }, [fetchBasePolicies]);

    return {
        data,
        loading,
        error,
        refetch: fetchBasePolicies,
    };
}
