import { Outlet } from "react-router-dom";
import LinkedInNavbar from "./LinkedInNavbar";

const LinkedInLayout = () => {
  return (
    <div className="min-h-screen bg-[#f3f2ef] dark:bg-[#000000]">
      <LinkedInNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default LinkedInLayout;
