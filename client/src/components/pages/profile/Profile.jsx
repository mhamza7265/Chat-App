import { useEffect, useState } from "react";
import userPlaceholder from "../../../assets/images/user-placeholder.jpg";
import Input from "../../common/Input";
import InputConfirmPassword from "../../common/InputConfirmPassword";
import InputFiles from "../../common/InputFiles";
import InputPassword from "../../common/InputPassword";
import { useForm } from "react-hook-form";
import sendRequest from "../../../utility/apiManager";
import { BASE_URL } from "../../../utility/config";
import { errorToast, successToast } from "../../../utility/toast";
import { BarLoader } from "react-spinners";
import arrowDownGif from "../../../assets/images/arrow-down.gif";

function Profile() {
  const [profile, setProfile] = useState(null);
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
    top: "95%",
    left: 0,
    margin: "0 auto",
    borderColor: "red",
    width: "100%",
    height: "6px",
    backgroundColor: "#3bb77e",
  };

  useEffect(() => {
    sendRequest("get", "profile").then((res) => {
      if (res.status) {
        setProfile(res.user);
      }
    });
  }, []);

  const onSubmit = (data) => {
    console.log("data", data);
    const formData = new FormData();
    data.firstName && formData.append("firstName", data.firstName);
    data.lastName && formData.append("lastName", data.lastName);
    data.image.length > 0 && formData.append("image", data.image[0]);
    data.currentPassword &&
      formData.append("currentPassword", data.currentPassword);
    data.newPassword && formData.append("newPassword", data.newPassword);
    formData.append("email", profile?.email);

    setSpinnerStatus(true);
    sendRequest("put", "profile", formData, "formData")
      .then((res) => {
        setSpinnerStatus(false);
        if (res.status) {
          successToast(res.message);
          sendRequest("get", "profile").then((res) => {
            if (res.status) {
              setProfile(res.user);
            }
          });
        } else {
          errorToast(res.error);
        }
      })
      .catch((err) => {
        setSpinnerStatus(false);
        errorToast(err);
      });
  };

  const handleScrollDownClick = () => {
    window.scrollTo(0, 680);
  };

  return (
    <div className="container-fluid p-0 container-bg">
      <div className="proflie">
        <div className="background-pic position-relative">
          <div className="profile-card">
            <div className="img-div">
              <img
                src={
                  profile?.image
                    ? BASE_URL + "/" + profile?.image
                    : userPlaceholder
                }
                alt="User"
              />
            </div>
            <h3>{profile?.firstName + " " + profile?.lastName}</h3>
            <span>{profile?.email}</span>
          </div>
          <div
            className="w-max-content cursor-pointer"
            style={{
              position: "absolute",
              top: "482px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            onClick={handleScrollDownClick}
          >
            <span
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              Edit Profile
            </span>
            <div className="w-max-content m-auto">
              {/* <i
                className="fa fa-angle-double-down"
                style={{ fontWeight: "bold", fontSize: "22px" }}
              ></i> */}
              <img
                src={arrowDownGif}
                alt="arrow-down"
                style={{ width: "30px", height: "30px" }}
              />
            </div>
          </div>
        </div>
        <div className="profile-form form position-relative">
          <BarLoader
            color={"#ffffff"}
            loading={spinnerStatus}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <h3
            className="text-center"
            style={{ textDecoration: "underline", marginBottom: "50px" }}
          >
            EDIT PROFILE
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              register={register}
              name="firstName"
              placeholder="First Name"
              label={"First Name"}
              required={false}
              defaultValue={profile?.firstName}
              error={errors}
            />
            <Input
              register={register}
              name="lastName"
              placeholder="Last Name"
              label={"Last Name"}
              required={false}
              defaultValue={profile?.lastName}
              error={errors}
            />
            <InputFiles
              register={register}
              name="image"
              placeholder="Profile Picture"
              label={"Profile Picture"}
              required={false}
              error={errors}
            />
            <div className="password-fields">
              <InputPassword
                register={register}
                name="currentPassword"
                label="Current Password"
                placeholder="Enter current password"
                required={false}
                error={errors}
              />
              <InputPassword
                register={register}
                name="newPassword"
                label="New Password"
                placeholder="Enter new password"
                required={false}
                error={errors}
              />
              <InputConfirmPassword
                register={register}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                required={true}
                error={errors}
                watchErr={watch}
                confirmInputName={"newPassword"}
              />
            </div>
            <button type="submit" className="button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
