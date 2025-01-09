import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Input, DatePicker, Row, Col, Select } from 'antd';
import axiosInstance from '../../helper/axiosHelper';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Result = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [previewVisible, setPreviewVisible] = useState(false); 
  const [previewImage, setPreviewImage] = useState(''); 
  const [pagination, setPagination] = useState({ page: 1, limit: 10 }); 
  const [filters, setFilters] = useState({ status: '', date_range: '', image_type: '' }); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const response = await axiosInstance.get('data', {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            status: filters.status,
            date_range: filters.date_range,
            image_type: filters.image_type, // Add image type filter
          },
        });

        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
          console.log('Session expired. Please log in again.');
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
      // If the user clears the date range, reset the filter
      setFilters({
        ...filters,
        date_range: '',
      });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ status: '', date_range: '', image_type: '' });
    setPagination({ page: 1, limit: 10 }); // Reset pagination to first page
  };

  // Columns for the Ant Design Table
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (imageUrl) => (
        <Button onClick={() => handleImageClick(imageUrl)} type="link">
          <img src={imageUrl} alt="Preview" style={{ width: 50, height: 50, objectFit: 'cover' }} />
        </Button>
      ),
    },
  ];

  return (
    <div className="container mt-2 shadow p-1">
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
            value={filters.image_type}
            onChange={(value) => handleFilterChange(value, 'image_type')}
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
          total: data.total, // Assuming the API returns the total number of records
          onChange: handlePaginationChange,
        }}
      />

      {/* Modal for image preview */}
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
