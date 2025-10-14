import { Link } from "react-router";
import type { Product } from "../../types/common";
import { useCart } from "../../contexts/CartContext";
import { ROUTES } from "../../routes/routes";
import { IoHeartOutline } from "react-icons/io5";

const Card = ({ product }: { product: Product }) => {
	const { addCart } = useCart();

	return (
		<div className='relative'>
			<Link to={ROUTES.productDetail(product.id)}>
				<div>
					<div className='rounded-lg overflow-hidden'>
						<img src={product.images[0]} alt='' />
					</div>
					<div className='mt-2'>
						<span className='text-xs text-gray-400'>{product.category.name}</span>
						<p className='line-clamp-2'>{product.title}</p>
						<p className='mt-1 text-sm text-gray-600'>USD {product.price.toFixed(2)}</p>
					</div>
				</div>
			</Link>
			<button className='absolute top-3 right-3 lg:top-4 lg:right-4'>
				<IoHeartOutline size={24} color='#e2e2e2' />
				{/* <IoHeartSharp size={24} color='#ef4da2' /> */}
			</button>
			<button
				type='button'
				onClick={() => addCart(product)}
				className='font-[Outfit] mt-2 text-sm underline tracking-tight'>
				Add to Cart+
			</button>
		</div>
	);
};

export default Card;
