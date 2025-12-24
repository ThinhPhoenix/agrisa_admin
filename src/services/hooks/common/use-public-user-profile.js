import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { useCallback, useState } from "react";

/**
 * Hook to fetch public user profiles by id(s)
 * Uses /profile/public/api/v1/users/own/{user_id}
 */
export const usePublicUserProfiles = () => {
  // Map of userId -> { loading, error, data }
  const [publicUsers, setPublicUsers] = useState({});

  const fetchPublicUsers = useCallback(async (ids) => {
    if (!ids || ids.length === 0) return;

    const uniqueUserIds = Array.from(
      new Set(
        ids
          .map((id) => id)
          .filter((id) => typeof id === "string" && id.trim() !== "")
      )
    );

    if (uniqueUserIds.length === 0) return;

    // Mark these users as loading if not already
    setPublicUsers((prev) => {
      const next = { ...prev };
      uniqueUserIds.forEach((id) => {
        if (!next[id] || !next[id].data) {
          next[id] = { loading: true, error: null, data: null };
        }
      });
      return next;
    });

    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          const res = await axiosInstance.get(
            endpoints.user.get_public_user_by_id(userId)
          );
          const userData = res.data?.data || res.data;

          setPublicUsers((prev) => ({
            ...prev,
            [userId]: {
              loading: false,
              error: null,
              data: userData,
            },
          }));
        } catch (err) {
          setPublicUsers((prev) => ({
            ...prev,
            [userId]: {
              loading: false,
              error: err,
              data: null,
            },
          }));
        }
      })
    );
  }, []);

  return {
    publicUsers,
    fetchPublicUsers,
  };
};
