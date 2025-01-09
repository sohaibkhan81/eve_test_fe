import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button, Card, Typography, message } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const Signup = () => {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // This will be validated but not included in the payload
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = values;
      const response = await axios.post("http://localhost:8080/api/signup", payload);

      // Handle success
      if (response.status === 200) {
        message.success("Signup successful! Please check your email to verify your account.");
        resetForm();
      }
    } catch (error) {
      // Handle error from backend
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message); // Display backend error message
      } else {
        message.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <Title level={3} className="text-center">
          Signup
        </Title>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 font-medium">
                  Username
                </label>
                <Field
                  name="username"
                  as={Input}
                  placeholder="Enter username"
                  className="w-full"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium">
                  Email
                </label>
                <Field
                  name="email"
                  as={Input}
                  placeholder="Enter email"
                  className="w-full"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-medium">
                  Password
                </label>
                <Field
                  name="password"
                  as={Input.Password}
                  placeholder="Enter password"
                  className="w-full"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">
                  Confirm Password
                </label>
                <Field
                  name="confirmPassword"
                  as={Input.Password}
                  placeholder="Confirm password"
                  className="w-full"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="text-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading || isSubmitting}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  {loading || isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>
                <div className="mt-2">
                  <span>Already have an account? </span>
                  <Link to="/login" className="text-blue-500">
                    Login
                  </Link>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Signup;
