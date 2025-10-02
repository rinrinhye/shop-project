import {Link, useParams} from "react-router";
import type {Product} from "../types/common";
import {ROUTES} from "../routes/routes";
import {useProducts} from "../queries/useProducts";

const Products = () => {
	const {categorySlug} = useParams();

	const {data: products = []} = useProducts({categorySlug});

	return (
		<div>
			<ul className='grid grid-cols-4'>
				{products.map((product: Product) => (
					<li key={product.id}>
						<Link to={ROUTES.productDetail(product.id)}>
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
