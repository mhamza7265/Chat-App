import { useForm } from "react-hook-form";
import Input from "../../common/Input";
import InputPassword from "../../common/InputPassword";
import sendRequest from "../../../utility/apiManager";
import { errorToast, successToast } from "../../../utility/toast";
import { BarLoader } from "react-spinners";
import { useState } from "react";
import InputConfirmPassword from "../../common/InputConfirmPassword";
import InputFiles from "../../common/InputFiles";

function Register() {
  const [spinnerStatus, setSpinnerStatus] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
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
    console.log("data", data);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("password", data.password);
    formData.append("image", data.image[0]);
    setSpinnerStatus(true);
    sendRequest("post", "register", formData, "formData")
      .then((res) => {
        console.log("res", res);
        setSpinnerStatus(false);
        if (res.status) {
          successToast(res.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
        setSpinnerStatus(false);
        errorToast(err);
      });
  };

  return (
    <div className="container h-100">
      <div className="container-form">
        <div className="registration form">
          <BarLoader
            color={"#ffffff"}
            loading={spinnerStatus}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <header>Signup</header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              register={register}
              name="email"
              placeholder="Enter your email"
              required={true}
              error={errors}
            />
            <Input
              register={register}
              name="firstName"
              placeholder="First Name"
              required={true}
              error={errors}
            />
            <Input
              register={register}
              name="lastName"
              placeholder="Last Name"
              required={true}
              error={errors}
            />
            <InputFiles
              register={register}
              name="image"
              placeholder="Profile Picture"
              label={"Profile Picture"}
              required={true}
              error={errors}
            />
            <InputPassword
              register={register}
              name="password"
              placeholder="Create a password"
              required={true}
              error={errors}
            />
            <InputConfirmPassword
              register={register}
              name="confirmPassword"
              placeholder="Confirm your password"
              required={true}
              error={errors}
              watchErr={watch}
              confirmInputName={"password"}
            />
            <button type="submit" className="button">
              Signup
            </button>
          </form>
          <div className="signup">
            <span className="signup">
              Already have an account?
              <label htmlFor="check">Login</label>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
