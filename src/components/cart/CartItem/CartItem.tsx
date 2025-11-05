import { Link } from "react-router";
import { useCart } from "../../../contexts/CartContext";
import { IoMdClose } from "react-icons/io";
import { FiMinus, FiPlus } from "react-icons/fi";

const CartItem = ({ product, isSelected, toggleOne }) => {
	const { addCart, decreaseCart, removeCart } = useCart();

	return (
		<li key={product.id} className='first:pb-8 not-first:py-8 border-b border-[#e2e2e2]'>
			<div className='relative grid grid-cols-2 gap-y-4 gap-x-6 lg:grid-cols-[auto_1fr_1fr]'>
				<div className='col-span-full lg:col-auto'>
					<input type='checkbox' onChange={() => toggleOne(product.id)} checked={isSelected} />
					<label htmlFor='' className='sr-only'></label>
				</div>
				<Link to={`/products/${product.id}`}>
					<div className='rounded-2xl overflow-hidden lg:max-w-140'>
						<img src={product.images[0]} alt='' />
					</div>
				</Link>
				<div className='lg:pr-6'>
					<p className='text-xl'>{product.title}</p>
					<p className='mt-2 text-gray-600'>USD {product.price.toFixed(2)}</p>
					<div className='mt-2 flex items-center justify-between border-1 border-[#e2e2e2] rounded-4xl px-2 py-1 w-24'>
						<button
							type='button'
							onClick={() => decreaseCart(product.id)}
							className='px-2 py-2'
							disabled={product.quantity === 1}>
							<FiMinus size={10} />
						</button>
						<span className='font-outfit text-sm'>{product.quantity}</span>
						<button type='button' onClick={() => addCart(product)} className='px-2 py-2'>
							<FiPlus size={10} />
						</button>
					</div>
				</div>
				<button
					type='button'
					onClick={() => removeCart(product.id)}
					className='absolute top-0 right-0 rounded-full bg-[#eee] p-1'>
					<IoMdClose size={16} />
					<span className='sr-only'></span>
				</button>
			</div>
		</li>
	);
};

export default CartItem;
