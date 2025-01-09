import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import Result from "./components/Results/Result";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Signup from "./components/RegistrationForm/Signup";
import Login from "./components/RegistrationForm/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="results"
            element={
              <PrivateRoute>
                <Result />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
