import {useQuery} from "@tanstack/react-query";
import {getProductsQuery} from "../queries/queries";
import {useParams} from "react-router";
import type {Product} from "../types/common";

const ProductDetail = () => {
	const {id} = useParams();

	const {data: product, isLoading} = useQuery<Product>(getProductsQuery({id}));

	if (isLoading || !product) return null;

	const {description, images} = product;
	return (
		<div className='flex'>
			<div>
				{images.map((image, index) => (
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
