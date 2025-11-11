import axiosInstance from "@/libs/axios-instance";
import {
  getDataSourceError,
  getDataSourceInfo,
  getDataSourceSuccess,
  parseDataSourceError,
} from "@/libs/message";
import { endpoints } from "@/services/endpoints";
import { message } from "antd";
import { useEffect, useMemo, useState } from "react";

export function useSources() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    status: "",
  });

  // Fetch sources data
  const fetchSources = async () => {
    try {
      const response = await axiosInstance.get(
        endpoints.policy.data_tier.data_source.get_all
      );
      let sourcesData = response.data;
      if (Array.isArray(response.data)) {
        sourcesData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        sourcesData = response.data.data;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        response.data.data
      ) {
        sourcesData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
      } else {
        sourcesData = [];
      }
      return sourcesData;
    } catch (err) {
      console.error("Error fetching sources:", err);
      throw err;
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchSourcesData = async () => {
      try {
        setLoading(true);
        const sourcesData = await fetchSources();

        // Extract last updated timestamp
        const timestamp = sourcesData?.meta?.timestamp || null;
        setLastUpdated(timestamp);

        setData(sourcesData);
        setError(null);
      } catch (err) {
        setError(err);
        console.error("Error fetching sources:", err);
        const errorMessage = parseDataSourceError(err, "data_source");
        message.error(errorMessage);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSourcesData();
  }, []);

  // Filter options
  const filterOptions = useMemo(() => {
    const types = [
      ...new Set(data.map((item) => item.data_source).filter(Boolean)),
    ];
    const statuses = [
      { label: "Hoạt động", value: "true" },
      { label: "Tạm ngừng", value: "false" },
    ];

    return {
      statuses,
      types: types.map((type) => ({ label: type, value: type })),
      categories: [],
    };
  }, [data]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter((item) => {
      const matchesName =
        !filters.name ||
        item.display_name_vi
          ?.toLowerCase()
          .includes(filters.name.toLowerCase()) ||
        item.parameter_name?.toLowerCase().includes(filters.name.toLowerCase());
      const matchesType = !filters.type || item.data_source === filters.type;
      const matchesStatus =
        !filters.status || item.is_active.toString() === filters.status;
      return matchesName && matchesType && matchesStatus;
    });
  }, [data, filters]);

  // Summary stats
  const summaryStats = useMemo(() => {
    if (!Array.isArray(data)) {
      return {
        totalItems: 0,
        activeItems: 0,
        inactiveItems: 0,
        averageCost: "0.0",
      };
    }

    const totalItems = data.length;
    const activeItems = data.filter((item) => item.is_active).length;
    const inactiveItems = totalItems - activeItems;
    const averageCost =
      data.length > 0
        ? data.reduce((sum, item) => sum + (item.base_cost || 0), 0) /
          data.length
        : 0;

    return {
      totalItems,
      activeItems,
      inactiveItems,
      averageCost: averageCost.toFixed(1),
    };
  }, [data]);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      name: "",
      type: "",
      status: "",
    });
  };

  // Create source
  const createSource = async (sourceData) => {
    try {
      const response = await axiosInstance.post(
        endpoints.policy.data_tier.data_source.create,
        sourceData
      );
      message.success(getDataSourceSuccess("CREATE_SUCCESS"));
      // Refetch data to update the list
      const newSourcesData = await fetchSources();
      setData(newSourcesData);
      return response.data;
    } catch (err) {
      console.error("Error creating source:", err);
      const errorMessage = parseDataSourceError(err, "data_source");
      message.error(errorMessage);
      throw err;
    }
  };

  // Update source
  const updateSource = async (id, sourceData) => {
    try {
      const response = await axiosInstance.put(
        endpoints.policy.data_tier.data_source.update(id),
        sourceData
      );
      message.success(getDataSourceSuccess("UPDATE_SUCCESS"));
      // Refetch data to update the list
      const newSourcesData = await fetchSources();
      setData(newSourcesData);
      return response.data;
    } catch (err) {
      console.error("Error updating source:", err);
      const errorMessage = parseDataSourceError(err, "data_source");
      message.error(errorMessage);
      throw err;
    }
  };

  // Delete source
  const deleteSource = async (id) => {
    try {
      await axiosInstance.delete(
        endpoints.policy.data_tier.data_source.delete(id)
      );
      message.success(getDataSourceSuccess("DELETE_SUCCESS"));
      // Refetch data to update the list
      const newSourcesData = await fetchSources();
      setData(newSourcesData);
    } catch (err) {
      console.error("Error deleting source:", err);
      const errorMessage = parseDataSourceError(err, "data_source");
      message.error(errorMessage);
      throw err;
    }
  };

  // Get single source
  const getSource = async (id) => {
    try {
      const response = await axiosInstance.get(
        endpoints.policy.data_tier.data_source.get_one(id)
      );
      let sourceData = response.data;
      if (
        response.data &&
        typeof response.data === "object" &&
        response.data.data
      ) {
        sourceData = Array.isArray(response.data.data)
          ? response.data.data[0]
          : response.data.data;
      }
      return sourceData;
    } catch (err) {
      console.error("Error fetching source:", err);
      const errorMessage = parseDataSourceError(err, "data_source");
      message.error(errorMessage);
      throw err;
    }
  };

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
    lastUpdated,
    createSource,
    updateSource,
    deleteSource,
    getSource,
  };
}
