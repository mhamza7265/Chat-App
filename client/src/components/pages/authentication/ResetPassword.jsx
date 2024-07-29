import { useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { useEffect, useState } from "react";
import sendRequest from "../../../utility/apiManager";
import { errorToast, successToast } from "../../../utility/toast";
import { useNavigate } from "react-router";
import InputPassword from "../../common/InputPassword";
import InputConfirmPassword from "../../common/InputConfirmPassword";

function ResetPassword() {
  const [spinnerStatus, setSpinnerStatus] = useState(false);
  const [renderPage, setRenderPage] = useState(false);
  const [emailAddress, setEmailAddress] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const queryString = window.location?.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams?.get("token");
    console.log("string", token);
    if (token) {
      sendRequest("post", "verifyReset", { token })
        .then((res) => {
          if (res.status) {
            setRenderPage(true);
            setEmailAddress(res.user.email);
          } else {
            setRenderPage(false);
            errorToast(res.error);
          }
        })
        .catch((err) => {
          setRenderPage(false);
          errorToast(err);
        });
    } else {
      setRenderPage(false);
      errorToast("Invalid URL Parameters");
    }
  }, []);

  const onSubmit = (data) => {
    setSpinnerStatus(true);
    sendRequest("put", "resetPw", { ...data, email: emailAddress })
      .then((res) => {
        setSpinnerStatus(false);
        if (res.status) {
          successToast(res.message);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      })
      .catch((err) => {
        console.log("err", err);
        setSpinnerStatus(false);
        errorToast(err);
      });
  };

  return (
    <>
      {renderPage && (
        <div className="container-form">
          <div className="verification form">
            <BarLoader
              color={"#ffffff"}
              loading={spinnerStatus}
              cssOverride={override}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <header>Reset Password</header>
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputPassword
                register={register}
                name="newPassword"
                placeholder="New password"
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
                confirmInputName={"newPassword"}
              />
              <button type="submit" className="button">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
