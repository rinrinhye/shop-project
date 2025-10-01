export default class Shop {
	private baseUrl = "https://api.escuelajs.co/api/v1";
	constructor() {}

	async getProducts({id, categorySlug}: {id?: string; categorySlug?: string}) {
		let url = this.baseUrl + "/products";

		if (id) {
			url = url + `/${id}`;
		}

		if (categorySlug) {
			url = url + `/?categorySlug=${categorySlug}`;
		}

		const res = await fetch(url);
		const data = await res.json();

		return data;
	}

	async getCategories() {
		let url = this.baseUrl + "/categories?limit=4";

		const res = await fetch(url);
		const data = await res.json();

		return data;
	}
}
