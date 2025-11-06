import { useNavigate, useParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { useProducts } from "../queries/useProducts";
import { useRef, useState } from "react";
import { FreeMode, Navigation, Thumbs, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useCart } from "../contexts/CartContext";
import Button from "../components/ui/Button";

const mainSwiperConfig = {
	slidesPerView: 1,
	effect: "fade",
	speed: 800,
	modules: [FreeMode, Thumbs, Navigation, EffectFade],
};

const thumbSwiperConfig = {
	freeMode: true,
	slidesPerView: "auto" as const,
	spaceBetween: 8,
	breakpoints: {
		1024: { direction: "vertical" as const },
	},
};

const ProductDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
	const [isOpen, setOpen] = useState<boolean>(false);

	const imgErrorRef = useRef<boolean>(false);

	const { data: product, isLoading, isError } = useProducts({ id });
	const { addCart } = useCart();

	if (isLoading) return null;
	if (isError) {
		alert("페이지를 찾을 수 없습니다. 상품을 삭제해 주세요.");
		navigate(-1);
		return null;
	}
	if (!product) return null;

	const { title, description, price, images } = product;

	return (
		<div className='main'>
			<div className='flex flex-col lg:flex-row lg:gap-8 lg:justify-center'>
				<div className='lg:flex lg:flex-row-reverse lg:gap-2 lg:flex-[2] lg:min-w-0 lg:max-w-[800px]'>
					<div className='lg:min-w-[400px] lg:grow-1'>
						<Swiper {...mainSwiperConfig} thumbs={{ swiper: thumbsSwiper }} className='product-swiper'>
							{images.map((image: string, index: number) => (
								<SwiperSlide key={index}>
									<div className='rounded-lg overflow-hidden aspect-square'>
										<img
											src={image}
											className='w-full h-full object-cover'
											onError={(e) => {
												e.currentTarget.onerror = null; // 무한 루프 방지
												e.currentTarget.src = "/img/no_image.png";
												imgErrorRef.current = true;
											}}
										/>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
					<div className='mt-2 lg:mt-0'>
						<Swiper {...thumbSwiperConfig} onSwiper={setThumbsSwiper} className='thumbnail-swiper'>
							{images?.map((image: string, index: number) => (
								<SwiperSlide key={index}>
									<div className='overflow-hidden rounded-xl aspect-square'>
										<img
											src={image}
											alt=''
											className='w-full h-full object-cover'
											onError={(e) => {
												e.currentTarget.onerror = null; // 무한 루프 방지
												e.currentTarget.src = "/img/no_image.png";
												imgErrorRef.current = true;
											}}
										/>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
				<div className='lg:flex-[1.5] lg:max-w-[600px]'>
					<div className='mt-4'>
						<p className='text-2xl'>{title}</p>
						<p className='mt-2 text-lg'>${price}</p>
						<p className={`mt-2 leading-relaxed text-[#555] ${isOpen ? "" : "line-clamp-3"}`}>
							{description}
						</p>
						<button type='button' className='block mt-2 mx-auto' onClick={() => setOpen((prev) => !prev)}>
							{isOpen ? <IoChevronUp color='#444' /> : <IoChevronDown color='#444' />}
						</button>
					</div>
					<div className='mt-6 flex gap-2'>
						<Button
							size='xl'
							rounded
							color='black'
							onClick={() => addCart(product)}
							text='Add to Cart'
							className='grow'
						/>
						<Button
							size='xl'
							rounded
							color='pink'
							onClick={() => addCart(product)}
							text='Buy Now'
							className='grow'
						/>
					</div>
				</div>
			</div>
			<div className='mt-10'>
				<ul className='flex justify-between font-outfit'>
					<li>
						<button type='button' className='px-4 py-2'>
							Product Info
						</button>
					</li>
					<li>
						<button type='button' className='px-4 py-2'>
							Review
						</button>
					</li>
					<li>
						<button type='button' className='px-4 py-2'>
							Delivery
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default ProductDetail;
