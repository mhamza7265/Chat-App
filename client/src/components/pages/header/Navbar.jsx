import { NavLink, useNavigate, Link } from "react-router-dom";
import logo from "../../../assets/images/chat-vector.svg";
import { successToast } from "../../../utility/toast";

function Navbar() {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem("currentUser");
    successToast("Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="nav-bar">
      <div className="header">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
        <div className="nav-btns">
          <div className="d-flex justify-content-between align-items-center">
            {/* <NavLink className="navlinks me-3" to={"/chat"}>
            CHAT
          </NavLink> */}
            <NavLink className="navlinks" to={"/profile"}>
              PROFILE
            </NavLink>
          </div>
          <span className="cursor-pointer" onClick={handleLogoutClick}>
            LOGOUT
          </span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
