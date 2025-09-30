import {getCategories} from "../lib.ts/http";

export const getCategoriesQuery = () => ({
	queryKey: ["categories"],
	queryFn: getCategories,
	staleTime: 1000 * 60 * 5,
});
