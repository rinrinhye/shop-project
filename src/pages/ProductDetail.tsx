import {useParams} from "react-router";
import {Swiper, SwiperSlide} from "swiper/react";
import {useProducts} from "../queries/useProducts";
import {useState} from "react";
import {FreeMode, Navigation, Thumbs} from "swiper/modules";
import type {Swiper as SwiperType} from "swiper";
import {IoChevronDown, IoChevronUp, IoHeartOutline} from "react-icons/io5";
const ProductDetail = () => {
	const {id} = useParams();

	const {data: product, isLoading} = useProducts({id});
	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
	const [isOpen, setOpen] = useState<boolean>(false);

	if (isLoading || !product) return null;

	const {title, description, price, images} = product;

	console.log(product);

	return (
		<div className='main'>
			<div className='flex flex-col lg:flex-row lg:gap-8'>
				<div className='lg:flex lg:flex-row-reverse lg:gap-2 lg:flex-[2] lg:min-w-0'>
					<div className='lg:min-w-[400px]'>
						<Swiper
							slidesPerView={1}
							thumbs={{swiper: thumbsSwiper}}
							modules={[FreeMode, Thumbs, Navigation]}
							className='product-swiper'>
							{images.map((image: string, index: number) => (
								<SwiperSlide key={index}>
									<div className='rounded-lg overflow-hidden'>
										<img src={image} className='' />
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
					<div className='mt-2 lg:mt-0'>
						<Swiper
							onSwiper={setThumbsSwiper}
							freeMode={true}
							slidesPerView={"auto"}
							spaceBetween={8}
							breakpoints={{
								1024: {direction: "vertical"},
							}}
							className='thumbnail-swiper'>
							{images.map((image: string, index: number) => (
								<SwiperSlide>
									<div className='overflow-hidden rounded-xl'>
										<img src={image} alt='' className='' />
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
				<div className='lg:flex-[1.5] lg:max-w-[560px]'>
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
						<button type='button' className='button button-xl grow rounded-4xl bg-black text-white'>
							Add to Cart
						</button>
						<button type='button' className='button button-xl grow rounded-4xl bg-[#ef4da2] text-white'>
							Buy Now
						</button>
					</div>
				</div>
			</div>
			<div className='mt-10'>
				<ul className='flex justify-between font-[Outfit]'>
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
