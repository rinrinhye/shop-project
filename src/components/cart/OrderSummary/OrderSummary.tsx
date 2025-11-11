import Button from "../../ui/Button";

const OrderSummary = ({ totalPrice, deliveryFee }) => {
	return (
		<div className='lg:w-200 lg:sticky lg:top-5'>
			<div className='font-outfit py-6 px-6 bg-gray-100 rounded-3xl'>
				<p className='flex justify-between text-sm mb-4'>
					<span>총 상품 금액</span>
					<span>${Number(totalPrice).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
				</p>
				<p className='flex justify-between text-sm mb-6'>
					<span>배송비</span>
					<span>${deliveryFee.toFixed(2)}</span>
				</p>
				<p className='flex justify-between pt-6 border-t'>
					<span>결제 예정 금액</span>
					<span className='font-bold text-lg text-primary'>
						${(Number(totalPrice) + deliveryFee).toLocaleString("en-US", { minimumFractionDigits: 2 })}
					</span>
				</p>
			</div>
			<div className='hidden lg:flex lg:gap-3 lg:mt-4'>
				<Button size='lg' className='grow' text='선택 상품 주문' />
				<Button size='lg' className='grow' color='black' text='전체 상품 주문' />
			</div>
			<p className='mt-6 text-outfit text-sm font-gray-900'>
				총 상품 금액이 $200 미만일 경우 배송비가 부과됩니다.
			</p>
		</div>
	);
};

export default OrderSummary;
