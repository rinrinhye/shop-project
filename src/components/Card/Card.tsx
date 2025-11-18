import { Link } from "react-router";
import type { Product } from "../../types/common";
import { useCart } from "../../contexts/CartContext";
import { ROUTES } from "../../routes/routes";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { useFavorites } from "../../contexts/FavoriteContext";
import ProductImage from "../ProductImage/ProductImage";

const Card = ({ product, variant }: { product: Product; variant?: string }) => {
	const { addCart } = useCart();
	const { toggleFavorites, isFavorite } = useFavorites();

	const variantClass = variant === "summary" ? "line-clamp-1" : "line-clamp-2";

	return (
		<div className='relative'>
			<Link to={ROUTES.productDetail(product.id)}>
				<div>
					<ProductImage src={product.images[0]} variant='square' />
					<div className='mt-2'>
						<span className='text-xs text-gray-400'>{product.category.name}</span>
						<p className={variantClass}>{product.title}</p>
						<p className='mt-1 text-sm text-gray-700'>
							USD {product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
						</p>
					</div>
				</div>
			</Link>
			<button
				className='absolute flex items-center justify-center top-0 right-0 w-12 h-12 lg:w-16 lg:h-16'
				onClick={() => toggleFavorites(product)}>
				{isFavorite(product.id) ? (
					<IoHeartSharp size={24} color='#ef4da2' />
				) : (
					<IoHeartOutline size={24} color='#e2e2e2' />
				)}
			</button>
			{variant !== "summary" && (
				<button
					type='button'
					onClick={() => addCart(product)}
					className='font-outfit mt-2 text-sm underline tracking-tight'>
					Add to Cart+
				</button>
			)}
		</div>
	);
};

export default Card;
