import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Modal,
  Button,
  Input,
  DatePicker,
  Row,
  Col,
  Select,
  message,
  Form,
} from "antd";
import axiosInstance from "../../helper/axiosHelper";
import moment from "moment";
import axios from "axios";

const { RangePicker } = DatePicker;
const { Option } = Select;

const DEFAULT_FILTERS = {
  status: "",
  date_range: "",
  fileType: "",
  search: "",
};
const DEFAULT_PAGINATION = { page: 1, limit: 10 };

const Result = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [totalRecords, setTotalRecords] = useState(0);

  const cancelTokenSource = useRef(null); // Ref to store cancel token

  // API call function
  const fetchData = async () => {
    setLoading(true);

    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel(
        "Operation canceled due to new request."
      );
    }

    cancelTokenSource.current = axios.CancelToken.source();

    try {
      const response = await axiosInstance.get("/image/analysis", {
        params: {
          fileType: filters.fileType,
          status: filters.status,
          search: filters.search,
          page: pagination.page,
          limit: pagination.limit,
          date_range: filters.date_range,
        },
        cancelToken: cancelTokenSource.current.token, // Attach cancel token
      });

      const { images, pagination: apiPagination } = response.data.data;
      setData(images || []);
      setTotalRecords(parseInt(apiPagination.totalCount, 10));
    } catch (error) {
      // Handle errors, including canceled requests
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Error fetching data:", error);
        if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
            message.error("Session expired. Please log in again.");
          } else if (status === 404) {
            message.error("No data found for the given filters.");
          } else if (status === 500) {
            message.error("Internal server error. Please try again later.");
          } else {
            message.error(data.message || "An unexpected error occurred.");
          }
        } else if (error.request) {
          message.error(
            "Network error. Please check your internet connection."
          );
        } else {
          message.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [pagination]);

  // Handle search button click
  const handleSearchClick = () => {
    fetchData(); // Trigger the API call when search button is clicked
  };

  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ page, limit: pageSize });
  };

  const handleFilterChange = (value, key) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    if (dates && dates.length === 2) {
      setFilters({
        ...filters,
        date_range: `${dateStrings[0]}:${dateStrings[1]}`,
      });
    } else {
      setFilters({
        ...filters,
        date_range: "",
      });
    }
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPagination(DEFAULT_PAGINATION);
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "file_name",
      key: "file_name",
    },
    {
      title: "Description",
      dataIndex: "file_description",
      key: "file_description",
    },
    {
      title: "Type",
      dataIndex: "file_type",
      key: "file_type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Results",
      dataIndex: "result",
      key: "result",
    },
    {
      title: "Image",
      dataIndex: "file_path",
      key: "file_path",
      render: (filePath) => (
        <Button onClick={() => handleImageClick(filePath)} type="link">
          <img
            src={filePath}
            alt="Preview"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        </Button>
      ),
    },
  ];

  return (
    <div className="container mt-2 shadow-sm p-1">
      <h4 className="font-bold">Analysis Results</h4>

      {/* Filter Section */}
      <Form layout="vertical">
        <Row gutter={16} className="mb-5">
          <Col xs={24} sm={12} md={4}>
            <Form.Item label="Filter by Status">
              <Select
              disabled={loading || ""}
                placeholder="Select a status"
                value={filters.status || ""}
                onChange={(value) => handleFilterChange(value, "status")}
                style={{ width: "100%" }}
              >
                <Option value="processing">Processing</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Filter by Date">
              <RangePicker
              disabled={loading || ""}
                value={
                  filters.date_range
                    ? [
                        moment(filters.date_range.split(":")[0]),
                        moment(filters.date_range.split(":")[1]),
                      ]
                    : []
                }
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
                placeholder={["From Date", "To Date"]}
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Form.Item label="Filter by Image Type">
              <Select
              disabled={loading || ""}
                placeholder="Filter by Image Type"
                value={filters.fileType}
                onChange={(value) => handleFilterChange(value, "fileType")}
                style={{ width: "100%" }}
              >
                <Option value="png">PNG</Option>
                <Option value="jpg">JPG</Option>
                <Option value="jpeg">JPEG</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Form.Item label="Search by File Name">
              <Input
              disabled={loading || ""}
                placeholder="Search by File Name"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Button type="default"
             onClick={clearFilters}>
              Clear All Filters
            </Button>
            <Button
              type="primary"
              disabled={
                loading ||
                (!filters.status &&
                  !filters.date_range &&
                  !filters.fileType &&
                  !filters.search)
              }
              onClick={handleSearchClick}
              style={{ marginLeft: 10 }}
            >
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: totalRecords,
          onChange: handlePaginationChange,
        }}
      />

      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img
          alt="Preview"
          style={{ width: "100%", height: "auto" }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};

export default Result;
