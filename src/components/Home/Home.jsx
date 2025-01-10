import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Input, Button, Upload, Typography, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../helper/axiosHelper";

const { Title, Text } = Typography;

const Home = () => {
  const navigate = useNavigate(); 

  const initialValues = {
    title: "",
    description: "",
    image: null,
  };

  const validationSchema = Yup.object({
    image: Yup.mixed()
      .required("An image is required")
      .test(
        "fileSize",
        "File size is too large",
        (value) => value && value.size <= 2 * 1024 * 1024 // 2MB
      )
      .test(
        "fileType",
        "Unsupported file format",
        (value) =>
          value &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
      ),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("image", values.image);
    console.log("formData", formData);
    
  
    try {
      const response = await axiosInstance.post("image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
  
      console.log("Upload successful", response.data);
  
      message.success(response.data.message || "Upload successful!");
  
      navigate("/results");
  
      resetForm();
    } catch (error) {
      console.error("Upload failed", error);
  
      const errorMessage = error.response?.data?.message || "Upload failed. Please try again.";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="m-auto bg-gray-100 p-4" style={{ width: "800px" }}>
      <Card className="shadow-lg">
        <Title level={3} className="text-center">
          Upload Image with Metadata
        </Title>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium">
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
                <label htmlFor="image" className="block text-gray-700 font-medium">
                  Image
                </label>
                <Upload
                  beforeUpload={(file) => {
                    setFieldValue("image", file);
                    return false; // Prevent automatic upload
                  }}
                  maxCount={1}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
                <ErrorMessage
                  name="image"
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
