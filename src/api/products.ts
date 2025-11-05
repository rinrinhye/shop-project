const BASE_URL = "https://api.escuelajs.co/api/v1";

export const getProducts = async ({ id, categorySlug }: { id?: string; categorySlug?: string }) => {
	let url = BASE_URL + "/products";

	if (id) {
		url = url + `/${id}`;
	}

	if (categorySlug) {
		url = url + `/?categorySlug=${categorySlug}`;
	}

	const res = await fetch(url);
	const body = await res.json();

	if (!res.ok) {
		throw body;
	}

	return body;
};

export const getCategories = async () => {
	let url = BASE_URL + "/categories?limit=4";

	const res = await fetch(url);
	const body = await res.json();

	if (!res.ok) {
		throw body;
	}

	return body;
};
