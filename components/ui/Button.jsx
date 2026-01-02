export default function Button({ 
  children, 
  variant = "primary",
  size = "medium",
  className = "",
  disabled = false,
  onClick,
  ...props 
}) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    ghost: "btn-ghost"
  };

  const sizes = {
    small: "btn-sm",
    medium: "btn-md",
    large: "btn-lg"
  };

  return (
    <button
      className={`btn ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'btn-disabled' : ''}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}