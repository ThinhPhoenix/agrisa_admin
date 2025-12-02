import { policyMessage } from "@/libs/message";
import {
  Card,
  Table,
  Tag,
  Typography,
  Empty,
  Row,
  Col,
  Spin,
  Space,
  Descriptions,
  InputNumber,
  DatePicker,
  Collapse,
} from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { useMemo, useState } from "react";

const { Text } = Typography;
const { RangePicker } = DatePicker;

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

// Quality translation
const QUALITY_LABELS = {
  excellent: "Xuất sắc",
  good: "Tốt",
  fair: "Trung bình",
  poor: "Kém",
  acceptable: "Chấp nhận được",
};

export function MonitoringDataTab({ monitoringData, loadingMonitoring, formatUnixDateTime }) {
  // State for filters
  const [chartSampleSize, setChartSampleSize] = useState(30);
  const [dateRange, setDateRange] = useState(null);

  // Helper function to format Unix timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "-";
    if (formatUnixDateTime) return formatUnixDateTime(timestamp);

    const date = new Date(timestamp * 1000);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Sort by timestamp
  const sortedRecords = useMemo(() => {
    if (!monitoringData || monitoringData.length === 0) return [];
    return [...monitoringData].sort(
      (a, b) => a.measurement_timestamp - b.measurement_timestamp
    );
  }, [monitoringData]);

  // Filter records by date range if selected
  const filteredRecords = useMemo(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return sortedRecords;
    }

    const startTimestamp = dateRange[0].startOf("day").valueOf() / 1000;
    const endTimestamp = dateRange[1].endOf("day").valueOf() / 1000;

    return sortedRecords.filter(
      (r) =>
        r.measurement_timestamp >= startTimestamp &&
        r.measurement_timestamp <= endTimestamp
    );
  }, [sortedRecords, dateRange]);

  // Prepare chart data - show last N points based on sample size
  const chartRecords = useMemo(() => {
    return filteredRecords.slice(-chartSampleSize);
  }, [filteredRecords, chartSampleSize]);

  // Calculate overall statistics
  const stats = useMemo(() => {
    if (!filteredRecords || filteredRecords.length === 0) return null;

    const avgValue =
      filteredRecords.reduce((sum, r) => sum + (r.measured_value || 0), 0) /
      filteredRecords.length;
    const maxValue = Math.max(...filteredRecords.map((r) => r.measured_value || 0));
    const minValue = Math.min(...filteredRecords.map((r) => r.measured_value || 0));
    const avgConfidence =
      (filteredRecords.reduce((sum, r) => sum + (r.confidence_score || 0), 0) /
        filteredRecords.length) *
      100;

    // Data quality distribution
    const qualityCount = filteredRecords.reduce((acc, r) => {
      acc[r.data_quality] = (acc[r.data_quality] || 0) + 1;
      return acc;
    }, {});

    return {
      avgValue: avgValue.toFixed(4),
      maxValue: maxValue.toFixed(4),
      minValue: minValue.toFixed(4),
      avgConfidence: avgConfidence.toFixed(1),
      qualityCount,
    };
  }, [filteredRecords]);

  // Main trend line chart
  const trendChartData = {
    labels: chartRecords.map((r) =>
      new Date(r.measurement_timestamp * 1000).toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Giá trị đo",
        data: chartRecords.map((r) => r.measured_value),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  // Confidence bar chart
  const confidenceChartData = {
    labels: chartRecords.map((r) =>
      new Date(r.measurement_timestamp * 1000).toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Độ tin cậy (%)",
        data: chartRecords.map((r) => (r.confidence_score * 100).toFixed(1)),
        backgroundColor: "rgba(147, 51, 234, 0.6)",
        borderColor: "rgb(147, 51, 234)",
        borderWidth: 1,
      },
    ],
  };

  // Cloud cover line chart
  const cloudCoverChartData = {
    labels: chartRecords.map((r) =>
      new Date(r.measurement_timestamp * 1000).toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Mây che phủ (%)",
        data: chartRecords.map((r) => r.cloud_cover_percentage?.toFixed(1) || 0),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  // Quality pie chart
  const qualityColors = {
    excellent: "rgba(34, 197, 94, 0.8)",
    good: "rgba(59, 130, 246, 0.8)",
    acceptable: "rgba(251, 146, 60, 0.8)",
    fair: "rgba(251, 146, 60, 0.8)",
    poor: "rgba(239, 68, 68, 0.8)",
  };

  const pieChartData = stats
    ? {
        labels: Object.keys(stats.qualityCount).map((q) => QUALITY_LABELS[q] || q),
        datasets: [
          {
            label: "Số bản ghi",
            data: Object.values(stats.qualityCount),
            backgroundColor: Object.keys(stats.qualityCount).map(
              (q) => qualityColors[q] || "rgba(156, 163, 175, 0.8)"
            ),
            borderColor: Object.keys(stats.qualityCount).map((q) => {
              const bg = qualityColors[q] || "rgba(156, 163, 175, 0.8)";
              return bg.replace("0.8", "1");
            }),
            borderWidth: 2,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const cloudCoverOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} bản ghi (${percentage}%)`;
          },
        },
      },
    },
  };

  // Table columns
  const columns = [
    {
      title: policyMessage.monitoring.parameterName,
      dataIndex: "parameter_name",
      key: "parameter_name",
      width: 150,
      render: (text) => (
        <Tag color="green" style={{ fontWeight: 500 }}>
          {policyMessage.monitoring.parameters[text] || text}
        </Tag>
      ),
    },
    {
      title: policyMessage.monitoring.measuredValue,
      dataIndex: "measured_value",
      key: "measured_value",
      width: 120,
      sorter: (a, b) => a.measured_value - b.measured_value,
      render: (value, record) => (
        <strong style={{ color: "#2563eb" }}>
          {value?.toFixed(4)} {record.unit}
        </strong>
      ),
    },
    {
      title: policyMessage.monitoring.measurementTime,
      dataIndex: "measurement_timestamp",
      key: "measurement_timestamp",
      width: 150,
      sorter: (a, b) => a.measurement_timestamp - b.measurement_timestamp,
      render: formatTimestamp,
    },
    {
      title: policyMessage.monitoring.dataQuality,
      dataIndex: "data_quality",
      key: "data_quality",
      width: 120,
      filters: [
        { text: "Xuất sắc", value: "excellent" },
        { text: "Tốt", value: "good" },
        { text: "Trung bình", value: "fair" },
        { text: "Chấp nhận được", value: "acceptable" },
        { text: "Kém", value: "poor" },
      ],
      onFilter: (value, record) => record.data_quality === value,
      render: (quality) => (
        <Tag
          color={
            quality === "excellent"
              ? "green"
              : quality === "good"
              ? "blue"
              : quality === "acceptable" || quality === "fair"
              ? "orange"
              : "red"
          }
        >
          {QUALITY_LABELS[quality] || quality}
        </Tag>
      ),
    },
    {
      title: policyMessage.monitoring.confidenceScore,
      dataIndex: "confidence_score",
      key: "confidence_score",
      width: 100,
      sorter: (a, b) => a.confidence_score - b.confidence_score,
      render: (score) => (
        <span
          style={{
            color: score >= 0.9 ? "#2563eb" : score >= 0.7 ? "#ca8a04" : "#ef4444",
            fontWeight: 500,
          }}
        >
          {(score * 100).toFixed(1)}%
        </span>
      ),
    },
    {
      title: policyMessage.monitoring.cloudCover,
      dataIndex: "cloud_cover_percentage",
      key: "cloud_cover_percentage",
      width: 110,
      sorter: (a, b) => a.cloud_cover_percentage - b.cloud_cover_percentage,
      render: (value) => `${value?.toFixed(2)}%`,
    },
    {
      title: policyMessage.monitoring.measurementSource,
      dataIndex: "measurement_source",
      key: "measurement_source",
      width: 180,
      render: (source) => <Text type="secondary">{source}</Text>,
    },
  ];

  if (loadingMonitoring) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip={policyMessage.loading.monitoring} />
      </div>
    );
  }

  if (!monitoringData || monitoringData.length === 0) {
    return <Empty description={policyMessage.empty.monitoring} />;
  }

  return (
    <Space direction="vertical" size="large" className="w-full">
      {/* Filter Controls */}
      <Card size="small" title="Bộ lọc biểu đồ">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" size="small" className="w-full">
              <Text type="secondary" className="text-xs">
                Số lượng mẫu hiển thị
              </Text>
              <InputNumber
                min={10}
                max={200}
                value={chartSampleSize}
                onChange={(value) => setChartSampleSize(value || 30)}
                style={{ width: "100%" }}
                placeholder="Nhập số mẫu"
              />
            </Space>
          </Col>
          <Col xs={24} sm={12} md={16}>
            <Space direction="vertical" size="small" className="w-full">
              <Text type="secondary" className="text-xs">
                Khoảng thời gian
              </Text>
              <RangePicker
                format="DD/MM/YYYY"
                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                onChange={(dates) => setDateRange(dates)}
                style={{ width: "100%" }}
              />
            </Space>
          </Col>
        </Row>
        {dateRange && (
          <div className="mt-2">
            <Tag color="blue">
              Hiển thị {chartRecords.length} mẫu trong khoảng thời gian đã chọn
            </Tag>
          </div>
        )}
      </Card>

      {/* Statistics Card */}
      {stats && (
        <Card size="small" title="Thống kê tổng quan">
          <Descriptions column={{ xs: 2, sm: 4 }} size="small" bordered>
            <Descriptions.Item label="Giá trị TB">{stats.avgValue}</Descriptions.Item>
            <Descriptions.Item label="Giá trị Max">{stats.maxValue}</Descriptions.Item>
            <Descriptions.Item label="Giá trị Min">{stats.minValue}</Descriptions.Item>
            <Descriptions.Item label="Độ tin cậy TB">
              {stats.avgConfidence}%
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Main Trend Chart - Full Width */}
      <Card
        size="small"
        title={`Biểu đồ xu hướng (${chartRecords.length} mẫu gần nhất)`}
      >
        <div style={{ height: "320px" }}>
          <Line data={trendChartData} options={chartOptions} />
        </div>
      </Card>

      {/* Three Charts in a Row */}
      <Row gutter={[16, 16]}>
        {/* Confidence Chart */}
        <Col xs={24} md={8}>
          <Card size="small" title={`Độ tin cậy (${chartRecords.length} mẫu)`}>
            <div style={{ height: "280px" }}>
              <Bar data={confidenceChartData} options={barChartOptions} />
            </div>
          </Card>
        </Col>

        {/* Cloud Cover Chart */}
        <Col xs={24} md={8}>
          <Card size="small" title={`Mây che phủ (${chartRecords.length} mẫu)`}>
            <div style={{ height: "280px" }}>
              <Line data={cloudCoverChartData} options={cloudCoverOptions} />
            </div>
          </Card>
        </Col>

        {/* Quality Pie Chart */}
        <Col xs={24} md={8}>
          <Card size="small" title="Tỉ trọng chất lượng dữ liệu">
            <div style={{ height: "280px" }}>
              {pieChartData && <Pie data={pieChartData} options={pieChartOptions} />}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Data Quality Distribution */}
      {stats && (
        <Card size="small" title="Phân bố chất lượng dữ liệu">
          <Space wrap>
            {Object.entries(stats.qualityCount).map(([quality, count]) => (
              <Tag
                key={quality}
                color={
                  quality === "excellent"
                    ? "green"
                    : quality === "good"
                    ? "blue"
                    : quality === "fair" || quality === "acceptable"
                    ? "orange"
                    : quality === "poor"
                    ? "red"
                    : "default"
                }
                className="text-sm py-1 px-3"
              >
                {QUALITY_LABELS[quality] || quality}: <strong>{count}</strong> bản ghi
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      {/* Data Table - Collapsible */}
      <Collapse
        items={[
          {
            key: "1",
            label: (
              <div className="flex justify-between items-center">
                <span>Chi tiết dữ liệu giám sát</span>
                <Tag color="blue">{filteredRecords.length} bản ghi</Tag>
              </div>
            ),
            children: (
              <Table
                columns={columns}
                dataSource={filteredRecords}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng số ${total} bản ghi`,
                }}
                scroll={{ x: 1200 }}
                size="small"
                bordered
              />
            ),
          },
        ]}
      />
    </Space>
  );
}
