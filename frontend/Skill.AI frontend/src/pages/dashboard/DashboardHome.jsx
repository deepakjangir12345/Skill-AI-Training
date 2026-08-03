import Topbar from "../../components/dashboard/Topbar";
import StatsCards from "../../components/dashboard/StatsCards";
import ProfileCard from "../../components/dashboard/ProfileCard";

const DashboardHome = () => {
  return (
    <>
      <Topbar />
      <StatsCards />
      <ProfileCard />
    </>
  );
};

export default DashboardHome;