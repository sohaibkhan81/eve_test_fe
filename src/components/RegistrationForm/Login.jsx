import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button, Card, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook to navigate to different routes

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const response = await axios.post("https://eve-backend.mrashid-te.workers.dev/user/login", values);

      if (response.data.status === "success") {
        message.success( response.data.message ||"Login successful!");
        localStorage.setItem("authToken", response.data.token)
        navigate("/");
      }
    } catch (error) {
      // Handle error from backend
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message); 
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
          Login
        </Title>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="text"
                  className="block text-gray-700 font-medium"
                >
                  Username
                </label>
                <Field
                  name="username"
                  as={Input}
                  placeholder="Enter your username"
                  className="w-full"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium"
                >
                  Password
                </label>
                <Field
                  name="password"
                  as={Input.Password}
                  placeholder="Enter your password"
                  className="w-full"
                />
                <ErrorMessage
                  name="password"
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
                  {loading || isSubmitting ? "Logging In..." : "Login"}
                </Button>
                <div className="mt-2">
                  <span>Don't have an account? </span>
                  <Link to="/signup" className="text-blue-500">
                    SignUp
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

export default Login;
