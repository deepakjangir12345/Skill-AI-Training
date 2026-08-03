import { Outlet } from "react-router-dom";
import "./DashboardPage.css";
import Sidebar from "../components/dashboard/Sidebar";

const DashboardPage = () => {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardPage;