import { useState } from "react";

function InputPassword({
  register,
  name,
  placeholder,
  required,
  error,
  label,
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
              required: "This field is required!",
              minLength: {
                value: 8,
                message: "Minimum length is 8",
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

export default InputPassword;
