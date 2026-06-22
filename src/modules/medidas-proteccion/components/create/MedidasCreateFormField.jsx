export function FormField({
  id,
  label,
  required = false,
  hint = "",
  error = "",
  className = "",
  children,
}) {
  return (
    <div
      className={[
        "mp-ui-field",
        error ? "mp-ui-field--error" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label ? (
        <div className="mp-ui-field__label-row">
          <label className="mp-ui-field__label" htmlFor={id}>
            {label}
            {required ? <span className="mp-ui-field__required"> *</span> : null}
          </label>
        </div>
      ) : null}

      {children}

      {error ? <p className="mp-ui-field__error">{error}</p> : null}
      {!error && hint ? <p className="mp-ui-field__hint">{hint}</p> : null}
    </div>
  );
}

export function TextInput({
  id,
  label,
  value,
  onChange,
  required = false,
  hint = "",
  error = "",
  disabled = false,
  placeholder = "",
  type = "text",
  name,
  autoComplete,
  className = "",
  inputClassName = "",
  ...props
}) {
  return (
    <FormField
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <input
        id={id}
        name={name || id}
        type={type}
        className={["mp-ui-input", inputClassName].filter(Boolean).join(" ")}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...props}
      />
    </FormField>
  );
}

export function SelectInput({
  id,
  label,
  value,
  onChange,
  options = [],
  required = false,
  hint = "",
  error = "",
  disabled = false,
  placeholder = "Selecciona una opción",
  name,
  className = "",
  selectClassName = "",
  getOptionValue = (option) => option?.id ?? option?.value ?? "",
  getOptionLabel = (option) => option?.descripcion ?? option?.label ?? "",
  ...props
}) {
  return (
    <FormField
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <select
        id={id}
        name={name || id}
        className={["mp-ui-select", selectClassName].filter(Boolean).join(" ")}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => {
          const optionValue = getOptionValue(option);
          const optionLabel = getOptionLabel(option);

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </FormField>
  );
}

export function TextareaInput({
  id,
  label,
  value,
  onChange,
  required = false,
  hint = "",
  error = "",
  disabled = false,
  placeholder = "",
  name,
  rows = 4,
  className = "",
  textareaClassName = "",
  ...props
}) {
  return (
    <FormField
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <textarea
        id={id}
        name={name || id}
        rows={rows}
        className={["mp-ui-textarea", textareaClassName].filter(Boolean).join(" ")}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        {...props}
      />
    </FormField>
  );
}

export function CheckboxField({
  id,
  label,
  checked,
  onChange,
  hint = "",
  disabled = false,
  name,
  className = "",
  ...props
}) {
  return (
    <label
      htmlFor={id}
      className={["mp-ui-check", className].filter(Boolean).join(" ")}
    >
      <input
        id={id}
        name={name || id}
        type="checkbox"
        checked={Boolean(checked)}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />

      <span className="mp-ui-check__content">
        <span className="mp-ui-check__label">{label}</span>
        {hint ? <span className="mp-ui-check__hint">{hint}</span> : null}
      </span>
    </label>
  );
}

export function SectionCard({
  kicker,
  title,
  description,
  badge,
  children,
  actions,
  accent = true,
  compact = false,
  className = "",
}) {
  return (
    <section
      className={[
        "mp-ui-card",
        accent ? "mp-ui-card--accent" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "mp-ui-card__body",
          compact ? "mp-ui-card__body--compact" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {(kicker || title || description || badge) ? (
          <div className="mp-ui-section-header">
            <div className="mp-ui-section-header__content">
              {kicker ? <span className="mp-ui-kicker">{kicker}</span> : null}
              {title ? <h2 className="mp-ui-title">{title}</h2> : null}
              {description ? (
                <p className="mp-ui-description">{description}</p>
              ) : null}
            </div>

            {badge ? <div>{badge}</div> : null}
          </div>
        ) : null}

        {children}

        {actions ? <div className="mp-ui-actions">{actions}</div> : null}
      </div>
    </section>
  );
}

export function PrimaryButton({
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={["mp-ui-button", "mp-ui-button--primary", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={["mp-ui-button", "mp-ui-button--secondary", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={["mp-ui-button", "mp-ui-button--ghost", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export default {
  FormField,
  TextInput,
  SelectInput,
  TextareaInput,
  CheckboxField,
  SectionCard,
  PrimaryButton,
  SecondaryButton,
  GhostButton,
};