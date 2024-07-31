import Input from "../../common/Input";
import { useForm } from "react-hook-form";
import InputPassword from "../../common/InputPassword";
import { BarLoader } from "react-spinners";
import { useState } from "react";
import sendRequest from "../../../utility/apiManager";
import { errorToast, successToast, warningToast } from "../../../utility/toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { addEmail } from "../../../redux/reducers/loggingEmailReducer";
import { Link } from "react-router-dom";

function Login() {
  const [spinnerStatus, setSpinnerStatus] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const override = {
    display: "block",
    position: "absolute",
    top: "0%",
    left: 0,
    margin: "0 auto",
    borderColor: "red",
    width: "100%",
    height: "6px",
    backgroundColor: "#3bb77e",
  };

  const onSubmit = (data) => {
    setSpinnerStatus(true);
    sendRequest("post", "login", data)
      .then((res) => {
        setSpinnerStatus(false);
        console.log("res", res);
        if (res.status) {
          successToast(res.message);
          localStorage.setItem(
            "currentUser",
            JSON.stringify({ token: res.token })
          );
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          warningToast(res.error);
          dispatch(addEmail(data.email));
          setTimeout(() => {
            navigate("/verify");
          }, 2000);
        }
      })
      .catch((err) => {
        console.log("err", err);
        setSpinnerStatus(false);
        errorToast(err);
      });
  };

  return (
    <div className="container-form">
      <div className="login form">
        <BarLoader
          color={"#ffffff"}
          loading={spinnerStatus}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <header>Login</header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            register={register}
            name="email"
            placeholder="Enter your email"
            required={true}
            error={errors}
          />
          <InputPassword
            register={register}
            name="password"
            placeholder="Enter your password"
            required={true}
            error={errors}
          />
          <Link to={"/forgot-password"}>Forgot password?</Link>
          <button type="submit" className="button">
            Login
          </button>
        </form>
        <div className="signup">
          <span className="signup">
            {"Don't have an account?"}
            <Link className="ms-1" to={"/register"}>
              Signup
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
