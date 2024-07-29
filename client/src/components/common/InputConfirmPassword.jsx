import { useState } from "react";

function InputConfirmPassword({
  register,
  name,
  placeholder,
  required,
  error,
  label,
  watchErr,
  confirmInputName,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleEyeClick = (e) => {
    const classList = e.target.classList;
    if (classList.contains("fa-eye")) {
      setPasswordVisible(true);
    } else {
      setPasswordVisible(false);
    }
  };
  return (
    <div className="form-grp">
      {label && <label>{label}</label>}
      <div className="position-relative">
        <input
          {...register(
            name,
            required && {
              validate: (val) => {
                if (watchErr(confirmInputName) != val) {
                  return "Your passwords do no match";
                }
              },
            }
          )}
          name={name}
          type={passwordVisible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete="password"
        />
        <div className="eye-container">
          {passwordVisible ? (
            <i
              className="fa fa-eye-slash cursor-pointer"
              onClick={handleEyeClick}
            ></i>
          ) : (
            <i
              className="fa fa-eye cursor-pointer"
              onClick={handleEyeClick}
            ></i>
          )}
        </div>
      </div>
      {error && <p className="text-danger">{error[name]?.message}</p>}
    </div>
  );
}

export default InputConfirmPassword;
