import Input from "../../common/Input";
import { useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { useState } from "react";
import sendRequest from "../../../utility/apiManager";
import { errorToast, successToast } from "../../../utility/toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function Verification() {
  const [spinnerStatus, setSpinnerStatus] = useState(false);
  const loginEmail = useSelector((state) => state.logginEmail.email);
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
    sendRequest("post", "verify", { ...data, code: Number(data.code) })
      .then((res) => {
        setSpinnerStatus(false);
        console.log("res", res);
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
        <header>Verification</header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            register={register}
            name="email"
            placeholder="Your email"
            required={true}
            error={errors}
            defaultValue={loginEmail}
            readOnly={true}
          />
          <Input
            register={register}
            name="code"
            placeholder="Enter verifcation code"
            required={true}
            error={errors}
          />
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Verification;
