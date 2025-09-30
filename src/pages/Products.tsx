import {useQuery} from "@tanstack/react-query";
import {getProductsQuery} from "../api/products";
import {useParams} from "react-router";

interface Product {
	id: number;
	title: string;
	slug: string;
	price: number;
	description: string;
	category: {
		id: number;
		name: String;
		slug: String;
		image: String;
		creationAt: String;
		updatedAt: String;
	};
	images: Array<string>;
	creationAt: string;
	updatedAt: string;
}

const Products = () => {
	const {categorySlug} = useParams();

	const {data} = useQuery<Product[]>(getProductsQuery(categorySlug));

	console.log(data);

	return <div></div>;
};

export default Products;
