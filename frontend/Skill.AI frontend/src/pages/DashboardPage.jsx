import "./DashboardPage.css";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import ProfileCard from "../components/dashboard/ProfileCard";
import StatsCards from "../components/dashboard/StatsCards";

const DashboardPage = () => {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <StatsCards />

        <ProfileCard />
      </div>
    </div>
  );
};

export default DashboardPage;