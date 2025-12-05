import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { useCallback, useState } from "react";

/**
 * Hook for fetching data source details
 * Used to get data source information by ID
 */
const useDataSource = () => {
  const [dataSourceLoading, setDataSourceLoading] = useState(false);
  const [dataSourceError, setDataSourceError] = useState(null);

  /**
   * Fetch a single data source by ID
   * @param {string} dataSourceId - The data source ID
   * @returns {Promise<Object|null>} Data source object or null
   */
  const fetchDataSourceById = useCallback(async (dataSourceId) => {
    if (!dataSourceId) {
      return null;
    }

    try {
      const url = endpoints.policy.data_tier.data_source.get_one(dataSourceId);
      const response = await axiosInstance.get(url);

      // Handle response structure like use-sources.js
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

      if (sourceData) {
        // Transform to match the structure used in create policy
        const transformed = {
          id: sourceData.id || sourceData.data_source_id || dataSourceId,
          label: sourceData.display_name_vi || sourceData.parameter_name,
          display_name_vi: sourceData.display_name_vi,
          parameterName: sourceData.parameter_name,
          parameter_name: sourceData.parameter_name,
          unit: sourceData.unit,
          description: sourceData.description_vi || sourceData.parameter_name,
          baseCost: sourceData.base_cost,
          data_tier_id: sourceData.data_tier_id,
          data_provider: sourceData.data_provider,
          parameter_type: sourceData.parameter_type,
          min_value: sourceData.min_value,
          max_value: sourceData.max_value,
          update_frequency: sourceData.update_frequency,
          spatial_resolution: sourceData.spatial_resolution,
          accuracy_rating: sourceData.accuracy_rating,
          api_endpoint: sourceData.api_endpoint,
          ...sourceData,
        };
        return transformed;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch data source ${dataSourceId}:`, error);
      return null;
    }
  }, []);

  /**
   * Fetch multiple data sources by their IDs
   * @param {string[]} dataSourceIds - Array of data source IDs
   * @returns {Promise<Object[]>} Array of data source objects
   */
  const fetchDataSourcesByIds = useCallback(
    async (dataSourceIds) => {
      if (!dataSourceIds || dataSourceIds.length === 0) {
        return [];
      }

      setDataSourceLoading(true);
      setDataSourceError(null);

      try {
        // Fetch all data sources in parallel
        const promises = dataSourceIds.map((id) => fetchDataSourceById(id));
        const results = await Promise.all(promises);

        // Filter out null results (failed fetches)
        const dataSources = results.filter((ds) => ds !== null);

        setDataSourceLoading(false);
        return dataSources;
      } catch (error) {
        setDataSourceError(error.message || "Failed to fetch data sources");
        setDataSourceLoading(false);
        return [];
      }
    },
    [fetchDataSourceById]
  );

  return {
    dataSourceLoading,
    dataSourceError,
    fetchDataSourceById,
    fetchDataSourcesByIds,
  };
};

export default useDataSource;
