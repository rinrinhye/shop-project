type ProductImageProps = {
	src?: string;
	alt?: string;
	variant?: "square" | "wide";
	className?: string;
};

const ProductImage = ({ src, alt = "", variant = "square", className = "" }: ProductImageProps) => {
	const wrapperClass =
		variant === "square" ? "rounded-lg overflow-hidden aspect-square" : "rounded-2xl overflow-hidden lg:max-w-140";

	return (
		<div className={`${wrapperClass} ${className}`}>
			<img
				src={src || "/img/no_image.png"}
				alt={alt}
				className='w-full h-full object-cover'
				onError={(e) => {
					e.currentTarget.onerror = null;
					e.currentTarget.src = "/img/no_image.png";
				}}
			/>
		</div>
	);
};

export default ProductImage;
