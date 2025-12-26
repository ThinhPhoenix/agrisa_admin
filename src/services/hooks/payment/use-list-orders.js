import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { useEffect, useState } from "react";

export const useListOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(
                    endpoints.payment.order.list
                );
                if (response.data?.success && response.data?.data) {
                    setOrders(response.data.data);
                } else if (Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    setOrders([]);
                }
                setError(null);
            } catch (err) {
                setError(err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return { orders, loading, error };
};
