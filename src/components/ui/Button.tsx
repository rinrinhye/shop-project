import clsx from "clsx";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonColor = "black" | "pink";

type ButtonProps = {
	type?: "button" | "submit";
	text: string;
	disabled?: boolean;
	size?: ButtonSize;
	color?: ButtonColor;
	rounded?: boolean;
	className?: string;
	onClick?: () => void;
};

const Button = ({
	text,
	type = "button",
	disabled,
	size = "md",
	color,
	rounded = false,
	className,
	onClick,
}: ButtonProps) => {
	const sizeClass = {
		xs: "button-xs",
		sm: "button-sm",
		md: "button-md",
		lg: "button-lg",
		xl: "button-xl",
	}[size];

	const colorClass = color
		? {
				black: "button-black",
				pink: "button-pink",
		  }[color]
		: "";

	const roundedMap: Record<ButtonSize, string> = {
		xs: "rounded-md",
		sm: "rounded-lg",
		md: "rounded-xl",
		lg: "rounded-2xl",
		xl: "rounded-4xl",
	};

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={clsx(
				"button",
				sizeClass,
				colorClass,
				className,
				rounded && roundedMap[size],
				disabled && "opacity-50 cursor-not-allowed"
			)}>
			{text}
		</button>
	);
};

export default Button;
