import {getProducts} from "../lib.ts/http";

export const getProductsQuery = (categorySlug?: string) => ({
	queryKey: ["products"],
	queryFn: () => getProducts(categorySlug),
	staleTime: 1000 * 60 * 5,
});
