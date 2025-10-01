export interface Category {
	id: number;
	name: string;
	slug: string;
	image: string;
	creationAt: string;
	updatedAt: string;
}

export interface Product {
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
