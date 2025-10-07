import { useParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { useProducts } from "../queries/useProducts";
import { useState } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
const ProductDetail = () => {
  const { id } = useParams();

  const { data: product, isLoading } = useProducts({ id });
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  if (isLoading || !product) return null;

  const { title, description, images } = product;

  console.log(product);

  return (
    <div className='flex'>
      <div className='flex'>
        <div className='w-[150px]'>
          <Swiper
            onSwiper={setThumbsSwiper}
            slidesPerView={"auto"}
            direction='vertical'
          >
            {images.map((image: string, index: number) => (
              <SwiperSlide>
                <img src={image} alt='' />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className='w-[500px]'>
          <Swiper
            slidesPerView={1}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Thumbs, Navigation]}
          >
            {images.map((image: string, index: number) => (
              <SwiperSlide key={index}>
                <img src={image} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div>
        <p>{title}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
