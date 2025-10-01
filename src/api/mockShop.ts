export default class MockShop {
	constructor() {}

	async getCategories() {
		const res = await fetch("/data/categories/getAll.json");
		const data = res.json();

		return data;
	}

	async getProducts(categorySlug?: string) {
		const res = await fetch(`/data/products/${categorySlug ? "getFilteredProducts" : "getAll"}.json`);
		const data = await res.json();

		return data;
	}
}
