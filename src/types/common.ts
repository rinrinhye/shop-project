export interface LoginInput {
	email: string;
	password: string;
}

export interface RegisterInput {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	role: string;
	avatar: string;
}

export type RegisterPayload = Omit<RegisterInput, "confirmPassword" | "role">;

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
	category: Category;
	images: Array<string>;
	creationAt: string;
	updatedAt: string;
}

export type CartItem = Product & { quantity: number };

export type ApiError = {
	statusCode: number;
	message: string;
};
