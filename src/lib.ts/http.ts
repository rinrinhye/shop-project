export const getCategories = async () => {
	const res = await fetch("/data/categories/getAll.json");
	const data = await res.json();
	return data;
};

export const getProducts = async (categorySlug?: string) => {
	const res = await fetch("/data/products/getAll.json");
	// const res = await fetch("https://api.escuelajs.co/api/v1/products");

	const url = new URL("https://api.escuelajs.co/api/v1/products");

	if (categorySlug) {
		url.searchParams.set("categorySlug", categorySlug);
	}

	const data = await res.json();
	return data;
};
