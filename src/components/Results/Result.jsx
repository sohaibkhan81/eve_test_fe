import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Input, DatePicker, Row, Col, Select, message } from 'antd';
import axiosInstance from '../../helper/axiosHelper';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DEFAULT_FILTERS = { status: '', date_range: '', fileType: '' };
const DEFAULT_PAGINATION = { page: 1, limit: 10 };
const Result = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [previewVisible, setPreviewVisible] = useState(false); 
  const [previewImage, setPreviewImage] = useState(''); 
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION); // Pagination state
  const [filters, setFilters] = useState(DEFAULT_FILTERS); // Filter state
  const [totalRecords, setTotalRecords] = useState(0); 


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const response = await axiosInstance.get('/image/analysis', {
          params: {
            fileType: filters.fileType,
            status: filters.status,
            page: pagination.page,
            limit: pagination.limit,
            date_range: filters.date_range,
          },
        });
        // console.log(response.data.data);
        
  
        const { images, pagination: apiPagination } = response.data.data;
  
        // Update state with API response
        setData(images || []);
        setTotalRecords(parseInt(apiPagination.totalCount, 10));
  
        message.success(response.data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
  
        // Handle specific API error responses
        if (error.response) {
          const { status, data } = error.response;
  
          if (status === 401) {
            message.error('Session expired. Please log in again.');
          } else if (status === 404) {
            message.error('No data found for the given filters.');
          } else if (status === 500) {
            message.error('Internal server error. Please try again later.');
          } else {
            message.error(data.message || 'An unexpected error occurred.');
          }
        } else if (error.request) {
          // Network or server issues
          message.error('Network error. Please check your internet connection.');
        } else {
          // Other unexpected errors
          message.error('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [pagination, filters]);
  

  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true); 
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ page, limit: pageSize });
  };

  // Handle filter changes
  const handleFilterChange = (value, key) => {
    setFilters({ ...filters, [key]: value });
  };

  // Handle Date Range change
  const handleDateRangeChange = (dates, dateStrings) => {
    if (dates && dates.length === 2) {
      setFilters({
        ...filters,
        date_range: `${dateStrings[0]}:${dateStrings[1]}`,
      });
    } else {
      setFilters({
        ...filters,
        date_range: '',
      });
    }
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPagination(DEFAULT_PAGINATION); 
  };
  // Columns for the Ant Design Table
  const columns = [
    {
      title: 'File Name',
      dataIndex: 'file_name',
      key: 'file_name',
    },
    {
      title: 'Description',
      dataIndex: 'file_description',
      key: 'file_description',
    },
    {
      title: 'Type',
      dataIndex: 'file_type',
      key: 'file_type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Results',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: 'Image',
      dataIndex: 'file_path',
      key: 'file_path',
      render: (filePath) => (
        <Button onClick={() => handleImageClick(filePath)} type="link">
          <img src={filePath} alt="Preview" style={{ width: 50, height: 50, objectFit: 'cover' }} />
        </Button>
      ),
    },
  ];

  return (
    <div className="container mt-2 shadow-sm p-1">
      <h4 className="font-bold">Results</h4>

      {/* Filter Section */}
      <Row gutter={16} className="mb-5">
        <Col span={6}>
          <Select
            placeholder="Filter by Status"
            value={filters.status}
            onChange={(value) => handleFilterChange(value, 'status')}
            style={{ width: '100%' }}
          >
            <Option value="processing">Processing</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Col>
        <Col span={6}>
          <RangePicker
            value={
              filters.date_range
                ? [
                    moment(filters.date_range.split(':')[0]),
                    moment(filters.date_range.split(':')[1]),
                  ]
                : []
            }
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
            placeholder={['From Date', 'To Date']}
            allowClear
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder="Filter by Image Type"
            value={filters.fileType}
            onChange={(value) => handleFilterChange(value, 'fileType')}
            style={{ width: '100%' }}
          >
            <Option value="png">PNG</Option>
            <Option value="jpg">JPG</Option>
            <Option value="jpeg">JPEG</Option>
          </Select>
        </Col>
        <Col span={6}>
          <Button type="default" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </Col>
      </Row>

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
          style={{ width: '100%', height: 'auto' }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};

export default Result;
