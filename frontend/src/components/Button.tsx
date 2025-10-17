import type { ButtonHTMLAttributes, ReactElement } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "danger";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  fullWidth?: boolean;
  loading?: boolean;
}

const ButtonVariants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-brand-200 text-brand-600 hover:bg-brand-300",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const DefaultButtonStyles =
  "flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

export function Button(props: ButtonProps) {
  const { variant, text, startIcon, endIcon, fullWidth, loading, ...rest } = props;

  return (
    <button
      className={`${ButtonVariants[variant]} ${DefaultButtonStyles} ${
        fullWidth ? "w-full" : ""
      } ${loading ? "cursor-progress opacity-80" : ""}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {/* Start Icon */}
      {startIcon && !loading && <div className="pr-2">{startIcon}</div>}

      {/* Button Text */}
      {text}

      {/* Spinner (only when loading) */}
      {loading && (
        <div
          className={`w-4 h-4 border-2 rounded-full animate-spin ${
            variant === "primary"
              ? "border-white border-t-transparent"
              : variant === "danger"
              ? "border-white border-t-transparent"
              : "border-gray-500 border-t-transparent"
          }`}
        />
      )}

      {/* End Icon */}
      {endIcon && !loading && <div className="pl-2">{endIcon}</div>}
    </button>
  );
}
