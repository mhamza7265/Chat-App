function InputMessages({
  register,
  name,
  placeholder,
  error,
  label,
  defaultValue,
  readOnly,
  setBtnIsDisabled,
}) {
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value) {
      setBtnIsDisabled(false);
    } else {
      setBtnIsDisabled(true);
    }
  };

  return (
    <div className="form-grp">
      {label && <label>{label}</label>}
      <input
        {...register(name, { onChange: handleInputChange })}
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

export default InputMessages;
