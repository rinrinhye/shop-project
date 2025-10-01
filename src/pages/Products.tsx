import {useQuery} from "@tanstack/react-query";
import {Link, useParams} from "react-router";
import {getProductsQuery} from "../queries/queries";
import type {Product} from "../types/common";

const Products = () => {
	const {categorySlug} = useParams();

	const {data: products = []} = useQuery<Product[]>(getProductsQuery({categorySlug}));

	return (
		<div>
			<ul className='grid grid-cols-4'>
				{products.map((product) => (
					<li key={product.id}>
						<Link to={`/products/${product.id}`}>
							<div>
								<div>
									<img src={product.images[0]} alt='' />
								</div>
								<p>{product.title}</p>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Products;
