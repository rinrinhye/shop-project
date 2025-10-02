export const ROUTES = {
	home: "/",
	login: "login",
	register: "register",
	cart: "cart",
	products: (categorySlug: string) => `products/category/${categorySlug}`,
	productDetail: (id: number) => `products/${id}`,
	user: (userId: number) => `user/${userId}`,
};
