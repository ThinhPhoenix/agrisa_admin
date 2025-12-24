import axiosInstance from "@/libs/axios-instance";
import { useCallback, useState } from "react";

const useMarkPayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const markPayment = useCallback(async (id) => {
        if (!id) {
            setError("ID is required");
            return { success: false };
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post(
                `/policy/protected/api/v2/data-bill/mark-payment/${id}`
            );
            setLoading(false);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "Failed to mark payment";
            setError(errorMessage);
            setLoading(false);
            return { success: false, error: errorMessage };
        }
    }, []);

    return {
        markPayment,
        loading,
        error,
    };
};

export default useMarkPayment;
