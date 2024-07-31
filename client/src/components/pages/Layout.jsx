import { Outlet } from "react-router";
import Navbar from "./header/Navbar";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default Layout;
