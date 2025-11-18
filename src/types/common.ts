type Role = "customer" | "admin";

export type User = {
	name: string;
	email: string;
	password: string;
	role: Role;
	avatar: string;
};

export type LoginForm = {
	email: string;
	password: string;
	origin?: "login" | "signup";
};

export type LoginPayload = {
	email: string;
	password: string;
};

export type RegisterForm = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	role: Role;
	avatar: string;
};

export type RegisterPayload = Omit<RegisterForm, "confirmPassword" | "role">;

export type UserForm = { name: string; role: Role };

export type Category = {
	id: number;
	name: string;
	slug: string;
	image: string;
	creationAt: string;
	updatedAt: string;
};

export type Product = {
	id: number;
	title: string;
	slug: string;
	price: number;
	description: string;
	category: Category;
	images: Array<string>;
	creationAt: string;
	updatedAt: string;
};

export type CartItem = Product & { quantity: number };

export type CartMap = Record<number, CartItem>;

export type FavoriteMap = Record<number, Product>;

export type ErrorResponse = {
	statusCode: number;
	message: string;
};
