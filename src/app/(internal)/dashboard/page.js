"use client";

import {
  useDashboardRevenue,
  POLICY_STATUS,
  UNDERWRITING_STATUS,
} from "@/services/hooks/dashboard";
import { dashboardMessage } from "@/libs/message";
import { CustomForm } from "@/components/custom-form";
import {
  Layout,
  Spin,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Collapse,
  Space,
  Tag,
  Tooltip,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  FileTextOutlined,
  TeamOutlined,
  ReloadOutlined,
  RiseOutlined,
  FilterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { Chart as ChartJS, registerables } from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "./dashboard.css";

const { Title, Text } = Typography;

// Register Chart.js components
ChartJS.register(...registerables);

// Set dayjs locale to Vietnamese
dayjs.locale("vi");

// Status options for Select dropdown
const statusOptions = [
  { label: "Bản nháp", value: POLICY_STATUS.DRAFT },
  { label: "Chờ xem xét", value: POLICY_STATUS.PENDING_REVIEW },
  { label: "Chờ thanh toán", value: POLICY_STATUS.PENDING_PAYMENT },
  { label: "Đã chi trả", value: POLICY_STATUS.PAYOUT },
  { label: "Đang hoạt động", value: POLICY_STATUS.ACTIVE },
  { label: "Hết hạn", value: POLICY_STATUS.EXPIRED },
  { label: "Chờ hủy", value: POLICY_STATUS.PENDING_CANCEL },
  { label: "Đã hủy", value: POLICY_STATUS.CANCELLED },
  { label: "Bị từ chối", value: POLICY_STATUS.REJECTED },
  { label: "Tranh chấp", value: POLICY_STATUS.DISPUTE },
  {
    label: "Hủy chờ hoàn tiền",
    value: POLICY_STATUS.CANCELLED_PENDING_PAYMENT,
  },
];

const underwritingOptions = [
  { label: "Chờ xem xét", value: UNDERWRITING_STATUS.PENDING },
  { label: "Đã phê duyệt", value: UNDERWRITING_STATUS.APPROVED },
  { label: "Bị từ chối", value: UNDERWRITING_STATUS.REJECTED },
];

export default function DashboardPage() {
  // Filter states
  const [filterValues, setFilterValues] = useState({
    dateRange: [dayjs().subtract(1, "month"), dayjs()],
    status: [POLICY_STATUS.ACTIVE],
    underwriting_status: [UNDERWRITING_STATUS.APPROVED],
  });

  // Fetch revenue data
  const revenue = useDashboardRevenue();

  // Filter fields for CustomForm
  const filterFields = [
    {
      name: "dateRange",
      label: "Khoảng thời gian",
      type: "datepicker",
      placeholder: ["Từ tháng", "Đến tháng"],
      gridColumn: "span 2",
      isRangePicker: true,
      picker: "month",
      format: "MM/YYYY",
    },
    {
      name: "status",
      label: "Trạng thái đơn bảo hiểm",
      type: "multiselect",
      placeholder: "Chọn trạng thái",
      options: statusOptions,
      gridColumn: "span 2",
      showSearch: true,
      maxTagCount: 2,
    },
    {
      name: "underwriting_status",
      label: "Trạng thái thẩm định",
      type: "multiselect",
      placeholder: "Chọn trạng thái thẩm định",
      options: underwritingOptions,
      gridColumn: "span 1",
      showSearch: true,
    },
    {
      name: "apply",
      type: "button",
      buttonText: "Áp dụng bộ lọc",
      buttonType: "primary",
      buttonIcon: <FilterOutlined />,
      gridColumn: "span 1",
      onClick: handleApplyFilters,
    },
    {
      name: "clear",
      type: "button",
      buttonText: "Xóa bộ lọc",
      buttonType: "default",
      buttonIcon: <ClearOutlined />,
      gridColumn: "span 1",
      onClick: handleClearFilters,
    },
  ];

  // Apply filters
  function handleApplyFilters(values) {
    const { dateRange, status, underwriting_status } = values;
    const [startDate, endDate] = dateRange || [];

    revenue.updateFilters({
      year: endDate ? endDate.year() : new Date().getFullYear(),
      month: endDate ? endDate.month() + 1 : new Date().getMonth() + 1,
      status: status && status.length > 0 ? status : ["active"],
      underwriting_status:
        underwriting_status && underwriting_status.length > 0
          ? underwriting_status
          : ["approved"],
    });
  }

  // Clear filters
  function handleClearFilters() {
    const defaultValues = {
      dateRange: [dayjs().subtract(1, "month"), dayjs()],
      status: [POLICY_STATUS.ACTIVE],
      underwriting_status: [UNDERWRITING_STATUS.APPROVED],
    };

    setFilterValues(defaultValues);

    revenue.updateFilters({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      status: ["active"],
      underwriting_status: ["approved"],
    });
  }

  if (revenue.loading) {
    return (
      <Layout.Content className="dashboard-content">
        <div className="dashboard-loading">
          <Spin size="large" tip={dashboardMessage.loading.dashboard} />
        </div>
      </Layout.Content>
    );
  }

  // Growth indicator
  const growthIndicator = revenue.getGrowthIndicator();

  // Prepare revenue comparison chart
  const revenueComparisonData = revenue.data
    ? {
        labels: [
          `${dashboardMessage.months[revenue.data.previous_month?.month]} ${revenue.data.previous_month?.year}`,
          `${dashboardMessage.months[revenue.data.current_month?.month]} ${revenue.data.current_month?.year}`,
        ],
        datasets: [
          {
            label: dashboardMessage.revenue.totalRevenue,
            data: [
              revenue.data.previous_month?.total_revenue || 0,
              revenue.data.current_month?.total_revenue || 0,
            ],
            borderColor: "#18573f",
            backgroundColor: "rgba(24, 87, 63, 0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: "#18573f",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
          },
        ],
      }
    : null;

  // Prepare policy count comparison chart
  const policyComparisonData = revenue.data
    ? {
        labels: [
          dashboardMessage.months[revenue.data.previous_month?.month],
          dashboardMessage.months[revenue.data.current_month?.month],
        ],
        datasets: [
          {
            label: dashboardMessage.chart.policies,
            data: [
              revenue.data.previous_month?.total_policies || 0,
              revenue.data.current_month?.total_policies || 0,
            ],
            backgroundColor: ["#a5d7be", "#18573f"],
            borderWidth: 0,
            borderRadius: 8,
          },
          {
            label: dashboardMessage.chart.providers,
            data: [
              revenue.data.previous_month?.total_providers || 0,
              revenue.data.current_month?.total_providers || 0,
            ],
            backgroundColor: ["#fcf2cd", "#f7e8ab"],
            borderWidth: 0,
            borderRadius: 8,
          },
        ],
      }
    : null;

  return (
    <Layout.Content className="dashboard-content">
      <div className="dashboard-space">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <Title level={2} className="dashboard-title">
              {dashboardMessage.title.main}
            </Title>
            <Text className="dashboard-subtitle">
              {dashboardMessage.subtitle.main}
            </Text>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => revenue.refetch()}
            type="default"
            size="large"
          >
            {dashboardMessage.actions.refresh}
          </Button>
        </div>

        {/* Filter Section with CustomForm */}
        <Card className="dashboard-filter-card" style={{ marginBottom: 24 }}>
          <Collapse
            defaultActiveKey={["1"]}
            ghost
            items={[
              {
                key: "1",
                label: (
                  <Space>
                    <FilterOutlined
                      style={{ fontSize: 16, color: "#18573f" }}
                    />
                    <Text strong style={{ fontSize: 15 }}>
                      Bộ lọc dữ liệu
                    </Text>
                    <Tag color="processing">
                      {filterValues.status?.length || 0} trạng thái
                    </Tag>
                    <Tag color="success">
                      {filterValues.underwriting_status?.length || 0} thẩm định
                    </Tag>
                  </Space>
                ),
                children: (
                  <CustomForm
                    fields={filterFields}
                    gridColumns="repeat(6, 1fr)"
                    gap="16px"
                    initialValues={filterValues}
                    onSubmit={handleApplyFilters}
                    onValuesChange={(changed, all) => setFilterValues(all)}
                  />
                ),
              },
            ]}
          />
        </Card>

        {/* KPI Summary Cards */}
        <div className="dashboard-summary-row">
          <Tooltip title="Tổng doanh thu của tháng hiện tại">
            <div className="dashboard-summary-card-compact">
              <div className="dashboard-summary-icon total">
                <DollarOutlined />
              </div>
              <div className="dashboard-summary-content">
                <div className="dashboard-summary-value-compact">
                  {revenue.formatCurrency(
                    revenue.data?.current_month?.total_revenue || 0
                  )}
                </div>
                <div className="dashboard-summary-label-compact">
                  {dashboardMessage.revenue.currentMonthRevenue}
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip title="Tổng số đơn bảo hiểm đang hoạt động">
            <div className="dashboard-summary-card-compact">
              <div className="dashboard-summary-icon active">
                <FileTextOutlined />
              </div>
              <div className="dashboard-summary-content">
                <div className="dashboard-summary-value-compact">
                  {revenue.data?.total_active_policies || 0}
                </div>
                <div className="dashboard-summary-label-compact">
                  {dashboardMessage.revenue.totalActivePolicies}
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip title="Số nhà cung cấp bảo hiểm đang hoạt động">
            <div className="dashboard-summary-card-compact">
              <div className="dashboard-summary-icon pending">
                <TeamOutlined />
              </div>
              <div className="dashboard-summary-content">
                <div className="dashboard-summary-value-compact">
                  {revenue.data?.total_active_providers || 0}
                </div>
                <div className="dashboard-summary-label-compact">
                  {dashboardMessage.revenue.totalActiveProviders}
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip
            title={
              growthIndicator.isPositive === true
                ? "Doanh thu tăng so với tháng trước"
                : growthIndicator.isPositive === false
                ? "Doanh thu giảm so với tháng trước"
                : "Doanh thu không thay đổi"
            }
          >
            <div className="dashboard-summary-card-compact">
              <div
                className={`dashboard-summary-icon ${
                  growthIndicator.isPositive === true
                    ? "active"
                    : growthIndicator.isPositive === false
                    ? "warning"
                    : "total"
                }`}
              >
                {growthIndicator.isPositive === true ? (
                  <ArrowUpOutlined />
                ) : growthIndicator.isPositive === false ? (
                  <ArrowDownOutlined />
                ) : (
                  <RiseOutlined />
                )}
              </div>
              <div className="dashboard-summary-content">
                <div
                  className="dashboard-summary-value-compact"
                  style={{ color: growthIndicator.color }}
                >
                  {growthIndicator.text}
                </div>
                <div className="dashboard-summary-label-compact">
                  {dashboardMessage.revenue.monthlyGrowthRate}
                </div>
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Charts Section */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {/* Revenue Trend Line Chart */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <DollarOutlined style={{ color: "#18573f" }} />
                  {dashboardMessage.revenue.revenueComparison}
                </Space>
              }
              className="dashboard-card"
              extra={
                <Tag color="success">
                  Tăng trưởng: {revenue.data?.monthly_growth_rate || 0}%
                </Tag>
              }
            >
              {revenueComparisonData ? (
                <Line
                  data={revenueComparisonData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: "rgba(24, 87, 63, 0.9)",
                        padding: 12,
                        titleFont: { size: 14, weight: "bold" },
                        bodyFont: { size: 13 },
                        callbacks: {
                          label: (context) =>
                            `${dashboardMessage.chart.revenue}: ${revenue.formatCurrency(
                              context.parsed.y
                            )}`,
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: { color: "rgba(0, 0, 0, 0.05)" },
                        ticks: {
                          font: { size: 12 },
                          callback: (value) =>
                            new Intl.NumberFormat("vi-VN", {
                              notation: "compact",
                              compactDisplay: "short",
                            }).format(value) + " ₫",
                        },
                      },
                      x: {
                        grid: { display: false },
                        ticks: { font: { size: 12, weight: "500" } },
                      },
                    },
                  }}
                  height={80}
                />
              ) : (
                <div className="dashboard-empty">
                  {dashboardMessage.empty.revenue}
                </div>
              )}
            </Card>
          </Col>

          {/* Monthly Statistics */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <RiseOutlined style={{ color: "#18573f" }} />
                  {dashboardMessage.stats.overview}
                </Space>
              }
              className="dashboard-card"
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Statistic
                    title={dashboardMessage.revenue.avgRevenuePerPolicy}
                    value={
                      revenue.data?.current_month?.avg_revenue_per_policy || 0
                    }
                    precision={0}
                    prefix="₫"
                    valueStyle={{ color: "#18573f", fontSize: 22 }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={dashboardMessage.revenue.totalPoliciesThisMonth}
                    value={revenue.data?.current_month?.total_policies || 0}
                    valueStyle={{ fontSize: 20, color: "#18573f" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={dashboardMessage.revenue.totalProvidersThisMonth}
                    value={revenue.data?.current_month?.total_providers || 0}
                    valueStyle={{ fontSize: 20, color: "#f7e8ab" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Policy & Provider Comparison Bar Chart */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <FileTextOutlined style={{ color: "#18573f" }} />
                  {dashboardMessage.stats.comparison}
                </Space>
              }
              className="dashboard-card"
            >
              {policyComparisonData ? (
                <Bar
                  data={policyComparisonData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          boxWidth: 15,
                          padding: 15,
                          font: { size: 13, weight: "500" },
                        },
                      },
                      tooltip: {
                        backgroundColor: "rgba(24, 87, 63, 0.9)",
                        padding: 12,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, font: { size: 12 } },
                        grid: { color: "rgba(0, 0, 0, 0.05)" },
                      },
                      x: {
                        grid: { display: false },
                        ticks: { font: { size: 12, weight: "500" } },
                      },
                    },
                  }}
                  height={60}
                />
              ) : (
                <div className="dashboard-empty">
                  {dashboardMessage.empty.revenue}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </Layout.Content>
  );
}
