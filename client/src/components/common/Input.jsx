function Input({
  register,
  name,
  placeholder,
  required,
  error,
  label,
  defaultValue,
  readOnly,
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
      />
      {error && <p className="text-danger">{error[name]?.message}</p>}
    </div>
  );
}

export default Input;
