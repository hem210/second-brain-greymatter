import type { ButtonHTMLAttributes, ReactElement } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: "primary" | "secondary";
    text: string;
    startIcon?: ReactElement;
    endIcon?: ReactElement;
    fullWidth?: boolean;
    loading?: boolean;
}

const ButtonVariants = {
    "primary": "bg-brand-600 text-white",
    "secondary": "bg-brand-200 text-brand-400"
}

const DefaultButtonStyles = "rounded-md py-2 px-4 flex justify-center items-center"

export function Button(props: ButtonProps) {
    const { variant, text, startIcon, endIcon, fullWidth, loading, ...rest } = props;
    return <button className={`${ButtonVariants[variant]} ${DefaultButtonStyles} ${fullWidth ? " w-full" : null} ${loading ? " disabled cursor-progress opacity-45" : "cursor-pointer"}`} {...rest}>
        {startIcon ? <div className="pr-2">{startIcon}</div> : null} {text} {endIcon ? <div className="pl-2">{endIcon}</div> : null}
    </button>
}
