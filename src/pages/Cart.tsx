import {Link} from "react-router";
import {useCart} from "../contexts/CartContext";
import {IoMdClose} from "react-icons/io";
import {FiMinus, FiPlus} from "react-icons/fi";
import {useState} from "react";

const Cart = () => {
	const {cartItems, totalPrice, addCart, decreaseCart, removeCart, removeSelectedCart, clearCart} = useCart();

	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

	const deliveryFee = Number(totalPrice) < 200 ? 10.5 : 0;

	const isAllChecked = selectedIds.size === cartItems.length ? true : false;

	const toggleAll = () =>
		setSelectedIds((prev) => (prev.size === cartItems.length ? new Set() : new Set(cartItems.map((i) => i.id))));

	const toggleOne = (id: number) =>
		setSelectedIds((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});

	return (
		<div className='main pb-30'>
			<h2 className=' my-10 font-[Outfit] font-bold text-center text-4xl'>Cart</h2>
			{cartItems.length !== 0 && (
				<>
					<div className='mb-6 flex justify-between items-center'>
						<div className='form-checkbox'>
							<input type='checkbox' name='' id='' onChange={toggleAll} checked={isAllChecked} />
							<label htmlFor=''>
								전체 선택 ({selectedIds.size}/{cartItems.length})
							</label>
						</div>

						<button type='button' className='button button-md' onClick={clearCart}>
							장바구니 비우기
						</button>
					</div>
					<div className=' lg:flex lg:items-start lg:gap-8'>
						<div>
							<ul className='mt-4'>
								{cartItems.map((product) => (
									<li
										key={product.id}
										className='first:pb-8 not-first:py-8 border-b border-[#e2e2e2]'>
										<div className='relative grid grid-cols-2 gap-y-4 gap-x-6 lg:grid-cols-[auto_1fr_1fr]'>
											<div className='col-span-full lg:col-auto'>
												<input
													type='checkbox'
													onChange={() => toggleOne(product.id)}
													checked={selectedIds.has(product.id) ? true : false}
												/>
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
														className='px-2 py-2'>
														<FiMinus size={10} />
													</button>
													<span className='font-[Outfit] text-sm'>{product.quantity}</span>
													<button
														type='button'
														onClick={() => addCart(product)}
														className='px-2 py-2'>
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
								))}
							</ul>
							<button
								type='button'
								className='button button-md my-6'
								onClick={() => removeSelectedCart([...selectedIds])}>
								선택 상품 삭제
							</button>
						</div>
						<div className='lg:w-200 lg:sticky lg:top-5'>
							<div className='font-[Outfit] py-6 px-6 bg-[#f5f5f5] rounded-3xl'>
								<p className='flex justify-between text-sm mb-4'>
									<span>총 상품 금액</span>
									<span>${totalPrice}</span>
								</p>
								<p className='flex justify-between text-sm mb-6'>
									<span>배송비</span>
									<span>${deliveryFee.toFixed(2)}</span>
								</p>
								<p className='flex justify-between pt-6 border-t'>
									<span>결제 예정 금액</span>
									<span className='font-bold text-lg text-[#ef4da2]'>
										${(Number(totalPrice) + deliveryFee).toFixed(2)}
									</span>
								</p>
							</div>
							<div className='hidden lg:flex lg:gap-3 lg:mt-4'>
								<button type='button' className='button button-lg grow rounded-4xl'>
									선택 상품 주문
								</button>
								<button type='button' className='button button-lg grow rounded-4xl bg-black text-white'>
									전체 상품 주문
								</button>
							</div>
							<p className='mt-6 text-[Outfit] text-sm font-[#222]'>
								총 상품 금액이 $200 미만일 경우 배송비가 부과됩니다.
							</p>
						</div>
					</div>
				</>
			)}
			{cartItems.length === 0 && <p className='text-center font-[Outfit]'>장바구니가 비었습니다.</p>}
			{cartItems.length !== 0 && (
				<div className='fixed bottom-0 left-0 flex gap-4 px-4 py-4 w-full bg-white shadow-[0_-4px_5px_-4px_rgb(0_0_0/.18)] lg:hidden'>
					<button type='button' className='button button-lg grow'>
						선택 상품 주문
					</button>
					<button type='button' className='button button-lg grow bg-black text-white'>
						전체 상품 주문
					</button>
				</div>
			)}
		</div>
	);
};

export default Cart;
