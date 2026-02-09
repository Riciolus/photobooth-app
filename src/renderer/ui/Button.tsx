import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-[#F06647] border-2 border-yellow-900 text-yellow-950 font-semibold hover:bg-lime-500/10 focus:ring-blue-500",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={clsx(
        "inline-flex items-center justify-center font-mono rounded-2xl font-medium",
        "transition-colors focus:outline-none",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        (disabled || isLoading) &&
          "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
