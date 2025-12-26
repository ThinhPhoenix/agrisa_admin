import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { useEffect, useState } from "react";

export const useGetTotal = (type = "", from = "", to = "") => {
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTotal = async () => {
            if (!type) {
                setTotal(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axiosInstance.get(
                    endpoints.payment.dashboard.total(type, from, to)
                );
                if (response.data?.success && response.data?.data) {
                    setTotal(response.data.data);
                } else if (response.data) {
                    setTotal(response.data);
                } else {
                    setTotal(null);
                }
                setError(null);
            } catch (err) {
                setError(err);
                setTotal(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTotal();
    }, [type]);

    return { total, loading, error };
};
