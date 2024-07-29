function InputFiles({
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
        type="file"
        placeholder={placeholder}
        defaultValue={defaultValue}
        readOnly={readOnly}
        className="input-file"
      />
      {error && <p className="text-danger">{error[name]?.message}</p>}
    </div>
  );
}

export default InputFiles;
