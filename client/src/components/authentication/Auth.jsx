import { errorToast } from "../../utility/toast";
import { useNavigate } from "react-router";

function Auth({ children }) {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    return children;
  } else {
    errorToast("You must login first");
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  }
}

export default Auth;
