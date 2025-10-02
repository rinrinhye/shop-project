import {useParams} from "react-router";
import {useProducts} from "../queries/useProducts";

const ProductDetail = () => {
	const {id} = useParams();

	const {data: product, isLoading} = useProducts({id});

	if (isLoading || !product) return null;

	const {description, images} = product;
	return (
		<div className='flex'>
			<div>
				{images.map((image: string, index: number) => (
					<div key={index}>
						<img src={image} />
					</div>
				))}
			</div>
			<p>{description}</p>
		</div>
	);
};

export default ProductDetail;
