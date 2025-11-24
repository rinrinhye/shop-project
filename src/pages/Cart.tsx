import { useCartState, useCartActions } from "../contexts/CartContext";
import { useCallback, useEffect, useState, useMemo } from "react";
import CartItem from "../components/cart/CartItem/CartItem";
import OrderSummary from "../components/cart/OrderSummary/OrderSummary";
import Button from "../components/ui/Button";

const Cart = () => {
	const { cartItems, totalPrice } = useCartState();
	const { removeSelectedCart, clearCart } = useCartActions();

	const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set(cartItems.map((i) => i.id)));

	useEffect(() => {
		setSelectedIds(new Set(cartItems.map((i) => i.id)));
	}, [cartItems]);

	const isAllChecked = cartItems.length > 0 && selectedIds.size === cartItems.length;

	const selectedTotalPrice = useMemo(() => {
		const sum = cartItems.reduce((acc, item) => {
			if (!selectedIds.has(item.id)) return acc;
			return acc + item.price * item.quantity;
		}, 0);
		return sum.toFixed(2);
	}, [cartItems, selectedIds]);

	const displayPrice = isAllChecked ? totalPrice : selectedTotalPrice;

	const deliveryFee = selectedIds.size === 0 ? 0 : Number(displayPrice) < 200 ? 10.5 : 0;

	const toggleAll = () =>
		setSelectedIds((prev) => (prev.size === cartItems.length ? new Set() : new Set(cartItems.map((i) => i.id))));

	const toggleOne = useCallback((id: number) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	}, []);

	return (
		<div className='main pb-30'>
			<h2 className=' my-10 font-outfit font-bold text-center text-4xl'>Cart</h2>

			{cartItems.length !== 0 && (
				<>
					<div className='mb-6 flex justify-between items-center'>
						<div className='form-checkbox'>
							<input type='checkbox' onChange={toggleAll} checked={isAllChecked} />
							<label>
								전체 선택 ({selectedIds.size}/{cartItems.length})
							</label>
						</div>
						<Button text={"장바구니 비우기"} onClick={clearCart} />
					</div>

					<div className=' lg:flex lg:items-start lg:gap-8'>
						<div>
							<ul className='mt-4'>
								{cartItems.map((product) => (
									<CartItem
										key={product.id}
										product={product}
										isSelected={selectedIds.has(product.id)}
										toggleOne={toggleOne}
									/>
								))}
							</ul>
							<Button
								text='선택 상품 삭제'
								className='my-6'
								onClick={() => {
									removeSelectedCart([...selectedIds]);
								}}
								disabled={selectedIds.size === 0}
							/>
						</div>

						<OrderSummary totalPrice={displayPrice} deliveryFee={deliveryFee} />
					</div>
				</>
			)}

			{cartItems.length === 0 && <p className='text-center font-outfit'>장바구니가 비었습니다.</p>}

			{cartItems.length !== 0 && (
				<div className='fixed bottom-0 left-0 flex gap-4 px-4 py-4 w-full bg-white shadow-[0_-4px_5px_-4px_rgb(0_0_0/.18)] lg:hidden'>
					<Button text='선택 상품 주문' size='lg' className='grow' />
					<Button text='전체 상품 주문' size='lg' color='black' className='grow' />
				</div>
			)}
		</div>
	);
};

export default Cart;
