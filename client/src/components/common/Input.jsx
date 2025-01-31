function Input({
  register,
  name,
  placeholder,
  required,
  error,
  label,
  defaultValue,
  readOnly,
  style,
}) {
  return (
    <div className="form-grp">
      {label && <label>{label}</label>}
      <input
        {...register(name, required && { required: "This field is required!" })}
        name={name}
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        readOnly={readOnly}
        autoComplete="password"
        style={{ width: style?.width ?? "100%" }}
      />
      {error && <p className="text-danger">{error[name]?.message}</p>}
    </div>
  );
}

export default Input;
