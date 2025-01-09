import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Input, DatePicker, Row, Col } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

const Result = () => {
  const [data, setData] = useState([]); // To store the fetched data
  const [loading, setLoading] = useState(true); // To show loading spinner
  const [previewVisible, setPreviewVisible] = useState(false); // To control modal visibility
  const [previewImage, setPreviewImage] = useState(''); // To store the image URL for preview
  const [pagination, setPagination] = useState({ page: 1, limit: 10 }); // Pagination state
  const [filters, setFilters] = useState({ status: '', date_range: '' }); // Filters state

  // Fetch data from the API when the component mounts or when pagination/filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://your-api-url.com/data', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, 
          },
          params: {
            page: pagination.page,
            limit: pagination.limit,
            status: filters.status,
            date_range: filters.date_range,
          },
        });
        setData(response.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination, filters]);

  // Handle image click to show the preview
  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true); // Show modal
  };

  // Handle pagination change
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
    <div className="container mt-2">
      <h1 className="font-bold">Results</h1>

      {/* Filter Section */}
      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Input
            placeholder="Filter by Status"
            value={filters.status}
            onChange={(e) => handleFilterChange(e.target.value, 'status')}
          />
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
          <Button type="primary" onClick={() => setPagination({ ...pagination, page: 1 })}>
            Apply Filters
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
