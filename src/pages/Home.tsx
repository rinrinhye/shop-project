import Card from "../components/Card/Card";
import { useProducts } from "../queries/useProducts";
import type { Product } from "../types/common";

const Home = () => {
	const { data: products = [] } = useProducts();

	return (
		<div className='main'>
			<ul className='product-list'>
				{products.map((product: Product) => (
					<li key={product.id}>
						<Card product={product} />
					</li>
				))}
			</ul>
		</div>
	);
};

export default Home;
