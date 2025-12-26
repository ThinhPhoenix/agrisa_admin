import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { useEffect, useState } from "react";

export const usePaymentDetail = (id) => {
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayment = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await axiosInstance.get(
                    endpoints.payment.order.detail(id)
                );
                if (response.data?.success && response.data?.data) {
                    setPayment(response.data.data);
                } else if (response.data) {
                    setPayment(response.data);
                } else {
                    setPayment(null);
                }
                setError(null);
            } catch (err) {
                setError(err);
                setPayment(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPayment();
    }, [id]);

    return { payment, loading, error };
};
