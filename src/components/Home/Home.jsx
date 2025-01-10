import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button, Upload, Typography, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../helper/axiosHelper";

const { Title } = Typography;

const Home = () => {
  const [fileList, setFileList] = useState([]); // State for managing selected files

  const initialValues = {
    title: "",
    description: "",
    images: [],
  };

  const validationSchema = Yup.object({
    // title: Yup.string().required("Title is required"),
    // description: Yup.string().required("Description is required"),
    images: Yup.array()
      // .min(5, "At least one image is required")
      .required("Images are required"),
  });

  const handleFileChange = ({ file, fileList }) => {
    // Validate file type and size
    if (
      file.size > 2 * 1024 * 1024 || // 2MB size limit
      !["image/jpeg", "image/png", "image/jpg"].includes(file.type)
    ) {
      message.error("Invalid file format or size exceeds 2MB");
      return;
    }
    setFileList(fileList); // Update file list state
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);

    fileList.forEach((file) => {
      formData.append("images", file.originFileObj);
    });

    try {
      const response = await axiosInstance.post("image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success(response.data.message || "Upload successful!");
      resetForm();
      setFileList([]); // Clear file list
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Upload failed. Please try again.";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="m-auto bg-gray-100 p-4" style={{ width: "800px" }}>
      <Card className="shadow-lg">
        <Title level={3} className="text-center">
          Upload Multiple Images with Metadata
        </Title>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium"
                >
                  Title
                </label>
                <Field
                  name="title"
                  as={Input}
                  placeholder="Enter title"
                  className="w-full"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-medium"
                >
                  Description
                </label>
                <Field
                  name="description"
                  as={Input.TextArea}
                  placeholder="Enter description"
                  rows={4}
                  className="w-full"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="images"
                  className="block text-gray-700 font-medium"
                >
                  Images
                </label>
                <Upload
                  multiple
                  listType="picture"
                  fileList={fileList}
                  beforeUpload={() => false} // Prevent automatic upload
                  onChange={handleFileChange}
                  onRemove={(file) => {
                    setFileList((prev) =>
                      prev.filter((item) => item.uid !== file.uid)
                    );
                  }}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Select Files</Button>
                </Upload>
                <ErrorMessage
                  name="images"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="text-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  {isSubmitting ? "Uploading..." : "Submit"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Home;
