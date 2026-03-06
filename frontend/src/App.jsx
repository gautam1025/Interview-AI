import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StartInterview from "./pages/StartInterview";
import Interview from "./pages/Interview";
import Evaluation from "./pages/Evaluation";
import Layout from "./components/Layout";
import Footer from "./components/Footer";

function App() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 relative pb-[72px]">
      <Routes>
        <Route path="/" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={token ? (
          <Layout>
            <Dashboard />
          </Layout>
        ) : (
          <Navigate to="/" />
        )
        }
        />

        <Route
          path="/start"
          element={
            token ? (
              <Layout>
                <StartInterview />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/interview/:id"
          element={
            token ? (
              <Layout>
                <Interview />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/evaluation/:id"
          element={
            token ? (
              <Layout>
                <Evaluation />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;