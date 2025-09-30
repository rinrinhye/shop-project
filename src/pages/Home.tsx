import {useQuery} from "@tanstack/react-query";
import {getProductsQuery} from "../api/products";
import {Link} from "react-router";

interface Product {
	id: number;
	title: String;
	slug: String;
	price: number;
	description: String;
	caegory: {
		id: number;
		name: String;
		slug: String;
		image: String;
		creationAt: String;
		updatedAt: String;
	};
	images: Array<string>;
	creationAt: String;
	updatedAt: String;
}

const Home = () => {
	const {data: products = []} = useQuery<Product[]>(getProductsQuery());

	return (
		<div>
			<ul>
				{products.map((product) => (
					<li key={product.id}>
						<Link to={`products/${product.id}`}>{product.title}</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Home;
