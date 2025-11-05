import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "../api/products";

export const useCategories = () => {
	return useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategories(),
		staleTime: 1000 * 60 * 5,
	});
};

export const useProducts = ({ id, categorySlug }: { id?: string; categorySlug?: string } = {}) => {
	return useQuery({
		queryKey: ["products", categorySlug, id],
		queryFn: () => getProducts({ id, categorySlug }),
		staleTime: 1000 * 60 * 5,
		retry: 0,
	});
};
