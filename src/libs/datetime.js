/**
 * DateTime Utility Functions
 * Handles conversion and formatting of ISO strings and Unix timestamps
 */

/**
 * Convert ISO string to formatted date and time
 * @param {string} isoString - ISO format string (e.g., "2025-12-06T00:57:30Z")
 * @returns {Object} Object with date and time properties
 */
export const parseISOString = (isoString) => {
  if (!isoString) return { date: "", time: "" };

  try {
    const [date, timeWithZ] = isoString.split("T");
    const time = timeWithZ?.split(":").slice(0, 2).join(":") || "";

    const [year, month, day] = date.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    return {
      date: formattedDate,
      time: time,
    };
  } catch (err) {
    console.error("Error parsing ISO string:", err);
    return { date: "", time: "" };
  }
};

/**
 * Convert Unix timestamp (milliseconds) to formatted date and time
 * @param {number} unixTimestamp - Unix timestamp in milliseconds
 * @returns {Object} Object with date and time properties
 */
export const parseUnixTimestamp = (unixTimestamp) => {
  if (!unixTimestamp) return { date: "", time: "" };

  try {
    const date = new Date(unixTimestamp);

    // Extract date parts
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Extract time parts
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    return {
      date: formattedDate,
      time: time,
    };
  } catch (err) {
    console.error("Error parsing Unix timestamp:", err);
    return { date: "", time: "" };
  }
};

/**
 * Convert Unix timestamp (seconds) to formatted date and time
 * @param {number} unixSecond - Unix timestamp in seconds
 * @returns {Object} Object with date and time properties
 */
export const parseUnixSecond = (unixSecond) => {
  if (!unixSecond) return { date: "", time: "" };

  // Convert seconds to milliseconds
  return parseUnixTimestamp(unixSecond * 1000);
};

/**
 * Auto-detect and parse timestamp (Unix or ISO string)
 * @param {number|string} timestamp - Unix timestamp (ms/s) or ISO string
 * @returns {Object} Object with date and time properties
 */
export const parseTimestamp = (timestamp) => {
  if (!timestamp) return { date: "", time: "" };

  try {
    // If it's a string and contains 'T', it's ISO format
    if (typeof timestamp === "string" && timestamp.includes("T")) {
      return parseISOString(timestamp);
    }
    // Otherwise treat as Unix timestamp
    if (typeof timestamp === "number") {
      return parseUnixTimestamp(timestamp);
    }
    // Try to parse string as ISO
    if (typeof timestamp === "string") {
      return parseISOString(timestamp);
    }
  } catch (err) {
    console.error("Error parsing timestamp:", err);
  }

  return { date: "", time: "" };
};

/**
 * Format datetime for display
 * @param {Object} dateTimeObj - Object with date and time properties
 * @param {string} separator - Separator between date and time (default: "\n")
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (dateTimeObj, separator = "\n") => {
  if (!dateTimeObj || (!dateTimeObj.date && !dateTimeObj.time)) return "";
  return `${dateTimeObj.date}${separator}${dateTimeObj.time}`;
};

/**
 * Get current date and time in formatted string
 * @returns {Object} Object with current date and time
 */
export const getCurrentDateTime = () => {
  return parseUnixTimestamp(Date.now());
};

// Format UTC-aware date (optionally with time)
export function formatUtcDate(value, { withTime = false } = {}) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d)) return "-";
  return withTime
    ? d.toLocaleString("vi-VN", { timeZone: "UTC" })
    : d.toLocaleDateString("vi-VN", { timeZone: "UTC" });
}
