import Shop from "../api/shop";

export const getCategoriesQuery = () => ({
	queryKey: ["categories"],
	queryFn: () => {
		const shop = new Shop();

		return shop.getCategories();
	},
	staleTime: 1000 * 60 * 5,
});

export const getProductsQuery = ({id, categorySlug}: {id?: string; categorySlug?: string} = {}) => ({
	queryKey: ["products", categorySlug, id],
	queryFn: () => {
		const shop = new Shop();

		return shop.getProducts({id, categorySlug});
	},
	staleTime: 1000 * 60 * 5,
});
